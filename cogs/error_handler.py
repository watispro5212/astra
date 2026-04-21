import discord
import logging
import traceback
from discord.ext import commands
from discord import app_commands
from ui.embeds import ErrorEmbed

logger = logging.getLogger("astra")

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
        # Extract the original error if it's a CommandInvokeError
        if isinstance(error, app_commands.CommandInvokeError):
            error = error.original

        if isinstance(error, app_commands.CommandOnCooldown):
            embed = ErrorEmbed(f"This command is on cooldown. Please try again in **{error.retry_after:.1f}s**.")
            embed.set_footer(text="Error Code: COOLDOWN")
        elif isinstance(error, app_commands.MissingPermissions):
            perms = ", ".join([f"`{p}`" for p in error.missing_permissions])
            embed = ErrorEmbed(f"You don't have the required permissions to run this command: {perms}")
            embed.set_footer(text="Error Code: FORBIDDEN")
        elif isinstance(error, app_commands.BotMissingPermissions):
            perms = ", ".join([f"`{p}`" for p in error.missing_permissions])
            embed = ErrorEmbed(f"I don't have the required permissions to run this: {perms}")
            embed.set_footer(text="Error Code: BOT_FORBIDDEN")
        elif isinstance(error, app_commands.NoPrivateMessage):
            embed = ErrorEmbed("This command cannot be used in Direct Messages.")
            embed.set_footer(text="Error Code: NO_DM")
        elif isinstance(error, app_commands.CheckFailure):
            embed = ErrorEmbed("You do not meet the requirements to run this command.")
            embed.set_footer(text="Error Code: CHECK_FAILED")
        else:
            logger.error(f"Unexpected error in command '{interaction.command.name if interaction.command else 'Unknown'}': {error}")
            traceback.print_exception(type(error), error, error.__traceback__)
            
            # Formulate detailed text
            error_details = "".join(traceback.format_exception(type(error), error, error.__traceback__))
            
            # Notify owner
            try:
                owner_id = self.bot.config.owner_id if hasattr(self.bot, 'config') else 1320058519642177668
                from core.config import config
                owner = self.bot.get_user(config.owner_id) or await self.bot.fetch_user(config.owner_id)
                if owner:
                    if len(error_details) > 1900:
                        error_details = error_details[-1900:]
                    await owner.send(f"⚠️ **Unexpected Error** in `/{interaction.command.name if interaction.command else 'Unknown'}`:\n```py\n{error_details}\n```")
            except Exception as notify_error:
                logger.error(f"Failed to notify owner: {notify_error}")

            embed = ErrorEmbed("An unexpected error occurred. The developers have been notified.")
            embed.set_footer(text="Error Code: INTERNAL_SERVER_ERROR")

        # Try to respond to the interaction
        try:
            if isinstance(error, discord.NotFound) and error.code == 10062:
                # Interaction has expired (Unknown Interaction)
                return
                
            if interaction.response.is_done():
                await interaction.followup.send(embed=embed, ephemeral=True)
            else:
                await interaction.response.send_message(embed=embed, ephemeral=True)
        except Exception as e:
            # If all fails, try sending a followup
            try:
                await interaction.followup.send(embed=embed, ephemeral=True)
            except Exception:
                pass

async def setup(bot: commands.Bot):
    await bot.add_cog(ErrorHandler(bot))
