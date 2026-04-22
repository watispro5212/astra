import discord
from discord import app_commands
from discord.ext import commands
from services.moderation_service import ModerationService
from ui.embeds import SuccessEmbed, AstraEmbed

class AdminConfig(commands.GroupCog, name="config"):
    """Server configuration commands for administrators."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="logging", description="Set the channel where Astra logs server events.")
    @app_commands.checks.has_permissions(administrator=True)
    async def set_logging(self, interaction: discord.Interaction, channel: discord.TextChannel):
        """Configures the audit logging channel."""
        await interaction.response.defer(ephemeral=True)
        await ModerationService.update_guild_config(interaction.guild_id, log_channel_id=channel.id)
        
        embed = SuccessEmbed(f"✅ Logging channel has been set to {channel.mention}")
        await interaction.followup.send(embed=embed)



    @app_commands.command(name="staff", description="Set the staff role for Astra permissions.")
    @app_commands.checks.has_permissions(administrator=True)
    async def set_staff(self, interaction: discord.Interaction, role: discord.Role):
        """Configures the staff role."""
        await interaction.response.defer(ephemeral=True)
        await ModerationService.update_guild_config(interaction.guild_id, staff_role_id=role.id)
        
        embed = SuccessEmbed(f"✅ Staff role has been set to **{role.name}**")
        await interaction.followup.send(embed=embed)

    @app_commands.command(name="view", description="View current server configuration.")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def view_config(self, interaction: discord.Interaction):
        """Displays current guild settings."""
        await interaction.response.defer(ephemeral=True)
        config = await ModerationService.get_guild_config(interaction.guild_id)
        
        # Get Welcome Config too
        from services.welcome_service import welcome_service
        w_config = await welcome_service.get_config(interaction.guild_id)
        
        if not config and not w_config:
            await interaction.followup.send("No configuration found for this server. Use `/config logging` to get started.", ephemeral=True)
            return

        embed = AstraEmbed(title=f"⚙️ Configuration: {interaction.guild.name}")
        
        log_channel = interaction.guild.get_channel(config['log_channel_id']) if config and config.get('log_channel_id') else None
        staff_role = interaction.guild.get_role(config['staff_role_id']) if config and config.get('staff_role_id') else None
        welcome_channel = interaction.guild.get_channel(w_config['channel_id']) if w_config and w_config.get('channel_id') else None
        
        embed.add_field(name="📜 Logging Channel", value=log_channel.mention if log_channel else "Not set", inline=True)
        embed.add_field(name="👋 Welcome Channel", value=welcome_channel.mention if welcome_channel else "Not set", inline=True)
        embed.add_field(name="🛡️ Staff Role", value=staff_role.mention if staff_role else "Not set", inline=True)
        
        await interaction.followup.send(embed=embed)

async def setup(bot: commands.Bot):
    await bot.add_cog(AdminConfig(bot))
