import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';
import { THEME, footerText } from '../core/constants';
import { config } from '../core/config';

const command: Command = {
    ownerOnly: true,
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('🚫 Manage blacklisted users. (Owner only)')
        .setDMPermission(true)
        .addSubcommand(sub =>
            sub.setName('add')
               .setDescription('Blacklist a user — blocks XP gain and bot interactions.')
               .addUserOption(opt => opt.setName('user').setDescription('User to blacklist.').setRequired(true))
               .addStringOption(opt => opt.setName('reason').setDescription('Reason for blacklisting.'))
        )
        .addSubcommand(sub =>
            sub.setName('remove')
               .setDescription('Remove a user from the blacklist.')
               .addUserOption(opt => opt.setName('user').setDescription('User to unblacklist.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('check')
               .setDescription('Check if a user is blacklisted.')
               .addUserOption(opt => opt.setName('user').setDescription('User to check.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('list')
               .setDescription('Show all blacklisted users.')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.user.id !== config.ownerId) {
            return interaction.reply({ content: '❌ Only the bot owner can use this command.', flags: [MessageFlags.Ephemeral] });
        }

        const sub = interaction.options.getSubcommand();

        // ── ADD ───────────────────────────────────────────────────────────
        if (sub === 'add') {
            const user   = interaction.options.getUser('user')!;
            const reason = interaction.options.getString('reason') ?? 'No reason provided';

            if (user.id === config.ownerId) {
                return interaction.reply({ content: '❌ You cannot blacklist yourself.', flags: [MessageFlags.Ephemeral] });
            }

            await db.execute(
                'INSERT INTO users (user_id, blacklisted) VALUES (?, TRUE) ON CONFLICT(user_id) DO UPDATE SET blacklisted = TRUE',
                user.id
            );

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(THEME.DANGER)
                .setTitle('🚫 USER BLACKLISTED')
                .setDescription(`**${user.username}** has been blacklisted.`)
                .addFields(
                    { name: '🆔 User ID', value: `\`${user.id}\``, inline: true },
                    { name: '📜 Reason',  value: reason,           inline: true }
                )
                .setThumbnail(user.displayAvatarURL())
                .setTimestamp()], flags: [MessageFlags.Ephemeral] });

        // ── REMOVE ────────────────────────────────────────────────────────
        } else if (sub === 'remove') {
            const user = interaction.options.getUser('user')!;

            await db.execute(
                'UPDATE users SET blacklisted = FALSE WHERE user_id = ?',
                user.id
            );

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(THEME.SUCCESS)
                .setTitle('✅ BLACKLIST REMOVED')
                .setDescription(`**${user.username}** is no longer blacklisted.`)
                .setThumbnail(user.displayAvatarURL())
                .setTimestamp()], flags: [MessageFlags.Ephemeral] });

        // ── CHECK ─────────────────────────────────────────────────────────
        } else if (sub === 'check') {
            const user = interaction.options.getUser('user')!;
            const row  = await db.fetchOne('SELECT blacklisted FROM users WHERE user_id = ?', user.id);
            const isBlacklisted = row?.blacklisted === true || row?.blacklisted === 1;

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(isBlacklisted ? THEME.DANGER : THEME.SUCCESS)
                .setTitle(isBlacklisted ? '🚫 User is Blacklisted' : '✅ User is Not Blacklisted')
                .setDescription(`**${user.username}** (\`${user.id}\`)`)
                .setThumbnail(user.displayAvatarURL())
                .setTimestamp()], flags: [MessageFlags.Ephemeral] });

        // ── LIST ──────────────────────────────────────────────────────────
        } else if (sub === 'list') {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
            const rows = await db.fetchAll('SELECT user_id FROM users WHERE blacklisted = TRUE LIMIT 50');

            if (!rows.length) {
                return interaction.editReply({ content: '✅ No users are currently blacklisted.' });
            }

            const lines = await Promise.all(rows.map(async (r: any) => {
                const u = await interaction.client.users.fetch(r.user_id).catch(() => null);
                return `• **${u?.username ?? 'Unknown'}** (\`${r.user_id}\`)`;
            }));

            return interaction.editReply({ embeds: [new EmbedBuilder()
                .setColor(THEME.DANGER)
                .setTitle('🚫 Blacklisted Users')
                .setDescription(lines.join('\n'))
                .setFooter({ text: `${rows.length} user(s)` })
                .setTimestamp()] });
        }
    }
};

export default command;
