import discord
from core.database import db
from ui.embeds import AstraEmbed
from typing import Optional

class WelcomeService:
    async def get_config(self, guild_id: int):
        return await db.fetch_one("SELECT * FROM welcome_configs WHERE guild_id = ?", guild_id)

    async def format_message(self, text: str, member: discord.Member) -> str:
        """Formats placeholders like {user}, {server}, {member_count}."""
        return text.format(
            user=member.mention,
            server=member.guild.name,
            member_count=member.guild.member_count,
            username=member.display_name
        )

    async def send_welcome(self, member: discord.Member):
        config = await self.get_config(member.guild.id)
        if not config or not config['channel_id']:
            return

        channel = member.guild.get_channel(config['channel_id'])
        if not channel:
            return

        message_text = config['message'] or "Welcome to the server, {user}!"
        formatted = await self.format_message(message_text, member)

        embed = AstraEmbed(
            title="👋 Welcome!",
            description=formatted
        )
        embed.set_thumbnail(url=member.display_avatar.url)
        
        try:
            await channel.send(embed=embed)
        except discord.Forbidden:
            pass

        # Handle auto-role
        if config['auto_role_id']:
            role = member.guild.get_role(config['auto_role_id'])
            if role:
                try:
                    await member.add_roles(role, reason="Auto-role on join")
                except discord.Forbidden:
                    pass

    async def send_farewell(self, member: discord.Member):
        config = await self.get_config(member.guild.id)
        if not config or not config['farewell_channel_id']:
            return

        channel = member.guild.get_channel(config['farewell_channel_id'])
        if not channel:
            return

        message_text = config['farewell_message'] or "{username} has left the server."
        formatted = await self.format_message(message_text, member)

        embed = AstraEmbed(
            title="💔 Farewell",
            description=formatted,
            color=discord.Color.dark_grey()
        )
        embed.set_thumbnail(url=member.display_avatar.url)
        
        try:
            await channel.send(embed=embed)
        except discord.Forbidden:
            pass

welcome_service = WelcomeService()
