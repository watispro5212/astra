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

    @app_commands.command(name="mute", description="Timeout a member.")
    @app_commands.describe(member="The member to mute.", duration="Duration (e.g. 10m, 1h, 1d).", reason="Reason for the mute.")
    @app_commands.checks.has_permissions(moderate_members=True)
    async def mute(self, interaction: discord.Interaction, member: discord.Member, duration: str, reason: str = "No reason provided"):
        if member.top_role >= interaction.user.top_role:
             return await interaction.response.send_message(embed=ErrorEmbed("You cannot mute someone with a role higher or equal to yours."), ephemeral=True)

        # Parse duration
        unit = duration[-1].lower()
        try:
            val = int(duration[:-1])
            if unit == 's': delta = datetime.timedelta(seconds=val)
            elif unit == 'm': delta = datetime.timedelta(minutes=val)
            elif unit == 'h': delta = datetime.timedelta(hours=val)
            elif unit == 'd': delta = datetime.timedelta(days=val)
            else: raise ValueError()
        except:
            return await interaction.response.send_message("Invalid duration! Use e.g. 10m, 1h, 1d.", ephemeral=True)

        try:
            await member.timeout(delta, reason=reason)
            case_id = await ModerationService.create_case(interaction.guild_id, member.id, interaction.user.id, "mute", reason, duration)
            await interaction.response.send_message(embed=SuccessEmbed(f"Muted {member.mention} for {duration} (Case #{case_id})"))
        except Exception as e:
            await interaction.response.send_message(embed=ErrorEmbed(f"Failed to mute: {e}"), ephemeral=True)

    @app_commands.command(name="unmute", description="Remove timeout from a member.")
    @app_commands.checks.has_permissions(moderate_members=True)
    async def unmute(self, interaction: discord.Interaction, member: discord.Member, reason: str = "No reason provided"):
        try:
            await member.timeout(None, reason=reason)
            case_id = await ModerationService.create_case(interaction.guild_id, member.id, interaction.user.id, "unmute", reason)
            await interaction.response.send_message(embed=SuccessEmbed(f"Unmuted {member.mention} (Case #{case_id})"))
        except Exception as e:
            await interaction.response.send_message(embed=ErrorEmbed(f"Failed to unmute: {e}"), ephemeral=True)

    @app_commands.command(name="unban", description="Unban a user from the server.")
    @app_commands.describe(user_id="The ID of the user to unban.")
    @app_commands.checks.has_permissions(ban_members=True)
    async def unban(self, interaction: discord.Interaction, user_id: str, reason: str = "No reason provided"):
        try:
            user = await self.bot.fetch_user(int(user_id))
            await interaction.guild.unban(user, reason=reason)
            case_id = await ModerationService.create_case(interaction.guild_id, user.id, interaction.user.id, "unban", reason)
            await interaction.response.send_message(embed=SuccessEmbed(f"Unbanned {user.name} (Case #{case_id})"))
        except Exception as e:
            await interaction.response.send_message(embed=ErrorEmbed(f"Failed to unban: {e}"), ephemeral=True)

    @app_commands.command(name="purge", description="Clear a number of messages from the channel.")
    @app_commands.describe(amount="Number of messages to delete (max 100).")
    @app_commands.checks.has_permissions(manage_messages=True)
    async def purge(self, interaction: discord.Interaction, amount: int):
        if amount < 1 or amount > 100:
            return await interaction.response.send_message("Please specify between 1 and 100 messages.", ephemeral=True)
            
        await interaction.response.defer(ephemeral=True)
        deleted = await interaction.channel.purge(limit=amount)
        await interaction.followup.send(embed=SuccessEmbed(f"Deleted {len(deleted)} messages."))

    @app_commands.command(name="slowmode", description="Set a slowmode for the channel.")
    @app_commands.describe(seconds="Slowmode delay (in seconds). Set to 0 to disable.")
    @app_commands.checks.has_permissions(manage_channels=True)
    async def slowmode(self, interaction: discord.Interaction, seconds: int):
        try:
            await interaction.channel.edit(slowmode_delay=seconds)
            await interaction.response.send_message(embed=SuccessEmbed(f"Slowmode set to {seconds} seconds.") if seconds > 0 else SuccessEmbed("Slowmode disabled."))
        except Exception as e:
            await interaction.response.send_message(embed=ErrorEmbed(f"Failed to set slowmode: {e}"), ephemeral=True)

    @app_commands.command(name="cases", description="View moderation history for a user.")
    @app_commands.describe(user="The user to check.")
    @app_commands.checks.has_permissions(manage_messages=True)
    async def cases(self, interaction: discord.Interaction, user: discord.User):
        """Displays all moderation cases for a user in this guild."""
        cases = await ModerationService.get_user_cases(interaction.guild_id, user.id)
        
        if not cases:
            return await interaction.response.send_message(f"No cases found for {user.mention}.", ephemeral=True)
            
        embed = AstraEmbed(title=f"Moderation History: {user}")
        if user.display_avatar:
            embed.set_thumbnail(url=user.display_avatar.url)
            
        # Helper for emojis
        emojis = {"warning": "⚠️", "mute": "🔇", "unmute": "🔊", "kick": "👞", "ban": "🔨", "unban": "🔓"}
            
        for case in cases[:10]:
            action = case['type']
            emoji = emojis.get(action, "📝")
            date = datetime.datetime.fromisoformat(case['timestamp'].replace('Z', '+00:00')).strftime("%Y-%m-%d")
            duration_info = f"\n**Duration:** {case['duration']}" if case['duration'] else ""
            
            embed.add_field(
                name=f"Case #{case['case_number']} | {action.title()} {emoji}",
                value=f"**Reason:** {case['reason']}{duration_info}\n**Mod:** <@{case['moderator_id']}>\n**Date:** {date}",
                inline=False
            )
            
        if len(cases) > 10:
            embed.set_footer(text=f"Showing 10 of {len(cases)} total cases")

        await interaction.response.send_message(embed=embed)

async def setup(bot: commands.Bot):
    await bot.add_cog(Moderation(bot))
