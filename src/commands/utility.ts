import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import { ReminderService } from '../services/reminderService';
import { Command } from '../types';
import { THEME, VERSION, PROTOCOL } from '../core/constants';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('utility')
        .setDescription('🚀 Essential system utilities and diagnostics.')
        .setDMPermission(false)
        .addSubcommand(sub =>
            sub.setName('ping')
                .setDescription('📡 Measure WebSocket and API heartbeat.')
        )
        .addSubcommand(sub =>
            sub.setName('remind')
                .setDescription('🔔 Set a personal temporal reminder.')
                .addStringOption(opt => opt.setName('time').setDescription('Time in minutes (e.g. 10)').setRequired(true))
                .addStringOption(opt => opt.setName('message').setDescription('Reminder content.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('poll')
                .setDescription('📊 Initiate a tactical community poll.')
                .addStringOption(opt => opt.setName('question').setDescription('The inquiry to present.').setRequired(true))
                .addStringOption(opt => opt.setName('options').setDescription('Inquiry options (separated by commas).').setRequired(true))
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'ping') {
            const sent = await interaction.reply({ content: '📡 **ANALYZING HEARTBEAT...**', fetchReply: true, flags: [MessageFlags.Ephemeral] });
            const latency = sent.createdTimestamp - interaction.createdTimestamp;
            
            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle('🛰️ SYSTEM HEARTBEAT')
                .addFields(
                    { name: '🔌 WebSocket', value: `\`${interaction.client.ws.ping}ms\``, inline: true },
                    { name: '📡 API Latency', value: `\`${latency}ms\``, inline: true }
                )
                .setFooter({ text: `${PROTOCOL} Telemetry • ${VERSION} • All systems nominal` });

            await interaction.editReply({ content: null, embeds: [embed] });

        } else if (subcommand === 'remind') {
            const timeStr = interaction.options.getString('time')!;
            const message = interaction.options.getString('message')!;
            
            const minutes = parseInt(timeStr);
            if (isNaN(minutes) || minutes < 1) {
                return interaction.reply({ content: '❌ **INVALID TEMPORAL DATA**: Please specify a valid positive integer.', flags: [MessageFlags.Ephemeral] });
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
                .setTitle('🔔 REMINDER SYNCHRONIZED')
                .setDescription(`Temporal notification established. Alerting in **${minutes} minutes**.`)
                .addFields({ name: '📝 Transmission Content', value: `\`\`\`${message}\`\`\`` })
                .setFooter({ text: `Alert scheduled for ${remindAt.toLocaleTimeString()} • ${PROTOCOL}` });

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'poll') {
            const question = interaction.options.getString('question')!;
            const optionsStr = interaction.options.getString('options')!;
            const options = optionsStr.split(',').map(o => o.trim()).filter(o => o.length > 0);

            if (options.length < 2 || options.length > 10) {
                return interaction.reply({ content: '❌ **INVALID CONFIGURATION**: Polls require between 2 and 10 options.', flags: [MessageFlags.Ephemeral] });
            }

            const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
            let description = '';
            for (let i = 0; i < options.length; i++) {
                description += `${emojis[i]} **${options[i]}**\n`;
            }

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle(`📊 TACTICAL POLL: ${question.toUpperCase()}`)
                .setDescription(description)
                .setFooter({ text: `Inquiry authorized by ${interaction.user.username} • ${VERSION}` })
                .setTimestamp();

            const pollMessage = await interaction.reply({ embeds: [embed], fetchReply: true });
            for (let i = 0; i < options.length; i++) {
                await pollMessage.react(emojis[i]);
            }
        }
    }
};

export default command;
