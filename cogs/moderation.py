import discord
from discord import app_commands
from discord.ext import commands
from services.moderation_service import ModerationService
from ui.embeds import SuccessEmbed, ErrorEmbed, ModerationEmbed, AstraEmbed
from typing import Optional
import datetime

class BanConfirmView(discord.ui.View):
    """View for confirming a ban action."""
    def __init__(self, target: discord.Member, moderator: discord.Member, reason: str, delete_days: int):
        super().__init__(timeout=60)
        self.target = target
        self.moderator = moderator
        self.reason = reason
        self.delete_days = delete_days
        self.value = None

    @discord.ui.button(label="Confirm Ban", style=discord.ButtonStyle.danger)
    async def confirm(self, interaction: discord.Interaction, button: discord.ui.Button):
        if interaction.user.id != self.moderator.id:
            return await interaction.response.send_message("Only the moderator who initiated the ban can confirm it.", ephemeral=True)
        
        try:
            await self.target.ban(reason=self.reason, delete_message_days=self.delete_days)
            case_id = await ModerationService.create_case(
                interaction.guild_id, self.target.id, self.moderator.id, "ban", self.reason
            )
            
            embed = SuccessEmbed(f"Successfully banned {self.target.mention} (Case #{case_id})")
            await interaction.response.edit_message(content=None, embed=embed, view=None)
            
            # TODO: Add logging to log channel
        except Exception as e:
            await interaction.response.edit_message(content=f"❌ Failed to ban: {e}", view=None)

    @discord.ui.button(label="Cancel", style=discord.ButtonStyle.secondary)
    async def cancel(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.edit_message(content="Ban cancelled.", embed=None, view=None)

class Moderation(commands.Cog):
    """Core moderation tools for staff."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="kick", description="Kick a member from the server.")
    @app_commands.checks.has_permissions(kick_members=True)
    async def kick(self, interaction: discord.Interaction, member: discord.Member, reason: str = "No reason provided"):
        """Kicks a member and logs the action."""
        if member.top_role >= interaction.user.top_role:
             return await interaction.response.send_message(embed=ErrorEmbed("You cannot kick someone with a role higher or equal to yours."), ephemeral=True)

        try:
            await member.kick(reason=reason)
            case_id = await ModerationService.create_case(
                interaction.guild_id, member.id, interaction.user.id, "kick", reason
            )
            await interaction.response.send_message(embed=SuccessEmbed(f"Kicked {member.mention} (Case #{case_id})"))
        except Exception as e:
            await interaction.response.send_message(embed=ErrorEmbed(f"Failed to kick: {e}"), ephemeral=True)

    @app_commands.command(name="ban", description="Ban a member from the server.")
    @app_commands.checks.has_permissions(ban_members=True)
    async def ban(self, interaction: discord.Interaction, member: discord.Member, reason: str = "No reason provided", delete_days: int = 0):
        """Initiates a ban request with a confirmation prompt."""
        if member.top_role >= interaction.user.top_role:
             return await interaction.response.send_message(embed=ErrorEmbed("You cannot ban someone with a role higher or equal to yours."), ephemeral=True)

        view = BanConfirmView(member, interaction.user, reason, delete_days)
        await interaction.response.send_message(
            f"⚠️ Are you sure you want to ban **{member}**?\n**Reason:** {reason}", 
            view=view, 
            ephemeral=True
        )

    @app_commands.command(name="warn", description="Issue a warning to a member.")
    @app_commands.checks.has_permissions(manage_messages=True)
    async def warn(self, interaction: discord.Interaction, member: discord.Member, reason: str):
        """Issues a warning and records it in the database."""
        case_id = await ModerationService.create_case(
            interaction.guild_id, member.id, interaction.user.id, "warning", reason
        )
        
        # Try to DM the user
        try:
            dm_embed = ModerationEmbed("Warning", member, interaction.user, reason, case_id)
            dm_embed.description = f"You have been warned in **{interaction.guild.name}**."
            await member.send(embed=dm_embed)
        except:
            pass # DM failed
            
        await interaction.response.send_message(embed=SuccessEmbed(f"Warned {member.mention} (Case #{case_id})"))

    @app_commands.command(name="cases", description="View moderation history for a user.")
    @app_commands.checks.has_permissions(manage_messages=True)
    async def cases(self, interaction: discord.Interaction, user: discord.User):
        """Displays all moderation cases for a user in this guild."""
        cases = await ModerationService.get_user_cases(interaction.guild_id, user.id)
        
        if not cases:
            return await interaction.response.send_message(f"No cases found for {user.mention}.", ephemeral=True)
            
        embed = AstraEmbed(title=f"Moderation History: {user}")
        if user.display_avatar:
            embed.set_thumbnail(url=user.display_avatar.url)
            
        for case in cases[:10]: # Limit to 10 for display
            type_emoji = "⚠️" if case['type'] == "warning" else "🔨"
            date = datetime.datetime.fromisoformat(case['timestamp'].replace('Z', '+00:00')).strftime("%Y-%m-%d")
            embed.add_field(
                name=f"Case #{case['case_number']} | {case['type'].title()} {type_emoji}",
                value=f"**Reason:** {case['reason']}\n**Mod:** <@{case['moderator_id']}>\n**Date:** {date}",
                inline=False
            )
            
        if len(cases) > 10:
            embed.set_footer(text=f"Showing 10 of {len(cases)} total cases")

        await interaction.response.send_message(embed=embed)

async def setup(bot: commands.Bot):
    await bot.add_cog(Moderation(bot))
