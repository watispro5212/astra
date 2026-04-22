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
        embed.set_footer(text=f"Astra Tactical Guide • {len(commands_in_cat)} operations")
        
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

    @app_commands.command(name="help", description="Access the Astra Tactical Guide.")
    @app_commands.describe(category="Jump directly to a specific tactical sector.")
    async def help(self, interaction: discord.Interaction, category: Optional[str] = None):
        categories = list(_HELP_CATEGORIES.keys())

        if category:
            match = next((c for c in categories if category.lower() in c.lower()), None)
            if match:
                cmds = _HELP_CATEGORIES[match]
                embed = AstraEmbed(title=f"{match} Operations")
                embed.description = "\n".join(f"**{cmd}**\n└ {desc}" for cmd, desc in cmds)
                embed.set_footer(text=f"Astra Tactical Guide • {len(cmds)} operations")
                return await interaction.response.send_message(embed=embed, ephemeral=True)

        total = sum(len(v) for v in _HELP_CATEGORIES.values())
        embed = AstraEmbed(
            title="🛰️ Astra Tactical Command",
            description=(
                f"Astra is currently managing **{total} tactical operations** across **{len(categories)} sectors**.\n"
                "Use the interface below to navigate our core systems.\n\n"
                "**Tactical Uplinks:**\n"
                "• [Operations Manual](https://watispro5212.github.io/astra/commands.html)\n"
                "• [Command Center](https://discord.gg/NZ5Gr7eqE8)\n"
                "• [Intelligence (FAQ)](https://watispro5212.github.io/astra/faq.html)"
            ),
        )
        
        # Add summary fields for first 6 categories
        for cat, cmds in list(_HELP_CATEGORIES.items())[:6]:
            embed.add_field(name=cat, value=f"`{len(cmds)} ops`", inline=True)
            
        embed.set_footer(text="v6.0.0 Tactical Interface • Use dropdown to explore sectors")

        view = HelpView(categories)
        await interaction.response.send_message(embed=embed, view=view, ephemeral=True)
        view.message = await interaction.original_response()

    @help.autocomplete("category")
    async def help_category_autocomplete(
        self, interaction: discord.Interaction, current: str
    ) -> list[app_commands.Choice[str]]:
        categories = list(_HELP_CATEGORIES.keys())
        return [
            app_commands.Choice(name=cat, value=cat)
            for cat in categories
            if current.lower() in cat.lower()
        ][:25]



async def setup(bot: commands.Bot):
    await bot.add_cog(General(bot))
