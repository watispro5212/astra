import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, ChannelType, PermissionsBitField, OverwriteResolvable } from 'discord.js';
import logger from '../core/logger';

const TARGET_GUILD_ID = '1494909279159980192';

export default {
    data: new SlashCommandBuilder()
        .setName('setup_server')
        .setDescription('🏗️ APEX RECONSTRUCTION: Massive infrastructure deployment with metadata.')
        .addBooleanOption(opt => 
            opt.setName('nuclear')
               .setDescription('⚠️ DANGER: Delete ALL channels AND roles before rebuilding?')
               .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.guildId !== TARGET_GUILD_ID) {
            await interaction.reply({ 
                content: '❌ **TRANSMISSION DENIED**: This protocol is restricted to the Astra Prime Sector.', 
                ephemeral: true 
            });
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        const isNuclear = interaction.options.getBoolean('nuclear');
        const guild = interaction.guild!;

        const startEmbed = new EmbedBuilder()
            .setTitle('🏗️ Apex Reconstruction Initiated')
            .setDescription(isNuclear 
                ? '⚠️ **NUCLEAR PROTOCOL ACTIVE**: Purging all channels and roles for Apex deployment...' 
                : '🔄 **SYNC PROTOCOL ACTIVE**: Expanding sector architecture to Apex standards...')
            .setColor(isNuclear ? 0xe74c3c : 0x3498db)
            .setFooter({ text: 'Astra Architect v6.3.0 Apex' })
            .setTimestamp();

        await interaction.editReply({ embeds: [startEmbed] });

        if (isNuclear) {
            try {
                // 1. Purge Channels
                const channels = await guild.channels.fetch();
                for (const channel of channels.values()) {
                    if (channel) await channel.delete('Apex Reconstruction').catch(() => null);
                }

                // 2. Purge Roles (Excluding @everyone and integration roles)
                const roles = await guild.roles.fetch();
                for (const role of roles.values()) {
                    if (role.name !== "@everyone" && role.managed === false && role.editable) {
                        await role.delete('Apex Reconstruction').catch(() => null);
                    }
                }
            } catch (err) {
                logger.error(`Nuclear purge failed: ${err}`);
            }
        }

        // 1. APEX ROLE HIERARCHY
        const rolesToCreate = [
            { name: "👑 OVERSEER", color: "#e74c3c", permissions: [PermissionFlagsBits.Administrator] },
            { name: "🛡️ ENFORCER", color: "#e67e22", permissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ModerateMembers, PermissionFlagsBits.ViewAuditLog] },
            { name: "🧪 RESEARCHER", color: "#9b59b6", permissions: [PermissionFlagsBits.AttachFiles, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions, PermissionFlagsBits.UseExternalEmojis] },
            { name: "🎖️ VETERAN", color: "#f1c40f", permissions: [PermissionFlagsBits.UseExternalEmojis, PermissionFlagsBits.PrioritySpeaker] },
            { name: "🎨 CREATIVE", color: "#e91e63", permissions: [PermissionFlagsBits.AttachFiles, PermissionFlagsBits.AddReactions] },
            { name: "📣 HERALD", color: "#1abc9c", permissions: [PermissionFlagsBits.MentionEveryone] },
            { name: "💎 BOOSTER", color: "#f47fff", permissions: [PermissionFlagsBits.UseExternalEmojis, PermissionFlagsBits.ChangeNickname] },
            { name: "✨ PIONEER", color: "#3498db", permissions: [PermissionFlagsBits.SendMessages] },
            { name: "🤖 OPERATIVE", color: "#1abc9c", permissions: [PermissionFlagsBits.ManageWebhooks, PermissionFlagsBits.SendMessages] },
            { name: "👥 CITIZEN", color: "#95a5a6", permissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AddReactions] },
        ];

        for (const r of rolesToCreate) {
            let role = guild.roles.cache.find(role => role.name === r.name);
            if (!role) {
                await guild.roles.create({
                    name: r.name,
                    color: r.color as any,
                    permissions: r.permissions as any,
                    reason: 'Astra Apex Reconstruction'
                });
            }
        }

        // Re-fetch roles for channel permissions
        await guild.roles.fetch();
        const enforcerRole = guild.roles.cache.find(r => r.name === "🛡️ ENFORCER");
        const veteranRole = guild.roles.cache.find(r => r.name === "🎖️ VETERAN");
        const boosterRole = guild.roles.cache.find(r => r.name === "💎 BOOSTER");

        // 2. APEX SECTOR BLUEPRINTS
        const blueprint = [
            {
                name: "📡 INFORMATION SECTOR",
                permissions: [
                    { id: guild.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] },
                    { id: enforcerRole?.id, allow: [PermissionFlagsBits.SendMessages] }
                ],
                channels: [
                    { name: "📜-rules", type: ChannelType.GuildText, topic: "Official server regulations and community standards." },
                    { name: "📢-announcements", type: ChannelType.GuildText, topic: "Global transmissions and critical updates from Astra Core." },
                    { name: "👋-welcome", type: ChannelType.GuildText, topic: "Arrival protocol for new server operatives." },
                    { name: "❓-faq", type: ChannelType.GuildText, topic: "Frequently asked questions and tactical guidance." },
                    { name: "🤝-partners", type: ChannelType.GuildText, topic: "Collaborative sectors and allied communities." }
                ]
            },
            {
                name: "💬 CITIZEN SECTOR",
                permissions: [
                    { id: guild.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages], deny: [] }
                ],
                channels: [
                    { name: "💬-general", type: ChannelType.GuildText, topic: "Primary communication frequency for all citizens." },
                    { name: "🤖-commands", type: ChannelType.GuildText, topic: "Dedicated sector for bot interactions and system queries." },
                    { name: "📸-media", type: ChannelType.GuildText, topic: "Visual transmissions and asset sharing." },
                    { name: "🎮-gaming", type: ChannelType.GuildText, topic: "Coordination for gaming operations and combat sessions." },
                    { name: "💻-tech", type: ChannelType.GuildText, topic: "Discussions regarding development, hardware, and tactical tech." },
                    { name: "🎨-art-showcase", type: ChannelType.GuildText, topic: "Display sector for creative assets and artistic works." },
                    { name: "🎶-music-chat", type: ChannelType.GuildText, topic: "Audio-related discussions and track sharing." }
                ]
            },
            {
                name: "💎 ELITE SECTOR",
                permissions: [
                    { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: veteranRole?.id, allow: [PermissionFlagsBits.ViewChannel] },
                    { id: boosterRole?.id, allow: [PermissionFlagsBits.ViewChannel] }
                ],
                channels: [
                    { name: "💎-elite-lounge", type: ChannelType.GuildText, topic: "Exclusive lounge for Boosters and Veterans." },
                    { name: "🔊 Elite Frequency", type: ChannelType.GuildVoice, topic: "High-fidelity audio frequency for elite members." }
                ]
            },
            {
                name: "🛡️ SECURITY SECTOR",
                permissions: [
                    { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: enforcerRole?.id, allow: [PermissionFlagsBits.ViewChannel] }
                ],
                channels: [
                    { name: "🛠️-staff-hub", type: ChannelType.GuildText, topic: "Central coordination for server enforcers and administrators." },
                    { name: "🚨-admin-lounge", type: ChannelType.GuildText, topic: "High-clearance sector for Overseer-level discussions." },
                    { name: "⚖️-evidence", type: ChannelType.GuildText, topic: "Case archival and moderation evidence logs." },
                    { name: "📡-bot-logs", type: ChannelType.GuildText, topic: "Real-time telemetry from system integrations." },
                    { name: "🕵️-audit-trails", type: ChannelType.GuildText, topic: "Permanent record of administrative actions." }
                ]
            },
            {
                name: "📊 LOGISTICS SECTOR",
                permissions: [
                    { id: guild.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] }
                ],
                channels: [
                    { name: "🎫-ticket-hub", type: ChannelType.GuildText, topic: "Interaction point for opening support and inquiry tickets." },
                    { name: "🛰️-system-status", type: ChannelType.GuildText, topic: "Real-time shard health and deployment telemetry." },
                    { name: "💡-suggestions", type: ChannelType.GuildText, allowCitizen: true, topic: "Community feedback and enhancement proposals." },
                    { name: "🐛-bug-reports", type: ChannelType.GuildText, allowCitizen: true, topic: "Reporting tactical anomalies and system errors." }
                ]
            },
            {
                name: "🔊 VOICE SECTOR",
                permissions: [
                    { id: guild.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect], deny: [] }
                ],
                channels: [
                    { name: "🔊 Public Freq", type: ChannelType.GuildVoice },
                    { name: "🎮 Gaming Comms", type: ChannelType.GuildVoice },
                    { name: "🎵 Music Studio", type: ChannelType.GuildVoice },
                    { name: "🤫 Private Freq", type: ChannelType.GuildVoice },
                    { name: "🥃 Staff Lounge", type: ChannelType.GuildVoice, isStaff: true }
                ]
            }
        ];

        for (const sector of blueprint) {
            const overwrites: OverwriteResolvable[] = (sector.permissions as any[]).map(p => ({
                id: p.id,
                allow: p.allow || [],
                deny: p.deny || []
            }));
            
            const category = await guild.channels.create({
                name: sector.name,
                type: ChannelType.GuildCategory,
                permissionOverwrites: overwrites
            });

            for (const c of sector.channels) {
                const chanOverwrites: OverwriteResolvable[] = [...overwrites];
                if ((c as any).allowCitizen) {
                    chanOverwrites.push({ id: guild.id, allow: [PermissionFlagsBits.SendMessages] });
                }
                if ((c as any).isStaff) {
                    chanOverwrites.push({ id: guild.id, deny: [PermissionFlagsBits.ViewChannel] });
                    if (enforcerRole) chanOverwrites.push({ id: enforcerRole.id, allow: [PermissionFlagsBits.ViewChannel] });
                }

                await guild.channels.create({
                    name: c.name,
                    type: c.type as any,
                    parent: category.id,
                    permissionOverwrites: chanOverwrites,
                    topic: (c as any).topic || ""
                });
            }
        }

        const successEmbed = new EmbedBuilder()
            .setTitle('✅ Apex Reconstruction Complete')
            .setDescription(`The Astra Prime APEX architecture has been deployed. Infrastructure and Role Hierarchy have been synchronized.`)
            .setColor(0x2ecc71)
            .setThumbnail(interaction.client.user?.displayAvatarURL()!)
            .setFooter({ text: 'Astra Architect v6.3.0 Apex' })
            .setTimestamp();

        await interaction.editReply({ embeds: [successEmbed] });
    }
};
