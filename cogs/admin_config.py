import discord
from discord import app_commands
from discord.ext import commands
from services.moderation_service import ModerationService
from ui.embeds import SuccessEmbed, AstraEmbed

class AdminConfig(commands.GroupCog, name="config"):
    """Server configuration commands for administrators."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="logging", description="Set the channel where Astra logs server events.")
    @app_commands.checks.has_permissions(administrator=True)
    async def set_logging(self, interaction: discord.Interaction, channel: discord.TextChannel):
        """Configures the audit logging channel."""
        await interaction.response.defer(ephemeral=True)
        await ModerationService.update_guild_config(interaction.guild_id, log_channel_id=channel.id)
        
        embed = SuccessEmbed(f"Logging channel has been set to {channel.mention}")
        await interaction.followup.send(embed=embed)

    @app_commands.command(name="starboard", description="Set the channel for the Starboard.")
    @app_commands.checks.has_permissions(administrator=True)
    async def set_starboard(self, interaction: discord.Interaction, channel: discord.TextChannel):
        """Configures the starboard channel."""
        await interaction.response.defer(ephemeral=True)
        await ModerationService.update_guild_config(interaction.guild_id, starboard_channel_id=channel.id)
        await interaction.followup.send(embed=SuccessEmbed(f"Starboard channel set to {channel.mention}"))

    @app_commands.command(name="threshold", description="Set the number of stars required for the Starboard.")
    @app_commands.checks.has_permissions(administrator=True)
    async def set_threshold(self, interaction: discord.Interaction, threshold: int):
        """Configures the star threshold."""
        await interaction.response.defer(ephemeral=True)
        if threshold < 1:
            return await interaction.followup.send("Threshold must be at least 1.", ephemeral=True)
        await ModerationService.update_guild_config(interaction.guild_id, starboard_threshold=threshold)
        await interaction.followup.send(embed=SuccessEmbed(f"Starboard threshold set to **{threshold}** stars"))

    @app_commands.command(name="view", description="View current server configuration.")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def view_config(self, interaction: discord.Interaction):
        """Displays current guild settings."""
        await interaction.response.defer(ephemeral=True)
        config = await ModerationService.get_guild_config(interaction.guild_id)
        
        if not config:
            await interaction.followup.send("No configuration found for this server. Use `/config logging` to get started.", ephemeral=True)
            return

        embed = AstraEmbed(title=f"Configuration for {interaction.guild.name}")
        
        log_channel = interaction.guild.get_channel(config['log_channel_id']) if config['log_channel_id'] else None
        embed.add_field(name="Logging Channel", value=log_channel.mention if log_channel else "Not set", inline=True)
        
        starboard_channel = interaction.guild.get_channel(config['starboard_channel_id']) if config['starboard_channel_id'] else None
        embed.add_field(name="Starboard Channel", value=starboard_channel.mention if starboard_channel else "Not set", inline=True)
        embed.add_field(name="Star Threshold", value=f"⭐ {config['starboard_threshold']}", inline=True)
        
        await interaction.followup.send(embed=embed)

async def setup(bot: commands.Bot):
    await bot.add_cog(AdminConfig(bot))
