import discord
from core.database import db
from typing import Optional, List, Dict
from datetime import datetime

class ModerationService:
    @staticmethod
    async def create_case(guild_id: int, target_id: int, moderator_id: int, action_type: str, reason: str, duration: Optional[str] = None) -> int:
        """Creates a new moderation case and returns the case number."""
        # Get next case number for this guild
        row = await db.fetch_one(
            "SELECT MAX(case_number) as last_case FROM moderation_cases WHERE guild_id = ?",
            guild_id
        )
        
        next_case = (row['last_case'] or 0) + 1
        
        await db.execute(
            """INSERT INTO moderation_cases 
               (guild_id, case_number, target_id, moderator_id, type, reason, duration) 
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            guild_id, next_case, target_id, moderator_id, action_type, reason, duration
        )
        
        return next_case

    @staticmethod
    async def get_user_cases(guild_id: int, target_id: int) -> List[Dict]:
        """Retrieves all cases for a specific user in a guild."""
        rows = await db.fetch_all(
            "SELECT * FROM moderation_cases WHERE guild_id = ? AND target_id = ? ORDER BY timestamp DESC",
            guild_id, target_id
        )
        return [dict(row) for row in rows]

    @staticmethod
    async def get_case(guild_id: int, case_number: int) -> Optional[Dict]:
        """Retrieves a specific moderation case."""
        row = await db.fetch_one(
            "SELECT * FROM moderation_cases WHERE guild_id = ? AND case_number = ?",
            guild_id, case_number
        )
        return dict(row) if row else None

    @staticmethod
    async def update_case(guild_id: int, case_number: int, **kwargs):
        """Updates a specific moderation case (e.g. for appeals)."""
        columns = ", ".join([f"{k} = ?" for k in kwargs.keys()])
        values = list(kwargs.values())
        
        query = f"UPDATE moderation_cases SET {columns} WHERE guild_id = ? AND case_number = ?"
        await db.execute(query, *values, guild_id, case_number)

    @staticmethod
    async def get_all_cases(guild_id: int, limit: int = 100) -> List[Dict]:
        """Retrieves a bulk list of cases for export."""
        rows = await db.fetch_all(
            "SELECT * FROM moderation_cases WHERE guild_id = ? ORDER BY case_number DESC LIMIT ?",
            guild_id, limit
        )
        return [dict(row) for row in rows]

    @staticmethod
    async def get_guild_config(guild_id: int) -> Optional[Dict]:
        """Retrieves configuration for a specific guild."""
        row = await db.fetch_one("SELECT * FROM guilds WHERE guild_id = ?", guild_id)
        return dict(row) if row else None

    @staticmethod
    async def update_guild_config(guild_id: int, **kwargs):
        """Updates or creates guild configuration."""
        columns = ", ".join([f"{k} = ?" for k in kwargs.keys()])
        values = list(kwargs.values())
        
        # Check if exists
        exists = await db.fetch_one("SELECT 1 FROM guilds WHERE guild_id = ?", guild_id)
        
        if exists:
            query = f"UPDATE guilds SET {columns} WHERE guild_id = ?"
            await db.execute(query, *values, guild_id)
        else:
            # Insert new
            cols = ["guild_id"] + list(kwargs.keys())
            placeholders = ", ".join(["?" for _ in cols])
            query = f"INSERT INTO guilds ({', '.join(cols)}) VALUES ({placeholders})"
            await db.execute(query, guild_id, *values)
