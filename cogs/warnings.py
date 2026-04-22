import discord
from discord import app_commands
from discord.ext import commands
from services.warning_service import WarningService
from services.moderation_service import ModerationService
from ui.embeds import AstraEmbed, SuccessEmbed, ErrorEmbed
from typing import Optional
import datetime

class Warnings(commands.Cog):
    """Warning system — issue, view, and clear member warnings."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="warn", description="⚠️ Issue a formal tactical warning to a member.")
    @app_commands.describe(member="The member to warn.", reason="Reason for the tactical warning.")
    @app_commands.checks.has_permissions(manage_messages=True)
    @app_commands.guild_only()
    async def warn(self, interaction: discord.Interaction, member: discord.Member, reason: str = "No reason provided"):
        """Issues a warning and notifies the member."""
        if member.top_role >= interaction.user.top_role and interaction.user.id != interaction.guild.owner_id:
            return await interaction.response.send_message(
                embed=ErrorEmbed("Tactical override failed: You cannot warn someone with a higher or equal role."), ephemeral=True
            )
        if member.bot:
            return await interaction.response.send_message(embed=ErrorEmbed("Tactical Error: Automated systems (bots) cannot be warned."), ephemeral=True)

        await interaction.response.defer()
        warn_id = await WarningService.add_warning(interaction.guild_id, member.id, interaction.user.id, reason)
        count = await WarningService.get_warning_count(interaction.guild_id, member.id)

        embed = AstraEmbed(title=f"⚠️ Tactical Warning Issued — #{warn_id}")
        embed.add_field(name="Subject", value=member.mention, inline=True)
        embed.add_field(name="Moderator", value=interaction.user.mention, inline=True)
        embed.add_field(name="Total Violations", value=str(count), inline=True)
        embed.add_field(name="Reason", value=reason, inline=False)
        embed.set_thumbnail(url=member.display_avatar.url)
        embed.color = discord.Color.orange()

        await interaction.followup.send(embed=embed)

        try:
            dm_embed = AstraEmbed(title=f"⚠️ Tactical Warning: {interaction.guild.name}")
            dm_embed.description = f"You have received a formal warning.\n\n**Reason:** {reason}\n**Violation Count:** {count}"
            dm_embed.color = discord.Color.orange()
            await member.send(embed=dm_embed)
        except Exception:
            pass

    @app_commands.command(name="warnings", description="📋 Review tactical warning records for a member.")
    @app_commands.describe(member="The member to analyze.")
    @app_commands.checks.has_permissions(manage_messages=True)
    @app_commands.guild_only()
    async def warnings(self, interaction: discord.Interaction, member: discord.Member):
        """Displays warning history for a member."""
        await interaction.response.defer(ephemeral=True)
        warns = await WarningService.get_warnings(interaction.guild_id, member.id)
        
        if not warns:
            return await interaction.followup.send(
                embed=SuccessEmbed(f"No tactical violations found for {member.mention}."), ephemeral=True
            )
            
        embed = AstraEmbed(title=f"📋 Violation Records — {member.display_name}")
        embed.set_thumbnail(url=member.display_avatar.url)
        embed.description = f"**{len(warns)}** active tactical warning(s) identified."
        
        for w in warns[:10]:
            date = datetime.datetime.fromisoformat(str(w["timestamp"])).strftime("%Y-%m-%d")
            embed.add_field(
                name=f"Warning #{w['id']} — {date}",
                value=f"**Reason:** {w['reason']}\n**Issued By:** <@{w['moderator_id']}>",
                inline=False
            )
            
        if len(warns) > 10:
            embed.set_footer(text=f"Displaying 10 of {len(warns)} total violations.")
            
        await interaction.followup.send(embed=embed)

    @app_commands.command(name="delwarn", description="🗑️ Purge a specific warning record by ID.")
    @app_commands.describe(warning_id="The unique violation ID.")
    @app_commands.checks.has_permissions(manage_messages=True)
    @app_commands.guild_only()
    async def delwarn(self, interaction: discord.Interaction, warning_id: int):
        """Removes a specific warning."""
        await interaction.response.defer(ephemeral=True)
        success = await WarningService.remove_warning(warning_id, interaction.guild_id)
        if not success:
            return await interaction.followup.send(embed=ErrorEmbed(f"Violation ID `#{warning_id}` not found in sector records."))
            
        await interaction.followup.send(embed=SuccessEmbed(f"Violation record `#{warning_id}` has been purged."))

    @app_commands.command(name="clearwarns", description="☢️ WIPE all warning records for a member.")
    @app_commands.describe(member="The member whose records will be purged.")
    @app_commands.checks.has_permissions(administrator=True)
    @app_commands.guild_only()
    async def clearwarns(self, interaction: discord.Interaction, member: discord.Member):
        """Clears all warnings for a member."""
        await interaction.response.defer(ephemeral=True)
        count = await WarningService.clear_warnings(interaction.guild_id, member.id)
        if count == 0:
            return await interaction.followup.send(
                embed=ErrorEmbed(f"No violation records found for {member.mention}."), ephemeral=True
            )
            
        await interaction.followup.send(embed=SuccessEmbed(f"Successfully purged **{count}** violation records from {member.mention}."))

async def setup(bot: commands.Bot):
    await bot.add_cog(Warnings(bot))
