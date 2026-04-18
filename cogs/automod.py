import discord
from discord.ext import commands
from discord import app_commands
from services.automod_service import automod_service
from core.database import db
from ui.embeds import SuccessEmbed, AstraEmbed
from typing import Optional

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

async def setup(bot: commands.Bot):
    await bot.add_cog(Automod(bot))
