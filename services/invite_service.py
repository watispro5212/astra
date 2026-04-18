from core.database import db
from typing import Optional, List, Dict

class InviteService:
    @staticmethod
    async def record_join(guild_id: int, invitee_id: int, inviter_id: Optional[int], invite_code: str):
        await db.execute(
            "INSERT OR REPLACE INTO invite_tracking (guild_id, inviter_id, invitee_id, invite_code) VALUES (?, ?, ?, ?)",
            guild_id, inviter_id, invitee_id, invite_code
        )
        if inviter_id:
            await db.execute(
                "INSERT OR IGNORE INTO invite_counts (guild_id, user_id) VALUES (?, ?)", guild_id, inviter_id
            )
            await db.execute(
                "UPDATE invite_counts SET total = total + 1 WHERE guild_id = ? AND user_id = ?",
                guild_id, inviter_id
            )

    @staticmethod
    async def record_leave(guild_id: int, user_id: int):
        row = await db.fetch_one(
            "SELECT inviter_id FROM invite_tracking WHERE guild_id = ? AND invitee_id = ?",
            guild_id, user_id
        )
        if row and row["inviter_id"]:
            await db.execute(
                "UPDATE invite_counts SET left = left + 1 WHERE guild_id = ? AND user_id = ?",
                guild_id, row["inviter_id"]
            )

    @staticmethod
    async def get_invite_stats(guild_id: int, user_id: int) -> Dict:
        row = await db.fetch_one(
            "SELECT * FROM invite_counts WHERE guild_id = ? AND user_id = ?", guild_id, user_id
        )
        if not row:
            return {"total": 0, "fake": 0, "left": 0}
        d = dict(row)
        d["real"] = d["total"] - d["fake"] - d["left"]
        return d

    @staticmethod
    async def get_leaderboard(guild_id: int, limit: int = 10) -> List[Dict]:
        rows = await db.fetch_all(
            "SELECT user_id, total, fake, left, (total - fake - left) AS real FROM invite_counts WHERE guild_id = ? ORDER BY real DESC LIMIT ?",
            guild_id, limit
        )
        return [dict(r) for r in rows]

    @staticmethod
    async def get_inviter(guild_id: int, user_id: int) -> Optional[int]:
        row = await db.fetch_one(
            "SELECT inviter_id FROM invite_tracking WHERE guild_id = ? AND invitee_id = ?",
            guild_id, user_id
        )
        return row["inviter_id"] if row else None
