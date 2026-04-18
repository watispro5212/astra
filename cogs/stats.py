import discord
from discord.ext import commands
from discord import app_commands
from services.stats_service import stats_service
from ui.embeds import AstraEmbed
from typing import Optional

class Stats(commands.Cog):
    """Insightful statistics for users and the server."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    stats_group = app_commands.Group(name="stats", description="View server or member statistics.")

    @stats_group.command(name="server", description="View detailed server statistics.")
    async def server_stats(self, interaction: discord.Interaction):
        await interaction.response.defer()
        
        stats = await stats_service.get_server_stats(interaction.guild)
        
        embed = AstraEmbed(title=f"📊 Statistics: {interaction.guild.name}")
        if interaction.guild.icon:
            embed.set_thumbnail(url=interaction.guild.icon.url)
            
        embed.add_field(name="Members", value=f"👥 Total: {stats['members']}\n👤 Humans: {stats['humans']}\n🤖 Bots: {stats['bots']}", inline=True)
        embed.add_field(name="Presence", value=f"🟢 Online: {stats['online']}\n🔴 Offline: {stats['members'] - stats['online']}", inline=True)
        embed.add_field(name="Channels", value=f"📂 Total: {stats['channels']}\n💬 Text: {stats['text_channels']}\n🔊 Voice: {stats['voice_channels']}", inline=True)
        
        embed.add_field(name="Boosting", value=f"✨ Level: {stats['boost_level']}\n💎 Boosts: {stats['boosts']}", inline=True)
        embed.add_field(name="Roles", value=f"🏷️ Count: {stats['roles']}", inline=True)
        embed.add_field(name="Created", value=f"📅 <t:{int(stats['created_at'].timestamp())}:D>", inline=True)
        
        await interaction.followup.send(embed=embed)

    @stats_group.command(name="user", description="View statistics for a specific member.")
    @app_commands.describe(member="The member to view stats for.")
    async def user_stats(self, interaction: discord.Interaction, member: Optional[discord.Member] = None):
        target = member or interaction.user
        await interaction.response.defer()
        
        stats = await stats_service.get_user_stats(target)
        
        embed = AstraEmbed(title=f"👤 User Info: {target.display_name}")
        embed.set_thumbnail(url=target.display_avatar.url)
        
        embed.add_field(name="Leveling", value=f"⭐ Level: {stats['level']}\n📉 Total XP: {stats['xp']:,}", inline=True)
        embed.add_field(name="Moderation", value=f"🛡️ Active Cases: {stats['cases']}", inline=True)
        embed.add_field(name="Top Role", value=stats['top_role'].mention, inline=True)
        
        embed.add_field(name="Joined Server", value=f"📅 <t:{int(stats['joined_at'].timestamp())}:R>", inline=True)
        embed.add_field(name="Created Account", value=f"📅 <t:{int(stats['created_at'].timestamp())}:R>", inline=True)
        
        await interaction.followup.send(embed=embed)

async def setup(bot: commands.Bot):
    await bot.add_cog(Stats(bot))
