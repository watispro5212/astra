from core.database import db
from datetime import datetime, timedelta
from typing import Optional, Dict

class ReputationService:
    @staticmethod
    async def get_reputation(user_id: int, guild_id: int) -> int:
        row = await db.fetch_one(
            "SELECT rep_score FROM reputation WHERE user_id = ? AND guild_id = ?",
            user_id, guild_id
        )
        return row["rep_score"] if row else 0

    @staticmethod
    async def give_reputation(from_id: int, to_id: int, guild_id: int) -> bool:
        """Returns True if successful, False if on cooldown."""
        now = datetime.utcnow()
        # Check giver's last rep
        row = await db.fetch_one(
            "SELECT last_rep_given FROM reputation WHERE user_id = ? AND guild_id = ?",
            from_id, guild_id
        )
        
        if row and row["last_rep_given"]:
            last_given = datetime.fromisoformat(row["last_rep_given"])
            if (now - last_given).total_seconds() < 86400: # 24 hours
                return False
                
        # Update giver's last_rep_given
        await db.execute(
            "INSERT INTO reputation (user_id, guild_id, last_rep_given) VALUES (?, ?, ?) "
            "ON CONFLICT(user_id, guild_id) DO UPDATE SET last_rep_given = excluded.last_rep_given",
            from_id, guild_id, now.isoformat()
        )
        
        # Give +1 rep to the receiver
        await db.execute(
            "INSERT INTO reputation (user_id, guild_id, rep_score) VALUES (?, ?, 1) "
            "ON CONFLICT(user_id, guild_id) DO UPDATE SET rep_score = rep_score + 1",
            to_id, guild_id
        )
        
        return True

    @staticmethod
    async def get_cooldown_remaining(user_id: int, guild_id: int) -> Optional[str]:
        """Returns formatted string of cooldown time remaining, or None if ready."""
        row = await db.fetch_one(
            "SELECT last_rep_given FROM reputation WHERE user_id = ? AND guild_id = ?",
            user_id, guild_id
        )
        if not row or not row["last_rep_given"]:
            return None
            
        last_given = datetime.fromisoformat(row["last_rep_given"])
        now = datetime.utcnow()
        delta = now - last_given
        
        if delta.total_seconds() >= 86400:
            return None
            
        rem = timedelta(seconds=86400 - delta.total_seconds())
        hours = rem.seconds // 3600
        minutes = (rem.seconds % 3600) // 60
        return f"{hours}h {minutes}m"
