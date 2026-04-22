import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    PermissionFlagsBits, 
    EmbedBuilder, 
    GuildMember 
} from 'discord.js';
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
        .addSubcommand(sub =>
            sub.setName('purge')
                .setDescription('Bulk delete messages from the current channel.')
                .addIntegerOption(opt => opt.setName('count').setDescription('Number of messages to delete (1-100).').setRequired(true).setMinValue(1).setMaxValue(100))
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const guild = interaction.guild!;

        if (subcommand === 'kick') {
            const member = interaction.options.getMember('member');
            const reason = interaction.options.getString('reason') || 'No reason provided';

            if (!(member instanceof GuildMember)) {
                await interaction.reply({ content: '❌ Target not found in current sector.', ephemeral: true });
                return;
            }

            if (!member.kickable) {
                await interaction.reply({ content: '❌ Insufficient Authority: Target is protected by system hierarchy.', ephemeral: true });
                return;
            }

            const self = guild.members.me!;
            if (member.roles.highest.position >= self.roles.highest.position) {
                await interaction.reply({ content: '❌ Permission Error: Target rank exceeds or matches Astra authority.', ephemeral: true });
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
                // Check if member exists to check hierarchy
                const member = await guild.members.fetch(user.id).catch(() => null);
                if (member) {
                    const self = guild.members.me!;
                    if (member.roles.highest.position >= self.roles.highest.position) {
                        await interaction.reply({ content: '❌ Permission Error: Target rank exceeds or matches Astra authority.', ephemeral: true });
                        return;
                    }
                }

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
            const member = interaction.options.getMember('member');
            const duration = interaction.options.getInteger('duration')!;
            const reason = interaction.options.getString('reason') || 'No reason provided';

            if (!(member instanceof GuildMember)) {
                await interaction.reply({ content: '❌ Target not found in current sector.', ephemeral: true });
                return;
            }

            if (!member.moderatable) {
                await interaction.reply({ content: '❌ Insufficient Authority: Target is protected by system hierarchy.', ephemeral: true });
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

        } else if (subcommand === 'purge') {
            const count = interaction.options.getInteger('count')!;
            const channel = interaction.channel;

            if (!channel || !('bulkDelete' in channel)) {
                await interaction.reply({ content: '❌ Technical Limitation: Purge is only available in text sectors.', ephemeral: true });
                return;
            }

            try {
                const deleted = await (channel as any).bulkDelete(count, true);
                const embed = new EmbedBuilder()
                    .setColor(0x2ecc71)
                    .setTitle('🧹 Sector Sanitization Complete')
                    .setDescription(`Successfully purged **${deleted.size}** messages.`)
                    .setFooter({ text: 'Messages older than 14 days were automatically skipped.' })
                    .setTimestamp();

                await interaction.reply({ embeds: [embed], ephemeral: true });
            } catch (err) {
                await interaction.reply({ content: `❌ Sanitization Failed: ${err}`, ephemeral: true });
            }
        }
    }
};

export default command;
