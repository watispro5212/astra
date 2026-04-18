import discord
from services.role_service import RoleService
from core.logger import logger

class PersistentRoleView(discord.ui.View):
    """A persistent view that handles role assignment via buttons and select menus."""
    def __init__(self):
        super().__init__(timeout=None)

    async def handle_role_toggle(self, interaction: discord.Interaction, role_id: int):
        """Processes the role toggle logic and responds to the interaction."""
        # Fetch menu config to check for unique_roles
        menu = await RoleService.get_menu(interaction.message.id)
        unique_roles = menu['unique_roles'] if menu else False
        
        result = await RoleService.toggle_role(
            member=interaction.user,
            role_id=role_id,
            unique_roles=unique_roles,
            current_message_id=interaction.message.id
        )
        
        await interaction.response.send_message(result, ephemeral=True)

    @discord.ui.select(custom_id="astra:role_select", placeholder="Choose your roles...", min_values=1, max_values=1)
    async def select_callback(self, interaction: discord.Interaction, select: discord.ui.Select):
        role_id = int(select.values[0])
        await self.handle_role_toggle(interaction, role_id)

    async def interaction_check(self, interaction: discord.Interaction) -> bool:
        # If it's a button, it will have a custom_id starting with 'astra:role_btn:'
        if interaction.data.get('component_type') == 2: # Button
            custom_id = interaction.data.get('custom_id', '')
            if custom_id.startswith("astra:role_btn:"):
                role_id = int(custom_id.split(':')[-1])
                await self.handle_role_toggle(interaction, role_id)
                return False # Handled manually
        return True
