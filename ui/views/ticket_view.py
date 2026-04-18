import discord
from services.ticket_service import TicketService
from ui.embeds import AstraEmbed, SuccessEmbed

class TicketLauncherView(discord.ui.View):
    """A persistent view for the ticket opening panel."""
    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.button(
        label="Open Ticket",
        style=discord.ButtonStyle.primary,
        custom_id="astra:ticket_open",
        emoji="🎫"
    )
    async def open_ticket(self, interaction: discord.Interaction, button: discord.ui.Button):
        # Prevent multiple open tickets per user if desired (optional)
        
        await interaction.response.defer(ephemeral=True)
        
        channel = await TicketService.create_ticket(interaction.guild, interaction.user)
        if not channel:
            return await interaction.followup.send("❌ Internal Error: Ticket category or staff role not configured by an admin.", ephemeral=True)

        # Welcome message inside the ticket
        welcome_embed = AstraEmbed(
            title="Ticket Opened",
            description=f"Welcome {interaction.user.mention}! Staff will be with you shortly.\nPlease describe your issue in detail."
        )
        
        view = TicketControlView()
        await channel.send(content=f"{interaction.user.mention} | Staff", embed=welcome_embed, view=view)
        
        await interaction.followup.send(f"✅ Ticket created: {channel.mention}", ephemeral=True)

class TicketControlView(discord.ui.View):
    """A persistent view for managing an open ticket."""
    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.button(
        label="Close Ticket",
        style=discord.ButtonStyle.danger,
        custom_id="astra:ticket_close",
        emoji="🔒"
    )
    async def close(self, interaction: discord.Interaction, button: discord.ui.Button):
        if not await TicketService.is_ticket(interaction.channel_id):
            return await interaction.response.send_message("This channel is not an active ticket.", ephemeral=True)
            
        await interaction.response.send_message("Closing ticket in 5 seconds...")
        await TicketService.close_ticket(interaction.channel_id)
        
        # In a real scenario, we might archive it or delete it. For now, we archive (remove user).
        # We can also just delete it for simplicity in this demo.
        import asyncio
        await asyncio.sleep(5)
        await interaction.channel.delete(reason="Ticket closed by user/staff")
