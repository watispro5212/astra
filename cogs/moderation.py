import discord
from discord import app_commands
from discord.ext import commands
from services.moderation_service import ModerationService
from ui.embeds import SuccessEmbed, ErrorEmbed, ModerationEmbed, AstraEmbed
from typing import Optional, Literal
import datetime
import json
import io
import csv

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
    """Advanced moderation suite for staff."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    mod = app_commands.Group(name="mod", description="Advanced moderation suite.")

    @mod.command(name="kick", description="Kick a member from the server.")
    @app_commands.describe(member="The member to kick.", reason="Reason for the kick.")
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

    @mod.command(name="ban", description="Ban a member from the server.")
    @app_commands.describe(member="The member to ban.", reason="Reason for the ban.", delete_days="Days of messages to delete.")
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

    @mod.command(name="mute", description="Timeout a member.")
    @app_commands.describe(member="The member to mute.", duration="Duration (e.g. 10m, 1h, 1d).", reason="Reason for the mute.")
    @app_commands.checks.has_permissions(moderate_members=True)
    async def mute(self, interaction: discord.Interaction, member: discord.Member, duration: str, reason: str = "No reason provided"):
        if member.top_role >= interaction.user.top_role:
             return await interaction.response.send_message(embed=ErrorEmbed("You cannot mute someone with a role higher or equal to yours."), ephemeral=True)

        # Parse duration
        if not duration[-1].isalpha():
            return await interaction.response.send_message("❌ Missing unit! Use e.g. 10m, 1h, 1d.", ephemeral=True)
            
        unit = duration[-1].lower()
        try:
            val = int(duration[:-1])
            if unit == 's': delta = datetime.timedelta(seconds=val)
            elif unit == 'm': delta = datetime.timedelta(minutes=val)
            elif unit == 'h': delta = datetime.timedelta(hours=val)
            elif unit == 'd': delta = datetime.timedelta(days=val)
            else: raise ValueError()
        except:
            return await interaction.response.send_message("❌ Invalid format! Use e.g. 10m, 1h, 1d.", ephemeral=True)

        try:
            await member.timeout(delta, reason=reason)
            case_id = await ModerationService.create_case(interaction.guild_id, member.id, interaction.user.id, "mute", reason, duration)
            await interaction.response.send_message(embed=SuccessEmbed(f"Muted {member.mention} for {duration} (Case #{case_id})"))
        except Exception as e:
            await interaction.response.send_message(embed=ErrorEmbed(f"Failed to mute: {e}"), ephemeral=True)

    @mod.command(name="unmute", description="Remove timeout from a member.")
    @app_commands.describe(member="The member to unmute.", reason="Reason for the unmute.")
    @app_commands.checks.has_permissions(moderate_members=True)
    async def unmute(self, interaction: discord.Interaction, member: discord.Member, reason: str = "No reason provided"):
        try:
            await member.timeout(None, reason=reason)
            case_id = await ModerationService.create_case(interaction.guild_id, member.id, interaction.user.id, "unmute", reason)
            await interaction.response.send_message(embed=SuccessEmbed(f"Unmuted {member.mention} (Case #{case_id})"))
        except Exception as e:
            await interaction.response.send_message(embed=ErrorEmbed(f"Failed to unmute: {e}"), ephemeral=True)

    @mod.command(name="unban", description="Unban a user from the server.")
    @app_commands.describe(user_id="The ID of the user to unban.", reason="Reason for the unban.")
    @app_commands.checks.has_permissions(ban_members=True)
    async def unban(self, interaction: discord.Interaction, user_id: str, reason: str = "No reason provided"):
        try:
            user = await self.bot.fetch_user(int(user_id))
            await interaction.guild.unban(user, reason=reason)
            case_id = await ModerationService.create_case(interaction.guild_id, user.id, interaction.user.id, "unban", reason)
            await interaction.response.send_message(embed=SuccessEmbed(f"Unbanned {user.name} (Case #{case_id})"))
        except Exception as e:
            await interaction.response.send_message(embed=ErrorEmbed(f"Failed to unban: {e}"), ephemeral=True)

    @mod.command(name="history", description="View moderation history for a user or specific case.")
    @app_commands.describe(user="The user to check.", case_number="A specific case number to view.")
    @app_commands.checks.has_permissions(manage_messages=True)
    async def history(self, interaction: discord.Interaction, user: Optional[discord.User] = None, case_number: Optional[int] = None):
        """Advanced moderation history lookup."""
        if case_number:
            case = await ModerationService.get_case(interaction.guild_id, case_number)
            if not case:
                return await interaction.response.send_message(f"❌ Case #{case_number} not found.", ephemeral=True)
            
            embed = AstraEmbed(title=f"Case #{case_number} | {case['type'].title()}")
            embed.description = f"**Target:** <@{case['target_id']}>\n**Moderator:** <@{case['moderator_id']}>\n**Status:** `{case['case_status']}`"
            embed.add_field(name="Reason", value=case['reason'], inline=False)
            if case['is_appealed']:
                embed.add_field(name="Appeal Info", value=case['appeal_reason'] or "No reason provided.", inline=False)
            embed.timestamp = datetime.datetime.fromisoformat(case['timestamp'].replace('Z', '+00:00'))
            return await interaction.response.send_message(embed=embed)

        target = user or interaction.user
        cases = await ModerationService.get_user_cases(interaction.guild_id, target.id)
        
        if not cases:
            return await interaction.response.send_message(f"No cases found for {target.mention}.", ephemeral=True)
            
        embed = AstraEmbed(title=f"Moderation History: {target}")
        if target.display_avatar:
            embed.set_thumbnail(url=target.display_avatar.url)
            
        emojis = {"warning": "⚠️", "mute": "🔇", "unmute": "🔊", "kick": "👞", "ban": "🔨", "unban": "🔓"}
            
        for case in cases[:10]:
            action = case['type']
            emoji = emojis.get(action, "📝")
            status = f" [`{case['case_status']}`]" if case['case_status'] != 'active' else ""
            date = datetime.datetime.fromisoformat(case['timestamp'].replace('Z', '+00:00')).strftime("%Y-%m-%d")
            
            embed.add_field(
                name=f"Case #{case['case_number']} | {action.title()} {emoji}{status}",
                value=f"**Reason:** {case['reason']}\n**Mod:** <@{case['moderator_id']}>\n**Date:** {date}",
                inline=False
            )
            
        if len(cases) > 10:
            embed.set_footer(text=f"Showing 10 of {len(cases)} total cases")

        await interaction.response.send_message(embed=embed)

    @mod.command(name="appeal", description="Mark a case as appealed or resolved.")
    @app_commands.describe(case_number="The ID of the case to appeal.", reason="Reason/notes for the appeal.")
    @app_commands.checks.has_permissions(administrator=True)
    async def appeal(self, interaction: discord.Interaction, case_number: int, reason: str):
        case = await ModerationService.get_case(interaction.guild_id, case_number)
        if not case:
            return await interaction.response.send_message(f"❌ Case #{case_number} not found.", ephemeral=True)
            
        await ModerationService.update_case(
            interaction.guild_id, 
            case_number, 
            is_appealed=True, 
            appeal_reason=reason,
            case_status="appealed"
        )
        await interaction.response.send_message(embed=SuccessEmbed(f"Case #{case_number} has been marked as appealed."))

    @mod.command(name="export", description="Export moderation cases for this guild.")
    @app_commands.describe(format="The format for export (json/csv).", limit="Number of cases to export (max 500).")
    @app_commands.checks.has_permissions(administrator=True)
    async def export(self, interaction: discord.Interaction, format: Literal["json", "csv"] = "json", limit: int = 100):
        """Generates a downloadable file of moderation logs."""
        await interaction.response.defer(ephemeral=True)
        limit = min(max(1, limit), 500)
        
        cases = await ModerationService.get_all_cases(interaction.guild_id, limit)
        if not cases:
            return await interaction.followup.send("❌ No cases found to export.")

        file_data = io.BytesIO()
        if format == "json":
            content = json.dumps(cases, indent=4, default=str)
            file_data.write(content.encode('utf-8'))
            filename = f"mod_export_{interaction.guild_id}.json"
        else:
            # CSV Export
            keys = cases[0].keys()
            output = io.StringIO()
            dict_writer = csv.DictWriter(output, fieldnames=keys)
            dict_writer.writeheader()
            dict_writer.writerows(cases)
            file_data.write(output.getvalue().encode('utf-8'))
            filename = f"mod_export_{interaction.guild_id}.csv"

        file_data.seek(0)
        discord_file = discord.File(file_data, filename=filename)
        await interaction.followup.send(f"✅ Successfully exported **{len(cases)}** cases as `{format.upper()}`.", file=discord_file)

    # ── UTILITY COMMANDS ──────────────────────────────────────────────────────
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

async def setup(bot: commands.Bot):
    await bot.add_cog(Moderation(bot))
