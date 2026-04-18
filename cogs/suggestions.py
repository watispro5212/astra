import discord
from discord import app_commands
from discord.ext import commands
from core.database import db
from ui.embeds import AstraEmbed, SuccessEmbed, ErrorEmbed
from typing import Optional, Literal

STATUS_COLORS = {
    "pending": discord.Color.gold(),
    "approved": discord.Color.green(),
    "denied": discord.Color.red(),
    "implemented": discord.Color.blurple(),
}
STATUS_EMOJI = {
    "pending": "⏳",
    "approved": "✅",
    "denied": "❌",
    "implemented": "🚀",
}

class Suggestions(commands.Cog):
    """Suggestion system — community input with staff review."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="suggest", description="Submit a suggestion to the server.")
    @app_commands.describe(suggestion="Your suggestion.")
    async def suggest(self, interaction: discord.Interaction, suggestion: str):
        config = await db.fetch_one(
            "SELECT * FROM suggestion_configs WHERE guild_id = ?", interaction.guild_id
        )
        if not config or not config["channel_id"]:
            return await interaction.response.send_message(
                embed=ErrorEmbed("Suggestions are not configured. Ask an admin to set up `/suggestion config`."),
                ephemeral=True
            )

        channel = interaction.guild.get_channel(config["channel_id"])
        if not channel:
            return await interaction.response.send_message(embed=ErrorEmbed("Suggestion channel not found."), ephemeral=True)

        embed = AstraEmbed(title="💡 New Suggestion")
        embed.description = suggestion
        embed.add_field(name="Status", value="⏳ Pending", inline=True)
        embed.add_field(name="Votes", value="👍 0 | 👎 0", inline=True)
        embed.set_author(name=interaction.user.display_name, icon_url=interaction.user.display_avatar.url)
        embed.color = discord.Color.gold()
        embed.set_footer(text="🛰️ Mission proposal awaiting command evaluation.")

        msg = await channel.send(embed=embed)
        await msg.add_reaction("👍")
        await msg.add_reaction("👎")

        suggestion_id = await db.execute(
            "INSERT INTO suggestions (guild_id, channel_id, message_id, author_id, content) VALUES (?, ?, ?, ?, ?)",
            interaction.guild_id, channel.id, msg.id, interaction.user.id, suggestion
        )

        await interaction.response.send_message(
            embed=SuccessEmbed(f"Suggestion submitted! [View it here]({msg.jump_url}) (ID: `{suggestion_id}`)"),
            ephemeral=True
        )

    suggestions_group = app_commands.Group(name="suggestion", description="Manage suggestions.")

    @suggestions_group.command(name="config", description="Configure the suggestion system.")
    @app_commands.describe(channel="Channel to post suggestions.", staff_role="Role that can approve/deny suggestions.")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def config(self, interaction: discord.Interaction, channel: discord.TextChannel, staff_role: Optional[discord.Role] = None):
        exists = await db.fetch_one("SELECT 1 FROM suggestion_configs WHERE guild_id = ?", interaction.guild_id)
        if exists:
            await db.execute(
                "UPDATE suggestion_configs SET channel_id = ?, staff_role_id = ? WHERE guild_id = ?",
                channel.id, staff_role.id if staff_role else None, interaction.guild_id
            )
        else:
            await db.execute(
                "INSERT INTO suggestion_configs (guild_id, channel_id, staff_role_id) VALUES (?, ?, ?)",
                interaction.guild_id, channel.id, staff_role.id if staff_role else None
            )
        await interaction.response.send_message(
            embed=SuccessEmbed(f"Suggestion channel set to {channel.mention}.")
        )

    @suggestions_group.command(name="approve", description="Approve a suggestion.")
    @app_commands.describe(suggestion_id="The suggestion ID.", note="Optional staff note.")
    @app_commands.checks.has_permissions(manage_messages=True)
    async def approve(self, interaction: discord.Interaction, suggestion_id: int, note: Optional[str] = None):
        await self._update_suggestion(interaction, suggestion_id, "approved", note)

    @suggestions_group.command(name="deny", description="Deny a suggestion.")
    @app_commands.describe(suggestion_id="The suggestion ID.", note="Reason for denial.")
    @app_commands.checks.has_permissions(manage_messages=True)
    async def deny(self, interaction: discord.Interaction, suggestion_id: int, note: Optional[str] = None):
        await self._update_suggestion(interaction, suggestion_id, "denied", note)

    @suggestions_group.command(name="implement", description="Mark a suggestion as implemented.")
    @app_commands.describe(suggestion_id="The suggestion ID.", note="Optional note.")
    @app_commands.checks.has_permissions(manage_guild=True)
    async def implement(self, interaction: discord.Interaction, suggestion_id: int, note: Optional[str] = None):
        await self._update_suggestion(interaction, suggestion_id, "implemented", note)

    async def _update_suggestion(self, interaction: discord.Interaction, suggestion_id: int, status: str, note: Optional[str]):
        row = await db.fetch_one(
            "SELECT * FROM suggestions WHERE id = ? AND guild_id = ?", suggestion_id, interaction.guild_id
        )
        if not row:
            return await interaction.response.send_message(embed=ErrorEmbed(f"Suggestion `#{suggestion_id}` not found."), ephemeral=True)

        await db.execute(
            "UPDATE suggestions SET status = ?, staff_note = ? WHERE id = ?",
            status, note, suggestion_id
        )

        channel = interaction.guild.get_channel(row["channel_id"])
        if channel:
            try:
                msg = await channel.fetch_message(row["message_id"])
                embed = msg.embeds[0] if msg.embeds else AstraEmbed()
                # Update status field
                new_fields = []
                for f in embed.fields:
                    if f.name == "Status":
                        new_fields.append(discord.EmbedField(
                            name="Status",
                            value=f"{STATUS_EMOJI[status]} {status.title()}",
                            inline=True
                        ))
                    elif f.name == "Staff Note" or f.name == "Votes":
                        new_fields.append(f)
                    else:
                        new_fields.append(f)
                embed.color = STATUS_COLORS[status]
                embed.clear_fields()
                for f in new_fields:
                    embed.add_field(name=f.name, value=f.value, inline=f.inline)
                if note:
                    embed.add_field(name="Staff Note", value=note, inline=False)
                await msg.edit(embed=embed)
            except Exception:
                pass

        config = await db.fetch_one("SELECT dm_on_update FROM suggestion_configs WHERE guild_id = ?", interaction.guild_id)
        if config and config["dm_on_update"]:
            author = interaction.guild.get_member(row["author_id"])
            if author:
                try:
                    dm_embed = AstraEmbed(title=f"💡 Suggestion Update — {interaction.guild.name}")
                    dm_embed.description = f'Your suggestion was marked as **{status}**:\n> {row["content"]}'
                    dm_embed.color = STATUS_COLORS[status]
                    if note:
                        dm_embed.add_field(name="Staff Note", value=note)
                    await author.send(embed=dm_embed)
                except Exception:
                    pass

        await interaction.response.send_message(embed=SuccessEmbed(f"Suggestion `#{suggestion_id}` marked as **{status}**."))

async def setup(bot: commands.Bot):
    await bot.add_cog(Suggestions(bot))
