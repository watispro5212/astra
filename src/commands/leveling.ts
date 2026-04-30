import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';
import { config } from '../core/config';
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
        .setDescription('📊 Check your level and server rankings.')
        .setDMPermission(false)
        .addSubcommand(sub =>
            sub.setName('rank')
               .setDescription('📈 See your level and how much XP you have.')
               .addUserOption(opt => opt.setName('user').setDescription('The user you want to check.'))
        )
        .addSubcommand(sub =>
            sub.setName('leaderboard')
               .setDescription('🏆 See the top 15 players on the server.')
        )
        .addSubcommand(sub =>
            sub.setName('setxp')
               .setDescription('⚙️ Set a user\'s XP (Admin only).')
               .addUserOption(opt => opt.setName('user').setDescription('The user to change.').setRequired(true))
               .addIntegerOption(opt => opt.setName('xp').setDescription('XP amount to set.').setRequired(true).setMinValue(0))
        )
        .addSubcommand(sub =>
            sub.setName('setlevel')
               .setDescription('⚙️ Set a user\'s level (Admin only).')
               .addUserOption(opt => opt.setName('user').setDescription('The user to change.').setRequired(true))
               .addIntegerOption(opt => opt.setName('level').setDescription('Level to set.').setRequired(true).setMinValue(0))
        )
        .addSubcommand(sub =>
            sub.setName('reset')
               .setDescription('🗑️ Reset a user\'s level and XP to zero (Admin only).')
               .addUserOption(opt => opt.setName('user').setDescription('The user to reset.').setRequired(true))
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const sub = interaction.options.getSubcommand();

        // ── RANK ──────────────────────────────────────────────────────────────
        if (sub === 'rank') {
            await interaction.deferReply();
            const target = interaction.options.getUser('user') || interaction.user;
            
            // Fetch rank and stats
            const data = await db.fetchOne(`
                SELECT xp, level, 
                (SELECT COUNT(*) + 1 FROM users WHERE level > u.level OR (level = u.level AND xp > u.xp)) as position,
                (SELECT COUNT(*) FROM users) as total
                FROM users u WHERE user_id = ?`, target.id);

            if (!data) {
                return interaction.editReply({ content: '❌ **ERROR**: No data found for this user. They need to talk more to get XP!' });
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
                .setTitle('📈 YOUR RANK')
                .setThumbnail(target.displayAvatarURL({ size: 256 }))
                .addFields(
                    { name: '⭐ Level',         value: `\`${level}\``,                           inline: true },
                    { name: '🏅 Server Rank',   value: `\`#${position} / ${total}\``,            inline: true },
                    { name: '🔢 Total XP',      value: `\`${cumXp.toLocaleString()} XP\``,       inline: true },
                    { name: '📊 Progress',      value: `\`[${bar}]\`\n\`${xp.toLocaleString()} / ${needed.toLocaleString()} XP\``, inline: false },
                )
                .setFooter({ text: `Astra Levels` })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });

        // ── LEADERBOARD ───────────────────────────────────────────────────────
        } else if (sub === 'leaderboard') {
            await interaction.deferReply();
            const top = await db.fetchAll('SELECT user_id, xp, level FROM users ORDER BY level DESC, xp DESC LIMIT 15');

            if (!top || top.length === 0) {
                return interaction.editReply({ content: '❌ No leveling data available yet.' });
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
                .setTitle('🏆 LEADERBOARD — TOP 15')
                .setDescription(lines.join('\n'))
                .setFooter({ text: `Astra Levels` })
                .setTimestamp()] });

        // ── SETXP ─────────────────────────────────────────────────────────────
        } else if (sub === 'setxp') {
            if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: '❌ You need to be an Admin to do this.', ephemeral: true });
            }
            const target = interaction.options.getUser('user')!;
            const xp     = interaction.options.getInteger('xp')!;

            await db.execute(
                'INSERT INTO users (user_id, xp) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET xp = ?',
                target.id, xp, xp
            );

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('⚙️ XP UPDATED')
                .setDescription(`Set **${target.username}**'s XP to \`${xp.toLocaleString()}\`.`)
                .setFooter({ text: `Bot Settings` })] });

        // ── SETLEVEL ──────────────────────────────────────────────────────────
        } else if (sub === 'setlevel') {
            if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: '❌ You need to be an Admin to do this.', ephemeral: true });
            }
            const target = interaction.options.getUser('user')!;
            const level  = interaction.options.getInteger('level')!;

            await db.execute(
                'INSERT INTO users (user_id, level, xp) VALUES (?, ?, 0) ON CONFLICT(user_id) DO UPDATE SET level = ?, xp = 0',
                target.id, level, level
            );

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('⚙️ LEVEL UPDATED')
                .setDescription(`Set **${target.username}**'s level to \`${level}\` (XP reset to 0).`)
                .setFooter({ text: `Bot Settings` })] });

        // ── RESET ─────────────────────────────────────────────────────────────
        } else if (sub === 'reset') {
            if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: '❌ You need to be an Admin to do this.', ephemeral: true });
            }

            if (interaction.user.id === config.ownerId || interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
                const target = interaction.options.getUser('user')!;
                await db.execute(
                    'INSERT INTO users (user_id, xp, level) VALUES (?, 0, 0) ON CONFLICT(user_id) DO UPDATE SET xp = 0, level = 0',
                    target.id
                );

                return interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(0xe74c3c)
                    .setTitle('🗑️ LEVEL RESET')
                    .setDescription(`Reset **${target.username}**'s XP and level to zero.`)
                    .setFooter({ text: `Bot Settings` })] });
            }
        }
    }
};

export default command;
