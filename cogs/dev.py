import discord
from discord import app_commands
from discord.ext import commands
from core.config import config
from core.logger import logger
from typing import Optional

class Developer(commands.Cog):
    """Owner-only maintenance and developer tools."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    async def cog_check(self, ctx: commands.Context) -> bool:
        """Global check for this cog: Only the owner ID can use these."""
        return ctx.author.id == config.owner_id

    dev = app_commands.Group(name="dev", description="Owner-only maintenance tools.")

    @dev.command(name="reload", description="🚀 Reload a specific bot extension.")
    @app_commands.describe(extension="The name of the extension (e.g. cogs.moderation).")
    async def reload(self, interaction: discord.Interaction, extension: str):
        if interaction.user.id != config.owner_id:
            return await interaction.response.send_message("❌ This command is restricted to the bot owner.", ephemeral=True)
            
        try:
            await self.bot.reload_extension(extension)
            await interaction.response.send_message(f"✅ Successfully reloaded `{extension}`.", ephemeral=True)
            logger.info(f"Dev: Reloaded extension {extension}")
        except Exception as e:
            await interaction.response.send_message(f"❌ Failed to reload `{extension}`: {e}", ephemeral=True)

    @dev.command(name="sync", description="📑 Sync slash commands to local or global guild.")
    @app_commands.describe(scope="Whether to sync to 'global' or 'guild'.")
    async def sync_group(self, interaction: discord.Interaction, scope: str = "guild"):
        """Developer group sync command."""
        await self._perform_sync(interaction, scope)

    @app_commands.command(name="sync", description="🚀 Execute global command synchronization.")
    @app_commands.describe(scope="Whether to sync to 'global' or 'guild'.")
    async def sync_standalone(self, interaction: discord.Interaction, scope: str = "global"):
        """Top-level standalone sync command."""
        await self._perform_sync(interaction, scope)

    async def _perform_sync(self, interaction: discord.Interaction, scope: str):
        """Unified internal synchronization logic."""
        if interaction.user.id != config.owner_id:
            return await interaction.response.send_message("❌ This command is restricted to the bot owner.", ephemeral=True)
            
        await interaction.response.defer(ephemeral=True)
        
        try:
            if scope == "guild":
                guild = discord.Object(id=interaction.guild_id)
                self.bot.tree.copy_global_to(guild=guild)
                synced = await self.bot.tree.sync(guild=guild)
                await interaction.followup.send(f"✅ Synced **{len(synced)}** commands to this guild context.")
            else:
                synced = await self.bot.tree.sync()
                await interaction.followup.send(f"✅ Successfully synchronized **{len(synced)}** commands across all global contexts (Guilds & User-Apps).")
            
            logger.info(f"Dev: Synchronized {len(synced)} commands (Scope: {scope})")
        except Exception as e:
            await interaction.followup.send(f"❌ Synchronization failed: {e}")
            logger.error(f"Sync Error: {e}")

    @dev.command(name="shards", description="📡 View detailed shard health and latency.")
    async def shards(self, interaction: discord.Interaction):
        if interaction.user.id != config.owner_id:
            return await interaction.response.send_message("❌ This command is restricted to the bot owner.", ephemeral=True)
            
        from ui.embeds import AstraEmbed
        embed = AstraEmbed(title="📡 Shard Health Monitor")
        
        # In a real environment with many shards, we'd loop through them
        # For Astra, we'll show the current shard stats
        embed.add_field(name="Total Shards", value="`1`", inline=True)
        embed.add_field(name="Current Shard ID", value=f"`{interaction.guild.shard_id or 0}`", inline=True)
        embed.add_field(name="Latency", value=f"`{round(self.bot.latency * 1000)}ms`", inline=True)
        
        await interaction.response.send_message(embed=embed, ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(Developer(bot))
