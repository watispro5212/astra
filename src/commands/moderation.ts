import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
    GuildMember,
    ChannelType,
    MessageFlags
} from 'discord.js';
import { ModerationService } from '../services/moderationService';
import { Command } from '../types';
import { THEME, footerText } from '../core/constants';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('mod')
        .setDescription('🛡️ Moderation tools.')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addSubcommand(sub =>
            sub.setName('warn')
               .setDescription('Warn a user.')
               .addUserOption(opt => opt.setName('member').setDescription('Who to warn.').setRequired(true))
               .addStringOption(opt => opt.setName('reason').setDescription('Reason.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('kick')
               .setDescription('Kick a user.')
               .addUserOption(opt => opt.setName('member').setDescription('Who to kick.').setRequired(true))
               .addStringOption(opt => opt.setName('reason').setDescription('Reason.'))
        )
        .addSubcommand(sub =>
            sub.setName('ban')
               .setDescription('Ban a user.')
               .addUserOption(opt => opt.setName('member').setDescription('Who to ban.').setRequired(true))
               .addStringOption(opt => opt.setName('reason').setDescription('Reason.'))
               .addIntegerOption(opt => opt.setName('delete_days').setDescription('Days of messages to delete (0–7).').setMinValue(0).setMaxValue(7))
        )
        .addSubcommand(sub =>
            sub.setName('unban')
               .setDescription('Unban a user by ID.')
               .addStringOption(opt => opt.setName('user_id').setDescription('User ID to unban.').setRequired(true))
               .addStringOption(opt => opt.setName('reason').setDescription('Reason.'))
        )
        .addSubcommand(sub =>
            sub.setName('timeout')
               .setDescription('Timeout a user.')
               .addUserOption(opt => opt.setName('member').setDescription('Who to timeout.').setRequired(true))
               .addIntegerOption(opt => opt.setName('minutes').setDescription('Duration in minutes (1–40320).').setRequired(true).setMinValue(1).setMaxValue(40320))
               .addStringOption(opt => opt.setName('reason').setDescription('Reason.'))
        )
        .addSubcommand(sub =>
            sub.setName('purge')
               .setDescription('Delete messages in bulk.')
               .addIntegerOption(opt => opt.setName('count').setDescription('Number of messages (1–100).').setRequired(true).setMinValue(1).setMaxValue(100))
        )
        .addSubcommand(sub =>
            sub.setName('case')
               .setDescription('View a specific case.')
               .addIntegerOption(opt => opt.setName('number').setDescription('Case number.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('history')
               .setDescription("View a user's mod history.")
               .addUserOption(opt => opt.setName('member').setDescription('Who to look up.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('note')
               .setDescription('Add a note to an existing case.')
               .addIntegerOption(opt => opt.setName('case').setDescription('Case number.').setRequired(true))
               .addStringOption(opt => opt.setName('note').setDescription('Note text.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('close')
               .setDescription('Mark a case as closed.')
               .addIntegerOption(opt => opt.setName('case').setDescription('Case number.').setRequired(true))
        )
        .addSubcommandGroup(grp =>
            grp.setName('config')
               .setDescription('Server moderation settings.')
               .addSubcommand(sub =>
                   sub.setName('log-channel')
                      .setDescription('Set the channel where moderation actions are logged.')
                      .addChannelOption(opt => opt.setName('channel').setDescription('Log channel.').addChannelTypes(ChannelType.GuildText).setRequired(true))
               )
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        let sub   = interaction.options.getSubcommand();
        let group = interaction.options.getSubcommandGroup(false);
        const guild = interaction.guild!;

        if (group === 'mod' && sub.startsWith('config-')) {
            group = 'config';
            sub = sub.replace(/^config-/, '');
        }

        // ── CONFIG ────────────────────────────────────────────────────────
        if (group === 'config') {
            if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: '❌ You need Administrator to change settings.', flags: [MessageFlags.Ephemeral] });
            }
            if (sub === 'log-channel') {
                const channel = interaction.options.getChannel('channel')!;
                await ModerationService.setLogChannel(guild.id, channel.id);
                return interaction.reply({ embeds: [new EmbedBuilder()
                    .setColor(THEME.SUCCESS)
                    .setTitle('✅ LOG CHANNEL SET')
                    .setDescription(`Moderation actions will now be logged in <#${channel.id}>.`)
                    .setFooter({ text: footerText('Moderation') })], flags: [MessageFlags.Ephemeral] });
            }
        }

        // ── WARN ──────────────────────────────────────────────────────────
        if (sub === 'warn') {
            await interaction.deferReply();
            const member = interaction.options.getMember('member');
            const reason = interaction.options.getString('reason')!;

            if (!(member instanceof GuildMember)) return interaction.editReply({ content: '❌ Member not found.' });
            if (member.user.bot) return interaction.editReply({ content: '❌ Cannot warn bots.' });

            const caseId = await ModerationService.createCase(guild.id, member.id, interaction.user.id, 'warn', reason);

            try {
                await member.user.send({ embeds: [new EmbedBuilder()
                    .setColor(THEME.WARNING)
                    .setTitle(`⚠️ Warning in ${guild.name}`)
                    .setDescription(`You have been warned. Please follow the server rules.`)
                    .addFields(
                        { name: '📜 Reason', value: reason },
                        { name: '🆔 Case', value: `#${caseId}` }
                    )
                    .setTimestamp()] });
            } catch (_) { /* DMs closed */ }

            const embed = new EmbedBuilder()
                .setColor(THEME.WARNING)
                .setTitle('⚠️ WARNED')
                .addFields(
                    { name: '👤 User', value: `${member.user.tag}`, inline: true },
                    { name: '🆔 Case', value: `#${caseId}`, inline: true },
                    { name: '📜 Reason', value: reason }
                )
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
            await ModerationService.sendLog(interaction.client, guild.id, embed);

        // ── KICK ──────────────────────────────────────────────────────────
        } else if (sub === 'kick') {
            await interaction.deferReply();
            const member = interaction.options.getMember('member');
            const reason = interaction.options.getString('reason') ?? 'No reason provided';

            if (!(member instanceof GuildMember)) return interaction.editReply({ content: '❌ Member not found.' });
            if (!member.kickable) return interaction.editReply({ content: '❌ I cannot kick that member (higher role or missing permissions).' });

            await member.kick(reason);
            const caseId = await ModerationService.createCase(guild.id, member.id, interaction.user.id, 'kick', reason);

            const embed = new EmbedBuilder()
                .setColor(THEME.WARNING)
                .setTitle('👢 KICKED')
                .addFields(
                    { name: '👤 User', value: `${member.user.tag}`, inline: true },
                    { name: '🆔 Case', value: `#${caseId}`, inline: true },
                    { name: '📜 Reason', value: reason }
                )
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
            await ModerationService.sendLog(interaction.client, guild.id, embed);

        // ── BAN ───────────────────────────────────────────────────────────
        } else if (sub === 'ban') {
            await interaction.deferReply();
            const user     = interaction.options.getUser('member')!;
            const reason   = interaction.options.getString('reason') ?? 'No reason provided';
            const delDays  = interaction.options.getInteger('delete_days') ?? 0;

            try {
                const member = await guild.members.fetch(user.id).catch(() => null);
                if (member && !member.bannable) {
                    return interaction.editReply({ content: '❌ I cannot ban that member (higher role or missing permissions).' });
                }
                await guild.members.ban(user, { reason, deleteMessageSeconds: delDays * 86400 });
                const caseId = await ModerationService.createCase(guild.id, user.id, interaction.user.id, 'ban', reason);

                const embed = new EmbedBuilder()
                    .setColor(THEME.DANGER)
                    .setTitle('🔨 BANNED')
                    .addFields(
                        { name: '👤 User', value: `${user.tag}`, inline: true },
                        { name: '🆔 Case', value: `#${caseId}`, inline: true },
                        { name: '📜 Reason', value: reason }
                    )
                    .setThumbnail(user.displayAvatarURL())
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
                await ModerationService.sendLog(interaction.client, guild.id, embed);
            } catch (err) {
                await interaction.editReply({ content: `❌ Ban failed: ${err}` });
            }

        // ── UNBAN ─────────────────────────────────────────────────────────
        } else if (sub === 'unban') {
            await interaction.deferReply();
            const userId = interaction.options.getString('user_id')!;
            const reason = interaction.options.getString('reason') ?? 'No reason provided';

            const ban = await guild.bans.fetch(userId).catch(() => null);
            if (!ban) return interaction.editReply({ content: '❌ No active ban found for that ID.' });

            await guild.members.unban(userId, reason);
            const caseId = await ModerationService.createCase(guild.id, userId, interaction.user.id, 'unban', reason);

            const embed = new EmbedBuilder()
                .setColor(THEME.SUCCESS)
                .setTitle('✅ UNBANNED')
                .addFields(
                    { name: '🆔 User ID', value: `\`${userId}\``, inline: true },
                    { name: '🆔 Case', value: `#${caseId}`, inline: true },
                    { name: '📜 Reason', value: reason }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
            await ModerationService.sendLog(interaction.client, guild.id, embed);

        // ── TIMEOUT ───────────────────────────────────────────────────────
        } else if (sub === 'timeout') {
            await interaction.deferReply();
            const member  = interaction.options.getMember('member');
            const minutes = interaction.options.getInteger('minutes')!;
            const reason  = interaction.options.getString('reason') ?? 'No reason provided';

            if (!(member instanceof GuildMember)) return interaction.editReply({ content: '❌ Member not found.' });
            if (!member.moderatable) return interaction.editReply({ content: '❌ I cannot timeout that member.' });

            await member.timeout(minutes * 60000, reason);
            const caseId = await ModerationService.createCase(guild.id, member.id, interaction.user.id, 'timeout', reason, `${minutes}m`);

            const embed = new EmbedBuilder()
                .setColor(THEME.WARNING)
                .setTitle('⏳ TIMED OUT')
                .addFields(
                    { name: '👤 User', value: `${member.user.tag}`, inline: true },
                    { name: '🆔 Case', value: `#${caseId}`, inline: true },
                    { name: '⏱️ Duration', value: `${minutes} minute${minutes !== 1 ? 's' : ''}`, inline: true },
                    { name: '📜 Reason', value: reason }
                )
                .setThumbnail(member.user.displayAvatarURL())
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
            await ModerationService.sendLog(interaction.client, guild.id, embed);

        // ── PURGE ─────────────────────────────────────────────────────────
        } else if (sub === 'purge') {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
            const count   = interaction.options.getInteger('count')!;
            const channel = interaction.channel;

            if (!channel || !('bulkDelete' in channel)) {
                return interaction.editReply({ content: '❌ Purge only works in text channels.' });
            }

            const deleted = await (channel as any).bulkDelete(count, true).catch((e: any) => {
                return { size: 0, error: String(e) };
            });

            return interaction.editReply({ content: `🧹 Deleted **${deleted.size ?? 0}** messages.` });

        // ── CASE ──────────────────────────────────────────────────────────
        } else if (sub === 'case') {
            const num  = interaction.options.getInteger('number')!;
            const data = await ModerationService.getCase(guild.id, num);

            if (!data) return interaction.reply({ content: `❌ Case #${num} not found.`, flags: [MessageFlags.Ephemeral] });

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle(`📁 Case #${num}`)
                .addFields(
                    { name: '🔹 Type',      value: `\`${data.type.toUpperCase()}\``,                  inline: true },
                    { name: '🔸 Status',    value: `\`${data.case_status ?? 'active'}\``,             inline: true },
                    { name: '👤 Target',    value: `<@${data.target_id}>`,                             inline: false },
                    { name: '🛠️ Moderator', value: `<@${data.moderator_id}>`,                         inline: true },
                    { name: '⏱️ Duration',  value: data.duration ?? 'N/A',                            inline: true },
                    { name: '📜 Reason',    value: data.reason ?? 'No reason',                        inline: false },
                    { name: '📅 Date',      value: `<t:${Math.floor(new Date(data.timestamp).getTime() / 1000)}:F>`, inline: false }
                );

            if (data.note) embed.addFields({ name: '📝 Note', value: data.note });

            return interaction.reply({ embeds: [embed] });

        // ── HISTORY ───────────────────────────────────────────────────────
        } else if (sub === 'history') {
            const user  = interaction.options.getUser('member')!;
            await interaction.deferReply();
            const cases = await ModerationService.getUserHistory(guild.id, user.id);

            if (!cases?.length) {
                return interaction.editReply({ content: `✅ No cases found for **${user.username}**.` });
            }

            const typeIcons: Record<string, string> = { kick: '👢', ban: '🔨', unban: '✅', timeout: '⏳', warn: '⚠️' };
            const lines = cases.slice(0, 15).map((c: any) =>
                `${typeIcons[c.type] ?? '📋'} **#${c.case_number}** \`${c.type.toUpperCase()}\` — ${c.reason ?? 'No reason'} (<t:${Math.floor(new Date(c.timestamp).getTime() / 1000)}:R>)`
            ).join('\n');

            return interaction.editReply({ embeds: [new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle(`📋 Mod History: ${user.username}`)
                .setThumbnail(user.displayAvatarURL())
                .setDescription(lines)
                .setFooter({ text: `${cases.length} total case(s)` })
                .setTimestamp()] });

        // ── NOTE ──────────────────────────────────────────────────────────
        } else if (sub === 'note') {
            const num  = interaction.options.getInteger('case')!;
            const note = interaction.options.getString('note')!;

            const data = await ModerationService.getCase(guild.id, num);
            if (!data) return interaction.reply({ content: `❌ Case #${num} not found.`, flags: [MessageFlags.Ephemeral] });

            await ModerationService.addNote(guild.id, num, note);
            return interaction.reply({ content: `📝 Note added to Case #${num}.`, flags: [MessageFlags.Ephemeral] });

        // ── CLOSE ─────────────────────────────────────────────────────────
        } else if (sub === 'close') {
            const num  = interaction.options.getInteger('case')!;

            const data = await ModerationService.getCase(guild.id, num);
            if (!data) return interaction.reply({ content: `❌ Case #${num} not found.`, flags: [MessageFlags.Ephemeral] });
            if (data.case_status === 'closed') return interaction.reply({ content: `❌ Case #${num} is already closed.`, flags: [MessageFlags.Ephemeral] });

            await ModerationService.closeCase(guild.id, num);
            return interaction.reply({ content: `✅ Case #${num} has been closed.`, flags: [MessageFlags.Ephemeral] });
        }
    }
};

export default command;
