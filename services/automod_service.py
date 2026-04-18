import discord
import re
from core.database import db
from datetime import datetime, timedelta
from ui.embeds import WarnEmbed
from core.logger import logger

class AutomodService:
    def __init__(self):
        self.message_counts = {} # (user_id, guild_id) -> list of timestamps

    async def get_config(self, guild_id: int):
        return await db.fetch_one("SELECT * FROM automod_configs WHERE guild_id = ?", guild_id)

    async def check_message(self, message: discord.Message) -> bool:
        """
        Runs all automod checks. 
        Returns True if the message was deleted/handled.
        """
        if not message.guild or message.author.bot:
            return False
            
        # Bypass for members with Manage Messages
        if message.author.guild_permissions.manage_messages:
            return False

        config = await self.get_config(message.guild.id)
        if not config:
            return False

        # 1. Anti-Spam
        if config['spam_enabled']:
            if await self._check_spam(message, config):
                return True

        # 2. Invite / Link Filter
        if config['invite_filter'] or config['link_filter']:
            if await self._check_links(message, config):
                return True

        # 3. Caps Filter
        if config['caps_filter']:
            if await self._check_caps(message, config):
                return True

        # 4. Bad Words
        if config['bad_words']:
            if await self._check_bad_words(message, config):
                return True

        return False

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
        words = [w.strip() for w in config['bad_words'].split(',') if w.strip()]
        for word in words:
            if word.lower() in message.content.lower():
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
