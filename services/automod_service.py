import discord
import re
from core.database import db
from datetime import datetime, timedelta
from ui.embeds import WarnEmbed
from core.logger import logger

class AutomodService:
    def __init__(self):
        self.message_counts = {} # (user_id, guild_id) -> list of timestamps

    async def cleanup_cache(self):
        """Purges inactive users from the anti-spam cache to prevent memory leaks."""
        now = datetime.now()
        keys_to_delete = []
        for key, timestamps in self.message_counts.items():
            # If no messages in the last hour, clear entry
            if not timestamps or now - timestamps[-1] > timedelta(hours=1):
                keys_to_delete.append(key)
        
        for key in keys_to_delete:
            del self.message_counts[key]
            
    async def get_config(self, guild_id: int):
        return await db.fetch_one("SELECT * FROM automod_configs WHERE guild_id = ?", guild_id)

    async def get_rules(self, guild_id: int):
        rows = await db.fetch_all("SELECT * FROM automod_rules WHERE guild_id = ? AND is_enabled = 1", guild_id)
        return [dict(row) for row in rows]

    async def check_message(self, message: discord.Message) -> bool:
        """Runs both legacy toggles and dynamic rules."""
        if not message.guild or message.author.bot:
            return False
            
        # Global Bypass: Staff
        if message.author.guild_permissions.manage_messages:
            return False

        # 1. Check Legacy Global Config
        config = await self.get_config(message.guild.id)
        if config:
            if config['spam_enabled'] and await self._check_spam(message, config): return True
            if config['invite_filter'] and await self._check_links(message, config): return True
            if config['link_filter'] and await self._check_links(message, config): return True
            if config['caps_filter'] and await self._check_caps(message, config): return True
            if config['bad_words'] and await self._check_bad_words(message, config): return True

        # 2. Check Dynamic Rules
        rules = await self.get_rules(message.guild.id)
        for rule in rules:
            if await self._should_skip_rule(message, rule):
                continue
                
            if await self._execute_rule_check(message, rule):
                return True

        return False

    async def _should_skip_rule(self, message: discord.Message, rule: dict) -> bool:
        """Checks if the user or channel is exempt from this specific rule."""
        # Exempt Channels
        if rule['exempt_channels']:
            if str(message.channel.id) in rule['exempt_channels'].split(','):
                return True
        
        # Exempt Roles
        if rule['exempt_roles']:
            exempt_role_ids = set(rule['exempt_roles'].split(','))
            user_role_ids = {str(r.id) for r in message.author.roles}
            if not user_role_ids.isdisjoint(exempt_role_ids):
                return True
                
        return False

    async def _execute_rule_check(self, message: discord.Message, rule: dict) -> bool:
        """Executes the specific check for a dynamic rule."""
        trigger = rule['trigger_type']
        content = message.content.lower()
        data = rule['trigger_data'] or ""
        
        matched = False
        reason = f"Rule: {rule['name']}"

        if trigger == "word":
            words = [w.strip() for w in data.split(',') if w.strip()]
            normalized = re.sub(r'[^a-z0-9\s]', '', content)
            if any(w in content or w in normalized for w in words):
                matched = True

        elif trigger == "link":
            if re.search(r"https?://", content):
                matched = True

        elif trigger == "invite":
            if re.search(r"discord\.(gg|io|me|li|com/invite)", content):
                matched = True

        elif trigger == "spam":
            # Repurpose existing spam logic for the rule
            fake_config = {'spam_window': 5, 'spam_threshold': 5}
            if await self._check_spam(message, fake_config):
                return True # Already handled delete/warn

        if matched:
            await self._apply_action(message, rule['action'], reason)
            return True
            
        return False

    async def _apply_action(self, message: discord.Message, action: str, reason: str):
        """Applies the configured action for a rule match."""
        try:
            if action in ["delete", "warn", "mute"]:
                await message.delete()
            
            if action in ["warn", "mute"]:
                await self._warn_user(message, reason)
                
            # Mute would require calling moderation_service.mute
            # For brevity in this loop, we'll focus on delete/warn first
        except discord.Forbidden:
            pass

    async def _check_spam(self, message: discord.Message, config) -> bool:
        key = (message.author.id, message.guild.id)
        now = datetime.now()
        
        if key not in self.message_counts:
            self.message_counts[key] = []
            
        self.message_counts[key].append(now)
        
        # Clean old timestamps
        window = config['spam_window'] or 5
        self.message_counts[key] = [t for t in self.message_counts[key] if now - t < timedelta(seconds=window)]
        
        if len(self.message_counts[key]) > config['spam_threshold']:
            try:
                await message.delete()
                # Optional: timeout or warn
                await self._warn_user(message, "Spamming")
                return True
            except discord.Forbidden:
                pass
        return False

    async def _check_links(self, message: discord.Message, config) -> bool:
        content = message.content.lower()
        
        # Invite filter (Discord invites specifically)
        if config['invite_filter']:
            if re.search(r"discord\.(gg|io|me|li|com/invite)", content):
                await message.delete()
                await self._warn_user(message, "Sending Discord Invites")
                return True
                
        # General link filter
        if config['link_filter']:
            if re.search(r"https?://", content):
                await message.delete()
                await self._warn_user(message, "Sending Links")
                return True
                
        return False

    async def _check_caps(self, message: discord.Message, config) -> bool:
        if len(message.content) < 10:
            return False
            
        uppercase_count = sum(1 for c in message.content if c.isupper())
        total_letters = sum(1 for c in message.content if c.isalpha())
        
        if total_letters > 0:
            percent = (uppercase_count / total_letters) * 100
            if percent > config['caps_percent']:
                await message.delete()
                await self._warn_user(message, "Excessive Caps")
                return True
        return False

    async def _check_bad_words(self, message: discord.Message, config) -> bool:
        # Normalization: Remove common separators to catch bypasses like w.o.r.d
        content_low = message.content.lower()
        normalized = re.sub(r'[^a-z0-9\s]', '', content_low)
        
        words = [w.strip().lower() for w in config['bad_words'].split(',') if w.strip()]
        for word in words:
            if word in normalized or word in content_low:
                await message.delete()
                await self._warn_user(message, "Forbidden Language")
                return True
        return False

    async def _warn_user(self, message: discord.Message, reason: str):
        try:
            embed = WarnEmbed("Automod Action", f"Your message in **{message.guild.name}** was removed.")
            embed.add_field(name="Reason", value=reason)
            await message.author.send(embed=embed)
        except discord.Forbidden:
            pass

automod_service = AutomodService()
