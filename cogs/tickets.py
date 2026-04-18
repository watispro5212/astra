import discord
from typing import Optional
from discord import app_commands
from discord.ext import commands
from services.ticket_service import TicketService
from services.transcript_service import transcript_service
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

    ticket_group = app_commands.Group(name="ticket", description="Ticket system administration.", default_permissions=discord.Permissions(administrator=True))

    @ticket_group.command(name="transcript", description="📄 Generate a transcript for this ticket.")
    @app_commands.checks.has_permissions(manage_messages=True)
    async def ticket_transcript(self, interaction: discord.Interaction):
        """Generates a text archive of the current ticket channel."""
        if "ticket-" not in interaction.channel.name:
            return await interaction.response.send_message("❌ This command can only be used in ticket channels.", ephemeral=True)
            
        await interaction.response.defer()
        file = await transcript_service.generate_text_transcript(interaction.channel)
        await interaction.followup.send("✅ Transcript generated:", file=file)

    @ticket_group.command(name="add", description="➕ Add a member to this ticket.")
    @app_commands.describe(member="The member to add.")
    async def ticket_add(self, interaction: discord.Interaction, member: discord.Member):
        """Grants a member access to the current ticket."""
        if "ticket-" not in interaction.channel.name:
            return await interaction.response.send_message("❌ Not a ticket channel.", ephemeral=True)
            
        await interaction.channel.set_permissions(member, read_messages=True, send_messages=True, embed_links=True, attach_files=True)
        await interaction.response.send_message(f"✅ Added {member.mention} to the ticket.")

    @ticket_group.command(name="remove", description="➖ Remove a member from this ticket.")
    @app_commands.describe(member="The member to remove.")
    async def ticket_remove(self, interaction: discord.Interaction, member: discord.Member):
        """Revokes a member's access to the current ticket."""
        if "ticket-" not in interaction.channel.name:
            return await interaction.response.send_message("❌ Not a ticket channel.", ephemeral=True)
            
        await interaction.channel.set_permissions(member, overwrite=None)
        await interaction.response.send_message(f"✅ Removed {member.mention} from the ticket.")

    @ticket_group.command(name="stats", description="📈 View support performance statistics.")
    async def ticket_stats(self, interaction: discord.Interaction):
        """Calculates and displays support team metrics."""
        await interaction.response.defer(ephemeral=True)
        
        total_tickets = await db.fetch_one("SELECT COUNT(*) as count FROM tickets WHERE guild_id = ?", interaction.guild_id)
        active_tickets = await db.fetch_one("SELECT COUNT(*) as count FROM tickets WHERE guild_id = ? AND status = 'open'", interaction.guild_id)
        
        # Performance metrics (Last 30 days)
        stats_query = """
            SELECT event_type, AVG(strftime('%s', timestamp)) as avg_time 
            FROM ticket_events 
            WHERE guild_id = ? 
            GROUP BY event_type
        """
        # Note: Calculating claim time and resolution time accurately requires complex joins.
        # For this version, we'll show high-level counts and totals.
        
        embed = AstraEmbed(title="📊 Support Performance Stats")
        embed.add_field(name="Total Tickets", value=str(total_tickets['count']), inline=True)
        embed.add_field(name="Active Tickets", value=str(active_tickets['count']), inline=True)
        
        staff_rank = await db.fetch_all(
            "SELECT staff_id, COUNT(*) as count FROM tickets WHERE guild_id = ? AND staff_id IS NOT NULL GROUP BY staff_id ORDER BY count DESC LIMIT 5",
            interaction.guild_id
        )
        
        if staff_rank:
            rank_text = "\n".join([f"<@{row['staff_id']}>: **{row['count']}** cases" for row in staff_rank])
            embed.add_field(name="Top Staff (All Time)", value=rank_text, inline=False)
            
        await interaction.followup.send(embed=embed)

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
