import discord
from services.giveaway_service import giveaway_service

class GiveawayView(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @discord.ui.button(label="Enter Giveaway", style=discord.ButtonStyle.primary, custom_id="astra:giveaway:enter", emoji="🎉")
    async def enter(self, interaction: discord.Interaction, button: discord.ui.Button):
        success = await giveaway_service.add_entry(interaction.message.id, interaction.user.id)
        
        if success:
            await interaction.response.send_message("You've successfully entered the giveaway! Good luck! 🎉", ephemeral=True)
        else:
            await interaction.response.send_message("You've already entered this giveaway!", ephemeral=True)
