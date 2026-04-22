import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { ModerationService } from '../services/moderationService';
import { Command } from '../types';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('mod')
        .setDescription('🛡️ Tactical Moderation Suite.')
        .addSubcommand(sub =>
            sub.setName('kick')
                .setDescription('Eject a member from the sector.')
                .addUserOption(opt => opt.setName('member').setDescription('The member to eject.').setRequired(true))
                .addStringOption(opt => opt.setName('reason').setDescription('Reason for ejection.'))
        )
        .addSubcommand(sub =>
            sub.setName('ban')
                .setDescription('Permanently blacklist a member from the sector.')
                .addUserOption(opt => opt.setName('member').setDescription('The member to blacklist.').setRequired(true))
                .addStringOption(opt => opt.setName('reason').setDescription('Reason for blacklisting.'))
                .addIntegerOption(opt => opt.setName('delete_messages').setDescription('Number of days of messages to delete.').setMinValue(0).setMaxValue(7))
        )
        .addSubcommand(sub =>
            sub.setName('timeout')
                .setDescription('Temporary temporal suspension.')
                .addUserOption(opt => opt.setName('member').setDescription('The member to suspend.').setRequired(true))
                .addIntegerOption(opt => opt.setName('duration').setDescription('Duration in minutes.').setRequired(true))
                .addStringOption(opt => opt.setName('reason').setDescription('Reason for suspension.'))
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const guild = interaction.guild!;

        if (subcommand === 'kick') {
            const member = interaction.options.getMember('member') as any;
            const reason = interaction.options.getString('reason') || 'No reason provided';

            if (!member) {
                await interaction.reply({ content: '❌ Target not found in sector.', ephemeral: true });
                return;
            }
            if (!member.kickable) {
                await interaction.reply({ content: '❌ Insufficient Authority: Target is protected by system hierarchy.', ephemeral: true });
                return;
            }

            await member.kick(reason);
            const caseId = await ModerationService.createCase(guild.id, member.id, interaction.user.id, 'kick', reason);

            const embed = new EmbedBuilder()
                .setColor(0xe67e22)
                .setTitle('⚖️ Ejection Executed')
                .setDescription(`**Target:** ${member.user.tag}\n**Case ID:** #${caseId}\n**Reason:** ${reason}`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'ban') {
            const user = interaction.options.getUser('member')!;
            const reason = interaction.options.getString('reason') || 'No reason provided';
            const deleteDays = interaction.options.getInteger('delete_messages') || 0;

            try {
                await guild.members.ban(user, { reason, deleteMessageSeconds: deleteDays * 24 * 60 * 60 });
                const caseId = await ModerationService.createCase(guild.id, user.id, interaction.user.id, 'ban', reason);

                const embed = new EmbedBuilder()
                    .setColor(0xc0392b)
                    .setTitle('🚨 Blacklist Applied')
                    .setDescription(`**Target:** ${user.tag}\n**Case ID:** #${caseId}\n**Reason:** ${reason}`)
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            } catch (err) {
                await interaction.reply({ content: `❌ Blacklist Failed: ${err}`, ephemeral: true });
            }

        } else if (subcommand === 'timeout') {
            const member = interaction.options.getMember('member') as any;
            const duration = interaction.options.getInteger('duration')!;
            const reason = interaction.options.getString('reason') || 'No reason provided';

            if (!member) {
                await interaction.reply({ content: '❌ Target not found in sector.', ephemeral: true });
                return;
            }
            
            try {
                await member.timeout(duration * 60 * 1000, reason);
                const caseId = await ModerationService.createCase(guild.id, member.id, interaction.user.id, 'timeout', reason, `${duration}m`);

                const embed = new EmbedBuilder()
                    .setColor(0xf1c40f)
                    .setTitle('⏳ Temporal Suspension Active')
                    .setDescription(`**Target:** ${member.user.tag}\n**Case ID:** #${caseId}\n**Duration:** ${duration} minutes\n**Reason:** ${reason}`)
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            } catch (err) {
                await interaction.reply({ content: `❌ Suspension Failed: ${err}`, ephemeral: true });
            }
        }
    }
};

export default command;
