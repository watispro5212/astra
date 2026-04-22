import discord
from discord import app_commands
from discord.ext import commands
from ui.embeds import AstraEmbed, SuccessEmbed, WarnEmbed
from typing import Optional

class Permissions(commands.Cog):
    """Advanced permission auditing and security protocols."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="permissions_compare", description="🛡️ Compare two tactical roles side by side.")
    @app_commands.describe(role1="Primary role for comparison.", role2="Secondary role for comparison.")
    @app_commands.checks.has_permissions(manage_roles=True)
    @app_commands.guild_only()
    async def permissions_compare(self, interaction: discord.Interaction, role1: discord.Role, role2: discord.Role):
        """Displays a side-by-side comparison of two roles' permissions."""
        await interaction.response.defer(ephemeral=True)
        
        embed = AstraEmbed(title=f"⚖️ Role Analysis: {role1.name} vs {role2.name}")
        
        p1 = dict(role1.permissions)
        p2 = dict(role2.permissions)
        
        common_diffs = []
        for perm, value in p1.items():
            if value != p2[perm]:
                emoji1 = "✅" if value else "❌"
                emoji2 = "✅" if p2[perm] else "❌"
                common_diffs.append(f"`{perm.replace('_', ' ').title()}`: {role1.name} {emoji1} | {role2.name} {emoji2}")

        if not common_diffs:
            embed.description = "Identical permission matrices detected."
        else:
            embed.description = "Operational variances identified:\n\n" + "\n".join(common_diffs[:20])
            if len(common_diffs) > 20:
                embed.set_footer(text=f"Truncated: {len(common_diffs)} total variances.")

        await interaction.followup.send(embed=embed)

    @app_commands.command(name="permissions_audit", description="🔍 Scan for security vulnerabilities in the permission matrix.")
    @app_commands.checks.has_permissions(administrator=True)
    @app_commands.guild_only()
    async def permissions_audit(self, interaction: discord.Interaction):
        """Audits the server for high-risk permission configurations."""
        await interaction.response.defer(ephemeral=True)
        guild = interaction.guild
        issues = []

        # 1. Admin Audit
        admin_roles = [r for r in guild.roles if r.permissions.administrator and not r.is_bot_managed()]
        if len(admin_roles) > 5:
            issues.append(f"⚠️ **High Admin Density**: {len(admin_roles)} roles have full Administrator access.")

        # 2. @everyone Audit
        everyone = guild.default_role
        dangerous_everyone = [p for p, v in everyone.permissions if v and p in ['administrator', 'manage_guild', 'manage_roles', 'mention_everyone']]
        if dangerous_everyone:
            issues.append(f"🚨 **Insecure @everyone**: Dangerous permissions active: {', '.join(dangerous_everyone)}")

        # 3. Escalation Risks
        for role in guild.roles:
            if role.permissions.manage_roles and not role.permissions.administrator:
                issues.append(f"ℹ️ **Escalation Vector**: `{role.name}` can manage roles without full Admin rights.")

        embed = AstraEmbed(title="🛡️ Sector Permission Audit")
        if not issues:
            embed.description = "✅ No critical security variances detected in the permission matrix."
        else:
            embed.description = "I found the following potential security concerns:\n\n" + "\n".join(issues)
            
        await interaction.followup.send(embed=embed)

async def setup(bot: commands.Bot):
    await bot.add_cog(Permissions(bot))
