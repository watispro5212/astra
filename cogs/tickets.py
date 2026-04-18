import discord
from typing import Optional
from discord import app_commands
from discord.ext import commands
from services.ticket_service import TicketService
from ui.views.ticket_view import TicketLauncherView, TicketControlView
from ui.embeds import SuccessEmbed, AstraEmbed

class Tickets(commands.Cog):
    """Ticket system for private support and requests."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    async def cog_load(self):
        """Registers persistent views on startup."""
        self.bot.add_view(TicketLauncherView())
        self.bot.add_view(TicketControlView())

    @app_commands.command(name="ticket", description="Ticket system administration.")
    @app_commands.checks.has_permissions(administrator=True)
    async def ticket_cmd(self, interaction: discord.Interaction):
        """Root command for tickets."""
        pass

    @app_commands.command(name="ticket_setup", description="Configure ticket settings.")
    @app_commands.describe(
        category="The category where tickets will be created",
        staff_role="The role that can access tickets",
        logs_channel="Channel for ticket transcripts"
    )
    @app_commands.checks.has_permissions(administrator=True)
    async def setup_tickets(
        self, 
        interaction: discord.Interaction, 
        category: discord.CategoryChannel, 
        staff_role: discord.Role,
        logs_channel: Optional[discord.TextChannel] = None
    ):
        """Sets the ticket category, staff role, and log channel."""
        await TicketService.update_config(
            interaction.guild_id, 
            category_id=category.id, 
            staff_role_id=staff_role.id,
            log_channel_id=logs_channel.id if logs_channel else None
        )
        msg = f"Ticket system configured!\nCategory: {category}\nStaff Role: {staff_role.mention}"
        if logs_channel:
            msg += f"\nLogs: {logs_channel.mention}"
            
        await interaction.response.send_message(embed=SuccessEmbed(msg))

    @app_commands.command(name="ticket_panel", description="Send the ticket opening panel.")
    @app_commands.describe(channel="The channel to send the panel in")
    @app_commands.checks.has_permissions(administrator=True)
    async def send_panel(self, interaction: discord.Interaction, channel: discord.TextChannel):
        """Sends the persistent 'Open Ticket' button panel."""
        config = await TicketService.get_config(interaction.guild_id)
        if not config:
            return await interaction.response.send_message(
                "❌ Please run `/ticket_setup` first.", 
                ephemeral=True
            )

        embed = AstraEmbed(
            title="Astra Support",
            description="Need help? Click the button below to open a private support ticket.\n\n"
                        "Our staff will be notified and will assist you as soon as possible."
        )
        
        view = TicketLauncherView()
        await channel.send(embed=embed, view=view)
        await interaction.response.send_message(f"✅ Ticket panel sent to {channel.mention}", ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(Tickets(bot))
