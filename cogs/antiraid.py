import discord
from discord import app_commands
from discord.ext import commands
from services.antiraid_service import AntiRaidService
from ui.embeds import AstraEmbed, SuccessEmbed, ErrorEmbed, DangerEmbed
from typing import Optional, Literal

class AntiRaid(commands.Cog):
    """Anti-raid protection — detects mass joins and locks down the server."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_member_join(self, member: discord.Member):
        config = await AntiRaidService.get_config(member.guild.id)
        if not config or not config["enabled"]:
            return

        if config["lockdown_active"]:
            try:
                await member.kick(reason="Anti-raid: server is in lockdown mode")
            except Exception:
                pass
            return

        AntiRaidService.record_join(member.guild.id)
        recent = AntiRaidService.get_recent_joins(member.guild.id, config["join_window"])

        if recent >= config["join_threshold"]:
            await AntiRaidService.set_lockdown(member.guild.id, True)
            await AntiRaidService.log_event(
                member.guild.id, "lockdown_triggered",
                f"Triggered by {recent} joins in {config['join_window']}s"
            )

            alert_channel = member.guild.get_channel(config["alert_channel_id"]) if config["alert_channel_id"] else None

            embed = DangerEmbed(
                title="🚨 Raid Detected — Lockdown Active",
                description=(
                    f"**{recent}** members joined in {config['join_window']} seconds.\n"
                    f"The server has been placed in **lockdown mode**.\n\n"
                    f"New members will be automatically kicked.\n"
                    f"Use `/antiraid unlock` to end the lockdown."
                )
            )
            if alert_channel:
                try:
                    await alert_channel.send(embed=embed)
                except Exception:
                    pass

            # Kick the raid member
            action = config.get("action", "kick")
            if action in ("kick", "ban"):
                try:
                    if action == "ban":
                        await member.ban(reason="Anti-raid: automatic action", delete_message_days=1)
                    else:
                        await member.kick(reason="Anti-raid: automatic action")
                except Exception:
                    pass

    antiraid = app_commands.Group(name="antiraid", description="Anti-raid configuration and controls.")

    @antiraid.command(name="config", description="Configure anti-raid settings.")
    @app_commands.describe(
        enabled="Enable or disable anti-raid protection.",
        threshold="Number of joins to trigger lockdown (default 10).",
        window="Time window in seconds (default 10).",
        action="Action to take on raiders (kick/ban).",
        alert_channel="Channel to send raid alerts to."
    )
    @app_commands.checks.has_permissions(administrator=True)
    async def config(
        self,
        interaction: discord.Interaction,
        enabled: Optional[bool] = None,
        threshold: Optional[int] = None,
        window: Optional[int] = None,
        action: Optional[Literal["kick", "ban"]] = None,
        alert_channel: Optional[discord.TextChannel] = None
    ):
        kwargs = {}
        if enabled is not None:
            kwargs["enabled"] = enabled
        if threshold is not None:
            kwargs["join_threshold"] = threshold
        if window is not None:
            kwargs["join_window"] = window
        if action is not None:
            kwargs["action"] = action
        if alert_channel is not None:
            kwargs["alert_channel_id"] = alert_channel.id

        if not kwargs:
            config = await AntiRaidService.get_config(interaction.guild_id)
            if not config:
                return await interaction.response.send_message(embed=ErrorEmbed("Anti-raid is not configured yet."), ephemeral=True)
            embed = AstraEmbed(title="🛡️ Anti-Raid Configuration")
            embed.add_field(name="Enabled", value="✅ Yes" if config["enabled"] else "❌ No", inline=True)
            embed.add_field(name="Threshold", value=str(config["join_threshold"]), inline=True)
            embed.add_field(name="Window", value=f"{config['join_window']}s", inline=True)
            embed.add_field(name="Action", value=config["action"].title(), inline=True)
            embed.add_field(name="Lockdown Active", value="🔴 Yes" if config["lockdown_active"] else "🟢 No", inline=True)
            return await interaction.response.send_message(embed=embed)

        await AntiRaidService.update_config(interaction.guild_id, **kwargs)
        await interaction.response.send_message(embed=SuccessEmbed("Anti-raid configuration updated."))

    @antiraid.command(name="unlock", description="Lift the active lockdown.")
    @app_commands.checks.has_permissions(administrator=True)
    async def unlock(self, interaction: discord.Interaction):
        config = await AntiRaidService.get_config(interaction.guild_id)
        if not config or not config["lockdown_active"]:
            return await interaction.response.send_message(embed=ErrorEmbed("No active lockdown."), ephemeral=True)
        await AntiRaidService.set_lockdown(interaction.guild_id, False)
        AntiRaidService.clear_cache(interaction.guild_id)
        await AntiRaidService.log_event(interaction.guild_id, "lockdown_lifted", f"Manually lifted by {interaction.user}")
        await interaction.response.send_message(embed=SuccessEmbed("🔓 Lockdown lifted. The server is now open."))

    @antiraid.command(name="status", description="Check the current anti-raid status.")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def status(self, interaction: discord.Interaction):
        config = await AntiRaidService.get_config(interaction.guild_id)
        if not config:
            return await interaction.response.send_message(embed=ErrorEmbed("Anti-raid is not configured."), ephemeral=True)
        embed = AstraEmbed(title="🛡️ Anti-Raid Status")
        embed.add_field(name="Protection", value="✅ Active" if config["enabled"] else "❌ Disabled", inline=True)
        embed.add_field(name="Lockdown", value="🔴 Active" if config["lockdown_active"] else "🟢 Inactive", inline=True)
        embed.add_field(name="Threshold", value=f"{config['join_threshold']} joins / {config['join_window']}s", inline=True)
        await interaction.response.send_message(embed=embed)

async def setup(bot: commands.Bot):
    await bot.add_cog(AntiRaid(bot))
