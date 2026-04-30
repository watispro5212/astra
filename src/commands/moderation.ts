import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
    GuildMember,
    MessageFlags
} from 'discord.js';
import { ModerationService } from '../services/moderationService';
import { Command } from '../types';
import { THEME } from '../core/constants';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('mod')
        .setDescription('🛡️ Admin tools to keep the server safe.')
        .setDMPermission(false)
        .addSubcommand(sub =>
            sub.setName('kick')
                .setDescription('Kick someone out.')
                .addUserOption(opt => opt.setName('member').setDescription('The person to kick.').setRequired(true))
                .addStringOption(opt => opt.setName('reason').setDescription('Why are they being kicked?'))
        )
        .addSubcommand(sub =>
            sub.setName('ban')
                .setDescription('Ban someone forever.')
                .addUserOption(opt => opt.setName('member').setDescription('The person to ban.').setRequired(true))
                .addStringOption(opt => opt.setName('reason').setDescription('Why are they being banned?'))
                .addIntegerOption(opt => opt.setName('delete_messages').setDescription('How many days of messages to delete (0–7).').setMinValue(0).setMaxValue(7))
        )
        .addSubcommand(sub =>
            sub.setName('unban')
                .setDescription('Unban someone.')
                .addStringOption(opt => opt.setName('user_id').setDescription('The ID of the user to unban.').setRequired(true))
                .addStringOption(opt => opt.setName('reason').setDescription('Why are they being unbanned?'))
        )
        .addSubcommand(sub =>
            sub.setName('timeout')
                .setDescription('Time someone out.')
                .addUserOption(opt => opt.setName('member').setDescription('The person to time out.').setRequired(true))
                .addIntegerOption(opt => opt.setName('duration').setDescription('How many minutes?').setRequired(true).setMinValue(1).setMaxValue(40320))
                .addStringOption(opt => opt.setName('reason').setDescription('Why are they being timed out?'))
        )
        .addSubcommand(sub =>
            sub.setName('warn')
                .setDescription('Warn someone.')
                .addUserOption(opt => opt.setName('member').setDescription('The person to warn.').setRequired(true))
                .addStringOption(opt => opt.setName('reason').setDescription('Why are they being warned?').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('purge')
                .setDescription('Clear some messages.')
                .addIntegerOption(opt => opt.setName('count').setDescription('How many messages to delete (1–100).').setRequired(true).setMinValue(1).setMaxValue(100))
        )
        .addSubcommand(sub =>
            sub.setName('case')
                .setDescription('View a specific moderation case.')
                .addIntegerOption(opt => opt.setName('number').setDescription('The case number.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('history')
                .setDescription('See someone\'s mod history.')
                .addUserOption(opt => opt.setName('member').setDescription('The person to check.').setRequired(true))
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const guild = interaction.guild!;

        if (subcommand === 'kick') {
            await interaction.deferReply();
            const member = interaction.options.getMember('member');
            const reason = interaction.options.getString('reason') || 'No reason provided';

            if (!(member instanceof GuildMember)) {
                return interaction.editReply({ content: '❌ I can\'t find that person here.' });
            }
            if (!member.kickable) {
                return interaction.editReply({ content: '❌ I can\'t do that. They have a higher role than me.' });
            }
            const self = guild.members.me!;
            if (member.roles.highest.position >= self.roles.highest.position) {
                return interaction.editReply({ content: '❌ I can\'t do that. Their role is higher or the same as mine.' });
            }

            await member.kick(reason);
            const caseId = await ModerationService.createCase(guild.id, member.id, interaction.user.id, 'kick', reason);

            const embed = new EmbedBuilder()
                .setColor(THEME.WARNING)
                .setTitle('⚖️ KICKED')
                .setDescription(`That person has been kicked from the server.`)
                .addFields(
                    { name: '👤 User', value: `${member.user.tag}`, inline: true },
                    { name: '🆔 Case', value: `#${caseId}`, inline: true },
                    { name: '📜 Reason', value: reason, inline: false }
                )
                .setThumbnail(member.user.displayAvatarURL())
                .setFooter({ text: `Case #${caseId}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'ban') {
            await interaction.deferReply();
            const user = interaction.options.getUser('member')!;
            const reason = interaction.options.getString('reason') || 'No reason provided';
            const deleteDays = interaction.options.getInteger('delete_messages') || 0;

            try {
                const member = await guild.members.fetch(user.id).catch(() => null);
                if (member) {
                    const self = guild.members.me!;
                    if (member.roles.highest.position >= self.roles.highest.position) {
                        return interaction.editReply({ content: '❌ I can\'t do that. Their role is higher or the same as mine.' });
                    }
                }
                await guild.members.ban(user, { reason, deleteMessageSeconds: deleteDays * 86400 });
                const caseId = await ModerationService.createCase(guild.id, user.id, interaction.user.id, 'ban', reason);

                const embed = new EmbedBuilder()
                    .setColor(THEME.DANGER)
                    .setTitle('🚨 BANNED')
                    .setDescription(`That person has been banned forever.`)
                    .addFields(
                        { name: '👤 User', value: `${user.tag}`, inline: true },
                        { name: '🆔 Case', value: `#${caseId}`, inline: true },
                        { name: '📜 Reason', value: reason, inline: false }
                    )
                    .setThumbnail(user.displayAvatarURL())
                    .setFooter({ text: `Banned` })
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } catch (err) {
                await interaction.editReply({ content: `❌ Ban Failed: ${err}` });
            }

        } else if (subcommand === 'unban') {
            await interaction.deferReply();
            const userId = interaction.options.getString('user_id')!;
            const reason = interaction.options.getString('reason') || 'No reason provided';

            try {
                const ban = await guild.bans.fetch(userId).catch(() => null);
                if (!ban) {
                    return interaction.editReply({ content: '❌ No active ban found for that user ID.' });
                }
                await guild.members.unban(userId, reason);
                const caseId = await ModerationService.createCase(guild.id, userId, interaction.user.id, 'unban', reason);

                const embed = new EmbedBuilder()
                    .setColor(THEME.SUCCESS)
                    .setTitle('✅ UNBANNED')
                    .setDescription(`That person can now join the server again.`)
                    .addFields(
                        { name: '🆔 User ID', value: `\`${userId}\``, inline: true },
                        { name: '🆔 Case', value: `#${caseId}`, inline: true },
                        { name: '📜 Reason', value: reason, inline: false }
                    )
                    .setFooter({ text: `Unbanned` })
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } catch (err) {
                await interaction.editReply({ content: `❌ Unban Failed: ${err}` });
            }

        } else if (subcommand === 'timeout') {
            await interaction.deferReply();
            const member = interaction.options.getMember('member');
            const duration = interaction.options.getInteger('duration')!;
            const reason = interaction.options.getString('reason') || 'No reason provided';

            if (!(member instanceof GuildMember)) {
                return interaction.editReply({ content: '❌ I can\'t find that person here.' });
            }
            if (!member.moderatable) {
                return interaction.editReply({ content: '❌ I can\'t do that. They have a higher role than me.' });
            }
            try {
                await member.timeout(duration * 60000, reason);
                const caseId = await ModerationService.createCase(guild.id, member.id, interaction.user.id, 'timeout', reason, `${duration}m`);

                const embed = new EmbedBuilder()
                    .setColor(THEME.WARNING)
                    .setTitle('⏳ TIMED OUT')
                    .setDescription(`That person has been timed out and can't talk right now.`)
                    .addFields(
                        { name: '👤 User', value: `${member.user.tag}`, inline: true },
                        { name: '🆔 Case', value: `#${caseId}`, inline: true },
                        { name: '⏲️ Duration', value: `${duration} minutes`, inline: true },
                        { name: '📜 Reason', value: reason, inline: false }
                    )
                    .setThumbnail(member.user.displayAvatarURL())
                    .setFooter({ text: `Timed Out` })
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } catch (err) {
                await interaction.editReply({ content: `❌ Timeout Failed: ${err}` });
            }

        } else if (subcommand === 'warn') {
            await interaction.deferReply();
            const member = interaction.options.getMember('member');
            const reason = interaction.options.getString('reason')!;

            if (!(member instanceof GuildMember)) {
                return interaction.editReply({ content: '❌ I can\'t find that person here.' });
            }
            if (member.user.bot) {
                return interaction.editReply({ content: '❌ Bots cannot be warned.' });
            }

            const caseId = await ModerationService.createCase(guild.id, member.id, interaction.user.id, 'warn', reason);

            try {
                await member.user.send({ embeds: [new EmbedBuilder()
                    .setColor(THEME.WARNING)
                    .setTitle('⚠️ WARNING')
                    .setDescription(`You have been warned in **${guild.name}**.\nIf you keep breaking rules, you might be timed out or banned.`)
                    .addFields(
                        { name: '🆔 Case', value: `#${caseId}`, inline: true },
                        { name: '📜 Reason', value: reason, inline: false }
                    )
                    .setFooter({ text: `Astra Bot` })
                    .setTimestamp()] });
            } catch (_) { /* DMs closed */ }

            const embed = new EmbedBuilder()
                .setColor(THEME.WARNING)
                .setTitle('⚠️ WARNING')
                .addFields(
                    { name: '👤 User', value: `${member.user.tag}`, inline: true },
                    { name: '🆔 Case', value: `#${caseId}`, inline: true },
                    { name: '📜 Reason', value: reason, inline: false }
                )
                .setFooter({ text: `Warned` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'purge') {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
            const count = interaction.options.getInteger('count')!;
            const channel = interaction.channel;

            if (!channel || !('bulkDelete' in channel)) {
                return interaction.editReply({ content: '❌ Purge only available in text channels.' });
            }
            try {
                const deleted = await (channel as any).bulkDelete(count, true);
                const embed = new EmbedBuilder()
                    .setColor(THEME.SUCCESS)
                    .setTitle('🧹 MESSAGES CLEARED')
                    .setDescription(`Successfully cleared **${deleted.size}** messages from this channel.`)
                    .setFooter({ text: `Astra Bot` })
                    .setTimestamp();
                await interaction.editReply({ embeds: [embed] });
            } catch (err) {
                await interaction.editReply({ content: `❌ Purge Failed: ${err}` });
            }

        } else if (subcommand === 'case') {
            const caseNumber = interaction.options.getInteger('number')!;
            const caseData = await ModerationService.getCase(guild.id, caseNumber);

            if (!caseData) {
                return interaction.reply({ content: `❌ Case #${caseNumber} not found here.`, ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle(`📁 CASE #${caseNumber}`)
                .addFields(
                    { name: '🔹 Type', value: `\`${caseData.type.toUpperCase()}\``, inline: true },
                    { name: '🔸 Status', value: `\`${caseData.case_status || 'active'}\``, inline: true },
                    { name: '👤 Target', value: `<@${caseData.target_id}>`, inline: false },
                    { name: '🛠️ Moderator', value: `<@${caseData.moderator_id}>`, inline: true },
                    { name: '⏲️ Duration', value: caseData.duration || 'N/A', inline: true },
                    { name: '📜 Reason', value: caseData.reason || 'No reason provided', inline: false },
                    { name: '📅 Timestamp', value: `<t:${Math.floor(new Date(caseData.timestamp).getTime() / 1000)}:F>`, inline: false }
                )
                .setFooter({ text: `Astra Bot` });

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'history') {
            const user = interaction.options.getUser('member')!;
            await interaction.deferReply();
            const cases = await ModerationService.getUserHistory(guild.id, user.id);

            if (!cases || cases.length === 0) {
                return interaction.editReply({ content: `✅ No mod history found for **${user.tag}** here.` });
            }

            const typeColors: Record<string, string> = { kick: '🟠', ban: '🔴', unban: '🟢', timeout: '🟡', warn: '🟡' };
            const lines = cases.slice(0, 15).map((c: any) =>
                `${typeColors[c.type] || '⚪'} **#${c.case_number}** \`${c.type.toUpperCase()}\` — ${c.reason || 'No reason'} (<t:${Math.floor(new Date(c.timestamp).getTime() / 1000)}:R>)`
            ).join('\n');

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle(`📋 MOD HISTORY: ${user.tag}`)
                .setThumbnail(user.displayAvatarURL())
                .setDescription(lines)
                .setFooter({ text: `${cases.length} total case(s) found in the database.` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }
    }
};

export default command;
