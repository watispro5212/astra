import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    ChannelType,
    MessageFlags
} from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('👋 Configure welcome and farewell messages for your sector.')
        .setDMPermission(false)
        .addSubcommand(sub =>
            sub.setName('set-channel')
                .setDescription('Set the channel where welcome messages are sent.')
                .addChannelOption(opt =>
                    opt.setName('channel').setDescription('The welcome channel.').setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
        )
        .addSubcommand(sub =>
            sub.setName('set-message')
                .setDescription('Set the welcome message. Supports {user} and {server} placeholders.')
                .addStringOption(opt => opt.setName('message').setDescription('The welcome message.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('set-role')
                .setDescription('Set the role automatically assigned to new members.')
                .addRoleOption(opt => opt.setName('role').setDescription('The auto-role.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('set-farewell')
                .setDescription('Set farewell channel and message for departing members.')
                .addChannelOption(opt =>
                    opt.setName('channel').setDescription('The farewell channel.').setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
                .addStringOption(opt => opt.setName('message').setDescription('Farewell message. Supports {user} and {server}.'))
        )
        .addSubcommand(sub =>
            sub.setName('test')
                .setDescription('Send a test welcome message to the configured channel.')
        )
        .addSubcommand(sub =>
            sub.setName('view')
                .setDescription('View the current welcome configuration.')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guildId!;
        await interaction.deferReply();

        const upsert = async (data: Record<string, any>) => {
            const exists = await db.fetchOne('SELECT 1 FROM welcome_configs WHERE guild_id = ?', guildId);
            if (exists) {
                const keys = Object.keys(data);
                const setClause = keys.map(k => `${k} = ?`).join(', ');
                await db.execute(
                    `UPDATE welcome_configs SET ${setClause} WHERE guild_id = ?`,
                    ...Object.values(data), guildId
                );
            } else {
                const cols = ['guild_id', ...Object.keys(data)].join(', ');
                const placeholders = ['?', ...Object.keys(data).map(() => '?')].join(', ');
                await db.execute(
                    `INSERT INTO welcome_configs (${cols}) VALUES (${placeholders})`,
                    guildId, ...Object.values(data)
                );
            }
        };

        if (subcommand === 'set-channel') {
            const channel = interaction.options.getChannel('channel')!;
            await upsert({ channel_id: channel.id });
            await interaction.editReply({ embeds: [new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('✅ Welcome Channel Set')
                .setDescription(`Welcome messages will be sent to <#${channel.id}>.`)] });

        } else if (subcommand === 'set-message') {
            const message = interaction.options.getString('message')!;
            await upsert({ message });
            const preview = message
                .replace('{user}', `**${interaction.user.username}**`)
                .replace('{server}', `**${interaction.guild!.name}**`);
            await interaction.editReply({ embeds: [new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('✅ Welcome Message Set')
                .addFields({ name: 'Preview', value: preview })] });

        } else if (subcommand === 'set-role') {
            const role = interaction.options.getRole('role')!;
            await upsert({ auto_role_id: role.id });
            await interaction.editReply({ embeds: [new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('✅ Auto-Role Set')
                .setDescription(`New members will automatically receive the **${role.name}** role.`)] });

        } else if (subcommand === 'set-farewell') {
            const channel = interaction.options.getChannel('channel')!;
            const message = interaction.options.getString('message') ?? '{user} has left the sector.';
            await upsert({ farewell_channel_id: channel.id, farewell_message: message });
            await interaction.editReply({ embeds: [new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('✅ Farewell System Configured')
                .addFields(
                    { name: 'Channel', value: `<#${channel.id}>`, inline: true },
                    { name: 'Message', value: message, inline: false }
                )] });

        } else if (subcommand === 'test') {
            const cfg = await db.fetchOne('SELECT * FROM welcome_configs WHERE guild_id = ?', guildId);
            if (!cfg?.channel_id) {
                await interaction.editReply({ content: '❌ No welcome channel set. Use `/welcome set-channel` first.' });
                return;
            }
            const channel = await interaction.guild!.channels.fetch(cfg.channel_id).catch(() => null);
            if (!channel?.isTextBased()) {
                await interaction.editReply({ content: '❌ Welcome channel not found or not a text channel.' });
                return;
            }
            const text = (cfg.message ?? 'Welcome {user} to **{server}**!')
                .replace('{user}', `<@${interaction.user.id}>`)
                .replace('{server}', interaction.guild!.name);
            const embed = new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('👋 New Operative Arrived')
                .setDescription(text)
                .setThumbnail(interaction.user.displayAvatarURL())
                .setFooter({ text: 'Astra Welcome System • v7.0.0' })
                .setTimestamp();
            await (channel as any).send({ embeds: [embed] });
            await interaction.editReply({ content: '✅ Test welcome message sent!' });

        } else if (subcommand === 'view') {
            const cfg = await db.fetchOne('SELECT * FROM welcome_configs WHERE guild_id = ?', guildId);
            await interaction.editReply({ embeds: [new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('👋 Welcome Configuration')
                .addFields(
                    { name: 'Welcome Channel', value: cfg?.channel_id ? `<#${cfg.channel_id}>` : 'Not set', inline: true },
                    { name: 'Auto-Role', value: cfg?.auto_role_id ? `<@&${cfg.auto_role_id}>` : 'Not set', inline: true },
                    { name: 'Farewell Channel', value: cfg?.farewell_channel_id ? `<#${cfg.farewell_channel_id}>` : 'Not set', inline: true },
                    { name: 'Welcome Message', value: cfg?.message ?? '*Default*', inline: false },
                    { name: 'Farewell Message', value: cfg?.farewell_message ?? '*Default*', inline: false }
                )
                .setFooter({ text: 'Astra Welcome System • v7.0.0' })
                .setTimestamp()] });
        }
    }
};

export default command;
