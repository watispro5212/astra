import discord
from discord import app_commands
from discord.ext import commands
from services.invite_service import InviteService
from ui.embeds import AstraEmbed, ErrorEmbed
from typing import Optional

class InviteTracker(commands.Cog):
    """Tracks who invited who and maintains invite leaderboards."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot
        self._invite_cache: dict[int, dict[str, int]] = {}

    async def _cache_invites(self, guild: discord.Guild):
        try:
            invites = await guild.invites()
            self._invite_cache[guild.id] = {inv.code: inv.uses for inv in invites}
        except Exception:
            pass

    @commands.Cog.listener()
    async def on_ready(self):
        for guild in self.bot.guilds:
            await self._cache_invites(guild)

    @commands.Cog.listener()
    async def on_guild_join(self, guild: discord.Guild):
        await self._cache_invites(guild)

    @commands.Cog.listener()
    async def on_member_join(self, member: discord.Member):
        guild = member.guild
        try:
            new_invites = await guild.invites()
        except Exception:
            return

        old_cache = self._invite_cache.get(guild.id, {})
        inviter_id = None
        invite_code = "unknown"

        for inv in new_invites:
            old_uses = old_cache.get(inv.code, 0)
            if inv.uses > old_uses:
                inviter_id = inv.inviter.id if inv.inviter else None
                invite_code = inv.code
                break

        self._invite_cache[guild.id] = {inv.code: inv.uses for inv in new_invites}
        await InviteService.record_join(guild.id, member.id, inviter_id, invite_code)

    @commands.Cog.listener()
    async def on_member_remove(self, member: discord.Member):
        await InviteService.record_leave(member.guild.id, member.id)

    invites = app_commands.Group(name="invites", description="Invite tracking commands.")

    @invites.command(name="check", description="Check a member's invite statistics.")
    @app_commands.describe(member="The member to check (defaults to yourself).")
    async def check(self, interaction: discord.Interaction, member: Optional[discord.Member] = None):
        target = member or interaction.user
        stats = await InviteService.get_invite_stats(interaction.guild_id, target.id)
        embed = AstraEmbed(title=f"📨 Invite Stats — {target.display_name}")
        embed.set_thumbnail(url=target.display_avatar.url)
        embed.add_field(name="Total Invites", value=str(stats["total"]), inline=True)
        embed.add_field(name="Real (Active)", value=str(stats.get("real", 0)), inline=True)
        embed.add_field(name="Left", value=str(stats["left"]), inline=True)
        embed.add_field(name="Fake", value=str(stats["fake"]), inline=True)
        await interaction.response.send_message(embed=embed)

    @invites.command(name="leaderboard", description="View the top inviters in this server.")
    async def leaderboard(self, interaction: discord.Interaction):
        await interaction.response.defer()
        rows = await InviteService.get_leaderboard(interaction.guild_id)
        if not rows:
            return await interaction.followup.send(embed=ErrorEmbed("No invite data recorded yet."))
        embed = AstraEmbed(title=f"📨 Invite Leaderboard — {interaction.guild.name}")
        medals = ["🥇", "🥈", "🥉"]
        lines = []
        for i, row in enumerate(rows):
            member = interaction.guild.get_member(row["user_id"])
            name = member.display_name if member else f"User {row['user_id']}"
            medal = medals[i] if i < 3 else f"`{i+1}.`"
            lines.append(f"{medal} **{name}** — {row['real']} real invites")
        embed.description = "\n".join(lines)
        await interaction.followup.send(embed=embed)

    @invites.command(name="whoinvited", description="Check who invited a specific member.")
    @app_commands.describe(member="The member to look up.")
    async def whoinvited(self, interaction: discord.Interaction, member: discord.Member):
        inviter_id = await InviteService.get_inviter(interaction.guild_id, member.id)
        if not inviter_id:
            return await interaction.response.send_message(
                embed=ErrorEmbed(f"No invite record found for {member.mention}."), ephemeral=True
            )
        inviter = interaction.guild.get_member(inviter_id)
        name = inviter.mention if inviter else f"`{inviter_id}`"
        embed = AstraEmbed(title="📨 Invite Lookup")
        embed.description = f"{member.mention} was invited by {name}."
        await interaction.response.send_message(embed=embed)

async def setup(bot: commands.Bot):
    await bot.add_cog(InviteTracker(bot))
