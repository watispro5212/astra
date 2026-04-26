import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';
import { THEME, VERSION, PROTOCOL } from '../core/constants';

const medals = ['🥇', '🥈', '🥉'];
const rank = (i: number) => medals[i] ?? `**${i + 1}.**`;

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('📊 View the top-tier operative rankings.')
        .setDMPermission(false)
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
            // Fetch guild members
            await interaction.guild!.members.fetch();
            const memberIds = [...interaction.guild!.members.cache.keys()];

            if (memberIds.length === 0) {
                await interaction.editReply({ content: '❌ Could not synchronize sector personnel data.' });
                return;
            }

            // SQLite limit is typically 999 variables
            const slicedIds = memberIds.slice(0, 990);
            const placeholders = slicedIds.map(() => '?').join(',');
            const users = await db.fetchAll(
                `SELECT user_id, level, xp FROM users WHERE user_id IN (${placeholders}) ORDER BY level DESC, xp DESC LIMIT 10`,
                ...slicedIds
            );

            const lines: string[] = [];
            for (let i = 0; i < users.length; i++) {
                const user = await interaction.client.users.fetch(users[i].user_id).catch(() => null);
                const name = user ? user.username : `Unknown Operative [${users[i].user_id}]`;
                lines.push(`${rank(i)} **${name}** — Level \`${users[i].level}\` · \`${users[i].xp} XP\``);
            }

            await interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setTitle(`📊 SECTOR LEADERBOARD: ${interaction.guild!.name.toUpperCase()}`)
                    .setColor(THEME.PRIMARY)
                    .setDescription(lines.length > 0 ? lines.join('\n') : 'No intelligence data recorded for this sector yet.')
                    .setFooter({ text: `Astra Intelligence System • ${VERSION} ${PROTOCOL}` })
                    .setTimestamp()]
            });

        } else if (subcommand === 'global') {
            const users = await db.fetchAll(
                'SELECT user_id, level, xp FROM users ORDER BY level DESC, xp DESC LIMIT 10'
            );

            const lines: string[] = [];
            for (let i = 0; i < users.length; i++) {
                const user = await interaction.client.users.fetch(users[i].user_id).catch(() => null);
                const name = user ? user.username : `Unknown Operative [${users[i].user_id}]`;
                lines.push(`${rank(i)} **${name}** — Level \`${users[i].level}\` · \`${users[i].xp} XP\``);
            }

            await interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setTitle('🌎 GLOBAL NETWORK RANKINGS')
                    .setColor(THEME.ACCENT)
                    .setDescription(lines.length > 0 ? lines.join('\n') : 'No global network data found.')
                    .setFooter({ text: `Astra Global Intelligence • ${VERSION} ${PROTOCOL}` })
                    .setTimestamp()]
            });

        } else if (subcommand === 'wealth') {
            const users = await db.fetchAll(
                'SELECT user_id, balance FROM users ORDER BY balance DESC LIMIT 10'
            );

            const lines: string[] = [];
            for (let i = 0; i < users.length; i++) {
                const user = await interaction.client.users.fetch(users[i].user_id).catch(() => null);
                const name = user ? user.username : `Unknown Operative [${users[i].user_id}]`;
                lines.push(`${rank(i)} **${name}** — \`${(users[i].balance || 0).toLocaleString()} cr\``);
            }

            await interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setTitle('💰 GLOBAL FISCAL LEADERBOARD')
                    .setColor(0x2ecc71)
                    .setDescription(lines.length > 0 ? lines.join('\n') : 'No fiscal data found.')
                    .setFooter({ text: `Astra Fiscal Network • ${VERSION} ${PROTOCOL}` })
                    .setTimestamp()]
            });
        }
    }
};

export default command;
