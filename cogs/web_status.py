import discord
from discord.ext import commands
from aiohttp import web
import asyncio
import psutil
import os
from core.logger import logger
from core.database import db
from datetime import datetime


class WebStatus(commands.Cog):
    """Hosts the JSON API powering the website status page and admin dashboard."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self.app = web.Application()

        # Register routes
        self.app.router.add_get('/api/status', self.handle_status)
        self.app.router.add_get('/api/stats', self.handle_stats)
        self.app.router.add_get('/api/modules', self.handle_modules)
        self.app.router.add_get('/api/moderation', self.handle_moderation)
        self.app.router.add_get('/api/economy', self.handle_economy)

        # CORS middleware
        async def on_prepare(request, response):
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type'

        self.app.on_response_prepare.append(on_prepare)
        self.runner = None
        self.site = None
        self.bot.loop.create_task(self.start_server())

        self.start_time = datetime.utcnow()

    # ── /api/status ─────────────────────────────────────────────────────────
    async def handle_status(self, request):
        """Original status endpoint used by status.html."""
        uptime = datetime.utcnow() - self.start_time
        cogs = self.bot.cogs
        services = {
            "Gateway API": "online" if not self.bot.is_closed() else "offline",
            "Database": "online",
            "Economy": "online" if "Economy" in cogs else "offline",
            "Moderation": "online" if "Moderation" in cogs else "offline",
            "Leveling/XP": "online" if "Leveling" in cogs else "offline",
            "Reputation": "online" if "Reputation" in cogs else "offline",
            "Ticket System": "online" if "Tickets" in cogs else "offline",
            "Anti-Raid": "online" if "AntiRaid" in cogs else "offline",
            "Background Tasks": "online"
        }

        data = {
            "status": "online",
            "ping": round(self.bot.latency * 1000),
            "guilds": len(self.bot.guilds),
            "users": sum(g.member_count for g in self.bot.guilds if g.member_count),
            "uptime_seconds": uptime.total_seconds(),
            "services": services
        }
        return web.json_response(data)

    # ── /api/stats ──────────────────────────────────────────────────────────
    async def handle_stats(self, request):
        """Rich telemetry data for the dashboard stat cards."""
        uptime = datetime.utcnow() - self.start_time
        process = psutil.Process()
        mem = process.memory_info().rss / 1024 / 1024  # MB

        total_channels = sum(len(g.channels) for g in self.bot.guilds)
        total_text = sum(len(g.text_channels) for g in self.bot.guilds)
        total_voice = sum(len(g.voice_channels) for g in self.bot.guilds)

        # Count total registered commands
        total_commands = len(self.bot.tree.get_commands())

        data = {
            "guilds": len(self.bot.guilds),
            "users": sum(g.member_count for g in self.bot.guilds if g.member_count),
            "channels": total_channels,
            "text_channels": total_text,
            "voice_channels": total_voice,
            "commands_loaded": total_commands,
            "cogs_loaded": len(self.bot.cogs),
            "latency_ms": round(self.bot.latency * 1000),
            "memory_mb": round(mem, 1),
            "cpu_percent": round(process.cpu_percent(interval=None), 1),
            "uptime_seconds": round(uptime.total_seconds()),
            "python_version": f"{__import__('sys').version_info.major}.{__import__('sys').version_info.minor}.{__import__('sys').version_info.micro}",
            "discord_py_version": discord.__version__,
        }
        return web.json_response(data)

    # ── /api/modules ────────────────────────────────────────────────────────
    async def handle_modules(self, request):
        """List of every loaded cog with its command count."""
        modules = []
        for name, cog in self.bot.cogs.items():
            # Count app commands belonging to this cog
            app_cmds = len([c for c in cog.__cog_app_commands__]) if hasattr(cog, '__cog_app_commands__') else 0
            # Count listener count
            listeners = len(cog.get_listeners()) if hasattr(cog, 'get_listeners') else 0

            modules.append({
                "name": name,
                "description": cog.description or "",
                "commands": app_cmds,
                "listeners": listeners,
                "status": "online"
            })

        modules.sort(key=lambda m: m["name"])
        return web.json_response({"modules": modules, "total": len(modules)})

    # ── /api/moderation ─────────────────────────────────────────────────────
    async def handle_moderation(self, request):
        """Recent moderation cases across all guilds (last 25)."""
        try:
            rows = await db.fetch_all(
                "SELECT * FROM moderation_cases ORDER BY timestamp DESC LIMIT 25"
            )
            cases = []
            for row in (rows or []):
                cases.append({
                    "case_number": row.get("case_number"),
                    "guild_id": str(row.get("guild_id", "")),
                    "target_id": str(row.get("target_id", "")),
                    "moderator_id": str(row.get("moderator_id", "")),
                    "type": row.get("type", "unknown"),
                    "reason": row.get("reason", "No reason"),
                    "timestamp": row.get("timestamp", ""),
                })
            return web.json_response({"cases": cases, "total": len(cases)})
        except Exception as e:
            logger.warning(f"Dashboard /api/moderation error: {e}")
            return web.json_response({"cases": [], "total": 0})

    # ── /api/economy ────────────────────────────────────────────────────────
    async def handle_economy(self, request):
        """Top 10 economy earners across all guilds."""
        try:
            rows = await db.fetch_all(
                "SELECT user_id, balance FROM economy ORDER BY balance DESC LIMIT 10"
            )
            leaders = []
            for row in (rows or []):
                leaders.append({
                    "user_id": str(row["user_id"]),
                    "balance": row["balance"],
                })
            return web.json_response({"leaderboard": leaders, "total": len(leaders)})
        except Exception as e:
            logger.warning(f"Dashboard /api/economy error: {e}")
            return web.json_response({"leaderboard": [], "total": 0})

    # ── Server Lifecycle ────────────────────────────────────────────────────
    async def start_server(self):
        await self.bot.wait_until_ready()
        self.runner = web.AppRunner(self.app)
        await self.runner.setup()

        # Determine port from env (Railway uses 'PORT', local uses 'STATUS_PORT' or 8080)
        port_env = os.getenv("PORT") or os.getenv("STATUS_PORT", "8080")
        port = int(port_env)

        try:
            self.site = web.TCPSite(self.runner, '0.0.0.0', port)
            await self.site.start()
            logger.info(f"Dashboard API Server started on port {port}")
        except Exception as e:
            logger.error(f"Failed to start API Server on port {port}: {e}")

    async def cog_unload(self):
        if self.runner:
            await self.runner.cleanup()


async def setup(bot: commands.Bot):
    await bot.add_cog(WebStatus(bot))
