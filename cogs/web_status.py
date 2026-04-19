import discord
from discord.ext import commands
from aiohttp import web
import aiohttp
import psutil
import os
import hmac
import hashlib
import json
import base64
import time
import urllib.parse
from core.logger import logger
from core.database import db
from datetime import datetime

# ── OAuth2 / Auth Config ──────────────────────────────────────────────────────
DISCORD_CLIENT_ID     = os.getenv("DISCORD_CLIENT_ID", "")
DISCORD_CLIENT_SECRET = os.getenv("DISCORD_CLIENT_SECRET", "")
DASHBOARD_SECRET      = os.getenv("DASHBOARD_SECRET", "astra-dashboard-change-me")
DASHBOARD_API_URL     = os.getenv("DASHBOARD_API_URL", "http://localhost:8080")
DASHBOARD_FRONTEND_URL = os.getenv("DASHBOARD_FRONTEND_URL", "http://localhost:5500/dashboard")

MANAGE_GUILD_BIT = 0x20  # Discord permission flag


# ── Token helpers ─────────────────────────────────────────────────────────────

def _create_token(payload: dict) -> str:
    payload["exp"] = int(time.time()) + 86400  # 24 h
    raw = json.dumps(payload, separators=(",", ":")).encode()
    data = base64.b64encode(raw).decode()
    sig = hmac.new(DASHBOARD_SECRET.encode(), data.encode(), hashlib.sha256).hexdigest()
    return f"{data}.{sig}"


def _verify_token(token: str) -> dict | None:
    try:
        last_dot = token.rfind(".")
        if last_dot == -1:
            return None
        data, sig = token[:last_dot], token[last_dot + 1:]
        expected = hmac.new(DASHBOARD_SECRET.encode(), data.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected):
            return None
        padded = data + "=" * (-len(data) % 4)
        payload = json.loads(base64.b64decode(padded))
        if payload.get("exp", 0) < int(time.time()):
            return None
        return payload
    except Exception:
        return None


def _get_auth(request: web.Request) -> dict | None:
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return _verify_token(auth[7:])
    return None


def _has_guild(user: dict, guild_id: str) -> bool:
    return any(str(g["id"]) == guild_id for g in user.get("guilds", []))


def _unauthorized():
    return web.json_response({"error": "Unauthorized"}, status=401)


def _forbidden():
    return web.json_response({"error": "Forbidden"}, status=403)


# ── Cog ───────────────────────────────────────────────────────────────────────

class WebStatus(commands.Cog):
    """Hosts the JSON API powering the status page, dashboard, and server config."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self.app = web.Application()
        self.start_time = datetime.utcnow()
        self._oauth_states: dict[str, float] = {}  # state -> timestamp
        self.http: aiohttp.ClientSession | None = None

        # ── Public read-only routes ──────────────────────────────────────────
        self.app.router.add_get("/api/status",     self.handle_status)
        self.app.router.add_get("/api/stats",      self.handle_stats)
        self.app.router.add_get("/api/modules",    self.handle_modules)
        self.app.router.add_get("/api/moderation", self.handle_moderation)
        self.app.router.add_get("/api/economy",    self.handle_economy)

        # ── OAuth2 ───────────────────────────────────────────────────────────
        self.app.router.add_get("/auth/login",    self.handle_auth_login)
        self.app.router.add_get("/auth/callback", self.handle_auth_callback)
        self.app.router.add_get("/auth/me",       self.handle_auth_me)

        # ── Authenticated dashboard routes ───────────────────────────────────
        self.app.router.add_get ("/api/guilds",                    self.handle_guilds)
        self.app.router.add_get ("/api/guild/{gid}/info",          self.handle_guild_info)
        self.app.router.add_get ("/api/config/{gid}",              self.handle_config_get)
        self.app.router.add_post("/api/config/{gid}/general",      self.handle_config_general)
        self.app.router.add_post("/api/config/{gid}/welcome",      self.handle_config_welcome)
        self.app.router.add_post("/api/config/{gid}/automod",      self.handle_config_automod)
        self.app.router.add_post("/api/config/{gid}/tickets",      self.handle_config_tickets)
        self.app.router.add_post("/api/config/{gid}/antiraid",     self.handle_config_antiraid)
        self.app.router.add_post("/api/config/{gid}/birthdays",    self.handle_config_birthdays)
        self.app.router.add_post("/api/config/{gid}/suggestions",  self.handle_config_suggestions)
        self.app.router.add_post("/api/config/{gid}/leveling",     self.handle_config_leveling)
        self.app.router.add_post("/api/config/{gid}/starboard",    self.handle_config_starboard)

        # ── CORS ─────────────────────────────────────────────────────────────
        async def on_prepare(request, response):
            response.headers["Access-Control-Allow-Origin"]  = "*"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"

        self.app.on_response_prepare.append(on_prepare)
        self.app.router.add_route("OPTIONS", "/{path:.*}", self._handle_options)

        self.runner = None
        self.site   = None
        self.bot.loop.create_task(self.start_server())

    async def _handle_options(self, _request: web.Request) -> web.Response:
        return web.Response(status=204)

    # ── Auth: /auth/login ─────────────────────────────────────────────────────

    async def handle_auth_login(self, _request: web.Request) -> web.Response:
        if not DISCORD_CLIENT_ID:
            return web.json_response({"error": "OAuth2 not configured"}, status=503)

        state = base64.b64encode(os.urandom(16)).decode().rstrip("=")
        self._oauth_states[state] = time.time()
        # Prune states older than 10 minutes
        cutoff = time.time() - 600
        self._oauth_states = {k: v for k, v in self._oauth_states.items() if v > cutoff}

        params = urllib.parse.urlencode({
            "client_id":     DISCORD_CLIENT_ID,
            "redirect_uri":  f"{DASHBOARD_API_URL}/auth/callback",
            "response_type": "code",
            "scope":         "identify guilds",
            "state":         state,
        })
        raise web.HTTPFound(f"https://discord.com/api/oauth2/authorize?{params}")

    # ── Auth: /auth/callback ──────────────────────────────────────────────────

    async def handle_auth_callback(self, request: web.Request) -> web.Response:
        q = request.rel_url.query
        code  = q.get("code")
        state = q.get("state", "")
        error = q.get("error")
        fail_url = f"{DASHBOARD_FRONTEND_URL}?auth_error=1"

        if error or not code:
            raise web.HTTPFound(fail_url)
        if state not in self._oauth_states:
            raise web.HTTPFound(fail_url)
        del self._oauth_states[state]

        try:
            # Exchange code for Discord access token
            async with self.http.post(
                "https://discord.com/api/oauth2/token",
                data={
                    "client_id":     DISCORD_CLIENT_ID,
                    "client_secret": DISCORD_CLIENT_SECRET,
                    "grant_type":    "authorization_code",
                    "code":          code,
                    "redirect_uri":  f"{DASHBOARD_API_URL}/auth/callback",
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
            ) as resp:
                if resp.status != 200:
                    raise web.HTTPFound(fail_url)
                token_data = await resp.json()
                access_token = token_data.get("access_token")
                if not access_token:
                    raise web.HTTPFound(fail_url)

            disc_headers = {"Authorization": f"Bearer {access_token}"}

            async with self.http.get("https://discord.com/api/users/@me", headers=disc_headers) as resp:
                user = await resp.json()

            async with self.http.get("https://discord.com/api/users/@me/guilds", headers=disc_headers) as resp:
                all_guilds = await resp.json()

        except web.HTTPFound:
            raise
        except Exception as exc:
            logger.warning(f"OAuth2 callback error: {exc}")
            raise web.HTTPFound(fail_url)

        # Only expose guilds where user has Manage Server
        bot_guild_ids = {str(g.id) for g in self.bot.guilds}
        manageable = []
        for g in all_guilds:
            if int(g.get("permissions", 0)) & MANAGE_GUILD_BIT:
                gid = str(g["id"])
                manageable.append({
                    "id":     gid,
                    "name":   g["name"],
                    "icon":   g.get("icon"),
                    "bot_in": gid in bot_guild_ids,
                })

        our_token = _create_token({
            "user_id":  str(user["id"]),
            "username": user["username"],
            "avatar":   user.get("avatar"),
            "guilds":   manageable,
        })

        raise web.HTTPFound(f"{DASHBOARD_FRONTEND_URL}?token={our_token}")

    # ── Auth: /auth/me ────────────────────────────────────────────────────────

    async def handle_auth_me(self, request: web.Request) -> web.Response:
        user = _get_auth(request)
        if not user:
            return _unauthorized()
        safe = {k: user[k] for k in ("user_id", "username", "avatar", "guilds") if k in user}
        return web.json_response(safe)

    # ── /api/guilds ───────────────────────────────────────────────────────────

    async def handle_guilds(self, request: web.Request) -> web.Response:
        user = _get_auth(request)
        if not user:
            return _unauthorized()
        return web.json_response({"guilds": user.get("guilds", [])})

    # ── /api/guild/{gid}/info ─────────────────────────────────────────────────

    async def handle_guild_info(self, request: web.Request) -> web.Response:
        user = _get_auth(request)
        if not user:
            return _unauthorized()
        gid = request.match_info["gid"]
        if not _has_guild(user, gid):
            return _forbidden()

        guild = self.bot.get_guild(int(gid))
        if not guild:
            return web.json_response({"error": "Bot is not in this server"}, status=404)

        channels = [
            {"id": str(c.id), "name": c.name, "type": c.type.value}
            for c in sorted(guild.channels, key=lambda c: c.position)
            if isinstance(c, (discord.TextChannel, discord.CategoryChannel, discord.VoiceChannel))
        ]
        roles = [
            {"id": str(r.id), "name": r.name, "color": r.color.value}
            for r in reversed(guild.roles)
            if not r.is_default()
        ]
        return web.json_response({
            "id":       str(guild.id),
            "name":     guild.name,
            "icon":     guild.icon.url if guild.icon else None,
            "channels": channels,
            "roles":    roles,
        })

    # ── /api/config/{gid} GET ─────────────────────────────────────────────────

    async def handle_config_get(self, request: web.Request) -> web.Response:
        user = _get_auth(request)
        if not user:
            return _unauthorized()
        gid = request.match_info["gid"]
        if not _has_guild(user, gid):
            return _forbidden()

        gid_int = int(gid)

        async def row(table: str, pk: str = "guild_id") -> dict:
            r = await db.fetch_one(f"SELECT * FROM {table} WHERE {pk} = ?", gid_int)
            return dict(r) if r else {}

        general    = await row("guilds")
        welcome    = await row("welcome_configs")
        automod    = await row("automod_configs")
        tickets    = await row("ticket_configs")
        antiraid   = await row("antiraid_configs")
        birthdays  = await row("birthday_configs")
        suggestions = await row("suggestion_configs")

        def s(v):
            return str(v) if v else ""

        return web.json_response({
            "general": {
                "log_channel_id":  s(general.get("log_channel_id")),
                "mute_role_id":    s(general.get("mute_role_id")),
            },
            "welcome": {
                "channel_id":         s(welcome.get("channel_id")),
                "message":            welcome.get("message", ""),
                "auto_role_id":       s(welcome.get("auto_role_id")),
                "farewell_channel_id": s(welcome.get("farewell_channel_id")),
                "farewell_message":   welcome.get("farewell_message", ""),
            },
            "automod": {
                "spam_enabled":    bool(automod.get("spam_enabled", 0)),
                "spam_threshold":  automod.get("spam_threshold", 5),
                "spam_window":     automod.get("spam_window", 5),
                "link_filter":     bool(automod.get("link_filter", 0)),
                "invite_filter":   bool(automod.get("invite_filter", 0)),
                "caps_filter":     bool(automod.get("caps_filter", 0)),
                "caps_percent":    automod.get("caps_percent", 80),
                "bad_words":       automod.get("bad_words", ""),
            },
            "tickets": {
                "category_id":  s(tickets.get("category_id")),
                "staff_role_id": s(tickets.get("staff_role_id")),
                "log_channel_id": s(tickets.get("log_channel_id")),
            },
            "antiraid": {
                "enabled":        bool(antiraid.get("enabled", 0)),
                "join_threshold": antiraid.get("join_threshold", 10),
                "join_window":    antiraid.get("join_window", 10),
                "action":         antiraid.get("action", "kick"),
                "alert_channel_id": s(antiraid.get("alert_channel_id")),
            },
            "birthdays": {
                "channel_id": s(birthdays.get("channel_id")),
                "role_id":    s(birthdays.get("role_id")),
                "message":    birthdays.get("message", ""),
            },
            "suggestions": {
                "channel_id":    s(suggestions.get("channel_id")),
                "staff_role_id": s(suggestions.get("staff_role_id")),
                "dm_on_update":  bool(suggestions.get("dm_on_update", 1)),
            },
            "leveling": {
                "xp_enabled":           bool(general.get("xp_enabled", 1)),
                "xp_rate":              general.get("xp_rate", 1),
                "xp_cooldown":          general.get("xp_cooldown", 60),
                "xp_announce_channel_id": s(general.get("xp_announce_channel_id")),
            },
            "starboard": {
                "starboard_channel_id": s(general.get("starboard_channel_id")),
                "starboard_threshold":  general.get("starboard_threshold", 3),
            },
            "economy": {
                "economy_enabled": bool(general.get("economy_enabled", 1)),
            },
        })

    # ── Config POST helpers ───────────────────────────────────────────────────

    async def _auth_guild(self, request: web.Request):
        user = _get_auth(request)
        if not user:
            return None, None, _unauthorized()
        gid = request.match_info["gid"]
        if not _has_guild(user, gid):
            return None, None, _forbidden()
        return user, gid, None

    # ── POST /api/config/{gid}/general ───────────────────────────────────────

    async def handle_config_general(self, request: web.Request) -> web.Response:
        user, gid, err = await self._auth_guild(request)
        if err:
            return err
        body = await request.json()
        gid_int = int(gid)
        await db.execute("INSERT OR IGNORE INTO guilds (guild_id) VALUES (?)", gid_int)
        await db.execute(
            "UPDATE guilds SET log_channel_id = ?, mute_role_id = ? WHERE guild_id = ?",
            body.get("log_channel_id") or None,
            body.get("mute_role_id") or None,
            gid_int,
        )
        return web.json_response({"ok": True})

    # ── POST /api/config/{gid}/welcome ────────────────────────────────────────

    async def handle_config_welcome(self, request: web.Request) -> web.Response:
        user, gid, err = await self._auth_guild(request)
        if err:
            return err
        body = await request.json()
        gid_int = int(gid)
        await db.execute(
            """
            INSERT INTO welcome_configs (guild_id, channel_id, message, auto_role_id, farewell_channel_id, farewell_message)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(guild_id) DO UPDATE SET
                channel_id = excluded.channel_id,
                message = excluded.message,
                auto_role_id = excluded.auto_role_id,
                farewell_channel_id = excluded.farewell_channel_id,
                farewell_message = excluded.farewell_message
            """,
            gid_int,
            body.get("channel_id") or None,
            body.get("message") or "",
            body.get("auto_role_id") or None,
            body.get("farewell_channel_id") or None,
            body.get("farewell_message") or "",
        )
        return web.json_response({"ok": True})

    # ── POST /api/config/{gid}/automod ────────────────────────────────────────

    async def handle_config_automod(self, request: web.Request) -> web.Response:
        user, gid, err = await self._auth_guild(request)
        if err:
            return err
        body = await request.json()
        gid_int = int(gid)
        await db.execute(
            """
            INSERT INTO automod_configs (guild_id, spam_enabled, spam_threshold, spam_window,
                link_filter, invite_filter, caps_filter, caps_percent, bad_words)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(guild_id) DO UPDATE SET
                spam_enabled = excluded.spam_enabled,
                spam_threshold = excluded.spam_threshold,
                spam_window = excluded.spam_window,
                link_filter = excluded.link_filter,
                invite_filter = excluded.invite_filter,
                caps_filter = excluded.caps_filter,
                caps_percent = excluded.caps_percent,
                bad_words = excluded.bad_words
            """,
            gid_int,
            int(body.get("spam_enabled", 0)),
            int(body.get("spam_threshold", 5)),
            int(body.get("spam_window", 5)),
            int(body.get("link_filter", 0)),
            int(body.get("invite_filter", 0)),
            int(body.get("caps_filter", 0)),
            int(body.get("caps_percent", 80)),
            body.get("bad_words") or "",
        )
        return web.json_response({"ok": True})

    # ── POST /api/config/{gid}/tickets ────────────────────────────────────────

    async def handle_config_tickets(self, request: web.Request) -> web.Response:
        user, gid, err = await self._auth_guild(request)
        if err:
            return err
        body = await request.json()
        gid_int = int(gid)
        await db.execute(
            """
            INSERT INTO ticket_configs (guild_id, category_id, staff_role_id, log_channel_id)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(guild_id) DO UPDATE SET
                category_id = excluded.category_id,
                staff_role_id = excluded.staff_role_id,
                log_channel_id = excluded.log_channel_id
            """,
            gid_int,
            body.get("category_id") or None,
            body.get("staff_role_id") or None,
            body.get("log_channel_id") or None,
        )
        return web.json_response({"ok": True})

    # ── POST /api/config/{gid}/antiraid ───────────────────────────────────────

    async def handle_config_antiraid(self, request: web.Request) -> web.Response:
        user, gid, err = await self._auth_guild(request)
        if err:
            return err
        body = await request.json()
        gid_int = int(gid)
        await db.execute(
            """
            INSERT INTO antiraid_configs (guild_id, enabled, join_threshold, join_window, action, alert_channel_id)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT(guild_id) DO UPDATE SET
                enabled = excluded.enabled,
                join_threshold = excluded.join_threshold,
                join_window = excluded.join_window,
                action = excluded.action,
                alert_channel_id = excluded.alert_channel_id
            """,
            gid_int,
            int(body.get("enabled", 0)),
            int(body.get("join_threshold", 10)),
            int(body.get("join_window", 10)),
            body.get("action", "kick"),
            body.get("alert_channel_id") or None,
        )
        return web.json_response({"ok": True})

    # ── POST /api/config/{gid}/birthdays ──────────────────────────────────────

    async def handle_config_birthdays(self, request: web.Request) -> web.Response:
        user, gid, err = await self._auth_guild(request)
        if err:
            return err
        body = await request.json()
        gid_int = int(gid)
        await db.execute(
            """
            INSERT INTO birthday_configs (guild_id, channel_id, role_id, message)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(guild_id) DO UPDATE SET
                channel_id = excluded.channel_id,
                role_id = excluded.role_id,
                message = excluded.message
            """,
            gid_int,
            body.get("channel_id") or None,
            body.get("role_id") or None,
            body.get("message") or "",
        )
        return web.json_response({"ok": True})

    # ── POST /api/config/{gid}/suggestions ────────────────────────────────────

    async def handle_config_suggestions(self, request: web.Request) -> web.Response:
        user, gid, err = await self._auth_guild(request)
        if err:
            return err
        body = await request.json()
        gid_int = int(gid)
        await db.execute(
            """
            INSERT INTO suggestion_configs (guild_id, channel_id, staff_role_id, dm_on_update)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(guild_id) DO UPDATE SET
                channel_id = excluded.channel_id,
                staff_role_id = excluded.staff_role_id,
                dm_on_update = excluded.dm_on_update
            """,
            gid_int,
            body.get("channel_id") or None,
            body.get("staff_role_id") or None,
            int(body.get("dm_on_update", 1)),
        )
        return web.json_response({"ok": True})

    # ── POST /api/config/{gid}/leveling ───────────────────────────────────────

    async def handle_config_leveling(self, request: web.Request) -> web.Response:
        user, gid, err = await self._auth_guild(request)
        if err:
            return err
        body = await request.json()
        gid_int = int(gid)
        await db.execute("INSERT OR IGNORE INTO guilds (guild_id) VALUES (?)", gid_int)
        await db.execute(
            """
            UPDATE guilds SET
                xp_enabled = ?,
                xp_rate = ?,
                xp_cooldown = ?,
                xp_announce_channel_id = ?
            WHERE guild_id = ?
            """,
            int(body.get("xp_enabled", 1)),
            max(1, int(body.get("xp_rate", 1))),
            max(1, int(body.get("xp_cooldown", 60))),
            body.get("xp_announce_channel_id") or None,
            gid_int,
        )
        return web.json_response({"ok": True})

    # ── POST /api/config/{gid}/starboard ──────────────────────────────────────

    async def handle_config_starboard(self, request: web.Request) -> web.Response:
        user, gid, err = await self._auth_guild(request)
        if err:
            return err
        body = await request.json()
        gid_int = int(gid)
        await db.execute("INSERT OR IGNORE INTO guilds (guild_id) VALUES (?)", gid_int)
        await db.execute(
            "UPDATE guilds SET starboard_channel_id = ?, starboard_threshold = ? WHERE guild_id = ?",
            body.get("starboard_channel_id") or None,
            max(1, int(body.get("starboard_threshold", 3))),
            gid_int,
        )
        return web.json_response({"ok": True})

    # ── POST /api/config/{gid}/economy ────────────────────────────────────────

    async def handle_config_economy(self, request: web.Request) -> web.Response:
        user, gid, err = await self._auth_guild(request)
        if err:
            return err
        body = await request.json()
        gid_int = int(gid)
        await db.execute("INSERT OR IGNORE INTO guilds (guild_id) VALUES (?)", gid_int)
        await db.execute(
            "UPDATE guilds SET economy_enabled = ? WHERE guild_id = ?",
            int(body.get("economy_enabled", 1)),
            gid_int,
        )
        return web.json_response({"ok": True})

    # ── Public read-only endpoints ────────────────────────────────────────────

    async def handle_status(self, _request: web.Request) -> web.Response:
        uptime = datetime.utcnow() - self.start_time
        cogs = self.bot.cogs
        services = {
            "Gateway API":      "online" if not self.bot.is_closed() else "offline",
            "Database":         "online",
            "Economy":          "online" if "Economy" in cogs else "offline",
            "Moderation":       "online" if "Moderation" in cogs else "offline",
            "Leveling/XP":      "online" if "Leveling" in cogs else "offline",
            "Reputation":       "online" if "Reputation" in cogs else "offline",
            "Ticket System":    "online" if "Tickets" in cogs else "offline",
            "Anti-Raid":        "online" if "AntiRaid" in cogs else "offline",
            "Background Tasks": "online",
        }
        return web.json_response({
            "status":         "online",
            "ping":           round(self.bot.latency * 1000),
            "guilds":         len(self.bot.guilds),
            "users":          sum(g.member_count for g in self.bot.guilds if g.member_count),
            "uptime_seconds": round(uptime.total_seconds()),
            "services":       services,
        })

    async def handle_stats(self, _request: web.Request) -> web.Response:
        uptime  = datetime.utcnow() - self.start_time
        process = psutil.Process()
        mem     = process.memory_info().rss / 1024 / 1024
        return web.json_response({
            "guilds":            len(self.bot.guilds),
            "users":             sum(g.member_count for g in self.bot.guilds if g.member_count),
            "channels":          sum(len(g.channels) for g in self.bot.guilds),
            "text_channels":     sum(len(g.text_channels) for g in self.bot.guilds),
            "voice_channels":    sum(len(g.voice_channels) for g in self.bot.guilds),
            "commands_loaded":   len(self.bot.tree.get_commands()),
            "cogs_loaded":       len(self.bot.cogs),
            "latency_ms":        round(self.bot.latency * 1000),
            "memory_mb":         round(mem, 1),
            "cpu_percent":       round(process.cpu_percent(interval=None), 1),
            "uptime_seconds":    round(uptime.total_seconds()),
            "python_version":    f"{__import__('sys').version_info.major}.{__import__('sys').version_info.minor}.{__import__('sys').version_info.micro}",
            "discord_py_version": discord.__version__,
        })

    async def handle_modules(self, _request: web.Request) -> web.Response:
        modules = []
        for name, cog in self.bot.cogs.items():
            app_cmds = len(cog.__cog_app_commands__) if hasattr(cog, "__cog_app_commands__") else 0
            listeners = len(cog.get_listeners()) if hasattr(cog, "get_listeners") else 0
            modules.append({"name": name, "description": cog.description or "", "commands": app_cmds, "listeners": listeners, "status": "online"})
        modules.sort(key=lambda m: m["name"])
        return web.json_response({"modules": modules, "total": len(modules)})

    async def handle_moderation(self, _request: web.Request) -> web.Response:
        try:
            rows = await db.fetch_all("SELECT * FROM moderation_cases ORDER BY timestamp DESC LIMIT 25")
            cases = [{"case_number": r.get("case_number"), "guild_id": str(r.get("guild_id", "")), "target_id": str(r.get("target_id", "")), "moderator_id": str(r.get("moderator_id", "")), "type": r.get("type", "unknown"), "reason": r.get("reason", "No reason"), "timestamp": r.get("timestamp", "")} for r in (rows or [])]
            return web.json_response({"cases": cases, "total": len(cases)})
        except Exception as e:
            logger.warning(f"Dashboard /api/moderation error: {e}")
            return web.json_response({"cases": [], "total": 0})

    async def handle_economy(self, _request: web.Request) -> web.Response:
        try:
            rows = await db.fetch_all("SELECT user_id, balance FROM economy ORDER BY balance DESC LIMIT 10")
            leaders = [{"user_id": str(r["user_id"]), "balance": r["balance"]} for r in (rows or [])]
            return web.json_response({"leaderboard": leaders, "total": len(leaders)})
        except Exception as e:
            logger.warning(f"Dashboard /api/economy error: {e}")
            return web.json_response({"leaderboard": [], "total": 0})

    # ── Server lifecycle ──────────────────────────────────────────────────────

    async def start_server(self):
        await self.bot.wait_until_ready()
        self.http = aiohttp.ClientSession()
        self.runner = web.AppRunner(self.app)
        await self.runner.setup()
        port = int(os.getenv("PORT") or os.getenv("STATUS_PORT", "8080"))
        try:
            self.site = web.TCPSite(self.runner, "0.0.0.0", port)
            await self.site.start()
            logger.info(f"Dashboard API started on port {port}")
        except Exception as e:
            logger.error(f"Failed to start API server: {e}")

    async def cog_unload(self):
        if self.http and not self.http.closed:
            await self.http.close()
        if self.runner:
            await self.runner.cleanup()


async def setup(bot: commands.Bot):
    await bot.add_cog(WebStatus(bot))
