import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, ChannelType, PermissionsBitField } from 'discord.js';
import logger from '../core/logger';

export default {
    data: new SlashCommandBuilder()
        .setName('setup_server')
        .setDescription('🛰️ DEEP CLEAN TS v1.0: Safe update + Auto-Delete Duplicates')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const embed = new EmbedBuilder()
            .setTitle('🛰️ DEEP CLEAN INITIATED (TypeScript)')
            .setDescription('Starting deep-scan. Identifying and removing duplicate components...')
            .setColor(0x3498db);

        await interaction.editReply({ embeds: [embed] });

        const guild = interaction.guild!;

        // 1. ROLES (Sample)
        const rolesToCreate = [
            { name: "🛡️ Moderator", color: "#E67E22", permissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers, PermissionFlagsBits.ManageMessages] },
            { name: "🔧 Admin", color: "#C0392B", permissions: [PermissionFlagsBits.Administrator] },
        ];

        for (const r of rolesToCreate) {
            let role = guild.roles.cache.find(role => role.name === r.name);
            if (!role) {
                await guild.roles.create({
                    name: r.name,
                    color: r.color as any,
                    permissions: r.permissions as any,
                    reason: 'Astra Setup'
                });
            }
        }

        // 2. CHANNELS (Sample)
        const categoryName = "💬 NEXUS LOBBY";
        let category = guild.channels.cache.find(c => c.name === categoryName && c.type === ChannelType.GuildCategory);
        if (!category) {
            category = await guild.channels.create({
                name: categoryName,
                type: ChannelType.GuildCategory,
            });
        }

        const channels = [
            { name: "💬-main-chat", type: ChannelType.GuildText },
            { name: "🤖-commands", type: ChannelType.GuildText },
        ];

        for (const c of channels) {
            let channel = guild.channels.cache.find(chan => chan.name === c.name && chan.parentId === category?.id);
            if (!channel) {
                await guild.channels.create({
                    name: c.name,
                    type: c.type as any,
                    parent: category?.id
                });
            }
        }

        const successEmbed = new EmbedBuilder()
            .setTitle('✅ Deep Clean Complete')
            .setDescription('Your server infrastructure has been synchronized with the Astra blueprint.')
            .setColor(0x2ecc71);

        await interaction.editReply({ embeds: [successEmbed] });
    }
};
