import discord
from discord import app_commands
from discord.ext import commands, tasks
from services.poll_service import PollService
from ui.views.poll_view import PersistentPollView
from ui.embeds import SuccessEmbed, ErrorEmbed
from core.config import config
from datetime import datetime, timedelta
from typing import Optional

class Polls(commands.Cog):
    """Community engagement tools for polls."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self.check_polls.start()

    def cog_unload(self):
        self.check_polls.cancel()

    @tasks.loop(seconds=60)
    async def check_polls(self):
        """Background task to close expired polls."""
        expired = await PollService.get_active_polls()
        for p in expired:
            await PollService.close_poll(p['message_id'])
            
            # Update embed
            guild = self.bot.get_guild(p['guild_id'])
            if not guild: continue
            channel = guild.get_channel(p['channel_id'])
            if not channel: continue
            
            try:
                msg = await channel.fetch_message(p['message_id'])
                embed = await PollService.build_poll_embed(p['message_id'], p['question'], config.bot_theme_color)
                await msg.edit(embed=embed, view=None)
            except:
                pass

    @app_commands.command(name="poll", description="Create an interactive poll.")
    @app_commands.describe(
        question="The question to ask",
        options="Comma-separated options (e.g. Yes, No, Maybe)",
        duration="Optional duration (e.g. 1h, 30m) after which the poll closes.",
        anonymous="If true, results are hidden until the poll closes."
    )
    async def create_poll(
        self, 
        interaction: discord.Interaction, 
        question: str, 
        options: str, 
        duration: Optional[str] = None,
        anonymous: bool = False
    ):
        """Creates a poll message with buttons."""
        option_list = [opt.strip() for opt in options.split(',') if opt.strip()]
        
        if len(option_list) < 2:
            return await interaction.response.send_message("Please provide at least 2 options.", ephemeral=True)
        if len(option_list) > 10:
            return await interaction.response.send_message("Maximum 10 options allowed.", ephemeral=True)

        ends_at = None
        if duration:
            unit = duration[-1].lower()
            try:
                val = int(duration[:-1])
                if unit == 's': ends_at = datetime.now() + timedelta(seconds=val)
                elif unit == 'm': ends_at = datetime.now() + timedelta(minutes=val)
                elif unit == 'h': ends_at = datetime.now() + timedelta(hours=val)
                elif unit == 'd': ends_at = datetime.now() + timedelta(days=val)
            except:
                return await interaction.response.send_message("Invalid duration format! Use e.g. 1h, 30m.", ephemeral=True)

        await interaction.response.defer(ephemeral=True)

        # Create message first
        embed = discord.Embed(title=f"📊 {question}", description="Setting up poll...", color=config.bot_theme_color)
        message = await interaction.channel.send(embed=embed)

        try:
            await PollService.create_poll(
                message.id, interaction.guild_id, interaction.channel_id, question, option_list, 
                is_anonymous=anonymous, ends_at=ends_at
            )
            
            poll = await PollService.get_poll(message.id)
            view = PersistentPollView()
            for opt in poll['options']:
                btn = discord.ui.Button(
                    label=opt['label'],
                    style=discord.ButtonStyle.secondary,
                    custom_id=f"astra:poll:vote:{opt['id']}"
                )
                view.add_item(btn)
            
            initial_embed = await PollService.build_poll_embed(message.id, question, config.bot_theme_color)
            await message.edit(embed=initial_embed, view=view)
            await interaction.followup.send("✅ Poll created successfully!")
        except Exception as e:
            await message.delete()
            await interaction.followup.send(f"❌ Failed to create poll: {e}")

    @app_commands.command(name="poll_close", description="Manually close a poll.")
    @app_commands.describe(message_id="The ID of the poll message to close.")
    @app_commands.checks.has_permissions(manage_messages=True)
    async def close_poll(self, interaction: discord.Interaction, message_id: str):
        try:
            m_id = int(message_id)
        except:
            return await interaction.response.send_message("Invalid message ID.", ephemeral=True)
            
        poll = await PollService.get_poll(m_id)
        if not poll:
            return await interaction.response.send_message("Poll not found.", ephemeral=True)
            
        await PollService.close_poll(m_id)
        
        # Try to update the message
        channel = self.bot.get_channel(poll['channel_id'])
        if channel:
            try:
                msg = await channel.fetch_message(m_id)
                embed = await PollService.build_poll_embed(m_id, poll['question'], config.bot_theme_color)
                await msg.edit(embed=embed, view=None)
            except:
                pass
                
        await interaction.response.send_message(embed=SuccessEmbed("Poll has been closed and results revealed."))

async def setup(bot: commands.Bot):
    await bot.add_cog(Polls(bot))
