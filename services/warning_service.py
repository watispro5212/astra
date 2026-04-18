from core.database import db
from typing import Optional, List, Dict

class WarningService:
    @staticmethod
    async def add_warning(guild_id: int, user_id: int, moderator_id: int, reason: str) -> int:
        return await db.execute(
            "INSERT INTO warnings (guild_id, user_id, moderator_id, reason) VALUES (?, ?, ?, ?)",
            guild_id, user_id, moderator_id, reason
        )

    @staticmethod
    async def get_warnings(guild_id: int, user_id: int) -> List[Dict]:
        rows = await db.fetch_all(
            "SELECT * FROM warnings WHERE guild_id = ? AND user_id = ? AND is_active = 1 ORDER BY timestamp DESC",
            guild_id, user_id
        )
        return [dict(r) for r in rows]

    @staticmethod
    async def get_warning_count(guild_id: int, user_id: int) -> int:
        row = await db.fetch_one(
            "SELECT COUNT(*) as count FROM warnings WHERE guild_id = ? AND user_id = ? AND is_active = 1",
            guild_id, user_id
        )
        return row["count"] if row else 0

    @staticmethod
    async def remove_warning(warning_id: int, guild_id: int) -> bool:
        row = await db.fetch_one("SELECT id FROM warnings WHERE id = ? AND guild_id = ?", warning_id, guild_id)
        if not row:
            return False
        await db.execute("UPDATE warnings SET is_active = 0 WHERE id = ?", warning_id)
        return True

    @staticmethod
    async def clear_warnings(guild_id: int, user_id: int) -> int:
        row = await db.fetch_one(
            "SELECT COUNT(*) as count FROM warnings WHERE guild_id = ? AND user_id = ? AND is_active = 1",
            guild_id, user_id
        )
        count = row["count"] if row else 0
        await db.execute(
            "UPDATE warnings SET is_active = 0 WHERE guild_id = ? AND user_id = ?",
            guild_id, user_id
        )
        return count
