import discord
from core.database import db
from typing import Optional, List, Dict, Any
from datetime import datetime

class PollService:
    @staticmethod
    async def create_poll(message_id: int, guild_id: int, channel_id: int, question: str, options: List[str]):
        """Initializes a poll and its options in the database."""
        await db.execute(
            "INSERT INTO polls (message_id, guild_id, channel_id, question) VALUES (?, ?, ?, ?)",
            message_id, guild_id, channel_id, question
        )
        
        for option_label in options:
            await db.execute(
                "INSERT INTO poll_options (message_id, label) VALUES (?, ?)",
                message_id, option_label
            )

    @staticmethod
    async def get_poll(message_id: int) -> Optional[Dict]:
        """Retrieves poll data and its options."""
        poll = await db.fetch_one("SELECT * FROM polls WHERE message_id = ?", message_id)
        if not poll:
            return None
        
        options = await db.fetch_all("SELECT * FROM poll_options WHERE message_id = ?", message_id)
        
        result = dict(poll)
        result['options'] = [dict(opt) for opt in options]
        return result

    @staticmethod
    async def cast_vote(poll_id: int, user_id: int, option_id: int) -> str:
        """Registers a vote for a user. Prevents double-voting."""
        # Check if user already voted
        existing_vote = await db.fetch_one(
            "SELECT 1 FROM poll_votes WHERE message_id = ? AND user_id = ?",
            poll_id, user_id
        )
        
        if existing_vote:
            return "You have already voted in this poll!"

        # Register vote
        await db.execute(
            "INSERT INTO poll_votes (message_id, user_id, option_id) VALUES (?, ?, ?)",
            poll_id, user_id, option_id
        )
        
        # Increment count
        await db.execute(
            "UPDATE poll_options SET vote_count = vote_count + 1 WHERE id = ?",
            option_id
        )
        
        return "Your vote has been counted!"

    @staticmethod
    def generate_bar(percentage: float, length: int = 10) -> str:
        """Generates a visual progress bar string."""
        filled_length = int(length * percentage / 100)
        bar = "█" * filled_length + "░" * (length - filled_length)
        return bar

    @staticmethod
    async def build_poll_embed(message_id: int, question: str, theme_color: int) -> discord.Embed:
        """Constructs an embed with the latest poll results."""
        poll = await PollService.get_poll(message_id)
        if not poll:
            return discord.Embed(title="Poll Error", description="Data not found.")

        total_votes = sum(opt['vote_count'] for opt in poll['options'])
        
        embed = discord.Embed(
            title=f"📊 {question}",
            color=theme_color,
            description="Click a button below to cast your vote!" if not poll['is_closed'] else "This poll is now closed."
        )

        for opt in poll['options']:
            percentage = (opt['vote_count'] / total_votes * 100) if total_votes > 0 else 0
            bar = PollService.generate_bar(percentage)
            embed.add_field(
                name=opt['label'],
                value=f"{bar} **{percentage:.1f}%** ({opt['vote_count']} votes)",
                inline=False
            )

        embed.set_footer(text=f"Total Votes: {total_votes}")
        return embed
