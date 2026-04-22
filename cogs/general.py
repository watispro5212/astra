import discord
from discord import app_commands
from discord.ext import commands
from ui.embeds import AstraEmbed
from typing import Optional


# Help data — one source of truth for all categories shown in /help
_HELP_CATEGORIES = {
    "🛡️ Moderation": [
        ("/mod kick", "Kick a member from the sector"),
        ("/mod ban", "Permanently ban a member"),
        ("/mod unban", "Restore access for a user ID"),
        ("/mod mute", "Temporarily timeout a member"),
        ("/mod unmute", "Remove an active timeout"),
        ("/mod history", "Audit a member's mod history"),
        ("/mod export", "Download moderation logs"),
        ("/mod purge", "Bulk-delete recent messages"),
        ("/mod slowmode", "Regulate channel message rate"),
        ("/lock", "Secure a channel (Read-Only)"),
        ("/unlock", "Restore channel permissions"),
    ],
    "⚠️ Warnings": [
        ("/warn", "Issue a formal infraction"),
        ("/warnings", "View active infractions for a user"),
        ("/delwarn", "Strike a specific warning by ID"),
        ("/clearwarns", "Reset all warnings for a user"),
    ],
    "🎫 Support": [
        ("/ticket_setup", "Initialize ticket infrastructure"),
        ("/ticket_panel", "Deploy an 'Open Ticket' panel"),
        ("/ticket add", "Add an operative to a ticket"),
        ("/ticket remove", "Remove an operative from a ticket"),
        ("/ticket transcript", "Archive current session logs"),
        ("/ticket stats", "Analyze support performance"),
    ],
    "🎭 Roles": [
        ("/role-menu create", "Create a self-assignment menu"),
    ],
    "🔔 Reminders": [
        ("/remind", "Set a tactical reminder"),
        ("/reminders_list", "Review your pending alerts"),
        ("/remind_delete", "Cancel a specific reminder"),
    ],
    "🏗️ Infrastructure": [
        ("/setup_server", "🛰️ Full automated server builder"),
        ("/welcome", "Configure onboarding protocols"),
    ],
    "⚙️ Configuration": [
        ("/config view", "Review server logic & hooks"),
        ("/config logging", "Set event logging vector"),
        ("/config staff", "Designate the staff role"),
    ],
    "📊 Engagement": [
        ("/poll", "Initiate a timed community vote"),
        ("/poll_close", "Finalize and reveal poll results"),
    ],
    "🛠️ Terminal": [
        ("/dev sync", "Synchronize command definitions"),
        ("/dev reload", "Hot-reload bot extensions"),
        ("/dev shards", "Audit shard health & latency"),
        ("/system", "View technical host metrics"),
    ],
    "✨ Astral": [
        ("/ping", "Test signal strength"),
        ("/about", "Astra mission & architecture"),
        ("/help", "Access this tactical guide"),
    ],
}


class HelpSelect(discord.ui.Select):
    """Tactical dropdown for help navigation."""

    def __init__(self, categories: list[str]):
        options = [
            discord.SelectOption(label=cat, value=cat, emoji=cat.split()[0])
            for cat in categories[:25]
        ]
        super().__init__(placeholder="Select tactical sector...", options=options, min_values=1, max_values=1)

    async def callback(self, interaction: discord.Interaction):
        cat = self.values[0]
        commands_in_cat = _HELP_CATEGORIES.get(cat, [])

        embed = AstraEmbed(title=f"{cat} Operations")
        desc_lines = [f"**{cmd}**\n└ {desc}" for cmd, desc in commands_in_cat]
        embed.description = "\n".join(desc_lines) or "*No operations registered in this sector.*"
        embed.set_footer(text="v6.1.0 Tactical Interface • Use dropdown to explore sectors")
        
        await interaction.response.edit_message(embed=embed, view=self.view)


class HelpView(discord.ui.View):
    def __init__(self, categories: list[str]):
        super().__init__(timeout=180)
        self.add_item(HelpSelect(categories))

    async def on_timeout(self) -> None:
        for item in self.children:
            item.disabled = True
        try:
            await self.message.edit(view=self)
        except:
            pass


class General(commands.Cog):
    """Core utility and navigational tools."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="ping", description="📡 Audit signal strength and network latency.")
    async def ping(self, interaction: discord.Interaction):
        latency = round(self.bot.latency * 1000)
        
        embed = AstraEmbed(
            title="📡 Signal Strength Diagnostic",
            description=(
                f"**Uplink Latency:** `{latency}ms`\n"
                f"**Shard:** `#{interaction.guild.shard_id if interaction.guild else 0}`\n"
                f"**API Status:** `OPERATIONAL`"
            )
        )
        
        # Color coding based on latency
        if latency < 100: embed.color = discord.Color.green()
        elif latency < 250: embed.color = discord.Color.orange()
        else: embed.color = discord.Color.red()
        
        await interaction.response.send_message(embed=embed, ephemeral=True)

    @app_commands.command(name="about", description="🚀 Astra: Mission Architecture & Core Specifications.")
    async def about(self, interaction: discord.Interaction):
        embed = AstraEmbed(
            title="🚀 Astra v6.1 \"Nebula\"",
            description=(
                "Astra is a high-performance, mission-ready Discord management system built for high-scale communities.\n\n"
                "**Core Specifications:**\n"
                f"• **Command Nodes:** `{len(self.bot.tree.get_commands())}`\n"
                f"• **Operational Sectors:** `{len(self.bot.guilds)}` servers\n"
                f"• **Intelligence Matrix:** `Discord.py 2.3.2`\n"
                "• **Architecture:** Event-driven, asynchronous core logic\n\n"
                "**Mission Focus:**\n"
                "Removing friction from community management through automation, diagnostics, and high-fidelity reporting."
            )
        )
        embed.set_thumbnail(url=self.bot.user.display_avatar.url)
        await interaction.response.send_message(embed=embed, ephemeral=True)

    @app_commands.command(name="userinfo", description="🔍 Deep-scan diagnostics for a specific member.")
    @app_commands.describe(member="The subject to analyze.")
    async def userinfo(self, interaction: discord.Interaction, member: Optional[discord.Member] = None):
        target = member or interaction.user
        
        roles = [role.mention for role in reversed(target.roles) if role != interaction.guild.default_role]
        role_str = " ".join(roles[:10]) + (f" ...and {len(roles)-10} more" if len(roles) > 10 else "")
        if not roles: role_str = "None"

        embed = AstraEmbed(title=f"🔍 Diagnostic: {target.display_name}")
        embed.set_thumbnail(url=target.display_avatar.url)
        
        embed.add_field(name="🆔 Identification", value=f"**ID:** `{target.id}`\n**Handle:** `{target.name}`", inline=True)
        embed.add_field(name="📅 Timestamps", value=(
            f"**Created:** <t:{int(target.created_at.timestamp())}:R>\n"
            f"**Joined:** <t:{int(target.joined_at.timestamp())}:R>"
        ), inline=True)
        
        embed.add_field(name="🛡️ Military Record", value=f"**Top Role:** {target.top_role.mention}\n**Roles:** {role_str}", inline=False)
        
        if target.id == interaction.guild.owner_id:
            embed.set_author(name="COMMANDER-IN-CHIEF / OWNER", icon_url="https://i.imgur.com/vHUP5F8.png")
        
        await interaction.response.send_message(embed=embed, ephemeral=True)

    @app_commands.command(name="serverinfo", description="📊 Retrieve detailed operational data for this guild.")
    async def serverinfo(self, interaction: discord.Interaction):
        guild = interaction.guild
        
        embed = AstraEmbed(title=f"📊 Sector Intelligence: {guild.name}")
        if guild.icon: embed.set_thumbnail(url=guild.icon.url)
        
        embed.add_field(name="🏰 Infrastructure", value=(
            f"**ID:** `{guild.id}`\n"
            f"**Owner:** <@{guild.owner_id}>\n"
            f"**Created:** <t:{int(guild.created_at.timestamp())}:F>"
        ), inline=True)
        
        embed.add_field(name="👥 Population", value=(
            f"**Total:** `{guild.member_count}` units\n"
            f"**Level:** `Tier {guild.premium_tier}`\n"
            f"**Boosts:** `{guild.premium_subscription_count}`"
        ), inline=True)
        
        embed.add_field(name="📂 Breakdown", value=(
            f"**Categories:** `{len(guild.categories)}` sectors\n"
            f"**Text:** `{len(guild.text_channels)}` | **Voice:** `{len(guild.voice_channels)}` channels\n"
            f"**Roles:** `{len(guild.roles)}` definitions"
        ), inline=False)
        
        await interaction.response.send_message(embed=embed, ephemeral=True)

    @app_commands.command(name="avatar", description="🖼️ Extract high-resolution visual asset for a member.")
    @app_commands.describe(member="The subject to scan.")
    async def avatar(self, interaction: discord.Interaction, member: Optional[discord.Member] = None):
        target = member or interaction.user
        
        embed = AstraEmbed(title=f"🖼️ Asset: {target.display_name}")
        embed.set_image(url=target.display_avatar.with_size(1024).url)
        
        await interaction.response.send_message(embed=embed, ephemeral=True)


async def setup(bot: commands.Bot):
    await bot.add_cog(General(bot))
