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

        await TicketService.log_event(channel.id, guild.id, "opened")
        return channel

    @staticmethod
    async def log_event(channel_id: int, guild_id: int, event_type: str, staff_id: int = None):
        """Logs a ticket event in the database for analytics."""
        await db.execute(
            "INSERT INTO ticket_events (channel_id, guild_id, staff_id, event_type) VALUES (?, ?, ?, ?)",
            channel_id, guild_id, staff_id, event_type
        )

    @staticmethod
    async def claim_ticket(channel: discord.TextChannel, staff: discord.Member):
        """Assigns a staff member to a ticket and logs the event."""
        # Update permissions for the staff
        await channel.set_permissions(staff, read_messages=True, send_messages=True, manage_messages=True)
        await TicketService.log_event(channel.id, channel.guild.id, "claimed", staff.id)
        
        # Update ticket status in DB (optionally add staff_id to tickets table)
        await db.execute("UPDATE tickets SET staff_id = ? WHERE channel_id = ?", staff.id, channel.id)

    @staticmethod
    async def generate_transcript(channel: discord.TextChannel) -> discord.File:
        """Generates a professional text transcript of the channel."""
        from services.transcript_service import transcript_service
        return await transcript_service.generate_text_transcript(channel)

    @staticmethod
    async def close_ticket(channel_id: int, guild_id: int, reason: str = "No reason provided", closed_by_id: int = None):
        """Marks a ticket as closed in the database and logs the event."""
        await db.execute(
            "UPDATE tickets SET status = 'closed', reason = ? WHERE channel_id = ?",
            reason, channel_id
        )
        await TicketService.log_event(channel_id, guild_id, "closed", closed_by_id)

    @staticmethod
    async def is_ticket(channel_id: int) -> bool:
        """Checks if a channel ID is an active ticket."""
        row = await db.fetch_one("SELECT 1 FROM tickets WHERE channel_id = ? AND status = 'open'", channel_id)
        return bool(row)
