import discord
from discord import app_commands
from discord.ext import commands
from core.config import config
from services.patron_service import patron_service
from ui.embeds import AstraEmbed
from typing import Optional
import time


# Help data — one source of truth for all categories shown in /help
_HELP_CATEGORIES = {
    "🛡️ Moderation": [
        ("/mod kick", "Kick a member with a reason"),
        ("/mod ban", "Ban a member (confirmation dialog)"),
        ("/mod unban", "Unban a user by ID"),
        ("/mod mute", "Timeout a member"),
        ("/mod unmute", "Remove a member's timeout"),
        ("/mod purge", "Bulk-delete messages"),
        ("/mod slowmode", "Set channel slow-mode"),
        ("/lock", "Lock a channel (deny @everyone messages)"),
        ("/unlock", "Unlock a channel"),
        ("/nick", "Change a member's nickname"),
    ],
    "⚠️ Warnings": [
        ("/warn", "Issue a formal warning with DM notification"),
        ("/warnings", "View a user's warning history"),
        ("/delwarn", "Remove a specific warning by ID"),
        ("/clearwarns", "Clear all warnings for a user"),
    ],
    "🚨 Anti-Raid": [
        ("/antiraid config", "Set join-rate threshold, window, and action"),
        ("/antiraid unlock", "Manually lift an active lockdown"),
        ("/antiraid status", "View current anti-raid config and state"),
    ],
    "🛡️ AutoMod": [
        ("/automod status", "View in-bot automod settings"),
        ("/automod spam", "Configure anti-spam (threshold / window)"),
        ("/automod links", "Toggle link and invite filters"),
        ("/automod words", "Set bad-word filter list"),
        ("/automod logs", "View recent AutoMod detections"),
        ("/automod rule create", "Create an in-bot dynamic filter rule"),
        ("/automod rule list", "List all in-bot dynamic rules"),
        ("/automod rule remove", "Delete an in-bot dynamic rule"),
        ("/automod native keyword", "Create a Discord-native keyword block rule"),
        ("/automod native profanity", "Enable Discord's built-in profanity filter"),
        ("/automod native mentionspam", "Block excessive @mention messages"),
        ("/automod native list", "List all native Discord AutoMod rules"),
        ("/automod native delete", "Delete a native Discord AutoMod rule"),
        ("/automod native toggle", "Enable or disable a native rule"),
    ],
    "💰 Economy": [
        ("/economy balance", "View your coin balance"),
        ("/economy daily", "Claim your daily 200 coins"),
        ("/economy work", "Earn 50–150 coins (1-hour cooldown)"),
        ("/economy pay", "Transfer coins to another member"),
        ("/economy leaderboard", "Top earners in the server"),
        ("/economy shop", "Browse the server shop"),
        ("/economy buy", "Purchase a shop item"),
        ("/economy additem", "Add an item to the shop (staff)"),
        ("/economy removeitem", "Remove a shop item (staff)"),
    ],
    "🏆 Leveling": [
        ("/rank", "View your XP and level card"),
        ("/leaderboard", "Top members by XP"),
    ],
    "💤 AFK": [
        ("/afk", "Set your AFK message; bot auto-replies on mention"),
    ],
    "🎂 Birthdays": [
        ("/birthday set", "Register your birthday"),
        ("/birthday remove", "Remove your birthday"),
        ("/birthday check", "Check a member's birthday"),
        ("/birthday upcoming", "Next 10 birthdays in the server"),
        ("/birthday config", "Set announcement channel and birthday role"),
    ],
    "💡 Suggestions": [
        ("/suggest", "Submit a community suggestion"),
        ("/suggestion config", "Set the suggestions channel"),
        ("/suggestion approve", "Approve a suggestion (staff)"),
        ("/suggestion deny", "Deny a suggestion (staff)"),
        ("/suggestion implement", "Mark a suggestion as implemented (staff)"),
    ],
    "📨 Invite Tracker": [
        ("/invites check", "View invite stats for a member"),
        ("/invites leaderboard", "Top inviters in the server"),
        ("/invites whoinvited", "Who invited a specific member"),
    ],
    "🎮 Fun": [
        ("/8ball", "Ask the magic 8-ball a question"),
        ("/coinflip", "Flip a coin"),
        ("/roll", "Roll a die with configurable sides"),
        ("/roast", "Roast a target member"),
        ("/trivia", "Live in-channel trivia with a 20-second timer"),
        ("/choose", "Pick randomly from a list of options"),
        ("/rps", "Rock, paper, scissors against the bot"),
    ],
    "🎁 Giveaways & Polls": [
        ("/giveaway", "Start a button-based giveaway"),
        ("/poll", "Create a timed vote with live results"),
    ],
    "⭐ Starboard": [
        ("/config starboard", "Set the starboard channel"),
        ("/config threshold", "Set the star reaction threshold"),
    ],
    "🎫 Tickets": [
        ("/ticket_setup", "Configure ticket category and staff role"),
        ("/ticket_panel", "Deploy a persistent 'Open Ticket' button"),
    ],
    "🎭 Reaction Roles": [
        ("/rolemenu", "Create a persistent button-based role menu"),
    ],
    "📦 Backup": [
        ("/backup export", "Export server config to a JSON file"),
        ("/backup import", "Restore server config from a JSON file"),
        ("/backup info", "Preview metadata before importing a backup"),
    ],
    "👋 Welcome": [
        ("/config welcome", "Set the welcome channel and message"),
        ("/config farewell", "Set the farewell channel and message"),
        ("/config autorole", "Set an auto-role for new members"),
    ],
    "🎙️ Temp Voice": [
        ("/config tempvoice", "Set a Join-to-Create hub channel"),
    ],
    "🔔 Reminders": [
        ("/remind", "Set a personal reminder"),
        ("/reminders", "List your pending reminders"),
    ],
    "⚙️ General": [
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

    @app_commands.command(name="ping", description="Check the bot's latency.")
    async def ping(self, interaction: discord.Interaction):
        start_time = time.time()
        embed = discord.Embed(title="🏓 Pong!", color=config.bot_theme_color)
        embed.add_field(name="Gateway Latency", value=f"{round(self.bot.latency * 1000)}ms")
        await interaction.response.send_message(embed=embed)
        end_time = time.time()
        rest_latency = round((end_time - start_time) * 1000)
        embed.add_field(name="REST Latency", value=f"{rest_latency}ms")
        await interaction.edit_original_response(embed=embed)

    @app_commands.command(name="about", description="Information about Astra.")
    async def about(self, interaction: discord.Interaction):
        embed = discord.Embed(
            title=f"✨ About {config.bot_name}",
            description=(
                f"{config.bot_name} is a polished utility and community assistant designed to make "
                "server management easy and interactive.\n\n"
                "Built with modular features and performance in mind."
            ),
            color=config.bot_theme_color,
        )
        embed.add_field(name="Framework", value="`discord.py` 2.3+", inline=True)
        embed.add_field(name="Commands", value="Slash commands enabled", inline=True)
        embed.add_field(name="Developer", value="watispro1", inline=True)
        embed.add_field(name="GitHub", value="[watispro5212](https://github.com/watispro5212)", inline=True)

        gallery_data = await patron_service.get_random_gallery_image()
        footer_text = f"{config.bot_name} • Built by watispro1"
        if gallery_data:
            embed.set_image(url=gallery_data["image_url"])
            contributor = self.bot.get_user(gallery_data["user_id"])
            name = contributor.display_name if contributor else "Elite Supporter"
            footer_text = f"✨ High Elevation Contributor: {name} | Built by watispro1"

        embed.set_footer(text=footer_text, icon_url=self.bot.user.display_avatar.url if self.bot.user else None)
        await interaction.response.send_message(embed=embed)

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
