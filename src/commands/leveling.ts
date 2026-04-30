import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';
import { THEME } from '../core/constants';

// Must match bot.ts XP formula exactly
// Level 0→1: 500 XP | Level 5→6: 2375 XP | Level 10→11: 5500 XP
function xpForLevel(level: number): number {
    return 25 * level * level + 250 * level + 500;
}

// Cumulative XP earned across all completed levels + current progress
function totalXp(level: number, currentXp: number): number {
    let total = Number(currentXp);
    for (let l = 0; l < level; l++) total += xpForLevel(l);
    return total;
}

function xpBar(xp: number, needed: number): string {
    const pct    = Math.min(Math.floor((Number(xp) / Math.max(needed, 1)) * 100), 100);
    const filled = Math.min(10, Math.max(0, Math.round(pct / 10)));
    return `${'█'.repeat(filled)}${'░'.repeat(10 - filled)} ${pct}%`;
}

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('leveling')
        .setDescription('📊 XP levels and server rankings.')
        .setDMPermission(true)
        .addSubcommand(sub =>
            sub.setName('rank')
               .setDescription('📈 See your level and XP progress.')
               .addUserOption(opt => opt.setName('user').setDescription('The user to check.'))
        )
        .addSubcommand(sub =>
            sub.setName('leaderboard')
               .setDescription('🏆 Top 15 players by level.')
        )
        .addSubcommand(sub =>
            sub.setName('setxp')
               .setDescription('⚙️ Set a user\'s XP. (Admin only)')
               .addUserOption(opt => opt.setName('user').setDescription('Target user.').setRequired(true))
               .addIntegerOption(opt => opt.setName('xp').setDescription('XP amount.').setRequired(true).setMinValue(0))
        )
        .addSubcommand(sub =>
            sub.setName('setlevel')
               .setDescription('⚙️ Set a user\'s level. (Admin only)')
               .addUserOption(opt => opt.setName('user').setDescription('Target user.').setRequired(true))
               .addIntegerOption(opt => opt.setName('level').setDescription('Level to set.').setRequired(true).setMinValue(0))
        )
        .addSubcommand(sub =>
            sub.setName('reset')
               .setDescription('🗑️ Reset a user\'s level and XP to zero. (Admin only)')
               .addUserOption(opt => opt.setName('user').setDescription('Target user.').setRequired(true))
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const sub   = interaction.options.getSubcommand();
        const guild = interaction.guild;

        // ── RANK ──────────────────────────────────────────────────────────────
        if (sub === 'rank') {
            await interaction.deferReply();
            const target = interaction.options.getUser('user') || interaction.user;

            const data = await db.fetchOne(`
                SELECT xp, level,
                (SELECT COUNT(*) + 1 FROM users WHERE level > u.level OR (level = u.level AND xp > u.xp)) AS position,
                (SELECT COUNT(*) FROM users) AS total
                FROM users u WHERE user_id = ?
            `, target.id);

            if (!data) {
                return interaction.editReply({ content: '❌ No XP data for that user yet — they need to chat first!' });
            }

            const level    = Number(data.level);
            const xp       = Number(data.xp);
            const position = Number(data.position);
            const total    = Number(data.total);
            const needed   = xpForLevel(level);
            const bar      = xpBar(xp, needed);
            const cumXp    = totalXp(level, xp);

            const embed = new EmbedBuilder()
                .setColor(0x9b59b6)
                .setAuthor({ name: target.username, iconURL: target.displayAvatarURL() })
                .setTitle('📈 RANK CARD')
                .setThumbnail(target.displayAvatarURL({ size: 256 }))
                .addFields(
                    { name: '⭐ Level',       value: `\`${level}\``,                           inline: true },
                    { name: '🏅 Global Rank', value: `\`#${position} / ${total}\``,            inline: true },
                    { name: '🔢 Total XP',    value: `\`${cumXp.toLocaleString()} XP\``,       inline: true },
                    { name: '📊 Progress',    value: `\`[${bar}]\`\n\`${xp.toLocaleString()} / ${needed.toLocaleString()} XP to Level ${level + 1}\``, inline: false },
                )
                .setFooter({ text: `Astra Levels • XP resets per level` })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });

        // ── LEADERBOARD ───────────────────────────────────────────────────────
        } else if (sub === 'leaderboard') {
            await interaction.deferReply();
            const top = await db.fetchAll('SELECT user_id, xp, level FROM users ORDER BY level DESC, xp DESC LIMIT 15');

            if (!top || top.length === 0) {
                return interaction.editReply({ content: '❌ No leveling data yet — start chatting!' });
            }

            const medals = ['👑', '🥈', '🥉'];

            const lines = await Promise.all(top.map(async (entry, i) => {
                let username = `User ${entry.user_id}`;
                try {
                    const u = await interaction.client.users.fetch(entry.user_id);
                    username = u.username;
                } catch (_) {}

                const cumXp  = totalXp(Number(entry.level), Number(entry.xp));
                const prefix = medals[i] ?? `\`${i + 1}.\``;
                return `${prefix} **${username}** — Level \`${entry.level}\` · \`${cumXp.toLocaleString()} XP\``;
            }));

            return interaction.editReply({ embeds: [new EmbedBuilder()
                .setColor(0x9b59b6)
                .setTitle('🏆 XP LEADERBOARD — TOP 15')
                .setDescription(lines.join('\n'))
                .setFooter({ text: `Astra Levels` })
                .setTimestamp()] });

        // ── SETXP ─────────────────────────────────────────────────────────────
        } else if (sub === 'setxp') {
            if (!guild) return interaction.reply({ content: '❌ This command only works in a server.', ephemeral: true });
            if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: '❌ You need Administrator to use this.', ephemeral: true });
            }

            const target = interaction.options.getUser('user')!;
            const xp     = interaction.options.getInteger('xp')!;

            await db.execute(
                'INSERT INTO users (user_id, xp) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET xp = ?',
                target.id, xp, xp
            );

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(THEME.SUCCESS)
                .setTitle('⚙️ XP UPDATED')
                .setDescription(`Set **${target.username}**'s XP to \`${xp.toLocaleString()}\`.`)
                .setFooter({ text: `Astra Admin` })], ephemeral: true });

        // ── SETLEVEL ──────────────────────────────────────────────────────────
        } else if (sub === 'setlevel') {
            if (!guild) return interaction.reply({ content: '❌ This command only works in a server.', ephemeral: true });
            if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: '❌ You need Administrator to use this.', ephemeral: true });
            }

            const target = interaction.options.getUser('user')!;
            const level  = interaction.options.getInteger('level')!;

            await db.execute(
                'INSERT INTO users (user_id, level, xp) VALUES (?, ?, 0) ON CONFLICT(user_id) DO UPDATE SET level = ?, xp = 0',
                target.id, level, level
            );

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(THEME.SUCCESS)
                .setTitle('⚙️ LEVEL UPDATED')
                .setDescription(`Set **${target.username}**'s level to \`${level}\` (XP reset to 0).`)
                .setFooter({ text: `Astra Admin` })], ephemeral: true });

        // ── RESET ─────────────────────────────────────────────────────────────
        } else if (sub === 'reset') {
            if (!guild) return interaction.reply({ content: '❌ This command only works in a server.', ephemeral: true });
            if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: '❌ You need Administrator to use this.', ephemeral: true });
            }

            const target = interaction.options.getUser('user')!;

            await db.execute(
                'INSERT INTO users (user_id, xp, level) VALUES (?, 0, 0) ON CONFLICT(user_id) DO UPDATE SET xp = 0, level = 0',
                target.id
            );

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(THEME.DANGER)
                .setTitle('🗑️ LEVEL RESET')
                .setDescription(`Reset **${target.username}**'s XP and level to zero.`)
                .setFooter({ text: `Astra Admin` })], ephemeral: true });
        }
    }
};

export default command;
