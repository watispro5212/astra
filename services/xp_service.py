import discord
from core.database import db
from datetime import datetime, timedelta
from services.patron_service import patron_service
import random

class XPService:
    def __init__(self):
        self.cooldowns = {} # (user_id, guild_id) -> last_xp_time

    async def add_xp(self, message: discord.Message) -> bool:
        """
        Adds XP to a user based on message. 
        Returns True if the user leveled up.
        """
        if not message.guild or message.author.bot:
            return False

        user_id = message.author.id
        guild_id = message.guild.id
        
        # Get guild settings
        guild_data = await db.fetch_one(
            "SELECT xp_enabled, xp_rate, xp_cooldown FROM guilds WHERE guild_id = ?",
            guild_id
        )
        
        if not guild_data or not guild_data['xp_enabled']:
            return False

        # Check cooldown with Patron adjustment
        cooldown_multiplier = await patron_service.get_cooldown_adjustment(user_id)
        adjusted_cooldown = guild_data['xp_cooldown'] * cooldown_multiplier
        
        last_time = self.cooldowns.get((user_id, guild_id))
        now = datetime.now()
        if last_time and now < last_time + timedelta(seconds=adjusted_cooldown):
            return False

        # Award XP with Patron Multiplier
        multiplier = await patron_service.get_multiplier(user_id)
        base_xp = guild_data['xp_rate'] + random.randint(-2, 2)
        xp_to_add = int(base_xp * multiplier)
        
        await db.execute(
            """
            INSERT INTO user_xp (user_id, guild_id, xp, level, last_message_at)
            VALUES (?, ?, ?, 0, ?)
            ON CONFLICT(user_id, guild_id) DO UPDATE SET
                xp = xp + ?,
                last_message_at = ?
            """,
            user_id, guild_id, xp_to_add, now, xp_to_add, now
        )

        self.cooldowns[(user_id, guild_id)] = now
        
        # Check level up
        return await self._check_level_up(message)

    async def _check_level_up(self, message: discord.Message) -> bool:
        user_id = message.author.id
        guild_id = message.guild.id
        
        data = await db.fetch_one(
            "SELECT xp, level FROM user_xp WHERE user_id = ? AND guild_id = ?",
            user_id, guild_id
        )
        
        if not data:
            return False

        xp = data['xp']
        current_level = data['level']
        
        # Simple formula: XP = 5 * (level ^ 2) + (50 * level) + 100
        # Actually let's use a more standard one: 100 * (level ^ 1.5)
        # For simplicity: Level 1 = 100, Level 2 = 250, Level 3 = 450...
        # Let's use: level * 100 + (level-1)^2 * 50
        
        def get_xp_for_level(level):
            if level == 0: return 0
            return level * 100 + ((level - 1) ** 2) * 50

        next_level = current_level + 1
        if xp >= get_xp_for_level(next_level):
            # Level up!
            await db.execute(
                "UPDATE user_xp SET level = ? WHERE user_id = ? AND guild_id = ?",
                next_level, user_id, guild_id
            )
            return True
            
        return False

    async def get_rank(self, user_id: int, guild_id: int):
        """Returns (xp, level, rank_position)"""
        data = await db.fetch_one(
            "SELECT xp, level FROM user_xp WHERE user_id = ? AND guild_id = ?",
            user_id, guild_id
        )
        
        if not data:
            return 0, 0, 0
            
        # Calc rank (global position in guild)
        all_ranks = await db.fetch_all(
            "SELECT user_id FROM user_xp WHERE guild_id = ? ORDER BY xp DESC",
            guild_id
        )
        
        rank_pos = 0
        for i, row in enumerate(all_ranks, 1):
            if row['user_id'] == user_id:
                rank_pos = i
                break
                
        return data['xp'], data['level'], rank_pos

xp_service = XPService()
