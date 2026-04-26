import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';

const medals = ['🥇', '🥈', '🥉'];
const rank = (i: number) => medals[i] ?? `**${i + 1}.**`;

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('📊 View the top-tier operative rankings.')
        .addSubcommand(sub =>
            sub.setName('server')
               .setDescription('Display the top 10 operatives by level in this sector.')
        )
        .addSubcommand(sub =>
            sub.setName('global')
               .setDescription('Display the global top 10 operatives across the entire network.')
        )
        .addSubcommand(sub =>
            sub.setName('wealth')
               .setDescription('Display the top 10 wealthiest operatives globally.')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        await interaction.deferReply();

        if (subcommand === 'server') {
            // Fetch guild members first, then query only those IDs — no string interpolation
            const members = await interaction.guild!.members.fetch();
            const memberIds = [...members.keys()];

            if (memberIds.length === 0) {
                await interaction.editReply({ content: '❌ Could not fetch member list.' });
                return;
            }

            // Query in batches to avoid hitting SQLite variable limits
            const placeholders = memberIds.map(() => '?').join(',');
            const users = await db.fetchAll(
                `SELECT user_id, level, xp FROM users WHERE user_id IN (${placeholders}) ORDER BY level DESC, xp DESC LIMIT 10`,
                ...memberIds
            );

            const lines = users.map((u, i) =>
                `${rank(i)} <@${u.user_id}> — Level \`${u.level}\` · \`${u.xp} XP\``
            );

            await interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setTitle(`📊 SECTOR LEADERBOARD: ${interaction.guild!.name}`)
                    .setColor(0x3498db)
                    .setDescription(lines.length > 0 ? lines.join('\n') : 'No intelligence data recorded for this sector yet.')
                    .setFooter({ text: 'Astra Intelligence System • v7.0.0' })
                    .setTimestamp()]
            });

        } else if (subcommand === 'global') {
            const users = await db.fetchAll(
                'SELECT user_id, level, xp FROM users ORDER BY level DESC, xp DESC LIMIT 10'
            );

            const lines: string[] = [];
            for (let i = 0; i < users.length; i++) {
                let name = `User ${users[i].user_id}`;
                try { name = (await interaction.client.users.fetch(users[i].user_id)).username; } catch (_) {}
                lines.push(`${rank(i)} **${name}** — Level \`${users[i].level}\` · \`${users[i].xp} XP\``);
            }

            await interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setTitle('🌎 GLOBAL LEADERBOARD: Top 10 Operatives')
                    .setColor(0xf1c40f)
                    .setDescription(lines.length > 0 ? lines.join('\n') : 'No global network data found.')
                    .setFooter({ text: 'Astra Global Network • v7.0.0' })
                    .setTimestamp()]
            });

        } else if (subcommand === 'wealth') {
            const users = await db.fetchAll(
                'SELECT user_id, balance FROM users ORDER BY balance DESC LIMIT 10'
            );

            const lines: string[] = [];
            for (let i = 0; i < users.length; i++) {
                let name = `User ${users[i].user_id}`;
                try { name = (await interaction.client.users.fetch(users[i].user_id)).username; } catch (_) {}
                lines.push(`${rank(i)} **${name}** — \`${(users[i].balance || 0).toLocaleString()} cr\``);
            }

            await interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setTitle('💰 WEALTH LEADERBOARD: Top 10 Operatives')
                    .setColor(0x2ecc71)
                    .setDescription(lines.length > 0 ? lines.join('\n') : 'No fiscal data found.')
                    .setFooter({ text: 'Astra Fiscal Network • v7.0.0' })
                    .setTimestamp()]
            });
        }
    }
};

export default command;
