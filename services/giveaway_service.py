import discord
import asyncio
import random
from datetime import datetime, timezone
from core.database import db
from core.logger import logger
from ui.embeds import SuccessEmbed, AstraEmbed

class GiveawayService:
    async def create_giveaway(self, message_id: int, guild_id: int, channel_id: int, host_id: int, prize: str, winner_count: int, ends_at: datetime):
        await db.execute(
            """
            INSERT INTO giveaways (message_id, guild_id, channel_id, host_id, prize, winner_count, ends_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            message_id, guild_id, channel_id, host_id, prize, winner_count, ends_at
        )

    async def add_entry(self, message_id: int, user_id: int) -> bool:
        """Adds a user to the giveaway. Returns False if already entered."""
        try:
            await db.execute(
                "INSERT INTO giveaway_entries (message_id, user_id) VALUES (?, ?)",
                message_id, user_id
            )
            return True
        except:
            return False

    async def pick_winners(self, message_id: int):
        giveaway = await db.fetch_one("SELECT * FROM giveaways WHERE message_id = ?", message_id)
        if not giveaway or giveaway['is_ended']:
            return []

        entries = await db.fetch_all("SELECT user_id FROM giveaway_entries WHERE message_id = ?", message_id)
        if not entries:
            return []

        user_ids = [row['user_id'] for row in entries]
        winner_count = min(len(user_ids), giveaway['winner_count'])
        
        winners = random.sample(user_ids, winner_count)
        
        await db.execute("UPDATE giveaways SET is_ended = 1 WHERE message_id = ?", message_id)
        return winners

    async def get_active_giveaways(self):
        return await db.fetch_all("SELECT * FROM giveaways WHERE is_ended = 0 AND ends_at <= CURRENT_TIMESTAMP")

giveaway_service = GiveawayService()
