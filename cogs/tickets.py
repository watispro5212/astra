import discord
from discord import app_commands
from discord.ext import commands
from services.ticket_service import TicketService
from ui.views.ticket_view import TicketLauncherView
from ui.embeds import SuccessEmbed, AstraEmbed

class Tickets(commands.Cog):
    """Ticket system for private support and requests."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="ticket", description="Ticket system administration.")
    @app_commands.checks.has_permissions(administrator=True)
    async def ticket_cmd(self, interaction: discord.Interaction):
        """Root command for tickets."""
        pass

    @app_commands.command(name="ticket_setup", description="Configure ticket settings.")
    @app_commands.describe(
        category="The category where tickets will be created",
        staff_role="The role that can access tickets"
    )
    @app_commands.checks.has_permissions(administrator=True)
    async def setup_tickets(
        self, 
        interaction: discord.Interaction, 
        category: discord.CategoryChannel, 
        staff_role: discord.Role
    ):
        """Sets the ticket category and staff role."""
        await TicketService.update_config(
            interaction.guild_id, 
            category_id=category.id, 
            staff_role_id=staff_role.id
        )
        await interaction.response.send_message(
            embed=SuccessEmbed(f"Ticket system configured!\nCategory: {category}\nStaff Role: {staff_role.mention}")
        )

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
