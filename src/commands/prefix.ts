import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';
import { THEME, VERSION } from '../core/constants';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('prefix')
        .setDescription('🛠️ Configure the tactical command prefix for this sector.')
        .addStringOption(opt => 
            opt.setName('new_prefix')
               .setDescription('The new character to use for message-based commands.')
               .setRequired(true)
               .setMaxLength(3)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: ChatInputCommandInteraction) {
        const newPrefix = interaction.options.getString('new_prefix')!;
        const guildId = interaction.guildId!;

        await db.execute(
            'INSERT INTO guilds (guild_id, prefix) VALUES (?, ?) ON CONFLICT(guild_id) DO UPDATE SET prefix = ?',
            guildId, newPrefix, newPrefix
        );

        const embed = new EmbedBuilder()
            .setColor(THEME.SUCCESS)
            .setTitle('📡 PREFIX CONFIGURATION UPDATED')
            .setDescription(`The tactical command prefix for this sector has been recalibrated to: \`${newPrefix}\``)
            .addFields(
                { name: '🛠️ Command Format', value: `\`${newPrefix}help\``, inline: true },
                { name: '🔒 Security', value: 'Administrator authorization confirmed.', inline: true }
            )
            .setFooter({ text: `Astra System Configuration • ${VERSION}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
    }
};

export default command;
