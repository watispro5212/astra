import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, ChannelType, PermissionsBitField, OverwriteResolvable, TextChannel } from 'discord.js';
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
                    if (channel && channel.id !== interaction.channelId) {
                        await channel.delete('Apex Reconstruction').catch(() => null);
                    }
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
            { name: "🌟 SUPREME", color: "#f1c40f", permissions: [PermissionFlagsBits.Administrator] },
            { name: "🛡️ ADMINISTRATOR", color: "#c0392b", permissions: [PermissionFlagsBits.Administrator] },
            { name: "💠 ELITE", color: "#3498db", permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.MuteMembers, PermissionFlagsBits.DeafenMembers] },
            { name: "👮 MODERATOR", color: "#2980b9", permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers, PermissionFlagsBits.ViewAuditLog, PermissionFlagsBits.ModerateMembers] },
            { name: "🔦 TRIAL MOD", color: "#3498db", permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ViewAuditLog] },
            { name: "🛡️ ENFORCER", color: "#e67e22", permissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ModerateMembers] },
            { name: "🧪 RESEARCHER", color: "#9b59b6", permissions: [PermissionFlagsBits.AttachFiles, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions] },
            { name: "🎖️ VETERAN", color: "#f1c40f", permissions: [PermissionFlagsBits.UseExternalEmojis, PermissionFlagsBits.PrioritySpeaker] },
            { name: "🎨 CREATIVE", color: "#e91e63", permissions: [PermissionFlagsBits.AttachFiles, PermissionFlagsBits.AddReactions] },
            { name: "📣 HERALD", color: "#1abc9c", permissions: [PermissionFlagsBits.MentionEveryone] },
            { name: "💎 BOOSTER", color: "#f47fff", permissions: [PermissionFlagsBits.UseExternalEmojis, PermissionFlagsBits.ChangeNickname] },
            { name: "✨ PIONEER", color: "#3498db", permissions: [PermissionFlagsBits.SendMessages] },
            { name: "🤖 OPERATIVE", color: "#1abc9c", permissions: [PermissionFlagsBits.ManageWebhooks] },
            { name: "👥 CITIZEN", color: "#95a5a6", permissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AddReactions] },
            // Leveling Milestone Roles
            { name: "🏆 LVL 100", color: "#ffd700", permissions: [] },
            { name: "🥇 LVL 50", color: "#c0c0c0", permissions: [] },
            { name: "🥈 LVL 25", color: "#cd7f32", permissions: [] },
            { name: "🥉 LVL 10", color: "#3498db", permissions: [] },
            { name: "🎖️ LVL 5", color: "#1abc9c", permissions: [] },
        ];

        const createdRoles = new Map<string, any>();
        for (const r of rolesToCreate) {
            const role = await guild.roles.create({
                name: r.name,
                color: r.color as any,
                permissions: r.permissions as any,
                reason: 'Apex Reconstruction Hierarchy Deployment'
            });
            createdRoles.set(r.name, role);
        }

        const enforcerRole = createdRoles.get("🛡️ ENFORCER");
        const veteranRole = createdRoles.get("🎖️ VETERAN");
        const boosterRole = createdRoles.get("💎 BOOSTER");

        // 2. APEX SECTOR BLUEPRINTS
        const blueprint = [
            {
                name: "📡 INFORMATION SECTOR",
                permissions: [
                    { id: guild.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] },
                    { id: enforcerRole?.id, allow: [PermissionFlagsBits.SendMessages] }
                ],
                channels: [
                    { name: "📜-rules", type: ChannelType.GuildText, topic: "Official guidelines and server regulations." },
                    { name: "📢-announcements", type: ChannelType.GuildText, topic: "Major updates and community news." },
                    { name: "👋-welcome", type: ChannelType.GuildText, topic: "New member arrival logs." },
                    { name: "📜-role-information", type: ChannelType.GuildText, topic: "Detailed diagnostic of the server hierarchy." },
                    { name: "❓-faq", type: ChannelType.GuildText, topic: "Common questions and information." },
                    { name: "🤝-partners", type: ChannelType.GuildText, topic: "Affiliated servers and communities." }
                ]
            },
            {
                name: "🏆 INTELLIGENCE SECTOR",
                permissions: [
                    { id: guild.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] }
                ],
                channels: [
                    { name: "📈-rank-analysis", type: ChannelType.GuildText, topic: "Real-time level-up transmissions." },
                    { name: "🏆-leaderboard", type: ChannelType.GuildText, topic: "Top-tier operative rankings." },
                    { name: "🔮-milestones", type: ChannelType.GuildText, topic: "Sector-wide achievement logs." }
                ]
            },
            {
                name: "💬 CITIZEN SECTOR",
                permissions: [
                    { id: guild.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages], deny: [] }
                ],
                channels: [
                    { name: "💬-general", type: ChannelType.GuildText, topic: "Main communication channel for members." },
                    { name: "🤖-commands", type: ChannelType.GuildText, topic: "Channel for bot commands and interactions." },
                    { name: "📸-media", type: ChannelType.GuildText, topic: "Sharing images and videos." },
                    { name: "🎮-gaming", type: ChannelType.GuildText, topic: "Gaming discussion and coordination." },
                    { name: "💻-tech", type: ChannelType.GuildText, topic: "Technology and development talk." },
                    { name: "🎨-art-showcase", type: ChannelType.GuildText, topic: "Showcase your creative work." },
                    { name: "🎶-music-chat", type: ChannelType.GuildText, topic: "Music sharing and discussion." }
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
                    { name: "💎-elite-lounge", type: ChannelType.GuildText, topic: "Exclusive chat for Veterans and Boosters." },
                    { name: "🔊 Elite Frequency", type: ChannelType.GuildVoice }
                ]
            },
            {
                name: "🛡️ SECURITY SECTOR",
                permissions: [
                    { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: enforcerRole?.id, allow: [PermissionFlagsBits.ViewChannel] }
                ],
                channels: [
                    { name: "🛠️-staff-hub", type: ChannelType.GuildText, topic: "Staff coordination and internal chat." },
                    { name: "🚨-admin-lounge", type: ChannelType.GuildText, topic: "Private area for administrators." },
                    { name: "⚖️-evidence", type: ChannelType.GuildText, topic: "Moderation logs and evidence storage." },
                    { name: "📡-bot-logs", type: ChannelType.GuildText, topic: "Bot logs and system activity." },
                    { name: "🕵️-audit-trails", type: ChannelType.GuildText, topic: "Administrative record keeping." }
                ]
            },
            {
                name: "📊 LOGISTICS SECTOR",
                permissions: [
                    { id: guild.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] }
                ],
                channels: [
                    { name: "🎫-ticket-hub", type: ChannelType.GuildText, topic: "Open a support ticket here." },
                    { name: "🛰️-system-status", type: ChannelType.GuildText, topic: "Astra system health and status." },
                    { name: "💡-suggestions", type: ChannelType.GuildText, allowCitizen: true, topic: "Submit server suggestions." },
                    { name: "🐛-bug-reports", type: ChannelType.GuildText, allowCitizen: true, topic: "Report bugs and system issues." }
                ]
            },
            {
                name: "🏦 ECONOMY SECTOR",
                permissions: [
                    { id: guild.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] }
                ],
                channels: [
                    { name: "🛒-marketplace", type: ChannelType.GuildText, topic: "Trade credits for exclusive roles and perks." },
                    { name: "💰-daily-claims", type: ChannelType.GuildText, topic: "Claim your daily tactical allowance." },
                    { name: "📈-stock-market", type: ChannelType.GuildText, topic: "Simulated sector trade and economy logs." }
                ]
            },
            {
                name: "📂 ARCHIVE SECTOR",
                permissions: [
                    { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: enforcerRole?.id, allow: [PermissionFlagsBits.ViewChannel] }
                ],
                channels: [
                    { name: "📁-case-files", type: ChannelType.GuildText, topic: "Closed moderation cases and archives." },
                    { name: "📜-legacy-logs", type: ChannelType.GuildText, topic: "Old system logs and data history." }
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
            .setFooter({ text: 'Astra Architect v7.0.0 Apex' })
            .setTimestamp();

        await interaction.editReply({ embeds: [successEmbed] });

        // 3. ROLE INFORMATION PAYLOAD
        const infoChannel = guild.channels.cache.find(c => c.name === "📜-role-information" && c.type === ChannelType.GuildText) as TextChannel;
        if (infoChannel) {
            const roleEmbed = new EmbedBuilder()
                .setTitle('📜 ASTRA HIERARCHY REGISTRY')
                .setDescription('Below is a detailed diagnostic of the server roles and their respective clearance levels.')
                .setColor(0x3498db)
                .addFields(
                    { name: '🌟 SUPREME', value: 'Highest administrative authority. Absolute sector control.' },
                    { name: '🛡️ ADMINISTRATOR', value: 'Strategic management and infrastructure oversight.' },
                    { name: '💠 ELITE', value: 'High-clearance moderation and community enforcement.' },
                    { name: '👮 MODERATOR', value: 'Standard tactical security and conflict resolution.' },
                    { name: '🛡️ ENFORCER', value: 'Entry-level security and message frequency maintenance.' },
                    { name: '🧪 RESEARCHER', value: 'Technical contributors and development partners.' },
                    { name: '🎖️ VETERAN', value: 'Long-term citizens with priority communication clearance.' },
                    { name: '💎 BOOSTER', value: 'Citizens providing direct fiscal support to the sector.' },
                    { name: '👥 CITIZEN', value: 'Standard operative with basic communication clearance.' }
                )
                .addFields({ 
                    name: '🏆 LEVELING MILESTONES', 
                    value: 'Roles earned through engagement: `LVL 5`, `LVL 10`, `LVL 25`, `LVL 50`, `LVL 100`.' 
                })
                .setFooter({ text: 'Astra Intelligence Registry v7.0.0' })
                .setTimestamp();

            await infoChannel.send({ embeds: [roleEmbed] });
        }
    }
};
