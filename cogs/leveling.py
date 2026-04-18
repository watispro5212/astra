import discord
from discord.ext import commands
from discord import app_commands
from services.xp_service import xp_service
from core.database import db
from ui.embeds import AstraEmbed, SuccessEmbed
from typing import Optional

class Leveling(commands.Cog):
    """XP and Leveling system for member engagement."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_message(self, message: discord.Message):
        if not message.guild or message.author.bot:
            return
            
        leveled_up = await xp_service.add_xp(message)
        
        if leveled_up:
            # Get current level
            xp, level, _ = await xp_service.get_rank(message.author.id, message.guild.id)
            
            # Check for role rewards
            role_data = await db.fetch_all(
                "SELECT role_id FROM level_roles WHERE guild_id = ? AND level <= ?",
                message.guild.id, level
            )
            
            if role_data:
                roles_to_add = []
                for row in role_data:
                    role = message.guild.get_role(row['role_id'])
                    if role and role not in message.author.roles:
                        roles_to_add.append(role)
                
                if roles_to_add:
                    try:
                        await message.author.add_roles(*roles_to_add)
                    except discord.Forbidden:
                        pass # Bot lacks permission

            # Announce level up
            guild_config = await db.fetch_one(
                "SELECT xp_announce_channel_id FROM guilds WHERE guild_id = ?",
                message.guild.id
            )
            
            channel = message.channel
            if guild_config and guild_config['xp_announce_channel_id']:
                target_channel = message.guild.get_channel(guild_config['xp_announce_channel_id'])
                if target_channel:
                    channel = target_channel
            
            embed = SuccessEmbed(f"GG **{message.author.display_name}**, you just reached **Level {level}**!")
            await channel.send(embed=embed)

    @app_commands.command(name="rank", description="Check your or another member's rank.")
    @app_commands.describe(member="The member to check rank for.")
    async def rank(self, interaction: discord.Interaction, member: Optional[discord.Member] = None):
        target = member or interaction.user
        
        xp, level, rank_pos = await xp_service.get_rank(target.id, interaction.guild_id)
        
        # Calculate progress to next level
        def get_xp_for_level(lvl):
            if lvl == 0: return 0
            return lvl * 100 + ((lvl - 1) ** 2) * 50
            
        xp_this_level = xp - get_xp_for_level(level)
        xp_needed = get_xp_for_level(level + 1) - get_xp_for_level(level)
        percentage = min(100, int((xp_this_level / xp_needed) * 100))
        
        # Progress bar
        segments = 15
        filled = int((percentage / 100) * segments)
        bar = "▰" * filled + "▱" * (segments - filled)
        
        embed = AstraEmbed(title=f"Rank: {target.display_name}")
        embed.set_thumbnail(url=target.display_avatar.url)
        
        embed.add_field(name="Level", value=f"**{level}**", inline=True)
        embed.add_field(name="Rank", value=f"**#{rank_pos}**" if rank_pos else "N/A", inline=True)
        embed.add_field(name="Total XP", value=f"{xp:,}", inline=True)
        
        embed.add_field(
            name=f"Progress to Level {level + 1}", 
            value=f"`{bar}` {percentage}%\n({xp_this_level:,} / {xp_needed:,} XP)", 
            inline=False
        )
        
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="leaderboard", description="View the server's top members by XP.")
    async def leaderboard(self, interaction: discord.Interaction):
        top_users = await db.fetch_all(
            "SELECT user_id, xp, level FROM user_xp WHERE guild_id = ? ORDER BY xp DESC LIMIT 10",
            interaction.guild_id
        )
        
        if not top_users:
            await interaction.response.send_message("No one has earned any XP yet!", ephemeral=True)
            return
            
        embed = AstraEmbed(title=f"🏆 {interaction.guild.name} Leaderboard")
        
        description = ""
        for i, row in enumerate(top_users, 1):
            user = interaction.guild.get_member(row['user_id'])
            name = user.display_name if user else f"User ID {row['user_id']}"
            medal = "🥇" if i == 1 else "🥈" if i == 2 else "🥉" if i == 3 else f"`#{i}`"
            description += f"{medal} **{name}** — Level {row['level']} ({row['xp']:,} XP)\n"
            
        embed.description = description
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="xp", description="Configure leveling settings (Staff Only).")
    @app_commands.describe(
        enabled="Enable or disable leveling.",
        rate="Base XP per message (default 15).",
        cooldown="Seconds between XP awards (default 60).",
        announce_channel="Channel for level-up announcements."
    )
    @app_commands.checks.has_permissions(manage_guild=True)
    async def xp_config(
        self, 
        interaction: discord.Interaction, 
        enabled: Optional[bool] = None,
        rate: Optional[int] = None,
        cooldown: Optional[int] = None,
        announce_channel: Optional[discord.TextChannel] = None
    ):
        query = "UPDATE guilds SET "
        updates = []
        params = []
        
        if enabled is not None:
            updates.append("xp_enabled = ?")
            params.append(enabled)
        if rate is not None:
            updates.append("xp_rate = ?")
            params.append(rate)
        if cooldown is not None:
            updates.append("xp_cooldown = ?")
            params.append(cooldown)
        if announce_channel:
            updates.append("xp_announce_channel_id = ?")
            params.append(announce_channel.id)
            
        if not updates:
            await interaction.response.send_message("No settings provided to update.", ephemeral=True)
            return
            
        query += ", ".join(updates) + " WHERE guild_id = ?"
        params.append(interaction.guild_id)
        
        await db.execute(query, *params)
        await interaction.response.send_message(embed=SuccessEmbed("Leveling settings updated successfully."), ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(Leveling(bot))
