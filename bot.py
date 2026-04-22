import discord
from discord.ext import commands, tasks
import os
import datetime
from core.logger import logger
from core.config import config
from core.database import db
from ui.views.role_view import PersistentRoleView
from ui.views.poll_view import PersistentPollView
from ui.views.ticket_view import TicketLauncherView, TicketControlView
from services.reminder_service import ReminderService

class AstraBot(commands.AutoShardedBot):
    def __init__(self):
        intents = discord.Intents.default()
        intents.guilds = True
        intents.messages = True
        intents.members = True # Required for Welcome/Leveling/Stats
        intents.message_content = True # Required for Automod/Leveling
        intents.presences = True # Required for Online Status stats
        
        super().__init__(
            command_prefix=commands.when_mentioned,
            intents=intents,
            help_command=None
        )

    async def setup_hook(self) -> None:
        """Called when the bot is being set up."""
        logger.info("Setting up Astra Bot...")
        
        # Initialize Database
        await db.initialize_tables()
        
        # Register Persistent Views
        self.add_view(PersistentRoleView())
        self.add_view(PersistentPollView())
        self.add_view(TicketLauncherView())
        self.add_view(TicketControlView())
        
        # Start background tasks
        self.check_reminders.start()
        
        # Load extensions
        await self.load_extensions()
        
        # Sync slash commands
        if config.guild_id:
            guild = discord.Object(id=config.guild_id)
            self.tree.copy_global_to(guild=guild)
            self.tree.clear_commands(guild=None)
            await self.tree.sync()
            await self.tree.sync(guild=guild)
            logger.info(f"Synced slash commands to guild {config.guild_id} and cleared globals")
        else:
            await self.tree.sync()
            logger.info("Synced global slash commands")

    async def load_extensions(self) -> None:
        """Discovers and loads cogs from the cogs directory."""
        if not os.path.exists("./cogs"):
            logger.error("Cogs directory not found")
            return

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

    @tasks.loop(minutes=1.0)
    async def check_reminders(self):
        """Background task to check for and send due reminders."""
        due_reminders = await ReminderService.get_due_reminders()
        if not due_reminders:
            return

        for rem in due_reminders:
            # Try to get the channel
            channel = self.get_channel(rem['channel_id'])
            
            # If not in cache, try to fetch the user for DM delivery
            if not channel:
                try:
                    user = self.get_user(rem['user_id']) or await self.fetch_user(rem['user_id'])
                    if user:
                        await user.send(f"🔔 **Chronos Alert:** Your reminder has been triggered: **{rem['message']}**")
                        logger.info(f"Delivered reminder {rem['id']} to user {rem['user_id']} via DM")
                    else:
                        logger.warning(f"Could not find user {rem['user_id']} for reminder {rem['id']}")
                except Exception as e:
                    logger.error(f"Failed to deliver reminder {rem['id']} via DM: {e}")
            else:
                try:
                    await channel.send(f"🔔 **Chronos Alert for <@{rem['user_id']}>:** {rem['message']}")
                    logger.info(f"Delivered reminder {rem['id']} to channel {rem['channel_id']}")
                except Exception as e:
                    logger.error(f"Failed to send reminder {rem['id']} to channel: {e}")
            
            # Delete reminder after triggering
            await ReminderService.delete_reminder(rem['id'])

    @check_reminders.before_loop
    async def before_check_reminders(self):
        await self.wait_until_ready()
