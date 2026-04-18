import discord
from discord.ext import commands
from discord import app_commands
from services.voice_service import voice_service
from core.database import db
from ui.embeds import SuccessEmbed, AstraEmbed, ErrorEmbed
from typing import Optional

class Voice(commands.Cog):
    """Dynamically created temporary voice channels."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_voice_state_update(self, member: discord.Member, before: discord.VoiceState, after: discord.VoiceState):
        if member.bot: return
        
        # 1. Handle Join Hub
        if after.channel:
            config = await voice_service.get_config(member.guild.id)
            if config and after.channel.id == config['hub_channel_id']:
                await voice_service.create_temp_voice(member, after.channel.category)

        # 2. Handle Leave Temp VC
        if before.channel:
            if await voice_service.is_temp_voice(before.channel.id):
                if len(before.channel.members) == 0:
                    try:
                        await before.channel.delete(reason="Temp VC empty")
                        await voice_service.delete_temp_voice(before.channel.id)
                    except discord.Forbidden:
                        pass

    @app_commands.group(name="voice", description="Manage temporary voice channels.")
    async def voice_group(self, interaction: discord.Interaction):
        pass

    @voice_group.command(name="setup", description="Designate a hub channel (Join-to-Create).")
    @app_commands.describe(channel="The voice channel that will trigger temp VC creation.")
    @app_commands.checks.has_permissions(manage_channels=True)
    async def voice_setup(self, interaction: discord.Interaction, channel: discord.VoiceChannel):
        await db.execute(
            """
            INSERT INTO temp_voice_configs (guild_id, hub_channel_id)
            VALUES (?, ?)
            ON CONFLICT(guild_id) DO UPDATE SET hub_channel_id = EXCLUDED.hub_channel_id
            """,
            interaction.guild_id, channel.id
        )
        await interaction.response.send_message(embed=SuccessEmbed(f"Hub channel set to {channel.mention}."), ephemeral=True)

    @voice_group.command(name="lock", description="Lock your temporary voice channel.")
    async def voice_lock(self, interaction: discord.Interaction):
        if not interaction.user.voice or not interaction.user.voice.channel:
            await interaction.response.send_message("You are not in a voice channel!", ephemeral=True)
            return
            
        channel = interaction.user.voice.channel
        owner_id = await voice_service.get_owner(channel.id)
        
        if owner_id != interaction.user.id:
            await interaction.response.send_message("You don't own this voice channel!", ephemeral=True)
            return
            
        await channel.set_permissions(interaction.guild.default_role, connect=False)
        await interaction.response.send_message(embed=SuccessEmbed("Channel locked. Only invited users can join."), ephemeral=True)

    @voice_group.command(name="unlock", description="Unlock your temporary voice channel.")
    async def voice_unlock(self, interaction: discord.Interaction):
        if not interaction.user.voice or not interaction.user.voice.channel:
            await interaction.response.send_message("You are not in a voice channel!", ephemeral=True)
            return
            
        channel = interaction.user.voice.channel
        owner_id = await voice_service.get_owner(channel.id)
        
        if owner_id != interaction.user.id:
            await interaction.response.send_message("You don't own this voice channel!", ephemeral=True)
            return
            
        await channel.set_permissions(interaction.guild.default_role, connect=True)
        await interaction.response.send_message(embed=SuccessEmbed("Channel unlocked. Anyone can join."), ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(Voice(bot))
