import discord
from core.database import db
from typing import Optional, Dict, List

class TicketService:
    @staticmethod
    async def get_config(guild_id: int) -> Optional[Dict]:
        """Retrieves ticket configuration for a guild."""
        row = await db.fetch_one("SELECT * FROM ticket_configs WHERE guild_id = ?", guild_id)
        return dict(row) if row else None

    @staticmethod
    async def update_config(guild_id: int, **kwargs):
        """Updates or creates ticket configuration."""
        columns = ", ".join([f"{k} = ?" for k in kwargs.keys()])
        values = list(kwargs.values())
        
        exists = await db.fetch_one("SELECT 1 FROM ticket_configs WHERE guild_id = ?", guild_id)
        if exists:
            query = f"UPDATE ticket_configs SET {columns} WHERE guild_id = ?"
            await db.execute(query, *values, guild_id)
        else:
            cols = ["guild_id"] + list(kwargs.keys())
            placeholders = ", ".join(["?" for _ in cols])
            query = f"INSERT INTO ticket_configs ({', '.join(cols)}) VALUES ({placeholders})"
            await db.execute(query, guild_id, *values)

    @staticmethod
    async def create_ticket(guild: discord.Guild, user: discord.Member, ticket_type: str = "Support") -> Optional[discord.TextChannel]:
        """Creates a private ticket channel with correct permission overwrites."""
        config = await TicketService.get_config(guild.id)
        if not config:
            return None

        staff_role = guild.get_role(config['staff_role_id'])
        category = guild.get_channel(config['category_id'])

        overwrites = {
            guild.default_role: discord.PermissionOverwrite(read_messages=False),
            user: discord.PermissionOverwrite(read_messages=True, send_messages=True, embed_links=True, attach_files=True),
            guild.me: discord.PermissionOverwrite(read_messages=True, send_messages=True, manage_channels=True)
        }
        
        if staff_role:
            overwrites[staff_role] = discord.PermissionOverwrite(read_messages=True, send_messages=True)

        # Create channel
        channel = await guild.create_text_channel(
            name=f"{ticket_type.lower()}-{user.name}",
            category=category,
            overwrites=overwrites,
            reason=f"Astra: {ticket_type} ticket opened by {user}"
        )

        # Record in DB
        await db.execute(
            "INSERT INTO tickets (channel_id, guild_id, user_id) VALUES (?, ?, ?)",
            channel.id, guild.id, user.id
        )

        return channel

    @staticmethod
    async def generate_transcript(channel: discord.TextChannel) -> str:
        """Generates a simple text transcript of the channel."""
        transcript = f"Transcript for ticket: {channel.name}\n"
        transcript += f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        transcript += "-" * 50 + "\n\n"
        
        # Limit to 500 messages to avoid huge files
        messages = [msg async for msg in channel.history(limit=500, oldest_first=True)]
        for msg in messages:
            timestamp = msg.created_at.strftime('%H:%M:%S')
            content = msg.content if msg.content else "[No Content/Embed/Attachment]"
            transcript += f"[{timestamp}] {msg.author}: {content}\n"
            
        return transcript

    @staticmethod
    async def close_ticket(channel_id: int, reason: str = "No reason provided"):
        """Marks a ticket as closed in the database with a reason."""
        await db.execute(
            "UPDATE tickets SET status = 'closed', reason = ? WHERE channel_id = ?",
            reason, channel_id
        )

    @staticmethod
    async def is_ticket(channel_id: int) -> bool:
        """Checks if a channel ID is an active ticket."""
        row = await db.fetch_one("SELECT 1 FROM tickets WHERE channel_id = ? AND status = 'open'", channel_id)
        return bool(row)
