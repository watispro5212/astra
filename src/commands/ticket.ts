import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    ChannelType,
    TextChannel
} from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('🎫 Astra Support Ticket System.')
        .addSubcommand(sub =>
            sub.setName('create')
                .setDescription('Open a private support ticket with staff.')
                .addStringOption(opt => opt.setName('reason').setDescription('Brief description of your issue.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('close')
                .setDescription('Close the current ticket channel.')
        )
        .addSubcommand(sub =>
            sub.setName('add')
                .setDescription('Add a user to this ticket.')
                .addUserOption(opt => opt.setName('user').setDescription('User to add.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('remove')
                .setDescription('Remove a user from this ticket.')
                .addUserOption(opt => opt.setName('user').setDescription('User to remove.').setRequired(true))
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const guild = interaction.guild!;

        if (subcommand === 'create') {
            const reason = interaction.options.getString('reason')!;

            const existing = await db.fetchOne(
                "SELECT channel_id FROM tickets WHERE guild_id = ? AND user_id = ? AND status = 'open'",
                guild.id, interaction.user.id
            );
            if (existing) {
                await interaction.reply({ content: `❌ You already have an open ticket: <#${existing.channel_id}>`, ephemeral: true });
                return;
            }

            await interaction.deferReply({ ephemeral: true });

            const cfg = await db.fetchOne('SELECT * FROM ticket_configs WHERE guild_id = ?', guild.id);
            const everyone = guild.roles.everyone;

            const channel = await guild.channels.create({
                name: `ticket-${interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
                type: ChannelType.GuildText,
                parent: cfg?.category_id ?? undefined,
                topic: `Ticket by ${interaction.user.tag} | ${reason}`,
                permissionOverwrites: [
                    { id: everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
                    {
                        id: interaction.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                    },
                    {
                        id: guild.members.me!.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels]
                    },
                    ...(cfg?.staff_role_id ? [{
                        id: cfg.staff_role_id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                    }] : [])
                ]
            }) as TextChannel;

            await db.execute(
                'INSERT INTO tickets (channel_id, guild_id, user_id, reason) VALUES (?, ?, ?, ?)',
                channel.id, guild.id, interaction.user.id, reason
            );

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('🎫 Support Ticket Opened')
                .setDescription(`Hello <@${interaction.user.id}>! A staff member will assist you shortly.\n\n**Issue:** ${reason}`)
                .addFields({ name: 'Available Commands', value: '`/ticket close` — Close this ticket\n`/ticket add <user>` — Add a user\n`/ticket remove <user>` — Remove a user' })
                .setFooter({ text: 'Astra Support System • v7.0.0' })
                .setTimestamp();

            await channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed] });
            await interaction.editReply({ content: `✅ Ticket created: <#${channel.id}>` });

        } else if (subcommand === 'close') {
            const ticket = await db.fetchOne(
                "SELECT * FROM tickets WHERE channel_id = ? AND status = 'open'",
                interaction.channelId
            );
            if (!ticket) {
                await interaction.reply({ content: '❌ This is not an active ticket channel.', ephemeral: true });
                return;
            }

            const member = interaction.member as any;
            const isOwner = interaction.user.id === ticket.user_id;
            const isStaff = member?.permissions?.has(PermissionFlagsBits.ManageChannels);
            if (!isOwner && !isStaff) {
                await interaction.reply({ content: '❌ Only the ticket creator or staff can close this ticket.', ephemeral: true });
                return;
            }

            await interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0xe74c3c)
                .setTitle('🔒 Ticket Closing')
                .setDescription('This ticket will be deleted in 5 seconds.')] });

            await db.execute("UPDATE tickets SET status = 'closed' WHERE channel_id = ?", interaction.channelId);
            setTimeout(() => interaction.channel?.delete().catch(() => {}), 5000);

        } else if (subcommand === 'add') {
            const ticket = await db.fetchOne(
                "SELECT 1 FROM tickets WHERE channel_id = ? AND status = 'open'",
                interaction.channelId
            );
            if (!ticket) {
                await interaction.reply({ content: '❌ This is not an active ticket channel.', ephemeral: true });
                return;
            }
            const user = interaction.options.getUser('user')!;
            await interaction.channel?.permissionOverwrites.create(user.id, {
                ViewChannel: true, SendMessages: true, ReadMessageHistory: true
            });
            await interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0x2ecc71)
                .setDescription(`✅ Added <@${user.id}> to this ticket.`)] });

        } else if (subcommand === 'remove') {
            const ticket = await db.fetchOne(
                "SELECT user_id FROM tickets WHERE channel_id = ? AND status = 'open'",
                interaction.channelId
            );
            if (!ticket) {
                await interaction.reply({ content: '❌ This is not an active ticket channel.', ephemeral: true });
                return;
            }
            const user = interaction.options.getUser('user')!;
            if (user.id === ticket.user_id) {
                await interaction.reply({ content: '❌ Cannot remove the ticket creator.', ephemeral: true });
                return;
            }
            await interaction.channel?.permissionOverwrites.delete(user.id);
            await interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(0xe74c3c)
                .setDescription(`✅ Removed <@${user.id}> from this ticket.`)] });
        }
    }
};

export default command;
