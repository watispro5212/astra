import discord
from discord.ext import commands
from discord import app_commands
from core.logger import logger
from core.config import config

class ErrorHandler(commands.Cog):
    """Global error handling for Astra bot."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot
        # Register the app_commands error handler
        bot.tree.on_error = self.on_app_command_error

    async def on_app_command_error(
        self, 
        interaction: discord.Interaction, 
        error: app_commands.AppCommandError
    ):
        """Global error handler for slash commands."""
        embed = discord.Embed(
            title="❌ Command Error",
            color=discord.Color.red(),
            description="An error occurred while executing the command."
        )

        if isinstance(error, app_commands.CommandOnCooldown):
            embed.description = f"This command is on cooldown. Please try again in {error.retry_after:.2f}s."
        elif isinstance(error, app_commands.MissingPermissions):
            embed.description = "You don't have the required permissions to run this command."
        elif isinstance(error, app_commands.BotMissingPermissions):
            embed.description = "I don't have the required permissions to run this command."
        else:
            logger.error(f"Unexpected error in command '{interaction.command.name}': {error}")
            embed.description = "An unexpected error occurred. The developers have been notified."

        # Try to respond to the interaction
        if interaction.response.is_done():
            await interaction.followup.send(embed=embed, ephemeral=True)
        else:
            await interaction.response.send_message(embed=embed, ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(ErrorHandler(bot))
