import discord
from discord import app_commands
from discord.ext import commands
from ui.embeds import AstraEmbed
from typing import Optional


# Help data — one source of truth for all categories shown in /help
_HELP_CATEGORIES = {
    "🛡️ Moderation": [
        ("/mod kick", "Kick a member with a reason"),
        ("/mod ban", "Ban a member (confirmation dialog)"),
        ("/mod unban", "Unban a user by ID"),
        ("/mod mute", "Timeout a member"),
        ("/mod unmute", "Remove a member's timeout"),
        ("/mod history", "View moderation history for a user"),
        ("/mod purge", "Bulk-delete messages"),
        ("/mod slowmode", "Set channel slow-mode"),
        ("/lock", "Lock a channel"),
        ("/unlock", "Unlock a channel"),
    ],
    "⚠️ Warnings": [
        ("/warn", "Issue a formal warning"),
        ("/warnings", "View a user's warning history"),
        ("/delwarn", "Remove a specific warning by ID"),
        ("/clearwarns", "Clear all warnings for a user"),
    ],
    "🎫 Tickets": [
        ("/ticket setup", "Configure ticket settings"),
        ("/ticket panel", "Deploy a persistent 'Open Ticket' button"),
    ],
    "🎭 Role Menus": [
        ("/rolemenu", "Create a persistent button-based role menu"),
    ],
    "🔔 Reminders": [
        ("/remind", "Set a personal reminder"),
        ("/reminders", "List your pending reminders"),
    ],
    "👋 Welcome": [
        ("/config welcome", "Set the welcome channel"),
        ("/config staff", "Set the staff role"),
    ],
    "⚙️ Config": [
        ("/config view", "View current server configuration"),
        ("/config logging", "Set the logging channel"),
    ],
    "🏗️ Setup": [
        ("/setup_server", "🛰️ Automated server builder"),
    ],
    "📊 Polls": [
        ("/poll", "Create a timed vote with live results"),
    ],
    "🛠️ Developer": [
        ("/sync", "Sync slash commands to Discord"),
        ("/system", "View bot host information"),
    ],
    "✨ General": [
        ("/ping", "Check bot latency"),
        ("/about", "Bot information and credits"),
        ("/help", "This command — browse all commands"),
    ],
}


class HelpSelect(discord.ui.Select):
    """Dropdown to navigate between help categories."""

    def __init__(self, categories: list[str]):
        options = [
            discord.SelectOption(label=cat, value=cat)
            for cat in categories[:25]
        ]
        super().__init__(placeholder="Choose a category...", options=options, min_values=1, max_values=1)

    async def callback(self, interaction: discord.Interaction):
        cat = self.values[0]
        commands_in_cat = _HELP_CATEGORIES.get(cat, [])

        embed = AstraEmbed(title=f"{cat} Commands")
        desc_lines = [f"`{cmd}` — {desc}" for cmd, desc in commands_in_cat]
        embed.description = "\n".join(desc_lines) or "No commands listed."
        embed.set_footer(text=f"Astra • {len(commands_in_cat)} command(s) in this category")
        await interaction.response.edit_message(embed=embed, view=self.view)


class HelpView(discord.ui.View):
    def __init__(self, categories: list[str]):
        super().__init__(timeout=120)
        self.add_item(HelpSelect(categories))

    async def on_timeout(self) -> None:
        for item in self.children:
            item.disabled = True  # type: ignore[union-attr]


class General(commands.Cog):
    """General utility commands."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="help", description="Browse all Astra commands by category.")
    @app_commands.describe(category="Jump straight to a specific category (optional).")
    async def help(self, interaction: discord.Interaction, category: Optional[str] = None):
        categories = list(_HELP_CATEGORIES.keys())

        if category:
            # Find case-insensitive match (strip emoji for partial matching)
            match = next(
                (c for c in categories if category.lower() in c.lower()),
                None,
            )
            if match:
                cmds = _HELP_CATEGORIES[match]
                embed = AstraEmbed(title=f"{match} Commands")
                embed.description = "\n".join(f"`{cmd}` — {desc}" for cmd, desc in cmds)
                embed.set_footer(text=f"Astra • {len(cmds)} command(s) | Use /help for the full menu")
                return await interaction.response.send_message(embed=embed, ephemeral=True)

        total = sum(len(v) for v in _HELP_CATEGORIES.values())
        embed = AstraEmbed(
            title="✨ Astra Help",
            description=(
                f"Astra has **{total}+ commands** across **{len(categories)} categories**.\n"
                "Use the dropdown below to browse by category, or use `/help category:<name>` to jump directly.\n\n"
                "**Quick links:**\n"
                "• [Commands Reference](https://watispro5212.github.io/astra/commands.html)\n"
                "• [Support Server](https://discord.gg/NZ5Gr7eqE8)\n"
                "• [FAQ](https://watispro5212.github.io/astra/faq.html)"
            ),
        )
        for cat, cmds in list(_HELP_CATEGORIES.items())[:6]:
            embed.add_field(name=cat, value=f"{len(cmds)} commands", inline=True)
        embed.set_footer(text="Astra v3.0 • Use the dropdown to explore all categories")

        view = HelpView(categories)
        await interaction.response.send_message(embed=embed, view=view, ephemeral=True)

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
