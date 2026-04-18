import discord
from discord import app_commands
from discord.ext import commands
from services.reminder_service import ReminderService
from ui.embeds import SuccessEmbed, ErrorEmbed, AstraEmbed
import datetime
from typing import Optional

class Reminders(commands.Cog):
    """Scheduling and reminder tools."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="remind", description="Set a reminder for yourself.")
    @app_commands.describe(
        time="How long from now (e.g. 10m, 1h, 2d)",
        message="What you want to be reminded about"
    )
    async def set_reminder(self, interaction: discord.Interaction, time: str, message: str):
        """Sets a personal reminder."""
        seconds = ReminderService.parse_duration(time)
        if not seconds:
            return await interaction.response.send_message(
                "❌ Invalid time format! Use something like `10m`, `1h 30m`, or `2d`.", 
                ephemeral=True
            )
        
        if seconds < 60:
            return await interaction.response.send_message("❌ Minimum reminder duration is 1 minute.", ephemeral=True)

        remind_at = datetime.datetime.now() + datetime.timedelta(seconds=seconds)
        
        await ReminderService.create_reminder(
            guild_id=interaction.guild_id,
            channel_id=interaction.channel_id,
            user_id=interaction.user.id,
            message=message,
            remind_at=remind_at
        )
        
        embed = SuccessEmbed(f"Reminder set for **{time}** from now.")
        embed.add_field(name="Message", value=message)
        embed.add_field(name="Trigger Time", value=f"<t:{int(remind_at.timestamp())}:F>")
        
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="reminders_list", description="List your active reminders.")
    async def list_reminders(self, interaction: discord.Interaction):
        """Lists all active reminders for the user."""
        reminders = await ReminderService.get_user_reminders(interaction.user.id)
        
        if not reminders:
            return await interaction.response.send_message("You have no active reminders.", ephemeral=True)
            
        embed = AstraEmbed(title="🔔 Your Active Reminders")
        for rem in reminders[:15]:
            trigger_ts = datetime.datetime.fromisoformat(rem['remind_at'])
            embed.add_field(
                name=f"ID: #{rem['id']}",
                value=f"📅 <t:{int(trigger_ts.timestamp())}:R>\n📝 {rem['message']}",
                inline=False
            )
            
        await interaction.response.send_message(embed=embed, ephemeral=True)

    @app_commands.command(name="remind_delete", description="Delete an active reminder.")
    @app_commands.describe(reminder_id="The ID of the reminder to delete.")
    async def delete_reminder(self, interaction: discord.Interaction, reminder_id: int):
        # Fetch to verify ownership
        reminders = await ReminderService.get_user_reminders(interaction.user.id)
        if not any(r['id'] == reminder_id for r in reminders):
             return await interaction.response.send_message("❌ Reminder not found or doesn't belong to you.", ephemeral=True)
             
        await ReminderService.delete_reminder(reminder_id)
        await interaction.response.send_message(embed=SuccessEmbed(f"Reminder #{reminder_id} has been deleted."), ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(Reminders(bot))
