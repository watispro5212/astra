import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import { ReminderService } from '../services/reminderService';
import { Command } from '../types';
import { THEME } from '../core/constants';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('utility')
        .setDescription('🛠️ Useful tools like reminders and polls.')
        .setDMPermission(false)
        .addSubcommand(sub =>
            sub.setName('ping')
                .setDescription('🏓 Check how fast the bot is.')
        )
        .addSubcommand(sub =>
            sub.setName('remind')
                .setDescription('🔔 Set a reminder for yourself.')
                .addStringOption(opt => opt.setName('time').setDescription('Time in minutes (e.g. 10)').setRequired(true))
                .addStringOption(opt => opt.setName('message').setDescription('What should I remind you about?').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('poll')
                .setDescription('📊 Start a poll for everyone to vote.')
                .addStringOption(opt => opt.setName('question').setDescription('The question you want to ask.').setRequired(true))
                .addStringOption(opt => opt.setName('options').setDescription('The choices (separate with commas).').setRequired(true))
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'ping') {
            const sent = await interaction.reply({ content: '🏓 **Pinging...**', fetchReply: true, flags: [MessageFlags.Ephemeral] });
            const latency = sent.createdTimestamp - interaction.createdTimestamp;
            
            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle('🏓 PING')
                .addFields(
                    { name: '🔌 WebSocket', value: `\`${interaction.client.ws.ping}ms\``, inline: true },
                    { name: '🌐 API Speed', value: `\`${latency}ms\``, inline: true }
                )
                .setFooter({ text: `Everything is running smoothly` });

            await interaction.editReply({ content: null, embeds: [embed] });

        } else if (subcommand === 'remind') {
            const timeStr = interaction.options.getString('time')!;
            const message = interaction.options.getString('message')!;
            
            const minutes = parseInt(timeStr);
            if (isNaN(minutes) || minutes < 1) {
                return interaction.reply({ content: '❌ **Invalid time**: Please use a positive number for minutes.', flags: [MessageFlags.Ephemeral] });
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
                .setColor(THEME.SUCCESS)
                .setTitle('🔔 REMINDER SET!')
                .setDescription(`I'll remind you in **${minutes} minutes**.`)
                .addFields({ name: '📝 Message', value: `\`\`\`${message}\`\`\`` })
                .setFooter({ text: `Reminder for ${remindAt.toLocaleTimeString()}` });

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'poll') {
            const question = interaction.options.getString('question')!;
            const optionsStr = interaction.options.getString('options')!;
            const options = optionsStr.split(',').map(o => o.trim()).filter(o => o.length > 0);

            if (options.length < 2 || options.length > 10) {
                return interaction.reply({ content: '❌ **Error**: Polls need between 2 and 10 options.', flags: [MessageFlags.Ephemeral] });
            }

            const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
            let description = '';
            for (let i = 0; i < options.length; i++) {
                description += `${emojis[i]} **${options[i]}**\n`;
            }

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle(`📊 POLL: ${question.toUpperCase()}`)
                .setDescription(description)
                .setFooter({ text: `Started by ${interaction.user.username}` })
                .setTimestamp();

            const pollMessage = await interaction.reply({ embeds: [embed], fetchReply: true });
            for (let i = 0; i < options.length; i++) {
                await pollMessage.react(emojis[i]);
            }
        }
    }
};

export default command;
