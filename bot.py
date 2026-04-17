import discord
from discord.ext import commands
import os
from core.logger import logger
from core.config import config

class AstraBot(commands.Bot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.guilds = True
        intents.messages = True
        # Explicitly setting message_content to False as requested
        intents.message_content = False
        
        super().__init__(
            command_prefix=commands.when_mentioned,
            intents=intents,
            help_command=None
        )

    async def setup_hook(self) -> None:
        """Called when the bot is being set up."""
        logger.info("Setting up Astra Bot...")
        
        # Load extensions
        await self.load_extensions()
        
        # Sync slash commands
        if config.guild_id:
            guild = discord.Object(id=config.guild_id)
            self.tree.copy_global_to(guild=guild)
            await self.tree.sync(guild=guild)
            logger.info(f"Synced slash commands to guild {config.guild_id}")
        else:
            await self.tree.sync()
            logger.info("Synced global slash commands")

    async def load_extensions(self) -> None:
        """Discovers and loads cogs from the cogs directory."""
        for filename in os.listdir("./cogs"):
            if filename.endswith(".py") and not filename.startswith("__"):
                extension = f"cogs.{filename[:-3]}"
                try:
                    await self.load_extension(extension)
                    logger.info(f"Loaded extension: {extension}")
                except Exception as e:
                    logger.error(f"Failed to load extension {extension}: {e}")

    async def on_ready(self) -> None:
        logger.info(f"Logged in as {self.user} (ID: {self.user.id})")
        logger.info(f"Connected to {len(self.guilds)} guilds")
        
        game = discord.Game("Helping the community | /about")
        await self.change_presence(status=discord.Status.online, activity=game)
