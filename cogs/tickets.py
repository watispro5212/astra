import discord
from typing import Optional
from discord import app_commands
from discord.ext import commands
from services.ticket_service import TicketService
from services.transcript_service import transcript_service
from core.database import db
from ui.views.ticket_view import TicketLauncherView, TicketControlView
from ui.embeds import SuccessEmbed, AstraEmbed

class Tickets(commands.Cog):
    """Support system infrastructure for secure private communication."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    async def cog_load(self):
        """Registers persistent views on mission start."""
        self.bot.add_view(TicketLauncherView())
        self.bot.add_view(TicketControlView())

    ticket_group = app_commands.Group(name="ticket", description="🛰️ Support infrastructure management.", default_permissions=discord.Permissions(administrator=True))

    @ticket_group.command(name="transcript", description="📄 Generate a secure tactical archive of this ticket.")
    @app_commands.checks.has_permissions(manage_messages=True)
    @app_commands.guild_only()
    async def ticket_transcript(self, interaction: discord.Interaction):
        """Generates a text archive of the current ticket channel."""
        if "ticket-" not in interaction.channel.name:
            return await interaction.response.send_message(embed=ErrorEmbed("Tactical archives can only be generated in active ticket channels."), ephemeral=True)
            
        await interaction.response.defer(thinking=True)
        try:
            file = await transcript_service.generate_text_transcript(interaction.channel)
            await interaction.followup.send(embed=SuccessEmbed("Tactical archive generated successfully."), file=file)
        except Exception as e:
            await interaction.followup.send(embed=ErrorEmbed(f"Failed to generate archive: {str(e)}"))

    @ticket_group.command(name="add", description="➕ Grant tactical access to a member.")
    @app_commands.describe(member="The member to add.")
    @app_commands.guild_only()
    async def ticket_add(self, interaction: discord.Interaction, member: discord.Member):
        """Grants a member access to the current ticket."""
        if "ticket-" not in interaction.channel.name:
            return await interaction.response.send_message(embed=ErrorEmbed("This action must be performed within a ticket channel."), ephemeral=True)
            
        await interaction.response.defer(ephemeral=True)
        await interaction.channel.set_permissions(member, read_messages=True, send_messages=True, embed_links=True, attach_files=True)
        await interaction.followup.send(embed=SuccessEmbed(f"Access granted to {member.mention}."))

    @ticket_group.command(name="remove", description="➖ Revoke tactical access from a member.")
    @app_commands.describe(member="The member to remove.")
    @app_commands.guild_only()
    async def ticket_remove(self, interaction: discord.Interaction, member: discord.Member):
        """Revokes a member's access to the current ticket."""
        if "ticket-" not in interaction.channel.name:
            return await interaction.response.send_message(embed=ErrorEmbed("This action must be performed within a ticket channel."), ephemeral=True)
            
        await interaction.response.defer(ephemeral=True)
        await interaction.channel.set_permissions(member, overwrite=None)
        await interaction.followup.send(embed=SuccessEmbed(f"Access revoked for {member.mention}."))

    @ticket_group.command(name="stats", description="📈 Analyze support operational metrics.")
    @app_commands.guild_only()
    async def ticket_stats(self, interaction: discord.Interaction):
        """Calculates and displays support team metrics."""
        await interaction.response.defer(ephemeral=True)
        
        total_tickets = await db.fetch_one("SELECT COUNT(*) as count FROM tickets WHERE guild_id = ?", interaction.guild_id)
        active_tickets = await db.fetch_one("SELECT COUNT(*) as count FROM tickets WHERE guild_id = ? AND status = 'open'", interaction.guild_id)
        
        embed = AstraEmbed(title="📊 Support Operational Analysis")
        embed.add_field(name="Total Deployments", value=f"`{total_tickets['count']}`", inline=True)
        embed.add_field(name="Active Cases", value=f"`{active_tickets['count']}`", inline=True)
        
        staff_rank = await db.fetch_all(
            "SELECT staff_id, COUNT(*) as count FROM tickets WHERE guild_id = ? AND staff_id IS NOT NULL GROUP BY staff_id ORDER BY count DESC LIMIT 5",
            interaction.guild_id
        )
        
        if staff_rank:
            rank_text = "\n".join([f"🎖️ <@{row['staff_id']}>: **{row['count']}** resolved" for row in staff_rank])
            embed.add_field(name="Top Responders", value=rank_text, inline=False)
            
        await interaction.followup.send(embed=embed)

    @app_commands.command(name="ticket_setup", description="🛰️ Initialize the support infrastructure.")
    @app_commands.describe(
        category="Deployment category for new tickets",
        staff_role="Role authorized for tactical response",
        logs_channel="Secure archive for ticket transcripts"
    )
    @app_commands.checks.has_permissions(administrator=True)
    @app_commands.guild_only()
    async def setup_tickets(
        self, 
        interaction: discord.Interaction, 
        category: discord.CategoryChannel, 
        staff_role: discord.Role,
        logs_channel: Optional[discord.TextChannel] = None
    ):
        """Sets the ticket category, staff role, and log channel."""
        await interaction.response.defer(ephemeral=True)
        await TicketService.update_config(
            interaction.guild_id, 
            category_id=category.id, 
            staff_role_id=staff_role.id,
            log_channel_id=logs_channel.id if logs_channel else None
        )
        
        embed = SuccessEmbed("Support infrastructure initialized.")
        embed.add_field(name="Deployment Zone", value=category.name, inline=True)
        embed.add_field(name="Tactical Team", value=staff_role.mention, inline=True)
        if logs_channel:
            embed.add_field(name="Archive Sector", value=logs_channel.mention, inline=True)
            
        await interaction.followup.send(embed=embed)

    @app_commands.command(name="ticket_panel", description="🛰️ Deploy the support initialization panel.")
    @app_commands.describe(channel="Target sector for panel deployment")
    @app_commands.checks.has_permissions(administrator=True)
    @app_commands.guild_only()
    async def send_panel(self, interaction: discord.Interaction, channel: discord.TextChannel):
        """Sends the persistent 'Open Ticket' button panel."""
        await interaction.response.defer(ephemeral=True)
        config = await TicketService.get_config(interaction.guild_id)
        if not config:
            return await interaction.followup.send(embed=ErrorEmbed("Infrastructure not initialized. Please run `/ticket_setup` first."))

        embed = AstraEmbed(
            title="🛰️ Astra Support Interface",
            description=(
                "Establish a secure, encrypted communication channel with our tactical response team.\n\n"
                "**Deployment Protocols:**\n"
                "• Click the button below to initialize.\n"
                "• A private channel will be established instantly.\n"
                "• Staff will be notified for immediate response."
            )
        )
        embed.set_image(url="https://i.imgur.com/vHREn9j.png") # Tactical placeholder or generated image later
        
        view = TicketLauncherView()
        await channel.send(embed=embed, view=view)
        await interaction.followup.send(embed=SuccessEmbed(f"Support panel deployed to {channel.mention}."))

async def setup(bot: commands.Bot):
    await bot.add_cog(Tickets(bot))
