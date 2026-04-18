import discord
from services.poll_service import PollService
from core.config import config
from core.logger import logger

class PersistentPollView(discord.ui.View):
    """A persistent view that handles voting in polls."""
    def __init__(self):
        super().__init__(timeout=None)

    async def interaction_check(self, interaction: discord.Interaction) -> bool:
        if interaction.data.get('component_type') == 2: # Button
            custom_id = interaction.data.get('custom_id', '')
            if custom_id.startswith("astra:poll:vote:"):
                # Format: astra:poll:vote:OPTION_ID
                # Fetch poll to check status
                poll = await PollService.get_poll(interaction.message.id)
                if not poll:
                    await interaction.response.send_message("This poll no longer exists in my records.", ephemeral=True)
                    return False
                    
                if poll['is_closed']:
                    await interaction.response.send_message("This poll is already closed!", ephemeral=True)
                    return False

                # Cast vote
                result = await PollService.cast_vote(
                    poll_id=interaction.message.id,
                    user_id=interaction.user.id,
                    option_id=option_id
                )
                
                if "Your vote has been counted" in result:
                    # Update embed
                    poll = await PollService.get_poll(interaction.message.id)
                    embed = await PollService.build_poll_embed(
                        interaction.message.id, 
                        poll['question'], 
                        config.bot_theme_color
                    )
                    await interaction.response.edit_message(embed=embed)
                else:
                    await interaction.response.send_message(result, ephemeral=True)
                
                return False # Handled manually
        return True
