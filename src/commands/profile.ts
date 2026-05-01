import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    MessageFlags
} from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';
import { THEME, footerText } from '../core/constants';

function xpForLevel(level: number): number { return 25 * level * level + 250 * level + 500; }
function totalXp(level: number, xp: number): number {
    let t = Number(xp);
    for (let l = 0; l < level; l++) t += xpForLevel(l);
    return t;
}
function rankBadge(level: number): string {
    if (level >= 100) return '🏆 Legendary';
    if (level >= 50)  return '💎 Diamond';
    if (level >= 25)  return '🥇 Gold';
    if (level >= 10)  return '🥈 Silver';
    if (level >= 5)   return '🥉 Bronze';
    return '🔰 Newcomer';
}

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('👤 View your full Astra profile — economy, leveling, and syndicate.')
        .setDMPermission(true)
        .addUserOption(opt => opt.setName('target').setDescription('The user to view.')),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const user   = interaction.options.getUser('target') || interaction.user;
        const userId = user.id;

        const [ecoData, memberInfo] = await Promise.all([
            db.fetchOne(
                'SELECT balance, bank_balance, level, xp, total_earned, daily_streak FROM users WHERE user_id = ?',
                userId
            ),
            db.fetchOne('SELECT syndicate_id FROM syndicate_members WHERE user_id = ?', userId),
        ]);

        const eco = ecoData ?? { balance: 0, bank_balance: 0, level: 0, xp: 0, total_earned: 0, daily_streak: 0 };
        const level    = Number(eco.level   || 0);
        const xp       = Number(eco.xp      || 0);
        const balance  = Number(eco.balance      || 0);
        const bank     = Number(eco.bank_balance  || 0);
        const earned   = Number(eco.total_earned  || 0);
        const streak   = Number(eco.daily_streak  || 0);
        const netWorth = balance + bank;
        const cumXp    = totalXp(level, xp);
        const needed   = xpForLevel(level);
        const pct      = Math.min(100, Math.floor((xp / needed) * 100));
        const filled   = Math.min(12, Math.max(0, Math.round((pct / 100) * 12)));
        const bar      = `${'█'.repeat(filled)}${'░'.repeat(12 - filled)}`;

        let syndicateName = 'None';
        if (memberInfo) {
            const syn = await db.fetchOne('SELECT name FROM syndicates WHERE id = ?', memberInfo.syndicate_id);
            if (syn) syndicateName = syn.name;
        }

        const embed = new EmbedBuilder()
            .setColor(THEME.ACCENT)
            .setAuthor({ name: `${user.username}'s Profile`, iconURL: user.displayAvatarURL() })
            .setTitle(`${rankBadge(level)}`)
            .setThumbnail(user.displayAvatarURL({ size: 256 }))
            .addFields(
                // ── Leveling ────────────────────────────────────────────
                { name: '⭐ Level',        value: `\`${level}\``,                           inline: true },
                { name: '🔢 Total XP',     value: `\`${cumXp.toLocaleString()} XP\``,        inline: true },
                { name: '📊 XP Progress',  value: `\`${xp.toLocaleString()} / ${needed.toLocaleString()}\``, inline: true },
                { name: `Progress — ${pct}%`, value: `\`[${bar}]\``,                       inline: false },
                // ── Economy ─────────────────────────────────────────────
                { name: '💰 Cash',         value: `\`${balance.toLocaleString()}\``,         inline: true },
                { name: '🏦 Bank',         value: `\`${bank.toLocaleString()}\``,            inline: true },
                { name: '💎 Net Worth',    value: `\`${netWorth.toLocaleString()}\``,         inline: true },
                { name: '📈 Total Earned', value: `\`${earned.toLocaleString()}\``,          inline: true },
                { name: '🔥 Daily Streak', value: `\`${streak} day${streak !== 1 ? 's' : ''}\``, inline: true },
                // ── Social ───────────────────────────────────────────────
                { name: '🏛️ Syndicate',   value: `\`${syndicateName}\``,                    inline: true },
            )
            .setFooter({ text: footerText('Profile') })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};

export default command;
