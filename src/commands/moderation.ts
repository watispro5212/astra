import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
    GuildMember
} from 'discord.js';
import { ModerationService } from '../services/moderationService';
import { Command } from '../types';
import { THEME, VERSION, PROTOCOL } from '../core/constants';

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
                return interaction.reply({ content: '❌ Target not found in current sector.', ephemeral: true });
            }
            if (!member.kickable) {
                return interaction.reply({ content: '❌ Insufficient Authority: Target is protected by system hierarchy.', ephemeral: true });
            }
            const self = guild.members.me!;
            if (member.roles.highest.position >= self.roles.highest.position) {
                return interaction.reply({ content: '❌ Permission Error: Target rank exceeds or matches Astra authority.', ephemeral: true });
            }

            await member.kick(reason);
            const caseId = await ModerationService.createCase(guild.id, member.id, interaction.user.id, 'kick', reason);

            const embed = new EmbedBuilder()
                .setColor(THEME.WARNING)
                .setTitle('⚖️ EJECTION EXECUTED')
                .setDescription(`The target operative has been ejected from the sector.`)
                .addFields(
                    { name: '👤 Operative', value: `${member.user.tag}`, inline: true },
                    { name: '🆔 Case', value: `#${caseId}`, inline: true },
                    { name: '📜 Reason', value: reason, inline: false }
                )
                .setThumbnail(member.user.displayAvatarURL())
                .setFooter({ text: `${PROTOCOL} Enforcement • Case #${caseId}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'ban') {
            const user = interaction.options.getUser('member')!;
            const reason = interaction.options.getString('reason') || 'No reason provided';
            const deleteDays = interaction.options.getInteger('delete_messages') || 0;

            try {
                const member = await guild.members.fetch(user.id).catch(() => null);
                if (member) {
                    const self = guild.members.me!;
                    if (member.roles.highest.position >= self.roles.highest.position) {
                        return interaction.reply({ content: '❌ Permission Error: Target rank exceeds or matches Astra authority.', ephemeral: true });
                    }
                }
                await guild.members.ban(user, { reason, deleteMessageSeconds: deleteDays * 86400 });
                const caseId = await ModerationService.createCase(guild.id, user.id, interaction.user.id, 'ban', reason);

                const embed = new EmbedBuilder()
                    .setColor(THEME.DANGER)
                    .setTitle('🚨 BLACKLIST APPLIED')
                    .setDescription(`The target operative has been permanently blacklisted.`)
                    .addFields(
                        { name: '👤 Operative', value: `${user.tag}`, inline: true },
                        { name: '🆔 Case', value: `#${caseId}`, inline: true },
                        { name: '📜 Reason', value: reason, inline: false }
                    )
                    .setThumbnail(user.displayAvatarURL())
                    .setFooter({ text: `${PROTOCOL} Enforcement • Critical Violation` })
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            } catch (err) {
                await interaction.reply({ content: `❌ Blacklist Failed: ${err}`, ephemeral: true });
            }

        } else if (subcommand === 'unban') {
            const userId = interaction.options.getString('user_id')!;
            const reason = interaction.options.getString('reason') || 'No reason provided';

            try {
                const ban = await guild.bans.fetch(userId).catch(() => null);
                if (!ban) {
                    return interaction.reply({ content: '❌ No active ban found for that user ID.', ephemeral: true });
                }
                await guild.members.unban(userId, reason);
                const caseId = await ModerationService.createCase(guild.id, userId, interaction.user.id, 'unban', reason);

                const embed = new EmbedBuilder()
                    .setColor(THEME.SUCCESS)
                    .setTitle('✅ BLACKLIST REVOKED')
                    .setDescription(`Sector access has been restored for the user.`)
                    .addFields(
                        { name: '🆔 User ID', value: `\`${userId}\``, inline: true },
                        { name: '🆔 Case', value: `#${caseId}`, inline: true },
                        { name: '📜 Reason', value: reason, inline: false }
                    )
                    .setFooter({ text: `${PROTOCOL} Enforcement • Restriction Lifted` })
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            } catch (err) {
                await interaction.reply({ content: `❌ Unban Failed: ${err}`, ephemeral: true });
            }

        } else if (subcommand === 'timeout') {
            const member = interaction.options.getMember('member');
            const duration = interaction.options.getInteger('duration')!;
            const reason = interaction.options.getString('reason') || 'No reason provided';

            if (!(member instanceof GuildMember)) {
                return interaction.reply({ content: '❌ Target not found in current sector.', ephemeral: true });
            }
            if (!member.moderatable) {
                return interaction.reply({ content: '❌ Insufficient Authority: Target is protected by system hierarchy.', ephemeral: true });
            }
            try {
                await member.timeout(duration * 60000, reason);
                const caseId = await ModerationService.createCase(guild.id, member.id, interaction.user.id, 'timeout', reason, `${duration}m`);

                const embed = new EmbedBuilder()
                    .setColor(THEME.WARNING)
                    .setTitle('⏳ TEMPORAL SUSPENSION')
                    .setDescription(`The operative has been temporarily suspended from all activities.`)
                    .addFields(
                        { name: '👤 Operative', value: `${member.user.tag}`, inline: true },
                        { name: '🆔 Case', value: `#${caseId}`, inline: true },
                        { name: '⏲️ Duration', value: `${duration} minutes`, inline: true },
                        { name: '📜 Reason', value: reason, inline: false }
                    )
                    .setThumbnail(member.user.displayAvatarURL())
                    .setFooter({ text: `${PROTOCOL} Enforcement • Stability Protocol` })
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] });
            } catch (err) {
                await interaction.reply({ content: `❌ Suspension Failed: ${err}`, ephemeral: true });
            }

        } else if (subcommand === 'warn') {
            const member = interaction.options.getMember('member');
            const reason = interaction.options.getString('reason')!;

            if (!(member instanceof GuildMember)) {
                return interaction.reply({ content: '❌ Target not found in current sector.', ephemeral: true });
            }
            if (member.user.bot) {
                return interaction.reply({ content: '❌ Bots cannot be warned.', ephemeral: true });
            }

            const caseId = await ModerationService.createCase(guild.id, member.id, interaction.user.id, 'warn', reason);

            try {
                await member.user.send({ embeds: [new EmbedBuilder()
                    .setColor(THEME.WARNING)
                    .setTitle('⚠️ FORMAL WARNING ISSUED')
                    .setDescription(`You have received a formal warning in **${guild.name}**.\nFurther violations may result in suspension or blacklist.`)
                    .addFields(
                        { name: '🆔 Case', value: `#${caseId}`, inline: true },
                        { name: '📜 Reason', value: reason, inline: false }
                    )
                    .setFooter({ text: `Astra Moderation System • ${VERSION}` })
                    .setTimestamp()] });
            } catch (_) { /* DMs closed */ }

            const embed = new EmbedBuilder()
                .setColor(THEME.WARNING)
                .setTitle('⚠️ WARNING ISSUED')
                .addFields(
                    { name: '👤 Operative', value: `${member.user.tag}`, inline: true },
                    { name: '🆔 Case', value: `#${caseId}`, inline: true },
                    { name: '📜 Reason', value: reason, inline: false }
                )
                .setFooter({ text: `${PROTOCOL} Enforcement • Protocol Logged` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'purge') {
            const count = interaction.options.getInteger('count')!;
            const channel = interaction.channel;

            if (!channel || !('bulkDelete' in channel)) {
                return interaction.reply({ content: '❌ Purge only available in text channels.', ephemeral: true });
            }
            try {
                const deleted = await (channel as any).bulkDelete(count, true);
                const embed = new EmbedBuilder()
                    .setColor(THEME.SUCCESS)
                    .setTitle('🧹 SECTOR SANITIZATION')
                    .setDescription(`Successfully purged **${deleted.size}** tactical logs from the local channel.`)
                    .setFooter({ text: `${PROTOCOL} Maintenance • ${VERSION}` })
                    .setTimestamp();
                await interaction.reply({ embeds: [embed], ephemeral: true });
            } catch (err) {
                await interaction.reply({ content: `❌ Sanitization Failed: ${err}`, ephemeral: true });
            }

        } else if (subcommand === 'case') {
            const caseNumber = interaction.options.getInteger('number')!;
            const caseData = await ModerationService.getCase(guild.id, caseNumber);

            if (!caseData) {
                return interaction.reply({ content: `❌ Case #${caseNumber} not found in this sector.`, ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle(`📁 CASE LOG: #${caseNumber}`)
                .addFields(
                    { name: '🔹 Type', value: `\`${caseData.type.toUpperCase()}\``, inline: true },
                    { name: '🔸 Status', value: `\`${caseData.case_status || 'active'}\``, inline: true },
                    { name: '👤 Target', value: `<@${caseData.target_id}>`, inline: false },
                    { name: '🛠️ Moderator', value: `<@${caseData.moderator_id}>`, inline: true },
                    { name: '⏲️ Duration', value: caseData.duration || 'N/A', inline: true },
                    { name: '📜 Reason', value: caseData.reason || 'No reason provided', inline: false },
                    { name: '📅 Timestamp', value: `<t:${Math.floor(new Date(caseData.timestamp).getTime() / 1000)}:F>`, inline: false }
                )
                .setFooter({ text: `Astra Moderation Core • ${VERSION}` });

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'history') {
            const user = interaction.options.getUser('member')!;
            await interaction.deferReply();
            const cases = await ModerationService.getUserHistory(guild.id, user.id);

            if (!cases || cases.length === 0) {
                return interaction.editReply({ content: `✅ No moderation history found for **${user.tag}** in this sector.` });
            }

            const typeColors: Record<string, string> = { kick: '🟠', ban: '🔴', unban: '🟢', timeout: '🟡', warn: '🟡' };
            const lines = cases.slice(0, 15).map((c: any) =>
                `${typeColors[c.type] || '⚪'} **#${c.case_number}** \`${c.type.toUpperCase()}\` — ${c.reason || 'No reason'} (<t:${Math.floor(new Date(c.timestamp).getTime() / 1000)}:R>)`
            ).join('\n');

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle(`📋 ENFORCEMENT HISTORY: ${user.tag}`)
                .setThumbnail(user.displayAvatarURL())
                .setDescription(lines)
                .setFooter({ text: `${cases.length} total case(s) logged in sector database.` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }
    }
};

export default command;
