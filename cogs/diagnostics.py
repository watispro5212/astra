import discord
from discord import app_commands
from discord.ext import commands
from ui.embeds import AstraEmbed
import time
import datetime
import psutil
from typing import Optional

class Diagnostics(commands.Cog):
    """Deep-level system diagnostics and analytics."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self.start_time = time.time()

    bot_group = app_commands.Group(
        name="bot", 
        description="Bot-level diagnostics and info.",
        allowed_installs=app_commands.AllowedInstalls(guilds=True, users=True),
        allowed_contexts=app_commands.AllowedContexts(guilds=True, dms=True, private_channels=True)
    )
    server_group = app_commands.Group(name="server", description="Server-level audit and snapshots.")

    @bot_group.command(name="stats", description="📊 Show high-level technical metrics for Astra.")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def bot_stats(self, interaction: discord.Interaction):
        """Displays technical health and shard metrics."""
        uptime = str(datetime.timedelta(seconds=int(time.time() - self.start_time)))
        process = psutil.Process()
        memory_usage = process.memory_info().rss / 1024 / 1024  # In MB
        
        embed = AstraEmbed(title="🛰️ Astra System Diagnostics")
        embed.set_thumbnail(url=self.bot.user.display_avatar.url)
        
        embed.add_field(name="⏱️ Uptime", value=f"`{uptime}`", inline=True)
        embed.add_field(name="📡 Shard Latency", value=f"`{round(self.bot.latency * 1000)}ms`", inline=True)
        embed.add_field(name="🧠 Memory Usage", value=f"`{round(memory_usage, 2)} MB`", inline=True)
        
        embed.add_field(name="🏙️ Total Guilds", value=f"`{len(self.bot.guilds)}`", inline=True)
        embed.add_field(name="👥 Total Users", value=f"`{sum(g.member_count or 0 for g in self.bot.guilds)}`", inline=True)
        embed.add_field(name="🤖 Shard ID", value=f"`{interaction.guild.shard_id if interaction.guild else 0}`", inline=True)
        
        await interaction.response.send_message(embed=embed)

    @server_group.command(name="snapshot", description="🏙️ Generate a health and structure summary for this server.")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def server_snapshot(self, interaction: discord.Interaction):
        """Provides a detailed overview of the server's structure."""
        guild = interaction.guild
        
        embed = AstraEmbed(title=f"🛡️ Server Snapshot: {guild.name}")
        if guild.icon:
            embed.set_thumbnail(url=guild.icon.url)
            
        embed.add_field(name="📅 Created", value=f"<t:{int(guild.created_at.timestamp())}:R>", inline=True)
        embed.add_field(name="👑 Owner", value=f"<@{guild.owner_id}>", inline=True)
        embed.add_field(name="🆔 Guild ID", value=f"`{guild.id}`", inline=True)
        
        embed.add_field(name="👥 Members", value=f"`{guild.member_count}`", inline=True)
        embed.add_field(name="🎭 Roles", value=f"`{len(guild.roles)}`", inline=True)
        embed.add_field(name="💬 Channels", value=f"`{len(guild.channels)}`", inline=True)
        
        # Security Metrics
        verif_level = str(guild.verification_level).title()
        embed.add_field(name="🔐 Security Level", value=f"`{verif_level}`", inline=True)
        embed.add_field(name="💎 Boost Level", value=f"`Level {guild.premium_tier}`", inline=True)
        embed.add_field(name="🖼️ Emoji Count", value=f"`{len(guild.emojis)} / {guild.emoji_limit}`", inline=True)

        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="about", description="🛰️ Discover Astra's mission and origins.")
    @app_commands.allowed_installs(guilds=True, users=True)
    @app_commands.allowed_contexts(guilds=True, dms=True, private_channels=True)
    async def about(self, interaction: discord.Interaction):
        """Displays bot overview and links."""
        embed = AstraEmbed(
            title="🛰️ Astra — Mission Overview",
            description=(
                "Astra is a high-performance Discord assistant designed for elite server management, "
                "security, and community engagement. Built with speed and precision, Astra provides "
                "everything from enterprise-grade Bio-Mod security to professional support ticket systems."
            )
        )
        embed.set_thumbnail(url=self.bot.user.display_avatar.url)
        
        embed.add_field(name="🏛️ Support Community", value="[Join Server](https://discord.gg/NZ5Gr7eqE8)", inline=True)
        embed.add_field(name="🔗 Discord Portal", value="[Invite Astra](https://discord.com/oauth2/authorize?client_id=1494879804615561238&permissions=8&response_type=code&redirect_uri=https%3A%2F%2Fdiscord.com%2Foauth2%2Fauthorize%3Fclient_id%3D1494879804615561238&integration_type=0&scope=bot+email+applications.commands+identify)", inline=True)
        embed.add_field(name="❤ Patreon", value="[Support Astra](https://patreon.com/watispro1)", inline=True)
        
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="ping", description="📡 Test Astra's response latency.")
    @app_commands.allowed_installs(guilds=True, users=True)
    @app_commands.allowed_contexts(guilds=True, dms=True, private_channels=True)
    async def ping(self, interaction: discord.Interaction):
        """Standard latency test."""
        latency = round(self.bot.latency * 1000)
        embed = AstraEmbed(title="📡 Signal Strength", description=f"🛰️ Latency: **{latency}ms**")
        await interaction.response.send_message(embed=embed)

async def setup(bot: commands.Bot):
    await bot.add_cog(Diagnostics(bot))
