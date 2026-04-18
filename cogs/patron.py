import discord
from discord import app_commands
from discord.ext import commands
from services.patron_service import patron_service
from ui.embeds import SuccessEmbed, ErrorEmbed, AstraEmbed
from typing import Optional

class Patron(commands.Cog):
    """Admin tools for managing bot supporters and tiers."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self.tier_roles = {
            1: "⭐ Premium",
            2: "💎 Elite Patron",
            3: "📜 Astra Contributor"
        }

    async def _update_member_roles(self, member: discord.Member, tier: int):
        """Helper to sync roles based on tier."""
        # Find the correct role
        role_name = self.tier_roles.get(tier)
        if not role_name:
            return

        role = discord.utils.get(member.guild.roles, name=role_name)
        if role:
            try:
                # Remove other patron roles first
                all_patron_roles = [discord.utils.get(member.guild.roles, name=n) for n in self.tier_roles.values()]
                await member.remove_roles(*[r for r in all_patron_roles if r and r in member.roles])
                
                # Add new role
                await member.add_roles(role, reason=f"Patron Tier {tier} assigned.")
            except:
                pass

    @app_commands.command(name="patron_add", description="👑 Assign a patron tier to a user.")
    @app_commands.describe(
        member="The member to upgrade.",
        tier="Tier Level (1-3).",
        days="Duration in days (leave empty for lifetime)."
    )
    @app_commands.checks.has_permissions(administrator=True)
    async def add_patron(self, interaction: discord.Interaction, member: discord.Member, tier: int, days: Optional[int] = None):
        if tier < 1 or tier > 3:
            return await interaction.response.send_message("❌ Tier must be between 1 and 3.", ephemeral=True)

        await patron_service.set_patron(member.id, tier, days)
        await self._update_member_roles(member, tier)

        duration_str = f"for {days} days" if days else "indefinitely"
        embed = SuccessEmbed(
            f"Successfully promoted {member.mention} to **Tier {tier} ({self.tier_roles[tier]})** {duration_str}!"
        )
        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="patron_remove", description="Remove patron status from a user.")
    @app_commands.checks.has_permissions(administrator=True)
    async def remove_patron(self, interaction: discord.Interaction, member: discord.Member):
        await patron_service.remove_patron(member.id)
        
        # Remove roles
        all_patron_roles = [discord.utils.get(member.guild.roles, name=n) for n in self.tier_roles.values()]
        try:
            await member.remove_roles(*[r for r in all_patron_roles if r and r in member.roles], reason="Patron status removed.")
        except:
            pass

        await interaction.response.send_message(embed=SuccessEmbed(f"Removed patron status from {member.mention}."))

    @app_commands.command(name="patron_status", description="Check your current patron status.")
    async def patron_status(self, interaction: discord.Interaction):
        status = await patron_service.get_patron(interaction.user.id)
        
        if not status:
            return await interaction.response.send_message(
                "You are not currently a patron. Support Astra to unlock exclusive perks!", 
                ephemeral=True
            )

        tier = status['tier']
        expires = status['expires_at']
        expiry_str = f"Expires: <t:{int(discord.utils.parse_time(expires).timestamp())}:R>" if expires else "Lifetime Access"

        embed = AstraEmbed(
            title="💎 Your Patron Status",
            description=f"**Tier:** {tier} ({self.tier_roles.get(tier, 'Unknown')})\n**Status:** Active\n**{expiry_str}**"
        )
        embed.set_thumbnail(url=interaction.user.display_avatar.url)
        await interaction.response.send_message(embed=embed, ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(Patron(bot))
