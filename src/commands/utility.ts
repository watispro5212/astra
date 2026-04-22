import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ReminderService } from '../services/reminderService';
import { Command } from '../types';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('utility')
        .setDescription('🚀 Essential system utilities.')
        .addSubcommand(sub =>
            sub.setName('remind')
                .setDescription('Set a personal temporal reminder.')
                .addStringOption(opt => opt.setName('time').setDescription('Time in minutes (e.g. 10)').setRequired(true))
                .addStringOption(opt => opt.setName('message').setDescription('Reminder content.').setRequired(true))
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'remind') {
            const timeStr = interaction.options.getString('time')!;
            const message = interaction.options.getString('message')!;
            
            const minutes = parseInt(timeStr);
            if (isNaN(minutes) || minutes < 1) {
                await interaction.reply({ content: '❌ Invalid Time: Please specify a valid number of minutes.', ephemeral: true });
                return;
            }

            const remindAt = new Date(Date.now() + minutes * 60000);
            
            await ReminderService.createReminder(
                interaction.guildId,
                interaction.channelId,
                interaction.user.id,
                message,
                remindAt
            );

            const embed = new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('🔔 Reminder Synchronized')
                .setDescription(`I will remind you in **${minutes} minutes**.`)
                .addFields({ name: 'Transmission', value: message })
                .setTimestamp(remindAt);

            await interaction.reply({ embeds: [embed] });
        }
    }
};

export default command;
