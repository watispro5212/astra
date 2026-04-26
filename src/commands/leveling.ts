import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';
import { config } from '../core/config';

const VER = 'v7.5.0';

// XP required to reach level N+1
function xpForLevel(level: number): number {
    return (level + 1) * 500;
}

// Calculate total XP across all levels
function totalXp(level: number, currentXp: number): number {
    let total = Number(currentXp);
    for (let l = 0; l < level; l++) total += xpForLevel(l);
    return total;
}

function xpBar(xp: number, needed: number): string {
    const pct    = Math.min(Math.floor((Number(xp) / needed) * 100), 100);
    const filled = Math.round(pct / 10);
    return `${'█'.repeat(filled)}${'░'.repeat(10 - filled)} ${pct}%`;
}

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('leveling')
        .setDescription('📊 Astra Intelligence Matrix — Progression & Global Rankings.')
        .addSubcommand(sub =>
            sub.setName('rank')
               .setDescription('📈 View your tactical rank and XP progression.')
               .addUserOption(opt => opt.setName('user').setDescription('Target operative.'))
        )
        .addSubcommand(sub =>
            sub.setName('leaderboard')
               .setDescription('🏆 View the top 15 operatives by intelligence level.')
        )
        .addSubcommand(sub =>
            sub.setName('setxp')
               .setDescription('⚙️ Manually set XP for an operative (Admin only).')
               .addUserOption(opt => opt.setName('user').setDescription('Target operative.').setRequired(true))
               .addIntegerOption(opt => opt.setName('xp').setDescription('XP amount to set.').setRequired(true).setMinValue(0))
        )
        .addSubcommand(sub =>
            sub.setName('setlevel')
               .setDescription('⚙️ Manually set level for an operative (Admin only).')
               .addUserOption(opt => opt.setName('user').setDescription('Target operative.').setRequired(true))
               .addIntegerOption(opt => opt.setName('level').setDescription('Level to set.').setRequired(true).setMinValue(0))
        )
        .addSubcommand(sub =>
            sub.setName('reset')
               .setDescription('🗑️ Reset an operative\'s XP and level to zero (Admin only).')
               .addUserOption(opt => opt.setName('user').setDescription('Target operative.').setRequired(true))
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const sub = interaction.options.getSubcommand();

        // ── RANK ──────────────────────────────────────────────────────────────
        if (sub === 'rank') {
            await interaction.deferReply();
            const target = interaction.options.getUser('user') || interaction.user;
            
            // Optimization: Fetch rank and stats in a single tactical sweep
            const data = await db.fetchOne(`
                SELECT xp, level, 
                (SELECT COUNT(*) + 1 FROM users WHERE level > u.level OR (level = u.level AND xp > u.xp)) as position,
                (SELECT COUNT(*) FROM users) as total
                FROM users u WHERE user_id = ?`, target.id);

            if (!data) {
                return interaction.editReply({ content: '❌ **INTELLIGENCE GAP**: No tactical data found for this operative. Active participation required for matrix registration.' });
            }

            // Ensure BigInt/Strings from Postgres are converted to Numbers
            const level    = Number(data.level);
            const xp       = Number(data.xp);
            const position = Number(data.position);
            const total    = Number(data.total);

            const needed   = xpForLevel(level);
            const bar      = xpBar(xp, needed);
            const cumXp    = totalXp(level, xp);

            const embed = new EmbedBuilder()
                .setColor(0x9b59b6)
                .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL() })
                .setTitle('📈 INTELLIGENCE RANK FILE')
                .setThumbnail(target.displayAvatarURL({ size: 256 }))
                .addFields(
                    { name: '⭐ Level',         value: `\`${level}\``,                           inline: true },
                    { name: '🏅 Sector Rank',   value: `\`#${position} / ${total}\``,            inline: true },
                    { name: '🔢 Total XP',      value: `\`${cumXp.toLocaleString()} XP\``,       inline: true },
                    { name: '📊 Matrix Progression', value: `\`[${bar}]\`\n\`${xp.toLocaleString()} / ${needed.toLocaleString()} XP\``, inline: false },
                )
                .setFooter({ text: `Astra Intelligence Matrix • v7.5.0` })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });

        // ── LEADERBOARD ───────────────────────────────────────────────────────
        } else if (sub === 'leaderboard') {
            await interaction.deferReply();
            const top = await db.fetchAll('SELECT user_id, xp, level FROM users ORDER BY level DESC, xp DESC LIMIT 15');

            if (!top || top.length === 0) {
                return interaction.editReply({ content: '❌ No intelligence data available yet.' });
            }

            const medals = ['👑', '🥈', '🥉'];
            
            // Parallel fetch for optimal performance
            const lines = await Promise.all(top.map(async (entry, i) => {
                let username = `User ${entry.user_id}`;
                try {
                    const u = await interaction.client.users.fetch(entry.user_id);
                    username = u.username;
                } catch (_) {}

                const cumXp = totalXp(entry.level, entry.xp);
                const prefix = medals[i] ?? `\`${i + 1}.\``;
                return `${prefix} **${username}** — Level \`${entry.level}\` · \`${cumXp.toLocaleString()} XP\``;
            }));

            return interaction.editReply({ embeds: [new EmbedBuilder()
                .setColor(0x9b59b6)
                .setTitle('🏆 INTELLIGENCE LEADERBOARD — TOP 15')
                .setDescription(lines.join('\n'))
                .setFooter({ text: `Astra Intelligence Matrix • ${VER}` })
                .setTimestamp()] });

        // ── SETXP ─────────────────────────────────────────────────────────────
        } else if (sub === 'setxp') {
            if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: '❌ Administrator clearance required.', ephemeral: true });
            }
            const target = interaction.options.getUser('user')!;
            const xp     = interaction.options.getInteger('xp')!;

            await db.execute(
                'INSERT INTO users (user_id, xp) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET xp = ?',
                target.id, xp, xp
            );

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('⚙️ XP OVERRIDE')
                .setDescription(`Set **${target.username}**'s XP to \`${xp.toLocaleString()}\`.`)
                .setFooter({ text: `Astra Admin Tools • ${VER}` })] });

        // ── SETLEVEL ──────────────────────────────────────────────────────────
        } else if (sub === 'setlevel') {
            if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: '❌ Administrator clearance required.', ephemeral: true });
            }
            const target = interaction.options.getUser('user')!;
            const level  = interaction.options.getInteger('level')!;

            await db.execute(
                'INSERT INTO users (user_id, level, xp) VALUES (?, ?, 0) ON CONFLICT(user_id) DO UPDATE SET level = ?, xp = 0',
                target.id, level, level
            );

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('⚙️ LEVEL OVERRIDE')
                .setDescription(`Set **${target.username}**'s level to \`${level}\` (XP reset to 0).`)
                .setFooter({ text: `Astra Admin Tools • ${VER}` })] });

        // ── RESET ─────────────────────────────────────────────────────────────
        } else if (sub === 'reset') {
            if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: '❌ Administrator clearance required.', ephemeral: true });
            }

            if (interaction.user.id === config.ownerId || interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
                const target = interaction.options.getUser('user')!;
                await db.execute(
                    'INSERT INTO users (user_id, xp, level) VALUES (?, 0, 0) ON CONFLICT(user_id) DO UPDATE SET xp = 0, level = 0',
                    target.id
                );

                return interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(0xe74c3c)
                    .setTitle('🗑️ INTELLIGENCE RESET')
                    .setDescription(`Reset **${target.username}**'s XP and level to zero.`)
                    .setFooter({ text: `Astra Admin Tools • ${VER}` })] });
            }
        }
    }
};

export default command;
