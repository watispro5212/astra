import discord
from core.database import db
from typing import Optional

class VoiceService:
    async def get_config(self, guild_id: int):
        return await db.fetch_one("SELECT * FROM temp_voice_configs WHERE guild_id = ?", guild_id)

    async def create_temp_voice(self, member: discord.Member, category: Optional[discord.CategoryChannel]):
        """Creates a temporary voice channel for a member."""
        guild = member.guild
        channel_name = f"🔊 {member.display_name}'s Lounge"
        
        try:
            new_channel = await guild.create_voice_channel(
                name=channel_name,
                category=category,
                reason=f"Temp VC hub join for {member}"
            )
            
            # Move member to the new channel
            await member.move_to(new_channel)
            
            # Track in DB
            await db.execute(
                "INSERT INTO temp_voice_channels (channel_id, guild_id, owner_id) VALUES (?, ?, ?)",
                new_channel.id, guild.id, member.id
            )
            return new_channel
        except discord.Forbidden:
            return None

    async def delete_temp_voice(self, channel_id: int):
        await db.execute("DELETE FROM temp_voice_channels WHERE channel_id = ?", channel_id)

    async def is_temp_voice(self, channel_id: int) -> bool:
        data = await db.fetch_one("SELECT 1 FROM temp_voice_channels WHERE channel_id = ?", channel_id)
        return data is not None

    async def get_owner(self, channel_id: int) -> Optional[int]:
        data = await db.fetch_one("SELECT owner_id FROM temp_voice_channels WHERE channel_id = ?", channel_id)
        return data['owner_id'] if data else None

voice_service = VoiceService()
