import discord
from core.database import db
from ui.embeds import AstraEmbed
from typing import Optional, Dict, List

class StarboardService:
    @staticmethod
    async def get_starboard_entry(original_id: int) -> Optional[Dict]:
        """Retrieves a starboard entry mapping."""
        row = await db.fetch_one("SELECT * FROM starboard_messages WHERE original_id = ?", original_id)
        return dict(row) if row else None

    @staticmethod
    async def create_starboard_entry(original_id: int, starboard_id: int, guild_id: int, count: int):
        """Creates a link between an original message and its starboard post."""
        await db.execute(
            "INSERT INTO starboard_messages (original_id, starboard_id, guild_id, star_count) VALUES (?, ?, ?, ?)",
            original_id, starboard_id, guild_id, count
        )

    @staticmethod
    async def update_star_count(original_id: int, count: int):
        """Updates the tracked star count for an entry."""
        await db.execute("UPDATE starboard_messages SET star_count = ? WHERE original_id = ?", count, original_id)

    @staticmethod
    def build_starboard_embed(message: discord.Message, star_count: int) -> discord.Embed:
        """Constructs a polished Starboard card."""
        embed = AstraEmbed(description=message.content or "*No text content*")
        embed.set_author(name=message.author.display_name, icon_url=message.author.display_avatar.url)
        
        # Add jump link
        embed.add_field(name="Source", value=f"[Jump to Message]({message.jump_url})", inline=False)
        
        # Handle attachments (Images)
        if message.attachments:
            # Take the first image attachment
            for attr in message.attachments:
                if attr.content_type and attr.content_type.startswith("image/"):
                    embed.set_image(url=attr.url)
                    break

        # Check for stickers or other media if needed
        
        embed.set_footer(text=f"⭐ {star_count} | {message.channel.name}")
        return embed

    @staticmethod
    async def get_guild_starboard_config(guild_id: int) -> Optional[Dict]:
        """Fetches the starboard configuration for a guild."""
        row = await db.fetch_one("SELECT starboard_channel_id, starboard_threshold FROM guilds WHERE guild_id = ?", guild_id)
        return dict(row) if row else None
