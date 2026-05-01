import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    MessageFlags
} from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';
import { config } from '../core/config';
import { THEME, footerText } from '../core/constants';

// Must match bot.ts XP formula exactly
// Level 0→1: 500 XP | Level 5→6: 2375 XP | Level 10→11: 5500 XP
function xpForLevel(level: number): number {
    return 25 * level * level + 250 * level + 500;
}

// Cumulative XP across all completed levels + current progress
function totalXp(level: number, currentXp: number): number {
    let total = Number(currentXp);
    for (let l = 0; l < level; l++) total += xpForLevel(l);
    return total;
}

// Progress bar — always safe
function xpBar(xp: number, needed: number, size = 14): string {
    const pct    = Math.min(Math.floor((Number(xp) / Math.max(needed, 1)) * 100), 100);
    const filled = Math.min(size, Math.max(0, Math.round((pct / 100) * size)));
    return `${'█'.repeat(filled)}${'░'.repeat(size - filled)}`;
}

// Rank badge based on level
function rankBadge(level: number): string {
    if (level >= 100) return '🏆';
    if (level >= 50)  return '💎';
    if (level >= 25)  return '🥇';
    if (level >= 10)  return '🥈';
    if (level >= 5)   return '🥉';
    return '🔰';
}

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('leveling')
        .setDescription('📊 XP levels and server rankings.')
        .setDMPermission(true)
        .addSubcommand(sub =>
            sub.setName('rank')
               .setDescription('📈 View your level, XP progress, and global rank.')
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

        // ── RANK ──────────────────────────────────────────────────────────
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
                return interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor(THEME.DANGER)
                        .setTitle('❌ No Data')
                        .setDescription(`**${target.username}** hasn't earned any XP yet — they need to chat in a server first!`)
                        .setFooter({ text: footerText('Leveling') })]
                });
            }

            const level    = Number(data.level);
            const xp       = Number(data.xp);
            const position = Number(data.position);
            const total    = Number(data.total);
            const needed   = xpForLevel(level);
            const cumXp    = totalXp(level, xp);
            const bar      = xpBar(xp, needed);
            const pct      = Math.floor((xp / needed) * 100);
            const badge    = rankBadge(level);

            const embed = new EmbedBuilder()
                .setColor(0x9b59b6)
                .setAuthor({ name: target.username, iconURL: target.displayAvatarURL() })
                .setTitle(`${badge} Rank Card`)
                .setThumbnail(target.displayAvatarURL({ size: 256 }))
                .setDescription(
                    `**Level ${level}** — ${badge} ${level >= 5 ? `*${
                        level >= 100 ? 'Legendary' :
                        level >= 50  ? 'Diamond'   :
                        level >= 25  ? 'Gold'       :
                        level >= 10  ? 'Silver'     : 'Bronze'
                    }*` : '*Newcomer*'}`
                )
                .addFields(
                    { name: '🏅 Global Rank', value: `\`#${position}\` / \`${total}\``,        inline: true },
                    { name: '🔢 Total XP',    value: `\`${cumXp.toLocaleString()} XP\``,        inline: true },
                    { name: '⭐ Next Level',  value: `\`Level ${level + 1}\``,                   inline: true },
                    {
                        name: `📊 Progress to Level ${level + 1} — ${pct}%`,
                        value: `\`[${bar}]\`\n\`${xp.toLocaleString()} / ${needed.toLocaleString()} XP\``,
                        inline: false,
                    },
                )
                .setFooter({ text: footerText('Leveling') })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });

        // ── LEADERBOARD ───────────────────────────────────────────────────
        } else if (sub === 'leaderboard') {
            await interaction.deferReply();
            const top = await db.fetchAll(
                'SELECT user_id, xp, level FROM users ORDER BY level DESC, xp DESC LIMIT 15'
            );

            if (!top?.length) {
                return interaction.editReply({
                    content: '❌ No leveling data yet — start chatting to earn XP!'
                });
            }

            const TIER_ICONS = ['👑', '🥈', '🥉'];
            const lines = await Promise.all(
                top.map(async (entry, i) => {
                    let username = `User ${entry.user_id}`;
                    try {
                        const u = await interaction.client.users.fetch(entry.user_id);
                        username = u.username;
                    } catch (_) {}

                    const level  = Number(entry.level);
                    const cumXp  = totalXp(level, Number(entry.xp));
                    const prefix = TIER_ICONS[i] ?? `\`${i + 1}.\``;
                    const badge  = rankBadge(level);
                    return `${prefix} **${username}** ${badge} · Level \`${level}\` · \`${cumXp.toLocaleString()} XP\``;
                })
            );

            const embed = new EmbedBuilder()
                .setColor(0x9b59b6)
                .setTitle('🏆 XP Leaderboard — Top 15')
                .setDescription(lines.join('\n'))
                .setFooter({ text: footerText('Leaderboard') })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });

        // ── SETXP ─────────────────────────────────────────────────────────
        } else if (sub === 'setxp') {
            if (!guild) return interaction.reply({ content: '❌ Server only.', flags: [MessageFlags.Ephemeral] });
            if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: '❌ You need Administrator to use this.', flags: [MessageFlags.Ephemeral] });
            }

            const target = interaction.options.getUser('user')!;
            const xp     = interaction.options.getInteger('xp')!;

            await db.execute(
                'INSERT INTO users (user_id, xp) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET xp = ?',
                target.id, xp, xp
            );

            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(THEME.SUCCESS)
                    .setTitle('⚙️ XP Updated')
                    .setDescription(`Set **${target.username}**'s XP to \`${xp.toLocaleString()}\`.`)
                    .setThumbnail(target.displayAvatarURL())
                    .setFooter({ text: footerText('Admin · Leveling') })
                    .setTimestamp()],
                flags: [MessageFlags.Ephemeral]
            });

        // ── SETLEVEL ──────────────────────────────────────────────────────
        } else if (sub === 'setlevel') {
            if (!guild) return interaction.reply({ content: '❌ Server only.', flags: [MessageFlags.Ephemeral] });
            if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: '❌ You need Administrator to use this.', flags: [MessageFlags.Ephemeral] });
            }

            const target = interaction.options.getUser('user')!;
            const level  = interaction.options.getInteger('level')!;

            await db.execute(
                'INSERT INTO users (user_id, level, xp) VALUES (?, ?, 0) ON CONFLICT(user_id) DO UPDATE SET level = ?, xp = 0',
                target.id, level, level
            );

            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(THEME.SUCCESS)
                    .setTitle('⚙️ Level Updated')
                    .setDescription(`Set **${target.username}**'s level to \`${level}\` (XP reset to 0).`)
                    .setThumbnail(target.displayAvatarURL())
                    .setFooter({ text: footerText('Admin · Leveling') })
                    .setTimestamp()],
                flags: [MessageFlags.Ephemeral]
            });

        // ── RESET ─────────────────────────────────────────────────────────
        } else if (sub === 'reset') {
            if (!guild) return interaction.reply({ content: '❌ Server only.', flags: [MessageFlags.Ephemeral] });
            if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: '❌ You need Administrator to use this.', flags: [MessageFlags.Ephemeral] });
            }

            const target = interaction.options.getUser('user')!;

            await db.execute(
                'INSERT INTO users (user_id, xp, level) VALUES (?, 0, 0) ON CONFLICT(user_id) DO UPDATE SET xp = 0, level = 0',
                target.id
            );

            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(THEME.DANGER)
                    .setTitle('🗑️ Level Reset')
                    .setDescription(`Reset **${target.username}**'s XP and level to zero.`)
                    .setThumbnail(target.displayAvatarURL())
                    .setFooter({ text: footerText('Admin · Leveling') })
                    .setTimestamp()],
                flags: [MessageFlags.Ephemeral]
            });
        }
    }
};

export default command;
