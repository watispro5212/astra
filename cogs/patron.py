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
                if role not in member.roles:
                    await member.add_roles(role, reason=f"Patron Tier {tier} assigned.")
            except:
                pass

    @commands.Cog.listener()
    async def on_member_update(self, before: discord.Member, after: discord.Member):
        """
        Listens for role changes (e.g. from Patreon's official bot) 
        and syncs with Astra's internal patron database.
        """
        # Mapping role names back to tiers
        reverse_map = {v: k for k, v in self.tier_roles.items()}
        
        # Check added roles
        added_roles = [r for r in after.roles if r not in before.roles]
        for role in added_roles:
            if role.name in reverse_map:
                tier = reverse_map[role.name]
                await patron_service.set_patron(after.id, tier)
                # No need to call roles helper, they already have the role
        
        # Check removed roles
        removed_roles = [r for r in before.roles if r not in after.roles]
        for role in removed_roles:
            if role.name in reverse_map:
                # Only remove if they don't have ANY other patron role left 
                # (Patreon usually handles this, but we want to be safe)
                has_any = any(r.name in reverse_map for r in after.roles)
                if not has_any:
                    await patron_service.remove_patron(after.id)

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
            description=f"**Tier:** {tier} ({self.tier_roles.get(tier, 'Unknown')})\n**Status:** Active\n**{expiry_str}**",
            patron=status
        )
        embed.set_thumbnail(url=interaction.user.display_avatar.url)
        await interaction.response.send_message(embed=embed, ephemeral=True)

    # ── CUSTOMIZATION COMMANDS ────────────────────────────────────────────────
    
    patron_customize = app_commands.Group(name="customize", description="Supporter-only profile customization.")

    @patron_customize.command(name="color", description="💎 Tier 2+: Set a custom hex color for your bot embeds.")
    @app_commands.describe(hex_code="The hex color code (e.g. #FF0000 or FF0000).")
    async def customize_color(self, interaction: discord.Interaction, hex_code: str):
        patron = await patron_service.get_patron(interaction.user.id)
        if not patron or patron['tier'] < 2:
            return await interaction.response.send_message("❌ This feature is reserved for **Stellar** patrons and above!", ephemeral=True)
            
        # Clean hex code
        clean_hex = hex_code.strip().replace("#", "")
        if len(clean_hex) != 6 or not all(c in "0123456789ABCDEFabcdef" for c in clean_hex):
            return await interaction.response.send_message("❌ Invalid hex code! Please use format: `#FFFFFF` or `FFFFFF`.", ephemeral=True)
            
        await patron_service.update_customization(interaction.user.id, color=f"#{clean_hex}")
        await interaction.response.send_message(embed=SuccessEmbed(f"Your profile theme color has been set to `#{clean_hex}`!"), ephemeral=True)

    @patron_customize.command(name="badge", description="🌌 Tier 3: Choose an elite badge for your rank card.")
    @app_commands.describe(badge="The emoji or icon for your badge.")
    async def customize_badge(self, interaction: discord.Interaction, badge: str):
        patron = await patron_service.get_patron(interaction.user.id)
        if not patron or patron['tier'] < 3:
            return await interaction.response.send_message("❌ This feature is reserved for **Galactic** patrons!", ephemeral=True)
            
        await patron_service.update_customization(interaction.user.id, badge=badge)
        await interaction.response.send_message(embed=SuccessEmbed(f"Your custom badge has been set to: {badge}"), ephemeral=True)

    # ── ELITE GALLERY COMMANDS ────────────────────────────────────────────────

    elite_gallery = app_commands.Group(name="elite_gallery", description="Elite Patron image gallery management.")

    @elite_gallery.command(name="add", description="👑 Elite Only: Add an image to the bot's global gallery.")
    @app_commands.describe(url="Direct link to a high-quality (16:9) image/art.")
    async def gallery_add(self, interaction: discord.Interaction, url: str):
        # Basic URL check
        if not any(url.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp']):
             return await interaction.response.send_message("❌ Image must be a direct link (.jpg, .png, etc.)", ephemeral=True)

        success = await patron_service.add_gallery_image(interaction.user.id, url)
        if not success:
            return await interaction.response.send_message(
                "❌ **Failed!** You must be an **Elite Patron** to use this, or you have reached your 5-image limit.", 
                ephemeral=True
            )

        embed = SuccessEmbed("Successfully added your artwork to the **Galactic Gallery**! It will now cycle through Astra's global commands.")
        embed.set_image(url=url)
        await interaction.response.send_message(embed=embed)

    @elite_gallery.command(name="list", description="List your currently contributed gallery images.")
    async def gallery_list(self, interaction: discord.Interaction):
        images = await patron_service.get_user_gallery(interaction.user.id)
        if not images:
            return await interaction.response.send_message("You haven't contributed any images yet. 🌌", ephemeral=True)

        description = ""
        for img in images:
            description += f"**ID:** `{img['id']}` | [View Image]({img['image_url']})\n"

        embed = AstraEmbed(title="🖼️ Your Gallery Contributions", description=description)
        await interaction.response.send_message(embed=embed, ephemeral=True)

    @elite_gallery.command(name="remove", description="Remove one of your gallery images.")
    @app_commands.describe(image_id="The ID of the image (find it in /elite_gallery list).")
    async def gallery_remove(self, interaction: discord.Interaction, image_id: int):
        await patron_service.delete_gallery_image(interaction.user.id, image_id)
        await interaction.response.send_message(embed=SuccessEmbed(f"Image `{image_id}` removed from the gallery."), ephemeral=True)

    @app_commands.command(name="gallery_purge", description="🚨 Admin Only: Emergency removal of any gallery image.")
    @app_commands.checks.has_permissions(administrator=True)
    async def gallery_purge(self, interaction: discord.Interaction, image_id: int):
        await patron_service.purge_gallery_image(image_id)
        await interaction.response.send_message(embed=SuccessEmbed(f"Successfully purged image `{image_id}` from the global gallery."), ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(Patron(bot))
