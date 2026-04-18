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

    @app_commands.command(name="warn", description="Issue a formal warning to a member.")
    @app_commands.describe(member="The member to warn.", reason="Reason for the warning.")
    @app_commands.checks.has_permissions(manage_messages=True)
    async def warn(self, interaction: discord.Interaction, member: discord.Member, reason: str = "No reason provided"):
        if member.top_role >= interaction.user.top_role:
            return await interaction.response.send_message(
                embed=ErrorEmbed("You cannot warn someone with a higher or equal role."), ephemeral=True
            )
        if member.bot:
            return await interaction.response.send_message(embed=ErrorEmbed("You cannot warn a bot."), ephemeral=True)

        warn_id = await WarningService.add_warning(interaction.guild_id, member.id, interaction.user.id, reason)
        count = await WarningService.get_warning_count(interaction.guild_id, member.id)

        embed = AstraEmbed(title=f"⚠️ Warning Issued — #{warn_id}")
        embed.add_field(name="Member", value=member.mention, inline=True)
        embed.add_field(name="Moderator", value=interaction.user.mention, inline=True)
        embed.add_field(name="Total Warnings", value=str(count), inline=True)
        embed.add_field(name="Reason", value=reason, inline=False)
        embed.set_thumbnail(url=member.display_avatar.url)
        embed.color = discord.Color.orange()

        await interaction.response.send_message(embed=embed)

        try:
            dm_embed = AstraEmbed(title=f"⚠️ You received a warning in {interaction.guild.name}")
            dm_embed.add_field(name="Reason", value=reason, inline=False)
            dm_embed.add_field(name="Warning #", value=str(count), inline=True)
            dm_embed.color = discord.Color.orange()
            await member.send(embed=dm_embed)
        except Exception:
            pass

    @app_commands.command(name="warnings", description="View warnings for a member.")
    @app_commands.describe(member="The member to check.")
    @app_commands.checks.has_permissions(manage_messages=True)
    async def warnings(self, interaction: discord.Interaction, member: discord.Member):
        warns = await WarningService.get_warnings(interaction.guild_id, member.id)
        if not warns:
            return await interaction.response.send_message(
                embed=SuccessEmbed(f"{member.mention} has no active warnings."), ephemeral=True
            )
        embed = AstraEmbed(title=f"⚠️ Warnings — {member.display_name}")
        embed.set_thumbnail(url=member.display_avatar.url)
        embed.description = f"**{len(warns)}** active warning(s)"
        for w in warns[:10]:
            date = datetime.datetime.fromisoformat(str(w["timestamp"])).strftime("%Y-%m-%d")
            embed.add_field(
                name=f"Warning #{w['id']} — {date}",
                value=f"**Reason:** {w['reason']}\n**By:** <@{w['moderator_id']}>",
                inline=False
            )
        if len(warns) > 10:
            embed.set_footer(text=f"Showing 10 of {len(warns)} warnings.")
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="delwarn", description="Remove a specific warning by ID.")
    @app_commands.describe(warning_id="The ID of the warning to remove.")
    @app_commands.checks.has_permissions(manage_messages=True)
    async def delwarn(self, interaction: discord.Interaction, warning_id: int):
        success = await WarningService.remove_warning(warning_id, interaction.guild_id)
        if not success:
            return await interaction.response.send_message(embed=ErrorEmbed(f"Warning `#{warning_id}` not found."), ephemeral=True)
        await interaction.response.send_message(embed=SuccessEmbed(f"Warning `#{warning_id}` has been removed."))

    @app_commands.command(name="clearwarns", description="Clear all warnings for a member.")
    @app_commands.describe(member="The member whose warnings to clear.")
    @app_commands.checks.has_permissions(administrator=True)
    async def clearwarns(self, interaction: discord.Interaction, member: discord.Member):
        count = await WarningService.clear_warnings(interaction.guild_id, member.id)
        if count == 0:
            return await interaction.response.send_message(
                embed=ErrorEmbed(f"{member.mention} has no active warnings to clear."), ephemeral=True
            )
        await interaction.response.send_message(embed=SuccessEmbed(f"Cleared **{count}** warning(s) from {member.mention}."))

async def setup(bot: commands.Bot):
    await bot.add_cog(Warnings(bot))
