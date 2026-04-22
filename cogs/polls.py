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
    """Community consensus tools for operational feedback."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self.check_polls.start()

    def cog_unload(self):
        self.check_polls.cancel()

    @tasks.loop(seconds=60)
    async def check_polls(self):
        """Background monitoring to finalize expired polls."""
        expired = await PollService.get_active_polls()
        for p in expired:
            await PollService.close_poll(p['message_id'])
            
            guild = self.bot.get_guild(p['guild_id'])
            if not guild: continue
            channel = guild.get_channel(p['channel_id'])
            if not channel: continue
            
            try:
                msg = await channel.fetch_message(p['message_id'])
                embed = await PollService.build_poll_embed(p['message_id'], p['question'], config.bot_theme_color)
                await msg.edit(embed=embed, view=None)
            except Exception:
                pass

    @app_commands.command(name="poll", description="📊 Deploy an interactive tactical poll.")
    @app_commands.describe(
        question="The mission objective or question.",
        options="Comma-separated tactical options (e.g. Alpha, Bravo, Charlie).",
        duration="Deployment duration (e.g. 1h, 30m).",
        anonymous="If enabled, results remain classified until closure."
    )
    @app_commands.guild_only()
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
            return await interaction.response.send_message(embed=ErrorEmbed("Tactical protocols require at least 2 options."), ephemeral=True)
        if len(option_list) > 10:
            return await interaction.response.send_message(embed=ErrorEmbed("Maximum tactical capacity is 10 options."), ephemeral=True)

        ends_at = None
        if duration:
            unit = duration[-1].lower()
            try:
                val = int(duration[:-1])
                if unit == 's': ends_at = datetime.now() + timedelta(seconds=val)
                elif unit == 'm': ends_at = datetime.now() + timedelta(minutes=val)
                elif unit == 'h': ends_at = datetime.now() + timedelta(hours=val)
                elif unit == 'd': ends_at = datetime.now() + timedelta(days=val)
                else: raise ValueError()
            except:
                return await interaction.response.send_message(embed=ErrorEmbed("Invalid duration format! Use `1h`, `30m`, etc."), ephemeral=True)

        await interaction.response.defer(ephemeral=True)

        # Initial placeholder
        embed = AstraEmbed(title=f"📊 {question}", description="🛰️ Initializing tactical poll...")
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
            
            final_embed = await PollService.build_poll_embed(message.id, question, config.bot_theme_color)
            await message.edit(embed=final_embed, view=view)
            await interaction.followup.send(embed=SuccessEmbed("Tactical poll deployed successfully."))
        except Exception as e:
            if message: await message.delete()
            await interaction.followup.send(embed=ErrorEmbed(f"Deployment failed: {str(e)}"))

    @app_commands.command(name="poll_close", description="🛰️ Manually terminate a tactical poll.")
    @app_commands.describe(message_id="The ID of the poll deployment.")
    @app_commands.checks.has_permissions(manage_messages=True)
    @app_commands.guild_only()
    async def close_poll(self, interaction: discord.Interaction, message_id: str):
        """Forces the closure of an active poll."""
        try:
            m_id = int(message_id)
        except:
            return await interaction.response.send_message(embed=ErrorEmbed("Invalid deployment ID provided."), ephemeral=True)
            
        await interaction.response.defer(ephemeral=True)
        poll = await PollService.get_poll(m_id)
        if not poll:
            return await interaction.followup.send(embed=ErrorEmbed("No tactical record found for this ID."))
            
        await PollService.close_poll(m_id)
        
        # Update the message
        channel = self.bot.get_channel(poll['channel_id'])
        if channel:
            try:
                msg = await channel.fetch_message(m_id)
                embed = await PollService.build_poll_embed(m_id, poll['question'], config.bot_theme_color)
                await msg.edit(embed=embed, view=None)
            except Exception:
                pass
                
        await interaction.followup.send(embed=SuccessEmbed("Tactical poll has been terminated and results finalized."))

async def setup(bot: commands.Bot):
    await bot.add_cog(Polls(bot))
