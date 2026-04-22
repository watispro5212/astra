import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('📊 View your tactical progression.')
        .addUserOption(opt => opt.setName('user').setDescription('Target operative.')),

    async execute(interaction: ChatInputCommandInteraction) {
        const target = interaction.options.getUser('user') || interaction.user;
        const data = await db.fetchOne('SELECT xp, level FROM users WHERE user_id = ?', target.id);

        if (!data) {
            await interaction.reply({ content: '❌ No tactical data found for this operative.', ephemeral: true });
            return;
        }

        const xpToNext = (data.level + 1) * 500;
        const progress = Math.floor((data.xp / xpToNext) * 100);

        const embed = new EmbedBuilder()
            .setColor(0x9b59b6)
            .setAuthor({ name: target.tag, iconURL: target.displayAvatarURL() })
            .setTitle('📈 Tactical Rank')
            .addFields(
                { name: 'Current Level', value: `\`Level ${data.level}\``, inline: true },
                { name: 'Experience', value: `\`${data.xp} / ${xpToNext} XP\``, inline: true },
                { name: 'Progress', value: `\`${progress}%\``, inline: true }
            )
            .setFooter({ text: 'Astra Intelligence System' });

        await interaction.reply({ embeds: [embed] });
    }
};

export default command;
