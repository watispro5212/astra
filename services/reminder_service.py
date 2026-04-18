import datetime
import re
from core.database import db
from typing import Optional, List, Dict, Any

class ReminderService:
    @staticmethod
    def parse_duration(duration_str: str) -> Optional[int]:
        """Parses a duration string into total seconds. E.g. '1h 30m' -> 5400."""
        # Simple regex for units
        units = {
            's': 1,
            'm': 60,
            'h': 3600,
            'd': 86400,
            'w': 604800
        }
        
        total_seconds = 0
        matches = re.findall(r'(\d+)\s*([smhdw])', duration_str.lower())
        
        if not matches:
            return None
            
        for amount, unit in matches:
            total_seconds += int(amount) * units[unit]
            
        return total_seconds

    @staticmethod
    async def create_reminder(guild_id: int, channel_id: int, user_id: int, message: str, remind_at: datetime.datetime):
        """Saves a reminder to the database."""
        await db.execute(
            "INSERT INTO reminders (guild_id, channel_id, user_id, message, remind_at) VALUES (?, ?, ?, ?, ?)",
            guild_id, channel_id, user_id, message, remind_at.isoformat()
        )

    @staticmethod
    async def get_due_reminders() -> List[Dict]:
        """Fetches all reminders that are due or overdue."""
        now = datetime.datetime.now().isoformat()
        rows = await db.fetch_all("SELECT * FROM reminders WHERE remind_at <= ?", now)
        return [dict(row) for row in rows]

    @staticmethod
    async def delete_reminder(reminder_id: int):
        """Deletes a reminder after it has been triggered or manually cancelled."""
        await db.execute("DELETE FROM reminders WHERE id = ?", reminder_id)

    @staticmethod
    async def get_user_reminders(user_id: int) -> List[Dict]:
        """Fetches all active reminders for a specific user."""
        rows = await db.fetch_all("SELECT * FROM reminders WHERE user_id = ? ORDER BY remind_at ASC", user_id)
        return [dict(row) for row in rows]
