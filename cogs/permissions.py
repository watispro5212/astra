import discord
from discord import app_commands
from discord.ext import commands
from ui.embeds import AstraEmbed, SuccessEmbed, WarnEmbed
from typing import Optional

class Permissions(commands.Cog):
    """Advanced permission auditing and security tools."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="permissions_compare", description="🛡️ Compare two roles side by side.")
    @app_commands.describe(role1="The first role.", role2="The second role.")
    @app_commands.checks.has_permissions(manage_roles=True)
    async def permissions_compare(self, interaction: discord.Interaction, role1: discord.Role, role2: discord.Role):
        """Displays a side-by-side comparison of two roles' permissions."""
        embed = AstraEmbed(title=f"⚖️ Role Comparison: {role1.name} vs {role2.name}")
        
        # We only care about permissions that differ
        p1 = dict(role1.permissions)
        p2 = dict(role2.permissions)
        
        common_diffs = []
        for perm, value in p1.items():
            if value != p2[perm]:
                emoji1 = "✅" if value else "❌"
                emoji2 = "✅" if p2[perm] else "❌"
                common_diffs.append(f"`{perm.replace('_', ' ').title()}`: {role1.name} {emoji1} | {role2.name} {emoji2}")

        if not common_diffs:
            embed.description = "These roles have identical permissions."
        else:
            embed.description = "\n".join(common_diffs[:20]) # Limit to 20 diffs for readability
            if len(common_diffs) > 20:
                embed.set_footer(text=f"Showing 20 of {len(common_diffs)} differences")

        await interaction.response.send_message(embed=embed)

    @app_commands.command(name="permissions_audit", description="🔍 Scan for dangerous or insecure permissions in this guild.")
    @app_commands.checks.has_permissions(administrator=True)
    async def permissions_audit(self, interaction: discord.Interaction):
        """Audits the server for high-risk permission configurations."""
        guild = interaction.guild
        issues = []

        # 1. Admin Audit
        admin_roles = [r for r in guild.roles if r.permissions.administrator and not r.is_bot_managed()]
        if len(admin_roles) > 5:
            issues.append(f"⚠️ **High Admin Density**: {len(admin_roles)} roles have Administrator access.")

        # 2. @everyone Audit
        everyone = guild.default_role
        dangerous_everyone = [p for p, v in everyone.permissions if v and p in ['administrator', 'manage_guild', 'manage_roles', 'mention_everyone']]
        if dangerous_everyone:
            issues.append(f"🚨 **Insecure @everyone**: Has dangerous permissions: {', '.join(dangerous_everyone)}")

        # 3. Dangerous Staff combinations
        for role in guild.roles:
            if role.permissions.manage_roles and not role.permissions.administrator:
                issues.append(f"ℹ️ **Role Logic**: `{role.name}` can manage roles but is not an Admin. (Potential Escalation)")

        embed = AstraEmbed(title="🛡️ Guild Permission Audit")
        if not issues:
            embed.description = "✅ No critical security flaws detected in role permissions."
            return await interaction.response.send_message(embed=embed)
            
        embed.description = "I found the following potential security concerns:\n\n" + "\n".join(issues)
        await interaction.response.send_message(embed=embed)

async def setup(bot: commands.Bot):
    await bot.add_cog(Permissions(bot))
