import discord
from discord import app_commands
from discord.ext import commands
from services.poll_service import PollService
from ui.views.poll_view import PersistentPollView
from core.config import config
from typing import Optional

class Polls(commands.Cog):
    """Community engagement tools for polls."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="poll", description="Create an interactive poll.")
    @app_commands.describe(
        question="The question to ask",
        options="Comma-separated options (e.g. Yes, No, Maybe)"
    )
    async def create_poll(self, interaction: discord.Interaction, question: str, options: str):
        """Creates a poll message with buttons."""
        option_list = [opt.strip() for opt in options.split(',') if opt.strip()]
        
        if len(option_list) < 2:
            return await interaction.response.send_message("Please provide at least 2 options.", ephemeral=True)
        if len(option_list) > 10:
            return await interaction.response.send_message("Maximum 10 options allowed for better visibility.", ephemeral=True)

        # Defer to allow database operations
        await interaction.response.defer(ephemeral=True)

        # Create message first to get ID
        embed = discord.Embed(title=f"📊 {question}", description="Setting up poll...", color=config.bot_theme_color)
        message = await interaction.channel.send(embed=embed)

        try:
            # Save to DB
            await PollService.create_poll(message.id, interaction.guild_id, interaction.channel_id, question, option_list)
            
            # Fetch back with option IDs
            poll = await PollService.get_poll(message.id)
            
            # Build actual View
            view = PersistentPollView()
            for opt in poll['options']:
                btn = discord.ui.Button(
                    label=opt['label'],
                    style=discord.ButtonStyle.secondary,
                    custom_id=f"astra:poll:vote:{opt['id']}"
                )
                view.add_item(btn)
            
            # Update initial message with final embed and view
            initial_embed = await PollService.build_poll_embed(message.id, question, config.bot_theme_color)
            await message.edit(embed=initial_embed, view=view)
            
            await interaction.followup.send("✅ Poll created successfully!")
        except Exception as e:
            await message.delete()
            await interaction.followup.send(f"❌ Failed to create poll: {e}")

async def setup(bot: commands.Bot):
    await bot.add_cog(Polls(bot))
