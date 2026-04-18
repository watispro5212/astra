import discord
from discord.ext import commands
from discord import app_commands
from services.welcome_service import welcome_service
from core.database import db
from ui.embeds import SuccessEmbed, AstraEmbed
from typing import Optional

class Welcome(commands.Cog):
    """Member join and leave announcements."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_member_join(self, member: discord.Member):
        await welcome_service.send_welcome(member)

    @commands.Cog.listener()
    async def on_member_remove(self, member: discord.Member):
        await welcome_service.send_farewell(member)

    @app_commands.command(name="welcome", description="Configure welcome and join settings.")
    @app_commands.describe(
        channel="Channel for join announcements.",
        message="The welcome message. Use {user}, {server}, {member_count}.",
        auto_role="Role awarded to new members.",
        farewell_channel="Channel for leave announcements.",
        farewell_message="The farewell message."
    )
    @app_commands.checks.has_permissions(manage_guild=True)
    async def welcome_config(
        self, 
        interaction: discord.Interaction, 
        channel: Optional[discord.TextChannel] = None,
        message: Optional[str] = None,
        auto_role: Optional[discord.Role] = None,
        farewell_channel: Optional[discord.TextChannel] = None,
        farewell_message: Optional[str] = None
    ):
        # Ensure row exists
        await db.execute(
            "INSERT OR IGNORE INTO welcome_configs (guild_id) VALUES (?)",
            interaction.guild_id
        )
        
        updates = []
        params = []
        
        if channel:
            updates.append("channel_id = ?")
            params.append(channel.id)
        if message:
            updates.append("message = ?")
            params.append(message)
        if auto_role:
            updates.append("auto_role_id = ?")
            params.append(auto_role.id)
        if farewell_channel:
            updates.append("farewell_channel_id = ?")
            params.append(farewell_channel.id)
        if farewell_message:
            updates.append("farewell_message = ?")
            params.append(farewell_message)
            
        if not updates:
            # Show current config
            config = await welcome_service.get_config(interaction.guild_id)
            embed = AstraEmbed(title="Current Welcome Configuration")
            
            w_channel = interaction.guild.get_channel(config['channel_id']) if config and config['channel_id'] else None
            f_channel = interaction.guild.get_channel(config['farewell_channel_id']) if config and config['farewell_channel_id'] else None
            a_role = interaction.guild.get_role(config['auto_role_id']) if config and config['auto_role_id'] else None
            
            embed.add_field(name="Welcome Channel", value=w_channel.mention if w_channel else "Not set", inline=True)
            embed.add_field(name="Farewell Channel", value=f_channel.mention if f_channel else "Not set", inline=True)
            embed.add_field(name="Auto-Role", value=a_role.mention if a_role else "Not set", inline=True)
            embed.add_field(name="Welcome Msg", value=f"`{config['message'] or 'Default'}`", inline=False)
            
            await interaction.response.send_message(embed=embed, ephemeral=True)
            return
            
        params.append(interaction.guild_id)
        query = f"UPDATE welcome_configs SET {', '.join(updates)} WHERE guild_id = ?"
        
        await db.execute(query, *params)
        await interaction.response.send_message(embed=SuccessEmbed("Welcome settings updated successfully."), ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(Welcome(bot))
