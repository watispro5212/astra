import discord
from core.database import db
from typing import Optional, List, Dict, Any
from datetime import datetime

class PollService:
    @staticmethod
    async def create_poll(message_id: int, guild_id: int, channel_id: int, question: str, options: List[str], is_anonymous: bool = False, ends_at: Optional[datetime] = None):
        """Initializes a poll and its options in the database."""
        await db.execute(
            "INSERT INTO polls (message_id, guild_id, channel_id, question, is_anonymous, ends_at) VALUES (?, ?, ?, ?, ?, ?)",
            message_id, guild_id, channel_id, question, is_anonymous, ends_at
        )
        
        for option_label in options:
            await db.execute(
                "INSERT INTO poll_options (message_id, label) VALUES (?, ?)",
                message_id, option_label
            )

    @staticmethod
    async def close_poll(message_id: int):
        await db.execute("UPDATE polls SET is_closed = 1 WHERE message_id = ?", message_id)

    @staticmethod
    async def get_active_polls():
        return await db.fetch_all("SELECT * FROM polls WHERE is_closed = 0 AND ends_at <= CURRENT_TIMESTAMP")

    @staticmethod
    async def build_poll_embed(message_id: int, question: str, theme_color: int) -> discord.Embed:
        """Constructs an embed with the latest poll results."""
        poll = await PollService.get_poll(message_id)
        if not poll:
            return discord.Embed(title="Poll Error", description="Data not found.")

        total_votes = sum(opt['vote_count'] for opt in poll['options'])
        is_closed = poll['is_closed']
        is_anonymous = poll['is_anonymous']
        
        embed = discord.Embed(
            title=f"📊 {question}",
            color=theme_color,
            description="Click a button below to cast your vote!" if not is_closed else "🏆 **Final Results**"
        )

        if is_anonymous and not is_closed:
            embed.description += "\n\n🤫 *This is an anonymous poll. Results will be shown once it closes.*"
            for opt in poll['options']:
                embed.add_field(name=opt['label'], value="`░░░░░░░░░░` ??%", inline=False)
        else:
            for opt in poll['options']:
                percentage = (opt['vote_count'] / total_votes * 100) if total_votes > 0 else 0
                bar = PollService.generate_bar(percentage)
                embed.add_field(
                    name=opt['label'],
                    value=f"{bar} **{percentage:.1f}%** ({opt['vote_count']} votes)",
                    inline=False
                )

        if not is_closed and poll['ends_at']:
            # Try parsing from string if it comes back as string from sqlite
            ends_at = poll['ends_at']
            if isinstance(ends_at, str):
                try:
                    ends_at = datetime.fromisoformat(ends_at)
                except:
                    pass
            if isinstance(ends_at, datetime):
                embed.description += f"\n\nEnds <t:{int(ends_at.timestamp())}:R>"

        embed.set_footer(text=f"Total Votes: {total_votes} • {'Closed' if is_closed else 'Active'}")
        return embed
