import discord
from discord import app_commands
from discord.ext import commands
from services.reminder_service import ReminderService
from ui.embeds import SuccessEmbed, ErrorEmbed, AstraEmbed
import datetime
from typing import Optional

class Reminders(commands.Cog):
    """Temporal scheduling and mission-critical reminder protocols."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="remind", description="🔔 Establish a personal temporal reminder.")
    @app_commands.describe(
        time="Duration until trigger (e.g. 10m, 1h, 2d).",
        message="Transmission content for the reminder."
    )
    @app_commands.allowed_installs(guilds=True, users=True)
    @app_commands.allowed_contexts(guilds=True, dms=True, private_channels=True)
    async def set_reminder(self, interaction: discord.Interaction, time: str, message: str):
        """Sets a personal reminder."""
        await interaction.response.defer(ephemeral=True)
        
        seconds = ReminderService.parse_duration(time)
        if not seconds:
            return await interaction.followup.send(
                embed=ErrorEmbed("Invalid temporal format! Use mission standards like `10m`, `1h 30m`, or `2d`."), 
                ephemeral=True
            )
        
        if seconds < 60:
            return await interaction.followup.send(embed=ErrorEmbed("Minimum temporal displacement is 60 seconds."), ephemeral=True)

        remind_at = datetime.datetime.now() + datetime.timedelta(seconds=seconds)
        
        await ReminderService.create_reminder(
            guild_id=interaction.guild_id,
            channel_id=interaction.channel_id,
            user_id=interaction.user.id,
            message=message,
            remind_at=remind_at
        )
        
        embed = SuccessEmbed(f"Temporal reminder synchronized for **{time}**.")
        embed.add_field(name="Transmission", value=message)
        embed.add_field(name="Trigger Sequence", value=f"<t:{int(remind_at.timestamp())}:F>")
        
        await interaction.followup.send(embed=embed)

    @app_commands.command(name="reminders_list", description="📋 View all active personal temporal reminders.")
    @app_commands.allowed_installs(guilds=True, users=True)
    @app_commands.allowed_contexts(guilds=True, dms=True, private_channels=True)
    async def list_reminders(self, interaction: discord.Interaction):
        """Lists all active reminders for the user."""
        await interaction.response.defer(ephemeral=True)
        reminders = await ReminderService.get_user_reminders(interaction.user.id)
        
        if not reminders:
            return await interaction.followup.send(embed=InfoEmbed("No active temporal reminders found in the database."))
            
        embed = AstraEmbed(title="🔔 Active Temporal Reminders")
        for rem in reminders[:15]:
            trigger_ts = datetime.datetime.fromisoformat(rem['remind_at'])
            embed.add_field(
                name=f"Sequence ID: #{rem['id']}",
                value=f"📅 **Trigger:** <t:{int(trigger_ts.timestamp())}:R>\n📝 **Data:** {rem['message']}",
                inline=False
            )
            
        await interaction.followup.send(embed=embed)

    @app_commands.command(name="remind_delete", description="🗑️ Terminate an active temporal reminder.")
    @app_commands.describe(reminder_id="The unique sequence ID of the reminder.")
    @app_commands.allowed_installs(guilds=True, users=True)
    @app_commands.allowed_contexts(guilds=True, dms=True, private_channels=True)
    async def delete_reminder(self, interaction: discord.Interaction, reminder_id: int):
        """Deletes a specific reminder by ID."""
        await interaction.response.defer(ephemeral=True)
        
        # Fetch to verify ownership
        reminders = await ReminderService.get_user_reminders(interaction.user.id)
        if not any(r['id'] == reminder_id for r in reminders):
             return await interaction.followup.send(embed=ErrorEmbed(f"Sequence ID `#{reminder_id}` not found or unauthorized."), ephemeral=True)
             
        await ReminderService.delete_reminder(reminder_id)
        await interaction.followup.send(embed=SuccessEmbed(f"Temporal sequence `#{reminder_id}` has been terminated."))

async def setup(bot: commands.Bot):
    await bot.add_cog(Reminders(bot))
