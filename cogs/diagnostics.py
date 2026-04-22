import discord
from discord import app_commands
from discord.ext import commands
from ui.embeds import AstraEmbed
import time
import datetime
import psutil
from typing import Optional

class Diagnostics(commands.Cog):
    """Deep-level system diagnostics and tactical analytics."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self.start_time = time.time()

    core_group = app_commands.Group(name="bot", description="🛰️ Bot-level diagnostics and info.")
    server_group = app_commands.Group(name="server", description="🛡️ Server-level audit and snapshots.")
    
    @core_group.command(name="stats", description="📊 Analyze high-level technical metrics for Astra.")
    @app_commands.allowed_installs(guilds=True, users=True)
    @app_commands.allowed_contexts(guilds=True, dms=True, private_channels=True)
    @app_commands.checks.has_permissions(manage_guild=True)
    async def bot_stats(self, interaction: discord.Interaction):
        """Displays technical health and shard metrics."""
        await interaction.response.defer()
        
        uptime = str(datetime.timedelta(seconds=int(time.time() - self.start_time)))
        process = psutil.Process()
        memory_usage = process.memory_info().rss / 1024 / 1024  # In MB
        
        embed = AstraEmbed(title="🛰️ Astra System Diagnostics")
        embed.set_thumbnail(url=self.bot.user.display_avatar.url)
        
        embed.add_field(name="⏱️ Uptime", value=f"`{uptime}`", inline=True)
        embed.add_field(name="📡 Latency", value=f"`{round(self.bot.latency * 1000)}ms`", inline=True)
        embed.add_field(name="🧠 Memory", value=f"`{round(memory_usage, 2)} MB`", inline=True)
        
        embed.add_field(name="🏙️ Sectors", value=f"`{len(self.bot.guilds)}`", inline=True)
        embed.add_field(name="👥 Population", value=f"`{sum(g.member_count or 0 for g in self.bot.guilds)}`", inline=True)
        embed.add_field(name="🤖 Shard ID", value=f"`{interaction.guild.shard_id if interaction.guild else 0}`", inline=True)
        
        await interaction.followup.send(embed=embed)

    @server_group.command(name="snapshot", description="🛡️ Generate an operational health summary for this sector.")
    @app_commands.checks.has_permissions(manage_guild=True)
    @app_commands.guild_only()
    async def server_snapshot(self, interaction: discord.Interaction):
        """Provides a detailed overview of the server's structure."""
        await interaction.response.defer()
        guild = interaction.guild
        
        embed = AstraEmbed(title=f"🛡️ Sector Snapshot: {guild.name}")
        if guild.icon:
            embed.set_thumbnail(url=guild.icon.url)
            
        embed.add_field(name="📅 Established", value=f"<t:{int(guild.created_at.timestamp())}:R>", inline=True)
        embed.add_field(name="👑 Commander", value=f"<@{guild.owner_id}>", inline=True)
        embed.add_field(name="🆔 Sector ID", value=f"`{guild.id}`", inline=True)
        
        embed.add_field(name="👥 Population", value=f"`{guild.member_count}`", inline=True)
        embed.add_field(name="🎭 Roles", value=f"`{len(guild.roles)}`", inline=True)
        embed.add_field(name="💬 Channels", value=f"`{len(guild.channels)}`", inline=True)
        
        # Security Metrics
        verif_level = str(guild.verification_level).title()
        embed.add_field(name="🔐 Security Level", value=f"`{verif_level}`", inline=True)
        embed.add_field(name="💎 Tier Level", value=f"`Level {guild.premium_tier}`", inline=True)
        embed.add_field(name="🖼️ Assets", value=f"`{len(guild.emojis)} / {guild.emoji_limit} Emojis`", inline=True)

        await interaction.followup.send(embed=embed)

    @app_commands.command(name="system", description="💻 Monitor host machine technical metrics.")
    @app_commands.checks.has_permissions(administrator=True)
    async def system_metrics(self, interaction: discord.Interaction):
        """High-level host telemetry."""
        cpu_usage = psutil.cpu_percent()
        memory = psutil.virtual_memory()
        uptime_seconds = int(time.time() - psutil.boot_time())
        uptime = str(datetime.timedelta(seconds=uptime_seconds))
        
        embed = AstraEmbed(title="💻 Host Machine Telemetry")
        embed.add_field(name="🧠 CPU Load", value=f"`{cpu_usage}%`", inline=True)
        embed.add_field(name="🧬 Memory Usage", value=f"`{memory.percent}%` ({round(memory.used/1024**3, 1)}GB / {round(memory.total/1024**3, 1)}GB)", inline=True)
        embed.add_field(name="⏱️ Host Uptime", value=f"`{uptime}`", inline=False)
        
        await interaction.response.send_message(embed=embed, ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(Diagnostics(bot))
