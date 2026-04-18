import discord
from core.database import db
from typing import Optional, List, Dict, Any

class RoleService:
    @staticmethod
    async def create_menu(message_id: int, guild_id: int, channel_id: int, title: str, menu_type: str, unique_roles: bool = False):
        """Creates a new role menu entry in the database."""
        await db.execute(
            "INSERT INTO role_menus (message_id, guild_id, channel_id, title, type, unique_roles) VALUES (?, ?, ?, ?, ?, ?)",
            message_id, guild_id, channel_id, title, menu_type, int(unique_roles)
        )

    @staticmethod
    async def add_option(message_id: int, role_id: int, label: str, emoji: Optional[str] = None):
        """Adds a role option to an existing menu."""
        await db.execute(
            "INSERT INTO role_options (message_id, role_id, label, emoji) VALUES (?, ?, ?, ?)",
            message_id, role_id, label, emoji
        )

    @staticmethod
    async def get_menu(message_id: int) -> Optional[Dict]:
        """Retrieves menu configuration and its options."""
        menu = await db.fetch_one("SELECT * FROM role_menus WHERE message_id = ?", message_id)
        if not menu:
            return None
        
        options = await db.fetch_all("SELECT * FROM role_options WHERE message_id = ?", message_id)
        
        result = dict(menu)
        result['options'] = [dict(opt) for opt in options]
        return result

    @staticmethod
    async def toggle_role(member: discord.Member, role_id: int, unique_roles: bool = False, current_message_id: int = 0) -> str:
        """Toggles a role for a member. If unique_roles is True, removes other roles in the same menu."""
        role = member.guild.get_role(role_id)
        if not role:
            return "Role not found."

        # Handle unique roles
        if unique_roles and current_message_id:
            menu = await RoleService.get_menu(current_message_id)
            if menu:
                # Find other roles from this menu the user might have
                other_role_ids = [opt['role_id'] for opt in menu['options'] if opt['role_id'] != role_id]
                roles_to_remove = [member.guild.get_role(rid) for rid in other_role_ids if member.get_role(rid)]
                if roles_to_remove:
                    await member.remove_roles(*roles_to_remove, reason="Astra: Unique role selection change")

        if member.get_role(role_id):
            await member.remove_roles(role, reason="Astra: Self-removed role")
            return f"Removed role: {role.name}"
        else:
            await member.add_roles(role, reason="Astra: Self-added role")
            return f"Added role: {role.name}"
