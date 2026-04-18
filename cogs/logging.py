import discord
from discord.ext import commands
from services.moderation_service import ModerationService
from ui.embeds import AstraEmbed
import datetime

class Logging(commands.Cog):
    """Event logging system to track server activity."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    async def _get_log_channel(self, guild: discord.Guild) -> discord.TextChannel:
        """Helper to retrieve the configured log channel."""
        config = await ModerationService.get_guild_config(guild.id)
        if not config or not config['log_channel_id']:
            return None
        return guild.get_channel(config['log_channel_id'])

    @commands.Cog.listener()
    async def on_member_join(self, member: discord.Member):
        channel = await self._get_log_channel(member.guild)
        if not channel: return

        embed = AstraEmbed(title="📥 Member Joined", color=discord.Color.green())
        embed.set_thumbnail(url=member.display_avatar.url if member.display_avatar else None)
        embed.add_field(name="User", value=f"{member.mention} ({member.id})", inline=False)
        embed.add_field(name="Account Created", value=member.created_at.strftime("%Y-%m-%d %H:%M:%S"), inline=False)
        
        await channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_member_remove(self, member: discord.Member):
        channel = await self._get_log_channel(member.guild)
        if not channel: return

        embed = AstraEmbed(title="📤 Member Left", color=discord.Color.orange())
        embed.set_thumbnail(url=member.display_avatar.url if member.display_avatar else None)
        embed.add_field(name="User", value=f"{member} ({member.id})", inline=False)
        
        await channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_message_delete(self, message: discord.Message):
        if message.author.bot: return
        channel = await self._get_log_channel(message.guild)
        if not channel: return

        embed = AstraEmbed(title="🗑️ Message Deleted", color=discord.Color.red())
        embed.add_field(name="Author", value=f"{message.author.mention} ({message.author.id})", inline=True)
        embed.add_field(name="Channel", value=message.channel.mention, inline=True)
        embed.add_field(name="Content", value=message.content or "*No text content*", inline=False)
        
        await channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_message_edit(self, before: discord.Message, after: discord.Message):
        if before.author.bot or before.content == after.content: return
        channel = await self._get_log_channel(before.guild)
        if not channel: return

        embed = AstraEmbed(title="📝 Message Edited", color=discord.Color.blue())
        embed.add_field(name="Author", value=f"{before.author.mention} ({before.author.id})", inline=True)
        embed.add_field(name="Channel", value=before.channel.mention, inline=True)
        embed.add_field(name="Before", value=before.content or "*No text content*", inline=False)
        embed.add_field(name="After", value=after.content or "*No text content*", inline=False)
        
        await channel.send(embed=embed)

    @commands.Cog.listener()
    async def on_member_ban(self, guild: discord.Guild, user: discord.User):
        channel = await self._get_log_channel(guild)
        if not channel: return

        embed = AstraEmbed(title="🔨 Member Banned", color=discord.Color.dark_red())
        embed.add_field(name="User", value=f"{user} ({user.id})", inline=False)
        
        await channel.send(embed=embed)

async def setup(bot: commands.Bot):
    await bot.add_cog(Logging(bot))
