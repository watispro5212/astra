from core.database import db
from typing import Optional, Dict, List
from datetime import datetime
import asyncio

class AntiRaidService:
    _join_cache: Dict[int, List[datetime]] = {}

    @staticmethod
    async def get_config(guild_id: int) -> Optional[Dict]:
        row = await db.fetch_one("SELECT * FROM antiraid_configs WHERE guild_id = ?", guild_id)
        return dict(row) if row else None

    @staticmethod
    async def update_config(guild_id: int, **kwargs):
        exists = await db.fetch_one("SELECT 1 FROM antiraid_configs WHERE guild_id = ?", guild_id)
        if exists:
            cols = ", ".join(f"{k} = ?" for k in kwargs)
            await db.execute(f"UPDATE antiraid_configs SET {cols} WHERE guild_id = ?", *kwargs.values(), guild_id)
        else:
            cols = ["guild_id"] + list(kwargs.keys())
            ph = ", ".join("?" for _ in cols)
            await db.execute(
                f"INSERT INTO antiraid_configs ({', '.join(cols)}) VALUES ({ph})",
                guild_id, *kwargs.values()
            )

    @staticmethod
    async def set_lockdown(guild_id: int, active: bool):
        await db.execute(
            "UPDATE antiraid_configs SET lockdown_active = ? WHERE guild_id = ?", active, guild_id
        )

    @staticmethod
    async def log_event(guild_id: int, event_type: str, description: str):
        await db.execute(
            "INSERT INTO antiraid_logs (guild_id, event_type, description) VALUES (?, ?, ?)",
            guild_id, event_type, description
        )

    @classmethod
    def record_join(cls, guild_id: int) -> int:
        """Track join and return count in window. Returns current join burst count."""
        now = datetime.utcnow()
        if guild_id not in cls._join_cache:
            cls._join_cache[guild_id] = []
        cls._join_cache[guild_id].append(now)
        return len(cls._join_cache[guild_id])

    @classmethod
    def get_recent_joins(cls, guild_id: int, window_seconds: int) -> int:
        now = datetime.utcnow()
        if guild_id not in cls._join_cache:
            return 0
        cls._join_cache[guild_id] = [
            t for t in cls._join_cache[guild_id]
            if (now - t).total_seconds() <= window_seconds
        ]
        return len(cls._join_cache[guild_id])

    @classmethod
    def clear_cache(cls, guild_id: int):
        cls._join_cache.pop(guild_id, None)
