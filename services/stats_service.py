import discord
from core.database import db
from datetime import datetime

class StatsService:
    async def get_server_stats(self, guild: discord.Guild):
        """Returns complex stats for a guild."""
        return {
            "members": guild.member_count,
            "bots": sum(1 for m in guild.members if m.bot),
            "humans": sum(1 for m in guild.members if not m.bot),
            "online": sum(1 for m in guild.members if m.status != discord.Status.offline),
            "channels": len(guild.channels),
            "text_channels": len(guild.text_channels),
            "voice_channels": len(guild.voice_channels),
            "roles": len(guild.roles),
            "boost_level": guild.premium_tier,
            "boosts": guild.premium_subscription_count,
            "created_at": guild.created_at
        }

    async def get_user_stats(self, member: discord.Member):
        """Returns complex stats for a user."""
        # Get moderation cases
        cases = await db.fetch_all(
            "SELECT id FROM moderation_cases WHERE target_id = ? AND guild_id = ?",
            member.id, member.guild.id
        )
        
        # Get XP data
        xp_data = await db.fetch_one(
            "SELECT xp, level FROM user_xp WHERE user_id = ? AND guild_id = ?",
            member.id, member.guild.id
        )
        
        return {
            "cases": len(cases),
            "xp": xp_data['xp'] if xp_data else 0,
            "level": xp_data['level'] if xp_data else 0,
            "joined_at": member.joined_at,
            "created_at": member.created_at,
            "top_role": member.top_role
        }

stats_service = StatsService()
