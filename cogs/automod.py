import discord
from discord.ext import commands
from discord import app_commands
from services.automod_service import automod_service
from core.database import db
from core.logger import logger
from ui.embeds import SuccessEmbed, AstraEmbed, ErrorEmbed
from typing import Optional, Literal
from datetime import datetime


class Automod(commands.Cog):
    """Automated moderation filters, anti-spam, and native Discord AutoMod rule management."""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    # ── Listeners ────────────────────────────────────────────────────────────

    @commands.Cog.listener()
    async def on_message(self, message: discord.Message):
        await automod_service.check_message(message)

    @commands.Cog.listener()
    async def on_message_edit(self, before: discord.Message, after: discord.Message):
        await automod_service.check_message(after)

    @commands.Cog.listener()
    async def on_automod_action(self, execution: discord.AutoModAction):
        """Intercepts and logs native Discord AutoMod detections."""
        rule_name = execution.rule_name or "Unknown Rule"
        content = execution.matched_content or "Content Unavailable"
        await db.execute(
            "INSERT INTO automod_logs (guild_id, user_id, rule_name, content) VALUES (?, ?, ?, ?)",
            execution.guild_id, execution.user_id, rule_name, content,
        )
        logger.info(f"Native AutoMod triggered: {rule_name} by {execution.user_id} in {execution.guild_id}")

    # ── /automod group ────────────────────────────────────────────────────────

    automod_group = app_commands.Group(
        name="automod",
        description="Configure auto-moderation filters.",
        default_permissions=discord.Permissions(manage_guild=True),
    )

    @automod_group.command(name="status", description="View current automod settings.")
    async def automod_status(self, interaction: discord.Interaction):
        config = await automod_service.get_config(interaction.guild_id)
        if not config:
            await interaction.response.send_message("Automod is not configured for this server.", ephemeral=True)
            return

        embed = AstraEmbed(title="🛡️ Automod Configuration")
        embed.add_field(name="Anti-Spam", value="✅ Enabled" if config["spam_enabled"] else "❌ Disabled", inline=True)
        embed.add_field(name="Link Filter", value="✅ Enabled" if config["link_filter"] else "❌ Disabled", inline=True)
        embed.add_field(name="Invite Filter", value="✅ Enabled" if config["invite_filter"] else "❌ Disabled", inline=True)
        embed.add_field(
            name="Caps Filter",
            value=f"✅ Enabled ({config['caps_percent']}%)" if config["caps_filter"] else "❌ Disabled",
            inline=True,
        )
        words = config["bad_words"]
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
            interaction.guild_id, enabled, threshold, window,
        )
        await interaction.response.send_message(
            embed=SuccessEmbed(f"Anti-spam has been {'enabled' if enabled else 'disabled'}."), ephemeral=True
        )

    @automod_group.command(name="links", description="Configure link and invite filters.")
    @app_commands.describe(links="Enable or disable general link filter.", invites="Enable or disable Discord invite filter.")
    async def config_links(self, interaction: discord.Interaction, links: Optional[bool] = None, invites: Optional[bool] = None):
        if links is None and invites is None:
            await interaction.response.send_message("Please provide at least one filter setting.", ephemeral=True)
            return

        updates, params = [], []
        if links is not None:
            updates.append("link_filter = ?")
            params.append(links)
        if invites is not None:
            updates.append("invite_filter = ?")
            params.append(invites)
        params.append(interaction.guild_id)

        await db.execute("INSERT OR IGNORE INTO automod_configs (guild_id) VALUES (?)", interaction.guild_id)
        await db.execute(f"UPDATE automod_configs SET {', '.join(updates)} WHERE guild_id = ?", *params)
        await interaction.response.send_message(embed=SuccessEmbed("Link filters updated."), ephemeral=True)

    @automod_group.command(name="words", description="Configure bad words filter.")
    @app_commands.describe(words="Comma-separated list of words to filter.")
    async def config_words(self, interaction: discord.Interaction, words: str):
        await db.execute("INSERT OR IGNORE INTO automod_configs (guild_id) VALUES (?)", interaction.guild_id)
        await db.execute("UPDATE automod_configs SET bad_words = ? WHERE guild_id = ?", words, interaction.guild_id)
        await interaction.response.send_message(embed=SuccessEmbed("Bad words filter updated."), ephemeral=True)

    @automod_group.command(name="logs", description="View recent AutoMod detections (custom and native).")
    @app_commands.describe(limit="Number of logs to view (max 50).")
    async def automod_logs(self, interaction: discord.Interaction, limit: int = 15):
        limit = min(max(1, limit), 50)
        rows = await db.fetch_all(
            "SELECT * FROM automod_logs WHERE guild_id = ? ORDER BY timestamp DESC LIMIT ?",
            interaction.guild_id, limit,
        )
        if not rows:
            return await interaction.response.send_message("No recent AutoMod detections found.", ephemeral=True)

        embed = AstraEmbed(title="📜 AutoMod Detection Logs")
        for row in rows:
            time_obj = (
                datetime.fromisoformat(row["timestamp"].replace("Z", "+00:00"))
                if isinstance(row["timestamp"], str)
                else row["timestamp"]
            )
            timestamp = f"<t:{int(time_obj.timestamp())}:R>"
            embed.add_field(
                name=f"Rule: {row['rule_name']} | {timestamp}",
                value=f"**User:** <@{row['user_id']}>\n**Content:** `{row['content'][:60]}`",
                inline=False,
            )
        await interaction.response.send_message(embed=embed, ephemeral=True)

    # ── /automod rule subgroup (in-bot dynamic rules) ─────────────────────────

    rule_group = app_commands.Group(name="rule", description="Manage in-bot dynamic AutoMod rules.", parent=automod_group)

    @rule_group.command(name="create", description="Create a dynamic AutoMod rule.")
    @app_commands.describe(
        name="A unique name for this rule.",
        trigger="Trigger type (word, link, invite, spam).",
        data="Trigger data (e.g. comma-separated words).",
        action="Action when triggered.",
        exempt_roles="Optional: comma-separated role IDs to exempt.",
        exempt_channels="Optional: comma-separated channel IDs to exempt.",
    )
    async def rule_create(
        self,
        interaction: discord.Interaction,
        name: str,
        trigger: Literal["word", "link", "invite", "spam"],
        data: Optional[str] = None,
        action: Literal["delete", "warn", "mute"] = "delete",
        exempt_roles: Optional[str] = None,
        exempt_channels: Optional[str] = None,
    ):
        await db.execute(
            """
            INSERT INTO automod_rules (guild_id, name, trigger_type, trigger_data, action, exempt_roles, exempt_channels)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            interaction.guild_id, name, trigger, data, action, exempt_roles, exempt_channels,
        )
        await interaction.response.send_message(
            embed=SuccessEmbed(f"Rule **{name}** created and activated."), ephemeral=True
        )

    @rule_group.command(name="list", description="List all in-bot dynamic AutoMod rules.")
    async def rule_list(self, interaction: discord.Interaction):
        rules = await automod_service.get_rules(interaction.guild_id)
        if not rules:
            return await interaction.response.send_message("No custom rules found for this server.", ephemeral=True)

        embed = AstraEmbed(title="🛡️ Dynamic AutoMod Rules")
        for rule in rules:
            exemptions = []
            if rule["exempt_roles"]:
                exemptions.append(f"Roles: {len(rule['exempt_roles'].split(','))}")
            if rule["exempt_channels"]:
                exemptions.append(f"Channels: {len(rule['exempt_channels'].split(','))}")
            ex_text = f" | Exempt: {', '.join(exemptions)}" if exemptions else ""
            embed.add_field(
                name=f"{rule['name']} ({rule['trigger_type'].title()})",
                value=f"**Action:** `{rule['action'].upper()}`{ex_text}\n**Data:** `{rule['trigger_data'] or 'N/A'}`",
                inline=False,
            )
        await interaction.response.send_message(embed=embed, ephemeral=True)

    @rule_group.command(name="remove", description="Remove a dynamic AutoMod rule.")
    @app_commands.describe(name="The name of the rule to remove.")
    async def rule_remove(self, interaction: discord.Interaction, name: str):
        res = await db.execute("DELETE FROM automod_rules WHERE guild_id = ? AND name = ?", interaction.guild_id, name)
        if res.rowcount == 0:
            return await interaction.response.send_message(f"Rule **{name}** not found.", ephemeral=True)
        await interaction.response.send_message(embed=SuccessEmbed(f"Rule **{name}** removed."), ephemeral=True)

    # ── /automod native subgroup (Discord's native AutoMod API) ───────────────

    native_group = app_commands.Group(
        name="native",
        description="Manage Discord's built-in AutoMod rules directly via the API.",
        parent=automod_group,
    )

    @native_group.command(name="keyword", description="Create a Discord-native keyword block rule.")
    @app_commands.describe(
        name="Rule name shown in Discord's AutoMod panel.",
        keywords="Comma-separated list of words/phrases to block.",
        alert_channel="Optional channel to receive AutoMod alerts.",
        timeout_seconds="Optional: timeout violators for this many seconds (max 2419200).",
    )
    async def native_keyword(
        self,
        interaction: discord.Interaction,
        name: str,
        keywords: str,
        alert_channel: Optional[discord.TextChannel] = None,
        timeout_seconds: Optional[int] = None,
    ):
        await interaction.response.defer(ephemeral=True)

        keyword_list = [kw.strip() for kw in keywords.split(",") if kw.strip()]
        if not keyword_list:
            return await interaction.followup.send(embed=ErrorEmbed("Please provide at least one keyword."))

        trigger = discord.AutoModTrigger(
            type=discord.AutoModRuleTriggerType.keyword,
            keyword_filter=keyword_list,
        )
        actions: list[discord.AutoModRuleAction] = [
            discord.AutoModRuleAction(type=discord.AutoModRuleActionType.block_message)
        ]
        if alert_channel:
            actions.append(
                discord.AutoModRuleAction(
                    type=discord.AutoModRuleActionType.send_alert_message,
                    channel_id=alert_channel.id,
                )
            )
        if timeout_seconds:
            duration = min(max(1, timeout_seconds), 2419200)
            actions.append(
                discord.AutoModRuleAction(
                    type=discord.AutoModRuleActionType.timeout,
                    duration=duration,
                )
            )

        try:
            rule = await interaction.guild.create_automod_rule(
                name=name,
                event_type=discord.AutoModRuleEventType.message_send,
                trigger=trigger,
                actions=actions,
                enabled=True,
                reason=f"Created by {interaction.user} via /automod native keyword",
            )
            embed = SuccessEmbed(f"Native keyword rule **{rule.name}** created (ID: `{rule.id}`).")
            embed.add_field(name="Keywords", value=", ".join(f"`{k}`" for k in keyword_list[:10]), inline=False)
            if len(keyword_list) > 10:
                embed.set_footer(text=f"... and {len(keyword_list) - 10} more keywords")
            await interaction.followup.send(embed=embed)
        except discord.Forbidden:
            await interaction.followup.send(embed=ErrorEmbed("Missing **Manage Guild** permission to create AutoMod rules."))
        except discord.HTTPException as e:
            await interaction.followup.send(embed=ErrorEmbed(f"Discord API error: {e.text}"))

    @native_group.command(name="profanity", description="Enable Discord's built-in profanity and content filters.")
    @app_commands.describe(
        name="Rule name shown in Discord's AutoMod panel.",
        profanity="Block profanity (Discord's default word list).",
        sexual_content="Block sexual content.",
        slurs="Block slurs.",
        alert_channel="Optional channel to receive AutoMod alerts.",
    )
    async def native_profanity(
        self,
        interaction: discord.Interaction,
        name: str,
        profanity: bool = True,
        sexual_content: bool = False,
        slurs: bool = False,
        alert_channel: Optional[discord.TextChannel] = None,
    ):
        await interaction.response.defer(ephemeral=True)

        presets = discord.AutoModPresets.none()
        if profanity:
            presets |= discord.AutoModPresets.profanity
        if sexual_content:
            presets |= discord.AutoModPresets.sexual_content
        if slurs:
            presets |= discord.AutoModPresets.slurs

        if not presets:
            return await interaction.followup.send(embed=ErrorEmbed("Select at least one filter preset."))

        trigger = discord.AutoModTrigger(
            type=discord.AutoModRuleTriggerType.keyword_preset,
            presets=presets,
        )
        actions: list[discord.AutoModRuleAction] = [
            discord.AutoModRuleAction(type=discord.AutoModRuleActionType.block_message)
        ]
        if alert_channel:
            actions.append(
                discord.AutoModRuleAction(
                    type=discord.AutoModRuleActionType.send_alert_message,
                    channel_id=alert_channel.id,
                )
            )

        try:
            rule = await interaction.guild.create_automod_rule(
                name=name,
                event_type=discord.AutoModRuleEventType.message_send,
                trigger=trigger,
                actions=actions,
                enabled=True,
                reason=f"Created by {interaction.user} via /automod native profanity",
            )
            labels = []
            if profanity:
                labels.append("Profanity")
            if sexual_content:
                labels.append("Sexual Content")
            if slurs:
                labels.append("Slurs")
            embed = SuccessEmbed(f"Native profanity rule **{rule.name}** created (ID: `{rule.id}`).")
            embed.add_field(name="Filters Active", value=", ".join(labels), inline=False)
            await interaction.followup.send(embed=embed)
        except discord.Forbidden:
            await interaction.followup.send(embed=ErrorEmbed("Missing **Manage Guild** permission to create AutoMod rules."))
        except discord.HTTPException as e:
            await interaction.followup.send(embed=ErrorEmbed(f"Discord API error: {e.text}"))

    @native_group.command(name="mentionspam", description="Block messages that mention too many users or roles.")
    @app_commands.describe(
        name="Rule name shown in Discord's AutoMod panel.",
        mention_limit="Maximum number of unique mentions allowed per message.",
        alert_channel="Optional channel to receive AutoMod alerts.",
        timeout_seconds="Optional: timeout violators for this many seconds.",
    )
    async def native_mentionspam(
        self,
        interaction: discord.Interaction,
        name: str,
        mention_limit: int = 5,
        alert_channel: Optional[discord.TextChannel] = None,
        timeout_seconds: Optional[int] = None,
    ):
        await interaction.response.defer(ephemeral=True)

        mention_limit = min(max(1, mention_limit), 50)
        trigger = discord.AutoModTrigger(
            type=discord.AutoModRuleTriggerType.mention_spam,
            mention_total_limit=mention_limit,
        )
        actions: list[discord.AutoModRuleAction] = [
            discord.AutoModRuleAction(type=discord.AutoModRuleActionType.block_message)
        ]
        if alert_channel:
            actions.append(
                discord.AutoModRuleAction(
                    type=discord.AutoModRuleActionType.send_alert_message,
                    channel_id=alert_channel.id,
                )
            )
        if timeout_seconds:
            duration = min(max(1, timeout_seconds), 2419200)
            actions.append(
                discord.AutoModRuleAction(
                    type=discord.AutoModRuleActionType.timeout,
                    duration=duration,
                )
            )

        try:
            rule = await interaction.guild.create_automod_rule(
                name=name,
                event_type=discord.AutoModRuleEventType.message_send,
                trigger=trigger,
                actions=actions,
                enabled=True,
                reason=f"Created by {interaction.user} via /automod native mentionspam",
            )
            embed = SuccessEmbed(f"Native mention-spam rule **{rule.name}** created (ID: `{rule.id}`).")
            embed.add_field(name="Mention Limit", value=str(mention_limit), inline=True)
            await interaction.followup.send(embed=embed)
        except discord.Forbidden:
            await interaction.followup.send(embed=ErrorEmbed("Missing **Manage Guild** permission to create AutoMod rules."))
        except discord.HTTPException as e:
            await interaction.followup.send(embed=ErrorEmbed(f"Discord API error: {e.text}"))

    @native_group.command(name="list", description="List all Discord-native AutoMod rules in this server.")
    async def native_list(self, interaction: discord.Interaction):
        await interaction.response.defer(ephemeral=True)

        try:
            rules = await interaction.guild.fetch_automod_rules()
        except discord.Forbidden:
            return await interaction.followup.send(embed=ErrorEmbed("Missing permission to view AutoMod rules."))

        if not rules:
            return await interaction.followup.send("No native AutoMod rules found in this server.", ephemeral=True)

        embed = AstraEmbed(title="🛡️ Discord Native AutoMod Rules")
        trigger_labels = {
            discord.AutoModRuleTriggerType.keyword: "Keyword Block",
            discord.AutoModRuleTriggerType.keyword_preset: "Preset Filter",
            discord.AutoModRuleTriggerType.mention_spam: "Mention Spam",
            discord.AutoModRuleTriggerType.spam: "Spam",
            discord.AutoModRuleTriggerType.harmful_link: "Harmful Link",
        }
        for rule in rules:
            trigger_label = trigger_labels.get(rule.trigger.type, str(rule.trigger.type))
            status = "✅ Enabled" if rule.enabled else "❌ Disabled"
            embed.add_field(
                name=f"{rule.name}",
                value=f"**ID:** `{rule.id}`\n**Type:** {trigger_label}\n**Status:** {status}",
                inline=True,
            )
        embed.set_footer(text=f"{len(rules)} rule(s) total")
        await interaction.followup.send(embed=embed)

    @native_group.command(name="delete", description="Delete a Discord-native AutoMod rule by ID.")
    @app_commands.describe(rule_id="The numeric ID of the rule (get it from /automod native list).")
    async def native_delete(self, interaction: discord.Interaction, rule_id: str):
        await interaction.response.defer(ephemeral=True)

        try:
            rules = await interaction.guild.fetch_automod_rules()
        except discord.Forbidden:
            return await interaction.followup.send(embed=ErrorEmbed("Missing permission to manage AutoMod rules."))

        target = next((r for r in rules if str(r.id) == rule_id), None)
        if not target:
            return await interaction.followup.send(embed=ErrorEmbed(f"No rule found with ID `{rule_id}`."))

        try:
            await target.delete(reason=f"Deleted by {interaction.user} via /automod native delete")
            await interaction.followup.send(embed=SuccessEmbed(f"Rule **{target.name}** (`{rule_id}`) deleted."))
        except discord.Forbidden:
            await interaction.followup.send(embed=ErrorEmbed("Missing permission to delete this AutoMod rule."))
        except discord.HTTPException as e:
            await interaction.followup.send(embed=ErrorEmbed(f"Discord API error: {e.text}"))

    @native_group.command(name="toggle", description="Enable or disable a Discord-native AutoMod rule.")
    @app_commands.describe(rule_id="The numeric ID of the rule.", enabled="True to enable, False to disable.")
    async def native_toggle(self, interaction: discord.Interaction, rule_id: str, enabled: bool):
        await interaction.response.defer(ephemeral=True)

        try:
            rules = await interaction.guild.fetch_automod_rules()
        except discord.Forbidden:
            return await interaction.followup.send(embed=ErrorEmbed("Missing permission to manage AutoMod rules."))

        target = next((r for r in rules if str(r.id) == rule_id), None)
        if not target:
            return await interaction.followup.send(embed=ErrorEmbed(f"No rule found with ID `{rule_id}`."))

        try:
            await target.edit(
                enabled=enabled,
                reason=f"{'Enabled' if enabled else 'Disabled'} by {interaction.user} via /automod native toggle",
            )
            status = "enabled" if enabled else "disabled"
            await interaction.followup.send(embed=SuccessEmbed(f"Rule **{target.name}** is now **{status}**."))
        except discord.Forbidden:
            await interaction.followup.send(embed=ErrorEmbed("Missing permission to edit this AutoMod rule."))
        except discord.HTTPException as e:
            await interaction.followup.send(embed=ErrorEmbed(f"Discord API error: {e.text}"))


async def setup(bot: commands.Bot):
    await bot.add_cog(Automod(bot))
