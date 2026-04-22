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
                .addIntegerOption(opt => opt.setName('delete_messages').setDescription('Days of messages to delete (0–7).').setMinValue(0).setMaxValue(7))
        )
        .addSubcommand(sub =>
            sub.setName('unban')
                .setDescription('Remove a blacklist entry for a user by ID.')
                .addStringOption(opt => opt.setName('user_id').setDescription('The Discord ID of the user to unban.').setRequired(true))
                .addStringOption(opt => opt.setName('reason').setDescription('Reason for removal.'))
        )
        .addSubcommand(sub =>
            sub.setName('timeout')
                .setDescription('Temporary temporal suspension.')
                .addUserOption(opt => opt.setName('member').setDescription('The member to suspend.').setRequired(true))
                .addIntegerOption(opt => opt.setName('duration').setDescription('Duration in minutes.').setRequired(true).setMinValue(1).setMaxValue(40320))
                .addStringOption(opt => opt.setName('reason').setDescription('Reason for suspension.'))
        )
        .addSubcommand(sub =>
            sub.setName('warn')
                .setDescription('Issue a formal warning to a member.')
                .addUserOption(opt => opt.setName('member').setDescription('The member to warn.').setRequired(true))
                .addStringOption(opt => opt.setName('reason').setDescription('Reason for the warning.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('purge')
                .setDescription('Bulk delete messages from the current channel.')
                .addIntegerOption(opt => opt.setName('count').setDescription('Number of messages to delete (1–100).').setRequired(true).setMinValue(1).setMaxValue(100))
        )
        .addSubcommand(sub =>
            sub.setName('case')
                .setDescription('View a specific moderation case.')
                .addIntegerOption(opt => opt.setName('number').setDescription('The case number.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('history')
                .setDescription('View the full moderation history for a user.')
                .addUserOption(opt => opt.setName('member').setDescription('The target operative.').setRequired(true))
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

            await interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0xe67e22)
                .setTitle('⚖️ Ejection Executed')
                .setDescription(`**Target:** ${member.user.tag}\n**Case:** #${caseId}\n**Reason:** ${reason}`)
                .setTimestamp()] });

        } else if (subcommand === 'ban') {
            const user = interaction.options.getUser('member')!;
            const reason = interaction.options.getString('reason') || 'No reason provided';
            const deleteDays = interaction.options.getInteger('delete_messages') || 0;

            try {
                const member = await guild.members.fetch(user.id).catch(() => null);
                if (member) {
                    const self = guild.members.me!;
                    if (member.roles.highest.position >= self.roles.highest.position) {
                        await interaction.reply({ content: '❌ Permission Error: Target rank exceeds or matches Astra authority.', ephemeral: true });
                        return;
                    }
                }
                await guild.members.ban(user, { reason, deleteMessageSeconds: deleteDays * 86400 });
                const caseId = await ModerationService.createCase(guild.id, user.id, interaction.user.id, 'ban', reason);

                await interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(0xc0392b)
                    .setTitle('🚨 Blacklist Applied')
                    .setDescription(`**Target:** ${user.tag}\n**Case:** #${caseId}\n**Reason:** ${reason}`)
                    .setTimestamp()] });
            } catch (err) {
                await interaction.reply({ content: `❌ Blacklist Failed: ${err}`, ephemeral: true });
            }

        } else if (subcommand === 'unban') {
            const userId = interaction.options.getString('user_id')!;
            const reason = interaction.options.getString('reason') || 'No reason provided';

            try {
                const ban = await guild.bans.fetch(userId).catch(() => null);
                if (!ban) {
                    await interaction.reply({ content: '❌ No active ban found for that user ID.', ephemeral: true });
                    return;
                }
                await guild.members.unban(userId, reason);
                const caseId = await ModerationService.createCase(guild.id, userId, interaction.user.id, 'unban', reason);

                await interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(0x2ecc71)
                    .setTitle('✅ Blacklist Revoked')
                    .setDescription(`**User ID:** \`${userId}\`\n**Case:** #${caseId}\n**Reason:** ${reason}`)
                    .setTimestamp()] });
            } catch (err) {
                await interaction.reply({ content: `❌ Unban Failed: ${err}`, ephemeral: true });
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
                await member.timeout(duration * 60000, reason);
                const caseId = await ModerationService.createCase(guild.id, member.id, interaction.user.id, 'timeout', reason, `${duration}m`);

                await interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(0xf1c40f)
                    .setTitle('⏳ Temporal Suspension Active')
                    .setDescription(`**Target:** ${member.user.tag}\n**Case:** #${caseId}\n**Duration:** ${duration} minutes\n**Reason:** ${reason}`)
                    .setTimestamp()] });
            } catch (err) {
                await interaction.reply({ content: `❌ Suspension Failed: ${err}`, ephemeral: true });
            }

        } else if (subcommand === 'warn') {
            const member = interaction.options.getMember('member');
            const reason = interaction.options.getString('reason')!;

            if (!(member instanceof GuildMember)) {
                await interaction.reply({ content: '❌ Target not found in current sector.', ephemeral: true });
                return;
            }
            if (member.user.bot) {
                await interaction.reply({ content: '❌ Bots cannot be warned.', ephemeral: true });
                return;
            }

            const caseId = await ModerationService.createCase(guild.id, member.id, interaction.user.id, 'warn', reason);

            try {
                await member.user.send({ embeds: [new EmbedBuilder()
                    .setColor(0xf39c12)
                    .setTitle('⚠️ Formal Warning Issued')
                    .setDescription(`You have received a formal warning in **${guild.name}**.\n\n**Reason:** ${reason}\n**Case:** #${caseId}`)
                    .setFooter({ text: 'Astra Moderation System • v7.0.0' })
                    .setTimestamp()] });
            } catch (_) { /* DMs closed — warning still logged */ }

            await interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0xf39c12)
                .setTitle('⚠️ Warning Issued')
                .setDescription(`**Target:** ${member.user.tag}\n**Case:** #${caseId}\n**Reason:** ${reason}`)
                .setTimestamp()] });

        } else if (subcommand === 'purge') {
            const count = interaction.options.getInteger('count')!;
            const channel = interaction.channel;

            if (!channel || !('bulkDelete' in channel)) {
                await interaction.reply({ content: '❌ Purge is only available in text channels.', ephemeral: true });
                return;
            }
            try {
                const deleted = await (channel as any).bulkDelete(count, true);
                await interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(0x2ecc71)
                    .setTitle('🧹 Sector Sanitization Complete')
                    .setDescription(`Successfully purged **${deleted.size}** message(s). (Messages older than 14 days are automatically skipped.)`)
                    .setTimestamp()], ephemeral: true });
            } catch (err) {
                await interaction.reply({ content: `❌ Sanitization Failed: ${err}`, ephemeral: true });
            }

        } else if (subcommand === 'case') {
            const caseNumber = interaction.options.getInteger('number')!;
            const caseData = await ModerationService.getCase(guild.id, caseNumber);

            if (!caseData) {
                await interaction.reply({ content: `❌ Case #${caseNumber} not found in this sector.`, ephemeral: true });
                return;
            }

            await interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle(`📁 Case #${caseNumber}`)
                .addFields(
                    { name: 'Type', value: `\`${caseData.type.toUpperCase()}\``, inline: true },
                    { name: 'Status', value: `\`${caseData.case_status || 'active'}\``, inline: true },
                    { name: 'Target', value: `<@${caseData.target_id}> (\`${caseData.target_id}\`)`, inline: false },
                    { name: 'Moderator', value: `<@${caseData.moderator_id}>`, inline: true },
                    { name: 'Duration', value: caseData.duration || 'N/A', inline: true },
                    { name: 'Reason', value: caseData.reason || 'No reason provided', inline: false },
                    { name: 'Timestamp', value: `<t:${Math.floor(new Date(caseData.timestamp).getTime() / 1000)}:F>`, inline: false }
                )
                .setFooter({ text: 'Astra Moderation System • v7.0.0' })] });

        } else if (subcommand === 'history') {
            const user = interaction.options.getUser('member')!;
            await interaction.deferReply();
            const cases = await ModerationService.getUserHistory(guild.id, user.id);

            if (!cases || cases.length === 0) {
                await interaction.editReply({ content: `✅ No moderation history found for **${user.tag}** in this sector.` });
                return;
            }

            const typeColors: Record<string, string> = { kick: '🟠', ban: '🔴', unban: '🟢', timeout: '🟡', warn: '🟡' };
            const lines = cases.slice(0, 15).map((c: any) =>
                `${typeColors[c.type] || '⚪'} **#${c.case_number}** \`${c.type.toUpperCase()}\` — ${c.reason || 'No reason'} (<t:${Math.floor(new Date(c.timestamp).getTime() / 1000)}:R>)`
            ).join('\n');

            await interaction.editReply({ embeds: [new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle(`📋 Moderation History: ${user.tag}`)
                .setThumbnail(user.displayAvatarURL())
                .setDescription(lines)
                .setFooter({ text: `${cases.length} total case(s) • Showing up to 15` })
                .setTimestamp()] });
        }
    }
};

export default command;
