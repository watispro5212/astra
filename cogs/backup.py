import discord
from discord import app_commands
from discord.ext import commands
from core.database import db
from ui.embeds import AstraEmbed, SuccessEmbed, ErrorEmbed
import json
import io
from datetime import datetime

class Backup(commands.Cog):
    """Server configuration backup and restore."""
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    backup_group = app_commands.Group(name="backup", description="Server configuration backup tools.")

    @backup_group.command(name="export", description="Export server configuration as a JSON file.")
    @app_commands.checks.has_permissions(administrator=True)
    async def export(self, interaction: discord.Interaction):
        await interaction.response.defer(ephemeral=True)

        guild_id = interaction.guild_id
        data = {"version": "3.0", "guild_id": guild_id, "exported_at": datetime.utcnow().isoformat(), "config": {}}

        tables = [
            ("guilds", "guild_id"),
            ("welcome_configs", "guild_id"),
            ("automod_configs", "guild_id"),
            ("ticket_configs", "guild_id"),
            ("temp_voice_configs", "guild_id"),
            ("suggestion_configs", "guild_id"),
            ("birthday_configs", "guild_id"),
            ("antiraid_configs", "guild_id"),
            ("level_roles", "guild_id"),
        ]

        for table, key in tables:
            try:
                rows = await db.fetch_all(f"SELECT * FROM {table} WHERE {key} = ?", guild_id)
                data["config"][table] = [dict(r) for r in rows]
            except Exception:
                data["config"][table] = []

        shop_rows = await db.fetch_all("SELECT * FROM shop_items WHERE guild_id = ? AND is_active = 1", guild_id)
        data["config"]["shop_items"] = [dict(r) for r in shop_rows]

        json_bytes = json.dumps(data, indent=2, default=str).encode("utf-8")
        file = discord.File(io.BytesIO(json_bytes), filename=f"astra_backup_{guild_id}_{datetime.utcnow().strftime('%Y%m%d')}.json")

        embed = SuccessEmbed(f"Configuration exported! Contains data for **{len(data['config'])}** modules.")
        await interaction.followup.send(embed=embed, file=file)

    @backup_group.command(name="import", description="Restore server configuration from a backup file.")
    @app_commands.describe(file="The JSON backup file to restore from.")
    @app_commands.checks.has_permissions(administrator=True)
    async def import_backup(self, interaction: discord.Interaction, file: discord.Attachment):
        await interaction.response.defer(ephemeral=True)

        if not file.filename.endswith(".json"):
            return await interaction.followup.send(embed=ErrorEmbed("Please upload a valid `.json` backup file."))

        try:
            content = await file.read()
            data = json.loads(content.decode("utf-8"))
        except Exception:
            return await interaction.followup.send(embed=ErrorEmbed("Could not parse the backup file."))

        if data.get("version") not in ("3.0",) or "config" not in data:
            return await interaction.followup.send(embed=ErrorEmbed("Unsupported or invalid backup format."))

        guild_id = interaction.guild_id
        restored = []

        simple_upsert = {
            "guilds": "guild_id",
            "welcome_configs": "guild_id",
            "automod_configs": "guild_id",
            "ticket_configs": "guild_id",
            "temp_voice_configs": "guild_id",
            "suggestion_configs": "guild_id",
            "birthday_configs": "guild_id",
            "antiraid_configs": "guild_id",
        }

        for table, key in simple_upsert.items():
            rows = data["config"].get(table, [])
            for row in rows:
                row[key] = guild_id
                cols = list(row.keys())
                ph = ", ".join("?" for _ in cols)
                try:
                    await db.execute(
                        f"INSERT OR REPLACE INTO {table} ({', '.join(cols)}) VALUES ({ph})",
                        *row.values()
                    )
                    restored.append(table)
                except Exception:
                    pass

        embed = SuccessEmbed(f"Backup restored! Loaded: {', '.join(set(restored)) or 'nothing'}.")
        await interaction.followup.send(embed=embed)

    @backup_group.command(name="info", description="View info about what a backup file contains.")
    @app_commands.describe(file="The backup JSON file.")
    @app_commands.checks.has_permissions(administrator=True)
    async def info(self, interaction: discord.Interaction, file: discord.Attachment):
        await interaction.response.defer(ephemeral=True)
        try:
            content = await file.read()
            data = json.loads(content.decode("utf-8"))
        except Exception:
            return await interaction.followup.send(embed=ErrorEmbed("Could not parse the backup file."))

        embed = AstraEmbed(title="📦 Backup File Info")
        embed.add_field(name="Version", value=data.get("version", "Unknown"), inline=True)
        embed.add_field(name="Exported At", value=data.get("exported_at", "Unknown"), inline=True)
        embed.add_field(name="Source Guild", value=str(data.get("guild_id", "Unknown")), inline=True)
        modules = list(data.get("config", {}).keys())
        embed.add_field(name="Modules", value=", ".join(modules) or "None", inline=False)
        await interaction.followup.send(embed=embed)

async def setup(bot: commands.Bot):
    await bot.add_cog(Backup(bot))
