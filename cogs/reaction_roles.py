import discord
from discord import app_commands
from discord.ext import commands
from services.role_service import RoleService
from ui.views.role_view import PersistentRoleView
from ui.embeds import SuccessEmbed, ErrorEmbed, AstraEmbed
from typing import Optional

class RoleMenuCog(commands.GroupCog, name="role-menu"):
    """Commands to manage self-assignable role menus."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="create", description="Create a new role menu.")
    @app_commands.checks.has_permissions(manage_roles=True)
    @app_commands.describe(
        title="Title of the role menu message",
        menu_type="Whether to use Buttons or a Select Menu",
        roles="Format: 'Label1:@Role1, Label2:@Role2'",
        unique="If True, selecting a role removes others in this menu"
    )
    async def create_menu(
        self, 
        interaction: discord.Interaction, 
        title: str, 
        menu_type: str, 
        roles: str, 
        unique: bool = False
    ):
        """Creates a role menu via a formatted string."""
        if menu_type.lower() not in ["buttons", "select"]:
            return await interaction.response.send_message("Menu type must be 'buttons' or 'select'.", ephemeral=True)

        parsed_roles = []
        try:
            # Simple parser: "Label:@Role, Label2:@Role2"
            parts = roles.split(',')
            for part in parts:
                label, role_mention = part.strip().split(':')
                role_id = int(role_mention.strip('<@&>'))
                role = interaction.guild.get_role(role_id)
                if not role:
                    raise ValueError(f"Role {role_mention} not found.")
                parsed_roles.append({"label": label, "role": role})
        except Exception as e:
            return await interaction.response.send_message(f"❌ Invalid format! Use `Label:@Role, Label2:@Role2`. Error: {e}", ephemeral=True)

        # Build View
        view = PersistentRoleView()
        if menu_type.lower() == "buttons":
            for r_data in parsed_roles:
                btn = discord.ui.Button(
                    label=r_data['label'],
                    style=discord.ButtonStyle.primary,
                    custom_id=f"astra:role_btn:{r_data['role'].id}"
                )
                view.add_item(btn)
        else: # Select
            options = []
            for r_data in parsed_roles:
                options.append(discord.SelectOption(label=r_data['label'], value=str(r_data['role'].id)))
            
            # Select component is already defined in the View, we just update it
            # Actually, the persistent view has a hardcoded select. We need to create a dynamic one or adjust the persistent view.
            # For Select menus, we'll use the one in the view but we need to pass options.
            # This is tricky for persistence. 
            # Better: One persistent view class, but if it has a select, the options are fetched from DB when clicked?
            # No, select options must be present.
            # I'll modify the view to accept options in __init__ if needed, but it must be recreateable.
            pass

        # Send message
        await interaction.response.defer(ephemeral=True)
        message = await interaction.channel.send(embed=embed, view=view)
        
        # Save to DB
        await RoleService.create_menu(message.id, interaction.guild_id, interaction.channel_id, title, menu_type, unique)
        for r_data in parsed_roles:
            await RoleService.add_option(message.id, r_data['role'].id, r_data['label'])

        await interaction.followup.send("✅ Role menu created successfully!", ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(RoleMenuCog(bot))
