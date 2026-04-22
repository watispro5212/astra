import discord
from discord.ext import commands
from discord import app_commands
from services.welcome_service import welcome_service
from core.database import db
from ui.embeds import SuccessEmbed, AstraEmbed
from typing import Optional

class Welcome(commands.Cog):
    """Member entry/exit protocols and automated role assignment."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_member_join(self, member: discord.Member):
        """Executes initialization sequence for new members."""
        await welcome_service.send_welcome(member)

    @commands.Cog.listener()
    async def on_member_remove(self, member: discord.Member):
        """Logs member departure from the operational area."""
        await welcome_service.send_farewell(member)

    @app_commands.command(name="welcome", description="🛰️ Configure member entry/exit protocols.")
    @app_commands.describe(
        channel="Sector for welcome broadcasts.",
        message="Transmission content. Variables: {user}, {server}, {member_count}.",
        auto_role="Tactical role assigned on entry.",
        farewell_channel="Sector for exit broadcasts.",
        farewell_message="Exit transmission content."
    )
    @app_commands.checks.has_permissions(manage_guild=True)
    @app_commands.guild_only()
    async def welcome_config(
        self, 
        interaction: discord.Interaction, 
        channel: Optional[discord.TextChannel] = None,
        message: Optional[str] = None,
        auto_role: Optional[discord.Role] = None,
        farewell_channel: Optional[discord.TextChannel] = None,
        farewell_message: Optional[str] = None
    ):
        """Updates or displays the welcome/farewell configuration."""
        await interaction.response.defer(ephemeral=True)
        
        # Ensure configuration exists
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
            # Show current operational status
            config = await welcome_service.get_config(interaction.guild_id)
            embed = AstraEmbed(title="🛰️ Operational Status: Entry Protocols")
            
            w_channel = interaction.guild.get_channel(config['channel_id']) if config and config['channel_id'] else None
            f_channel = interaction.guild.get_channel(config['farewell_channel_id']) if config and config['farewell_channel_id'] else None
            a_role = interaction.guild.get_role(config['auto_role_id']) if config and config['auto_role_id'] else None
            
            embed.add_field(name="Entry Sector", value=w_channel.mention if w_channel else "Classified", inline=True)
            embed.add_field(name="Exit Sector", value=f_channel.mention if f_channel else "Classified", inline=True)
            embed.add_field(name="Auto-Deployment Role", value=a_role.mention if a_role else "None", inline=True)
            embed.add_field(name="Transmission Matrix", value=f"`{config['message'] or 'Standard Protocol'}`", inline=False)
            
            await interaction.followup.send(embed=embed)
            return
            
        params.append(interaction.guild_id)
        query = f"UPDATE welcome_configs SET {', '.join(updates)} WHERE guild_id = ?"
        
        await db.execute(query, *params)
        await interaction.followup.send(embed=SuccessEmbed("Entry protocols have been recalibrated."))

async def setup(bot: commands.Bot):
    await bot.add_cog(Welcome(bot))
