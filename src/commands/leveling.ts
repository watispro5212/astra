import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('leveling')
        .setDescription('📊 Astra Intelligence Matrix — Progression & Global Rankings.')
        .addSubcommand(sub =>
            sub.setName('rank')
                .setDescription('View your tactical rank and XP progression.')
                .addUserOption(opt => opt.setName('user').setDescription('Target operative.'))
        )
        .addSubcommand(sub =>
            sub.setName('leaderboard')
                .setDescription('View the top 10 operatives by intelligence level.')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'rank') {
            const target = interaction.options.getUser('user') || interaction.user;
            const data = await db.fetchOne('SELECT xp, level FROM users WHERE user_id = ?', target.id);

            if (!data) {
                await interaction.reply({ content: '❌ No tactical data found for this operative.', ephemeral: true });
                return;
            }

            const xpToNext = (data.level + 1) * 500;
            const progress = Math.min(Math.floor((data.xp / xpToNext) * 100), 100);
            const filled = Math.round(progress / 10);
            const bar = `${'█'.repeat(filled)}${'░'.repeat(10 - filled)}`;

            const embed = new EmbedBuilder()
                .setColor(0x9b59b6)
                .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL() })
                .setTitle('📈 Intelligence Rank')
                .addFields(
                    { name: 'Level', value: `\`Level ${data.level}\``, inline: true },
                    { name: 'Experience', value: `\`${data.xp} / ${xpToNext} XP\``, inline: true },
                    { name: 'Progress', value: `\`[${bar}] ${progress}%\``, inline: false }
                )
                .setFooter({ text: 'Astra Intelligence Matrix • v7.0.0' });

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'leaderboard') {
            await interaction.deferReply();
            const top = await db.fetchAll(
                'SELECT user_id, xp, level FROM users ORDER BY level DESC, xp DESC LIMIT 10'
            );

            if (!top || top.length === 0) {
                await interaction.editReply({ content: '❌ No intelligence data available yet.' });
                return;
            }

            const medals = ['🥇', '🥈', '🥉'];
            let description = '';
            for (let i = 0; i < top.length; i++) {
                const entry = top[i];
                const prefix = medals[i] || `**${i + 1}.**`;
                let username = `User ${entry.user_id}`;
                try {
                    const u = await interaction.client.users.fetch(entry.user_id);
                    username = u.username;
                } catch (_) {}
                description += `${prefix} **${username}** — Level \`${entry.level}\` · \`${entry.xp} XP\`\n`;
            }

            await interaction.editReply({ embeds: [new EmbedBuilder()
                .setColor(0x9b59b6)
                .setTitle('🏆 Intelligence Leaderboard')
                .setDescription(description)
                .setFooter({ text: 'Astra Intelligence Matrix • Top 10 Operatives' })
                .setTimestamp()] });
        }
    }
};

export default command;
