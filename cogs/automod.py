import discord
from discord.ext import commands
from discord import app_commands
from services.automod_service import automod_service
from core.database import db
from ui.embeds import SuccessEmbed, AstraEmbed
from typing import Optional, Literal

class Automod(commands.Cog):
    """Automated moderation filters and anti-spam."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_message(self, message: discord.Message):
        await automod_service.check_message(message)

    @commands.Cog.listener()
    async def on_message_edit(self, before: discord.Message, after: discord.Message):
        await automod_service.check_message(after)

    @commands.Cog.listener()
    async def on_automod_action(self, execution: discord.AutoModAction):
        """Intercepts and logs native Discord AutoMod detections."""
        guild_id = execution.guild_id
        user_id = execution.user_id
        rule_name = execution.rule_name or "Unknown Rule"
        content = execution.matched_content or "Content Unavailable"
        
        await db.execute(
            "INSERT INTO automod_logs (guild_id, user_id, rule_name, content) VALUES (?, ?, ?, ?)",
            guild_id, user_id, rule_name, content
        )
        logger.info(f"Native AutoMod Triggered: {rule_name} by {user_id} in {guild_id}")

    automod_group = app_commands.Group(name="automod", description="Configure auto-moderation filters.", default_permissions=discord.Permissions(manage_guild=True))

    @automod_group.command(name="status", description="View current automod settings.")
    async def automod_status(self, interaction: discord.Interaction):
        config = await automod_service.get_config(interaction.guild_id)
        if not config:
            await interaction.response.send_message("Automod is not configured for this server.", ephemeral=True)
            return
            
        embed = AstraEmbed(title="🛡️ Automod Configuration")
        
        embed.add_field(name="Anti-Spam", value="✅ Enabled" if config['spam_enabled'] else "❌ Disabled", inline=True)
        embed.add_field(name="Link Filter", value="✅ Enabled" if config['link_filter'] else "❌ Disabled", inline=True)
        embed.add_field(name="Invite Filter", value="✅ Enabled" if config['invite_filter'] else "❌ Disabled", inline=True)
        embed.add_field(name="Caps Filter", value=f"✅ Enabled ({config['caps_percent']}%)" if config['caps_filter'] else "❌ Disabled", inline=True)
        
        words = config['bad_words']
        embed.add_field(name="Bad Words", value=f"`{words[:100]}...`" if words else "None set", inline=False)
        
        await interaction.response.send_message(embed=embed, ephemeral=True)

    @automod_group.command(name="spam", description="Configure anti-spam settings.")
    @app_commands.describe(enabled="Enable or disable anti-spam.", threshold="Messages allowed in window.", window="Time window in seconds.")
    async def config_spam(self, interaction: discord.Interaction, enabled: bool, threshold: int = 5, window: int = 5):
        await db.execute(
            """
            INSERT INTO automod_configs (guild_id, spam_enabled, spam_threshold, spam_window)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(guild_id) DO UPDATE SET
                spam_enabled = EXCLUDED.spam_enabled,
                spam_threshold = EXCLUDED.spam_threshold,
                spam_window = EXCLUDED.spam_window
            """,
            interaction.guild_id, enabled, threshold, window
        )
        await interaction.response.send_message(embed=SuccessEmbed(f"Anti-spam has been {'enabled' if enabled else 'disabled'}."), ephemeral=True)

    @automod_group.command(name="links", description="Configure link and invite filters.")
    @app_commands.describe(links="Enable or disable general link filter.", invites="Enable or disable Discord invite filter.")
    async def config_links(self, interaction: discord.Interaction, links: Optional[bool] = None, invites: Optional[bool] = None):
        if links is None and invites is None:
            await interaction.response.send_message("Please provide at least one filter setting.", ephemeral=True)
            return

        updates = []
        params = []
        if links is not None:
            updates.append("link_filter = ?")
            params.append(links)
        if invites is not None:
            updates.append("invite_filter = ?")
            params.append(invites)
            
        params.append(interaction.guild_id)
        
        # Ensure row exists
        await db.execute("INSERT OR IGNORE INTO automod_configs (guild_id) VALUES (?)", interaction.guild_id)
        await db.execute(f"UPDATE automod_configs SET {', '.join(updates)} WHERE guild_id = ?", *params)
        
        await interaction.response.send_message(embed=SuccessEmbed("Link filters updated."), ephemeral=True)

    @automod_group.command(name="words", description="Configure bad words filter.")
    @app_commands.describe(words="Comma-separated list of words to filter.")
    async def config_words(self, interaction: discord.Interaction, words: str):
        await db.execute("INSERT OR IGNORE INTO automod_configs (guild_id) VALUES (?)", interaction.guild_id)
        await db.execute("UPDATE automod_configs SET bad_words = ? WHERE guild_id = ?", words, interaction.guild_id)
        await interaction.response.send_message(embed=SuccessEmbed("Bad words filter updated."), ephemeral=True)

    rule_group = app_commands.Group(name="rule", description="Dynamic AutoMod rules.", parent=automod_group)

    @rule_group.command(name="create", description="🛡️ Create a new dynamic AutoMod rule.")
    @app_commands.describe(
        name="A unique name for this rule.",
        trigger="The type of trigger (word, link, invite, spam).",
        data="Trigger data (e.g. words separated by commas).",
        action="Action to take when triggered.",
        exempt_roles="Optional: comma-separated role IDs to exempt.",
        exempt_channels="Optional: comma-separated channel IDs to exempt."
    )
    async def rule_create(
        self, 
        interaction: discord.Interaction, 
        name: str, 
        trigger: Literal["word", "link", "invite", "spam"],
        data: Optional[str] = None,
        action: Literal["delete", "warn", "mute"] = "delete",
        exempt_roles: Optional[str] = None,
        exempt_channels: Optional[str] = None
    ):
        """Creates a new dynamic rule in the database."""
        await db.execute(
            """
            INSERT INTO automod_rules (guild_id, name, trigger_type, trigger_data, action, exempt_roles, exempt_channels)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            interaction.guild_id, name, trigger, data, action, exempt_roles, exempt_channels
        )
        await interaction.response.send_message(embed=SuccessEmbed(f"Custom rule **{name}** has been created and activated."), ephemeral=True)

    @rule_group.command(name="list", description="📋 List all dynamic AutoMod rules for this server.")
    async def rule_list(self, interaction: discord.Interaction):
        """Displays all custom rules."""
        rules = await automod_service.get_rules(interaction.guild_id)
        if not rules:
            return await interaction.response.send_message("No custom rules found for this server.", ephemeral=True)
            
        embed = AstraEmbed(title="🛡️ Dynamic AutoMod Rules")
        for rule in rules:
            exemptions = []
            if rule['exempt_roles']: exemptions.append(f"Roles: {len(rule['exempt_roles'].split(','))}")
            if rule['exempt_channels']: exemptions.append(f"Channels: {len(rule['exempt_channels'].split(','))}")
            
            ex_text = f" | Exempt: {', '.join(exemptions)}" if exemptions else ""
            
            embed.add_field(
                name=f"Rule: {rule['name']} ({rule['trigger_type'].title()})",
                value=f"**Action:** `{rule['action'].upper()}`{ex_text}\n**Data:** `{rule['trigger_data'] or 'N/A'}`",
                inline=False
            )
            
        await interaction.response.send_message(embed=embed, ephemeral=True)

    @rule_group.command(name="remove", description="🗑️ Remove a dynamic AutoMod rule.")
    @app_commands.describe(name="The name of the rule to remove.")
    async def rule_remove(self, interaction: discord.Interaction, name: str):
        """Deletes a rule by name."""
        res = await db.execute("DELETE FROM automod_rules WHERE guild_id = ? AND name = ?", interaction.guild_id, name)
        if res.rowcount == 0:
            return await interaction.response.send_message(f"❌ Rule **{name}** not found.", ephemeral=True)
            
        await interaction.response.send_message(embed=SuccessEmbed(f"Rule **{name}** has been removed."), ephemeral=True)

    @automod_group.command(name="logs", description="📋 View recent AutoMod detections (Custom & Native).")
    @app_commands.describe(limit="Number of logs to view (max 50).")
    async def automod_logs(self, interaction: discord.Interaction, limit: int = 15):
        """Displays a feed of recent security catches."""
        limit = min(max(1, limit), 50)
        
        rows = await db.fetch_all(
            "SELECT * FROM automod_logs WHERE guild_id = ? ORDER BY timestamp DESC LIMIT ?",
            interaction.guild_id, limit
        )
        
        if not rows:
            return await interaction.response.send_message("No recent AutoMod detections found.", ephemeral=True)
            
        embed = AstraEmbed(title="📜 AutoMod Detection Logs")
        for row in rows:
            time_obj = datetime.fromisoformat(row['timestamp'].replace('Z', '+00:00')) if isinstance(row['timestamp'], str) else row['timestamp']
            timestamp = f"<t:{int(time_obj.timestamp())}:R>"
            
            embed.add_field(
                name=f"Rule: {row['rule_name']} | {timestamp}",
                value=f"**User:** <@{row['user_id']}>\n**Content Snippet:** `{row['content'][:50]}...`",
                inline=False
            )
            
        await interaction.response.send_message(embed=embed, ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(Automod(bot))
