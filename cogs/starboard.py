import discord
from discord.ext import commands
from services.starboard_service import StarboardService
from core.logger import logger

class Starboard(commands.Cog):
    """Starboard system to highlight community messages."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    async def _get_star_count(self, message: discord.Message) -> int:
        """Helper to get the actual ⭐ count excluding bots and the author (optional)."""
        star_reaction = next((r for r in message.reactions if str(r.emoji) == "⭐"), None)
        if not star_reaction:
            return 0
            
        users = [user async for user in star_reaction.users()]
        # Filter out bots and optionally the author
        valid_users = [u for u in users if not u.bot and u.id != message.author.id]
        return len(valid_users)

    @commands.Cog.listener()
    async def on_raw_reaction_add(self, payload: discord.RawReactionActionEvent):
        if str(payload.emoji) != "⭐":
            return

        guild = self.bot.get_guild(payload.guild_id)
        if not guild: return
        
        config = await StarboardService.get_guild_starboard_config(guild.id)
        if not config or not config['starboard_channel_id']:
            return

        starboard_channel = guild.get_channel(config['starboard_channel_id'])
        if not starboard_channel: return
        
        # Avoid recursion (starring a message in the starboard channel)
        if payload.channel_id == starboard_channel.id:
            return

        # Fetch the original message
        channel = guild.get_channel(payload.channel_id)
        try:
            message = await channel.fetch_message(payload.message_id)
        except: return

        # Get count
        count = await self._get_star_count(message)
        
        # Check if already on starboard
        entry = await StarboardService.get_starboard_entry(message.id)
        
        if entry:
            # Update existing post
            try:
                star_msg = await starboard_channel.fetch_message(entry['starboard_id'])
                embed = StarboardService.build_starboard_embed(message, count)
                await star_msg.edit(embed=embed)
                await StarboardService.update_star_count(message.id, count)
            except discord.NotFound:
                # Post was deleted manually? Clean up DB and treat as new if it still meets threshold
                pass 
        elif count >= config['starboard_threshold']:
            # Create new starboard post
            embed = StarboardService.build_starboard_embed(message, count)
            star_msg = await starboard_channel.send(content=f"⭐ **{count}** | {channel.mention}", embed=embed)
            await StarboardService.create_starboard_entry(message.id, star_msg.id, guild.id, count)

    @commands.Cog.listener()
    async def on_raw_reaction_remove(self, payload: discord.RawReactionActionEvent):
        if str(payload.emoji) != "⭐":
            return

        # Check if it was on starboard
        entry = await StarboardService.get_starboard_entry(payload.message_id)
        if not entry:
            return

        guild = self.bot.get_guild(payload.guild_id)
        channel = guild.get_channel(payload.channel_id)
        try:
            message = await channel.fetch_message(payload.message_id)
            count = await self._get_star_count(message)
        except:
            return

        config = await StarboardService.get_guild_starboard_config(guild.id)
        starboard_channel = guild.get_channel(config['starboard_channel_id']) if config else None
        
        if not starboard_channel: return

        try:
            star_msg = await starboard_channel.fetch_message(entry['starboard_id'])
            embed = StarboardService.build_starboard_embed(message, count)
            # Update the message link count
            await star_msg.edit(content=f"⭐ **{count}** | {channel.mention}", embed=embed)
            await StarboardService.update_star_count(message.id, count)
        except discord.NotFound:
            pass

async def setup(bot: commands.Bot):
    await bot.add_cog(Starboard(bot))
