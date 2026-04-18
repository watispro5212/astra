import discord
import io
import asyncio
from services.ticket_service import TicketService
from ui.embeds import AstraEmbed

class TicketTypeSelect(discord.ui.Select):
    def __init__(self):
        options = [
            discord.SelectOption(label="General Support", description="Get help with server related issues.", emoji="🎫", value="Support"),
            discord.SelectOption(label="Report Player", description="Report a member for breaking rules.", emoji="⚖️", value="Report"),
            discord.SelectOption(label="Partnership/Inquiry", description="Business or partnership inquiries.", emoji="🤝", value="Inquiry"),
        ]
        super().__init__(placeholder="Select a ticket category...", min_values=1, max_values=1, options=options, custom_id="astra:ticket_type")

    async def callback(self, interaction: discord.Interaction):
        await interaction.response.defer(ephemeral=True)
        ticket_type = self.values[0]
        
        channel = await TicketService.create_ticket(interaction.guild, interaction.user, ticket_type=ticket_type)
        if not channel:
            return await interaction.followup.send("❌ Ticket system not fully configured by an admin.", ephemeral=True)

        welcome_embed = AstraEmbed(
            title=f"{ticket_type} Ticket Opened",
            description=f"Welcome {interaction.user.mention}! Staff will assist you with your **{ticket_type.lower()}** request shortly.\n"
                        "Please provide details below."
        )
        
        await channel.send(content=f"{interaction.user.mention} | Staff", embed=welcome_embed, view=TicketControlView())
        await interaction.followup.send(f"✅ Your {ticket_type.lower()} ticket has been created: {channel.mention}", ephemeral=True)

class TicketLauncherView(discord.ui.View):
    """A persistent view for the ticket opening panel."""
    def __init__(self):
        super().__init__(timeout=None)
        self.add_item(TicketTypeSelect())

class TicketCloseModal(discord.ui.Modal, title="Close Ticket"):
    reason = discord.ui.TextInput(
        label="Reason for closing",
        placeholder="e.g. Issue resolved.",
        required=False,
        max_length=100
    )

    async def on_submit(self, interaction: discord.Interaction):
        await interaction.response.send_message("Generating transcript and closing ticket...")
        
        # Generator transcript
        transcript_text = await TicketService.generate_transcript(interaction.channel)
        reason_text = self.reason.value or "No reason provided"
        
        # Save to DB
        await TicketService.close_ticket(interaction.channel_id, reason=reason_text)
        
        # Log to staff channel if configured
        config = await TicketService.get_config(interaction.guild_id)
        if config and config['log_channel_id']:
            log_channel = interaction.guild.get_channel(config['log_channel_id'])
            if log_channel:
                embed = AstraEmbed(title="🎫 Ticket Transcript", description=f"**User:** <@{interaction.channel.name.split('-')[-1]}>\n**Closed By:** {interaction.user.mention}\n**Reason:** {reason_text}")
                file = discord.File(io.BytesIO(transcript_text.encode()), filename=f"transcript-{interaction.channel.name}.txt")
                await log_channel.send(embed=embed, file=file)

        await asyncio.sleep(3)
        await interaction.channel.delete(reason=f"Ticket closed: {reason_text}")

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
            
        await interaction.response.send_modal(TicketCloseModal())
