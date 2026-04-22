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
    """Tactical confirmation for permanent sector removal."""
    def __init__(self, target: discord.Member, moderator: discord.Member, reason: str, delete_days: int):
        super().__init__(timeout=60)
        self.target = target
        self.moderator = moderator
        self.reason = reason
        self.delete_days = delete_days

    @discord.ui.button(label="Execute Ban", style=discord.ButtonStyle.danger, emoji="🔨")
    async def confirm(self, interaction: discord.Interaction, button: discord.ui.Button):
        if interaction.user.id != self.moderator.id:
            return await interaction.response.send_message("❌ Restricted: Only the initiating officer can confirm this execution.", ephemeral=True)
        
        try:
            await self.target.ban(reason=self.reason, delete_message_days=self.delete_days)
            case_id = await ModerationService.create_case(
                interaction.guild_id, self.target.id, self.moderator.id, "ban", self.reason
            )
            
            embed = SuccessEmbed(f"Successfully banned **{self.target}** (Case #{case_id})")
            await interaction.response.edit_message(content=None, embed=embed, view=None)
            
            # Log to tactical channel
            log_channel = await ModerationService.get_log_channel(interaction.guild)
            if log_channel:
                log_embed = ModerationEmbed("Permanent Ban", self.target, self.moderator, self.reason, case_id)
                await log_channel.send(embed=log_embed)
                
        except Exception as e:
            await interaction.response.edit_message(content=f"❌ **Execution Failed:** {e}", view=None)

    @discord.ui.button(label="Abort", style=discord.ButtonStyle.secondary)
    async def cancel(self, interaction: discord.Interaction, button: discord.ui.Button):
        await interaction.response.edit_message(content="🛡️ **Ban operation aborted.**", embed=None, view=None)

class Moderation(commands.Cog):
    """Advanced tactical moderation suite."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    mod = app_commands.Group(name="mod", description="Tactical moderation operations.")

    @mod.command(name="kick", description="Eject a member from the server.")
    @app_commands.describe(member="The member to eject.", reason="Reason for the ejection.")
    @app_commands.checks.has_permissions(kick_members=True)
    async def kick(self, interaction: discord.Interaction, member: discord.Member, reason: str = "No reason provided"):
        if member.top_role >= interaction.user.top_role:
             return await interaction.response.send_message(embed=ErrorEmbed("Insufficient Authority: Cannot eject a member with superior or equal rank."), ephemeral=True)

        try:
            await member.kick(reason=reason)
            case_id = await ModerationService.create_case(
                interaction.guild_id, member.id, interaction.user.id, "kick", reason
            )
            await interaction.response.send_message(embed=SuccessEmbed(f"Ejected **{member}** (Case #{case_id})"))
            
            log_channel = await ModerationService.get_log_channel(interaction.guild)
            if log_channel:
                await log_channel.send(embed=ModerationEmbed("Kick", member, interaction.user, reason, case_id))
        except Exception as e:
            await interaction.response.send_message(embed=ErrorEmbed(f"Ejection Failed: {e}"), ephemeral=True)

    @mod.command(name="ban", description="Permanently ban a member from the sector.")
    @app_commands.describe(member="The member to ban.", reason="Reason for the ban.", delete_days="Days of messages to purge (0-7).")
    @app_commands.checks.has_permissions(ban_members=True)
    async def ban(self, interaction: discord.Interaction, member: discord.Member, reason: str = "No reason provided", delete_days: int = 0):
        if member.top_role >= interaction.user.top_role:
             return await interaction.response.send_message(embed=ErrorEmbed("Insufficient Authority: Cannot ban a member with superior or equal rank."), ephemeral=True)

        delete_days = min(max(0, delete_days), 7)
        view = BanConfirmView(member, interaction.user, reason, delete_days)
        
        embed = AstraEmbed(
            title="🔨 Tactical Confirmation Required",
            description=f"Are you prepared to permanently ban **{member}**?\n\n**Reason:** {reason}\n**Message Purge:** {delete_days} days"
        )
        embed.color = discord.Color.red()
        
        await interaction.response.send_message(embed=embed, view=view, ephemeral=True)

    @mod.command(name="mute", description="Place a member in tactical timeout.")
    @app_commands.describe(member="The member to mute.", duration="Time (e.g. 10m, 1h, 1d).", reason="Reason for the timeout.")
    @app_commands.checks.has_permissions(moderate_members=True)
    async def mute(self, interaction: discord.Interaction, member: discord.Member, duration: str, reason: str = "No reason provided"):
        if member.top_role >= interaction.user.top_role:
             return await interaction.response.send_message(embed=ErrorEmbed("Insufficient Authority: Cannot mute a member with superior or equal rank."), ephemeral=True)

        if not duration[-1].isalpha():
            return await interaction.response.send_message("❌ Vector Missing: Use units like `10m`, `1h`, or `1d`.", ephemeral=True)
            
        unit = duration[-1].lower()
        try:
            val = int(duration[:-1])
            delta = {
                's': datetime.timedelta(seconds=val),
                'm': datetime.timedelta(minutes=val),
                'h': datetime.timedelta(hours=val),
                'd': datetime.timedelta(days=val)
            }.get(unit)
            if not delta: raise ValueError()
        except:
            return await interaction.response.send_message("❌ Invalid Vector: Use units like `10m`, `1h`, or `1d`.", ephemeral=True)

        try:
            await member.timeout(delta, reason=reason)
            case_id = await ModerationService.create_case(interaction.guild_id, member.id, interaction.user.id, "mute", reason, duration)
            await interaction.response.send_message(embed=SuccessEmbed(f"Placed **{member}** in timeout for **{duration}** (Case #{case_id})"))
            
            log_channel = await ModerationService.get_log_channel(interaction.guild)
            if log_channel:
                await log_channel.send(embed=ModerationEmbed("Timeout", member, interaction.user, f"[{duration}] {reason}", case_id))
        except Exception as e:
            await interaction.response.send_message(embed=ErrorEmbed(f"Timeout Failed: {e}"), ephemeral=True)

    @mod.command(name="unmute", description="Restore communication for a member.")
    @app_commands.describe(member="The member to unmute.", reason="Reason for restoring communication.")
    @app_commands.checks.has_permissions(moderate_members=True)
    async def unmute(self, interaction: discord.Interaction, member: discord.Member, reason: str = "No reason provided"):
        try:
            await member.timeout(None, reason=reason)
            case_id = await ModerationService.create_case(interaction.guild_id, member.id, interaction.user.id, "unmute", reason)
            await interaction.response.send_message(embed=SuccessEmbed(f"Restored communications for **{member}** (Case #{case_id})"))
            
            log_channel = await ModerationService.get_log_channel(interaction.guild)
            if log_channel:
                await log_channel.send(embed=ModerationEmbed("Unmute", member, interaction.user, reason, case_id))
        except Exception as e:
            await interaction.response.send_message(embed=ErrorEmbed(f"Restoration Failed: {e}"), ephemeral=True)

    @mod.command(name="unban", description="Restore sector access for a user.")
    @app_commands.describe(user_id="The ID of the user to unban.", reason="Reason for restoring access.")
    @app_commands.checks.has_permissions(ban_members=True)
    async def unban(self, interaction: discord.Interaction, user_id: str, reason: str = "No reason provided"):
        try:
            user = await self.bot.fetch_user(int(user_id))
            await interaction.guild.unban(user, reason=reason)
            case_id = await ModerationService.create_case(interaction.guild_id, user.id, interaction.user.id, "unban", reason)
            await interaction.response.send_message(embed=SuccessEmbed(f"Restored access for **{user.name}** (Case #{case_id})"))
            
            log_channel = await ModerationService.get_log_channel(interaction.guild)
            if log_channel:
                log_embed = ModerationEmbed("Unban", user, interaction.user, reason, case_id)
                await log_channel.send(embed=log_embed)
        except Exception as e:
            await interaction.response.send_message(embed=ErrorEmbed(f"Access Restoration Failed: {e}"), ephemeral=True)

    @mod.command(name="history", description="Audit moderation history for a user or case.")
    @app_commands.describe(user="The user to audit.", case_number="Specific case ID to review.")
    @app_commands.checks.has_permissions(manage_messages=True)
    async def history(self, interaction: discord.Interaction, user: Optional[discord.User] = None, case_number: Optional[int] = None):
        if case_number:
            case = await ModerationService.get_case(interaction.guild_id, case_number)
            if not case:
                return await interaction.response.send_message(f"❌ Case `#{case_number}` not found in archives.", ephemeral=True)
            
            embed = AstraEmbed(title=f"Case #{case_number} Archive | {case['type'].title()}")
            embed.description = f"**Target:** <@{case['target_id']}>\n**Moderator:** <@{case['moderator_id']}>\n**Status:** `{case['case_status']}`"
            embed.add_field(name="Reason", value=case['reason'], inline=False)
            if case['is_appealed']:
                embed.add_field(name="Intelligence (Appeal)", value=case['appeal_reason'] or "No details.", inline=False)
            
            ts = case['timestamp']
            if isinstance(ts, str):
                ts = datetime.datetime.fromisoformat(ts.replace('Z', '+00:00'))
            embed.timestamp = ts
            return await interaction.response.send_message(embed=embed)

        target = user or interaction.user
        cases = await ModerationService.get_user_cases(interaction.guild_id, target.id)
        
        if not cases:
            return await interaction.response.send_message(f"No archive records found for {target.mention}.", ephemeral=True)
            
        embed = AstraEmbed(title=f"Tactical Audit: {target}")
        if target.display_avatar:
            embed.set_thumbnail(url=target.display_avatar.url)
            
        emojis = {"warning": "⚠️", "mute": "🔇", "unmute": "🔊", "kick": "👞", "ban": "🔨", "unban": "🔓"}
            
        for case in cases[:10]:
            action = case['type']
            emoji = emojis.get(action, "📝")
            status = f" [`{case['case_status'].upper()}`]" if case['case_status'] != 'active' else ""
            ts = case['timestamp']
            if isinstance(ts, str):
                ts = datetime.datetime.fromisoformat(ts.replace('Z', '+00:00'))
            date = ts.strftime("%Y-%m-%d")
            
            embed.add_field(
                name=f"Case #{case['case_number']} | {action.title()} {emoji}{status}",
                value=f"**Reason:** {case['reason']}\n**Officer:** <@{case['moderator_id']}>\n**Date:** {date}",
                inline=False
            )
            
        if len(cases) > 10:
            embed.set_footer(text=f"Displaying 10 of {len(cases)} total records")

        await interaction.response.send_message(embed=embed)

    @mod.command(name="export", description="Download the moderation archives for this server.")
    @app_commands.describe(format="Export format (JSON/CSV).", limit="Number of records (Max 500).")
    @app_commands.checks.has_permissions(administrator=True)
    async def export(self, interaction: discord.Interaction, format: Literal["json", "csv"] = "json", limit: int = 100):
        await interaction.response.defer(ephemeral=True)
        limit = min(max(1, limit), 500)
        
        cases = await ModerationService.get_all_cases(interaction.guild_id, limit)
        if not cases:
            return await interaction.followup.send("❌ No records found to export.")

        file_data = io.BytesIO()
        if format == "json":
            content = json.dumps(cases, indent=4, default=str)
            file_data.write(content.encode('utf-8'))
            filename = f"astra_audit_{interaction.guild_id}.json"
        else:
            keys = cases[0].keys()
            output = io.StringIO()
            dict_writer = csv.DictWriter(output, fieldnames=keys)
            dict_writer.writeheader()
            dict_writer.writerows(cases)
            file_data.write(output.getvalue().encode('utf-8'))
            filename = f"astra_audit_{interaction.guild_id}.csv"

        file_data.seek(0)
        await interaction.followup.send(f"✅ **Archive exported:** {len(cases)} records in `{format.upper()}` format.", file=discord.File(file_data, filename=filename))

    @app_commands.command(name="purge", description="Tactical message removal.")
    @app_commands.describe(amount="Quantity of messages to purge (Max 100).")
    @app_commands.checks.has_permissions(manage_messages=True)
    async def purge(self, interaction: discord.Interaction, amount: int):
        amount = min(max(1, amount), 100)
        await interaction.response.defer(ephemeral=True)
        deleted = await interaction.channel.purge(limit=amount)
        await interaction.followup.send(embed=SuccessEmbed(f"Tactical Purge Complete: **{len(deleted)} messages** removed."))

    @app_commands.command(name="slowmode", description="Regulate message traffic.")
    @app_commands.describe(seconds="Delay between messages (0 to disable).")
    @app_commands.checks.has_permissions(manage_channels=True)
    async def slowmode(self, interaction: discord.Interaction, seconds: int):
        try:
            await interaction.channel.edit(slowmode_delay=seconds)
            msg = f"Traffic regulated: **{seconds}s** delay active." if seconds > 0 else "Traffic regulation disabled."
            await interaction.response.send_message(embed=SuccessEmbed(msg))
        except Exception as e:
            await interaction.response.send_message(embed=ErrorEmbed(f"Regulation Failed: {e}"), ephemeral=True)

    @app_commands.command(name="lock", description="Secure a channel (Restrict Sending).")
    @app_commands.describe(channel="Target channel (defaults to current).", reason="Reason for security lockdown.")
    @app_commands.checks.has_permissions(manage_channels=True)
    async def lock(self, interaction: discord.Interaction, channel: Optional[discord.TextChannel] = None, reason: str = "Tactical lockdown"):
        target = channel or interaction.channel
        overwrite = target.overwrites_for(interaction.guild.default_role)
        overwrite.send_messages = False
        try:
            await target.set_permissions(interaction.guild.default_role, overwrite=overwrite, reason=reason)
            await interaction.response.send_message(embed=SuccessEmbed(f"🔒 **{target.mention} secured.**"))
            await target.send(f"🔒 **LOCKDOWN ACTIVE:** Channel secured by {interaction.user.mention}. Reason: *{reason}*")
        except Exception as e:
            await interaction.response.send_message(embed=ErrorEmbed(f"Lockdown Failed: {e}"), ephemeral=True)

    @app_commands.command(name="unlock", description="Restore channel traffic (Remove Restriction).")
    @app_commands.describe(channel="Target channel (defaults to current).")
    @app_commands.checks.has_permissions(manage_channels=True)
    async def unlock(self, interaction: discord.Interaction, channel: Optional[discord.TextChannel] = None):
        target = channel or interaction.channel
        overwrite = target.overwrites_for(interaction.guild.default_role)
        overwrite.send_messages = None
        try:
            await target.set_permissions(interaction.guild.default_role, overwrite=overwrite)
            await interaction.response.send_message(embed=SuccessEmbed(f"🔓 **{target.mention} access restored.**"))
            await target.send(f"🔓 **LOCKDOWN LIFTED:** Tactical access restored by {interaction.user.mention}.")
        except Exception as e:
            await interaction.response.send_message(embed=ErrorEmbed(f"Restoration Failed: {e}"), ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(Moderation(bot))

