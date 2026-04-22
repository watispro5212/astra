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
        )
        .addSubcommand(sub =>
            sub.setName('poll')
                .setDescription('Initiate a tactical community poll.')
                .addStringOption(opt => opt.setName('question').setDescription('The inquiry to present.').setRequired(true))
                .addStringOption(opt => opt.setName('options').setDescription('Inquiry options (separated by commas).').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('userinfo')
                .setDescription('Diagnostic report on an operative.')
                .addUserOption(opt => opt.setName('target').setDescription('The operative to analyze.').setRequired(false))
        )
        .addSubcommand(sub =>
            sub.setName('serverinfo')
                .setDescription('Telemetry analysis of the current sector.')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'remind') {
            // ... (existing remind code)
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

        } else if (subcommand === 'poll') {
            const question = interaction.options.getString('question')!;
            const optionsStr = interaction.options.getString('options')!;
            const options = optionsStr.split(',').map(o => o.trim()).filter(o => o.length > 0);

            if (options.length < 2 || options.length > 10) {
                await interaction.reply({ content: '❌ Invalid Configuration: Polls require between 2 and 10 options.', ephemeral: true });
                return;
            }

            const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
            let description = '';
            for (let i = 0; i < options.length; i++) {
                description += `${emojis[i]} ${options[i]}\n`;
            }

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle(`📊 Tactical Poll: ${question}`)
                .setDescription(description)
                .setFooter({ text: `Inquiry by ${interaction.user.tag}` })
                .setTimestamp();

            const message = await interaction.reply({ embeds: [embed], fetchReply: true });
            for (let i = 0; i < options.length; i++) {
                await message.react(emojis[i]);
            }
        } else if (subcommand === 'userinfo') {
            const user = interaction.options.getUser('target') || interaction.user;
            const member = await interaction.guild?.members.fetch(user.id);

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle(`👤 Operative Profile: ${user.username}`)
                .setThumbnail(user.displayAvatarURL({ size: 256 }))
                .addFields(
                    { name: '🆔 Identification', value: `\`${user.id}\``, inline: true },
                    { name: '🎖️ Rank', value: member?.roles.highest.name || 'Citizen', inline: true },
                    { name: '📅 Arrival Protocol', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: '🛰️ Sector Entry', value: member?.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Unknown', inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'serverinfo') {
            const guild = interaction.guild;
            if (!guild) return;

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle(`🛰️ Sector Analysis: ${guild.name}`)
                .setThumbnail(guild.iconURL({ size: 256 }))
                .addFields(
                    { name: '🆔 Sector ID', value: `\`${guild.id}\``, inline: true },
                    { name: '👑 Overseer', value: `<@${guild.ownerId}>`, inline: true },
                    { name: '👥 Citizens', value: `**${guild.memberCount}** Total`, inline: true },
                    { name: '📅 Established', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: '🛡️ Verification', value: `Level **${guild.verificationLevel}**`, inline: true },
                    { name: '✨ Boosters', value: `**${guild.premiumSubscriptionCount || 0}** Tier **${guild.premiumTier}**`, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    }
};

export default command;
