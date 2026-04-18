import discord
from discord.ext import commands, tasks
from discord import app_commands
from services.giveaway_service import giveaway_service
from ui.views.giveaway_view import GiveawayView
from ui.embeds import AstraEmbed, SuccessEmbed
from core.database import db
from datetime import datetime, timedelta
import asyncio
from typing import Optional

class Giveaways(commands.Cog):
    """Host and manage giveaways with community participation."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self.check_giveaways.start()

    def cog_unload(self):
        self.check_giveaways.cancel()

    @tasks.loop(seconds=30)
    async def check_giveaways(self):
        active = await giveaway_service.get_active_giveaways()
        for g in active:
            guild = self.bot.get_guild(g['guild_id'])
            if not guild: continue
            
            channel = guild.get_channel(g['channel_id'])
            if not channel: continue
            
            winners = await giveaway_service.pick_winners(g['message_id'])
            
            # Update embed
            try:
                msg = await channel.fetch_message(g['message_id'])
                embed = msg.embeds[0]
                embed.title = f"🎁 Giveaway Ended: {g['prize']}"
                embed.description = f"Winners: {', '.join([f'<@{w}>' for w in winners]) if winners else 'No participants'}"
                embed.set_footer(text="Giveaway Finished")
                embed.color = discord.Color.greyple()
                await msg.edit(embed=embed, view=None)
                
                if winners:
                    await channel.send(f"Congratulations {', '.join([f'<@{w}>' for w in winners])}! You won the **{g['prize']}**! 🥳")
                else:
                    await channel.send(f"The giveaway for **{g['prize']}** has ended, but no one entered.")
            except:
                pass

    @app_commands.command(name="giveaway", description="Start a new giveaway.")
    @app_commands.describe(
        prize="The item being given away.",
        duration="How long the giveaway lasts (e.g. 1h, 1d, 30m).",
        winners="Number of winners to pick."
    )
    @app_commands.checks.has_permissions(manage_guild=True)
    async def giveaway(self, interaction: discord.Interaction, prize: str, duration: str, winners: int = 1):
        # Parse duration
        # Simple parser for now
        unit = duration[-1].lower()
        try:
            val = int(duration[:-1])
        except:
            await interaction.response.send_message("❌ Invalid duration format! Use e.g. 1h, 30m, 1d.", ephemeral=True)
            return
            
        if unit == 's': delta = timedelta(seconds=val)
        elif unit == 'm': delta = timedelta(minutes=val)
        elif unit == 'h': delta = timedelta(hours=val)
        elif unit == 'd': delta = timedelta(days=val)
        else:
            await interaction.response.send_message("❌ Invalid time unit! Use s, m, h, or d.", ephemeral=True)
            return

        await interaction.response.defer(ephemeral=True)
        ends_at = datetime.now() + delta
        
        embed = AstraEmbed(
            title=f"🎁 Giveaway: {prize}",
            description=f"Click the 🎉 button below to enter!\n\n**Winners:** {winners}\n**Ends:** <t:{int(ends_at.timestamp())}:R> (<t:{int(ends_at.timestamp())}:f>)\n**Host:** {interaction.user.mention}"
        )
        embed.set_footer(text="Good luck everyone!")
        
        # Create message first
        message = await interaction.channel.send(embed=embed, view=GiveawayView())
        
        await giveaway_service.create_giveaway(
            message.id, interaction.guild_id, interaction.channel_id, interaction.user.id, prize, winners, ends_at
        )
        
        await interaction.followup.send("✅ Giveaway has been successfully started!", ephemeral=True)

    @app_commands.command(name="reroll", description="Pick a new winner for a finished giveaway.")
    @app_commands.describe(message_id="The ID of the giveaway message.")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def reroll(self, interaction: discord.Interaction, message_id: str):
        try:
            m_id = int(message_id)
        except:
            await interaction.response.send_message("Invalid message ID.", ephemeral=True)
            return
            
        await interaction.response.defer(ephemeral=True)
        # Reset ended status for reroll logic simple hack
        await db.execute("UPDATE giveaways SET is_ended = 0 WHERE message_id = ?", m_id)
        winners = await giveaway_service.pick_winners(m_id)
        
        if winners:
            await interaction.followup.send(f"✅ New winner(s) picked: {', '.join([f'<@{w}>' for w in winners])} 🥳")
        else:
            await interaction.followup.send("❌ Could not pick new winners (maybe no participants).", ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(Giveaways(bot))
