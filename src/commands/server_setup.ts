import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, ChannelType, PermissionsBitField, OverwriteResolvable, TextChannel, MessageFlags } from 'discord.js';
import logger from '../core/logger';
import { footerText } from '../core/constants';

const TARGET_GUILD_ID = '1494909279159980192';

export default {
    data: new SlashCommandBuilder()
        .setName('setup_server')
        .setDescription('🏗️ Setup: Automatically create all channels and roles.')
        .setDMPermission(false)
        .addBooleanOption(opt => 
            opt.setName('reset')
               .setDescription('⚠️ DANGER: Delete ALL channels AND roles before rebuilding?')
               .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: ChatInputCommandInteraction) {
        if (interaction.guildId !== TARGET_GUILD_ID) {
            await interaction.reply({ 
                content: '❌ This command can only be used in the main server.', 
                flags: [MessageFlags.Ephemeral]
            });
            return;
        }

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const isReset = interaction.options.getBoolean('reset');
        const guild = interaction.guild!;

        const startEmbed = new EmbedBuilder()
            .setTitle('🏗️ Setting up server...')
            .setDescription(isReset 
                ? '⚠️ **RESET MODE**: Deleting all channels and roles to start fresh...' 
                : '🔄 **UPDATE MODE**: Creating missing channels and roles...')
            .setColor(isReset ? 0xe74c3c : 0x3498db)
            .setFooter({ text: footerText('Server Setup') })
            .setTimestamp();

        await interaction.editReply({ embeds: [startEmbed] });

        if (isReset) {
            try {
                // 1. Purge Channels
                const channels = await guild.channels.fetch();
                for (const channel of channels.values()) {
                    if (channel && channel.id !== interaction.channelId) {
                        await channel.delete('Server Setup').catch(() => null);
                    }
                }

                // 2. Purge Roles (Excluding @everyone and integration roles)
                const roles = await guild.roles.fetch();
                for (const role of roles.values()) {
                    if (role.name !== "@everyone" && role.managed === false && role.editable) {
                        await role.delete('Server Setup').catch(() => null);
                    }
                }
            } catch (err) {
                logger.error(`Reset failed: ${err}`);
            }
        }

        // 1. SERVER ROLE HIERARCHY
        const rolesToCreate = [
            { name: "💠 HEAD MOD", color: "#3498db", permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.MuteMembers, PermissionFlagsBits.DeafenMembers] },
            { name: "👮 MODERATOR", color: "#2980b9", permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers, PermissionFlagsBits.ViewAuditLog, PermissionFlagsBits.ModerateMembers] },
            { name: "🔦 TRIAL MOD", color: "#3498db", permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ViewAuditLog] },
            { name: "🛡️ HELPER", color: "#e67e22", permissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ModerateMembers] },
            { name: "🧪 RESEARCHER", color: "#9b59b6", permissions: [PermissionFlagsBits.AttachFiles, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions] },
            { name: "🎖️ VETERAN", color: "#f1c40f", permissions: [PermissionFlagsBits.UseExternalEmojis, PermissionFlagsBits.PrioritySpeaker] },
            { name: "🎨 CREATIVE", color: "#e91e63", permissions: [PermissionFlagsBits.AttachFiles, PermissionFlagsBits.AddReactions] },
            { name: "📣 ANNOUNCER", color: "#1abc9c", permissions: [PermissionFlagsBits.MentionEveryone] },
            { name: "💎 BOOSTER", color: "#f47fff", permissions: [PermissionFlagsBits.UseExternalEmojis, PermissionFlagsBits.ChangeNickname] },
            { name: "✨ PIONEER", color: "#3498db", permissions: [PermissionFlagsBits.SendMessages] },
            { name: "🤖 BOT", color: "#1abc9c", permissions: [PermissionFlagsBits.ManageWebhooks] },
            { name: "👥 CITIZEN", color: "#95a5a6", permissions: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AddReactions] },
            // Leveling Milestone Roles
            { name: "🏆 LVL 200", color: "#ffd700", permissions: [] },
            { name: "🏆 LVL 150", color: "#c0c0c0", permissions: [] },
            { name: "🏆 LVL 100", color: "#ffd700", permissions: [] },
            { name: "🏆 LVL 75", color: "#e5e4e2", permissions: [] },
            { name: "🏆 LVL 50", color: "#c0c0c0", permissions: [] },
            { name: "🏆 LVL 25", color: "#cd7f32", permissions: [] },
            { name: "🏆 LVL 15", color: "#95a5a6", permissions: [] },
            { name: "🏆 LVL 10", color: "#3498db", permissions: [] },
            { name: "🏆 LVL 5", color: "#1abc9c", permissions: [] },
            { name: "🏆 LVL 1", color: "#2c3e50", permissions: [] },
        ];

        const createdRoles = new Map<string, any>();
        for (const r of rolesToCreate) {
            const role = await guild.roles.create({
                name: r.name,
                color: r.color as any,
                permissions: r.permissions as any,
                reason: 'Server setup process'
            });
            createdRoles.set(r.name, role);
        }

        const enforcerRole = createdRoles.get("🛡️ HELPER");
        const veteranRole = createdRoles.get("🎖️ VETERAN");
        const boosterRole = createdRoles.get("💎 BOOSTER");

        const blueprint = [
            {
                name: "📢 INFORMATION",
                permissions: [
                    { id: guild.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] },
                    { id: enforcerRole?.id, allow: [PermissionFlagsBits.SendMessages] }
                ],
                channels: [
                    { name: "📜-rules", type: ChannelType.GuildText, topic: "Server rules." },
                    { name: "📢-announcements", type: ChannelType.GuildText, topic: "Important updates." },
                    { name: "👋-welcome", type: ChannelType.GuildText, topic: "New member logs." },
                    { name: "📜-role-info", type: ChannelType.GuildText, topic: "List of server roles." },
                    { name: "❓-faq", type: ChannelType.GuildText, topic: "Common questions." },
                    { name: "🤝-partners", type: ChannelType.GuildText, topic: "Partnered servers." }
                ]
            },
            {
                name: "🏆 LEVELS & RANKS",
                permissions: [
                    { id: guild.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] }
                ],
                channels: [
                    { name: "📈-rank-ups", type: ChannelType.GuildText, topic: "Level up messages." },
                    { name: "🏆-leaderboard", type: ChannelType.GuildText, topic: "Top members." },
                    { name: "🔮-milestones", type: ChannelType.GuildText, topic: "Major achievements." }
                ]
            },
            {
                name: "💬 CHAT CATEGORY",
                permissions: [
                    { id: guild.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages], deny: [] }
                ],
                channels: [
                    { name: "💬-general", type: ChannelType.GuildText, topic: "Main chat." },
                    { name: "🤖-commands", type: ChannelType.GuildText, topic: "Bot commands." },
                    { name: "📸-media", type: ChannelType.GuildText, topic: "Photos and videos." },
                    { name: "🎮-gaming", type: ChannelType.GuildText, topic: "Gaming chat." },
                    { name: "💻-tech", type: ChannelType.GuildText, topic: "Tech talk." },
                    { name: "🎨-art", type: ChannelType.GuildText, topic: "Show off your art." },
                    { name: "🎶-music-chat", type: ChannelType.GuildText, topic: "Talk about music." }
                ]
            },
            {
                name: "💎 VIP CATEGORY",
                permissions: [
                    { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: veteranRole?.id, allow: [PermissionFlagsBits.ViewChannel] },
                    { id: boosterRole?.id, allow: [PermissionFlagsBits.ViewChannel] }
                ],
                channels: [
                    { name: "💎-vip-lounge", type: ChannelType.GuildText, topic: "Exclusive chat for Veterans and Boosters." },
                    { name: "🔊 VIP Voice", type: ChannelType.GuildVoice }
                ]
            },
            {
                name: "🛡️ STAFF CATEGORY",
                permissions: [
                    { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: enforcerRole?.id, allow: [PermissionFlagsBits.ViewChannel] }
                ],
                channels: [
                    { name: "🛠️-staff-chat", type: ChannelType.GuildText, topic: "Staff only." },
                    { name: "🚨-admin-chat", type: ChannelType.GuildText, topic: "Admins only." },
                    { name: "⚖️-logs", type: ChannelType.GuildText, topic: "Logs and evidence." },
                    { name: "📡-bot-logs", type: ChannelType.GuildText, topic: "Bot logs." },
                    { name: "🕵️-audit-log", type: ChannelType.GuildText, topic: "Server history." }
                ]
            },
            {
                name: "📊 SUPPORT CATEGORY",
                permissions: [
                    { id: guild.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] }
                ],
                channels: [
                    { name: "🎫-tickets", type: ChannelType.GuildText, topic: "Open a support ticket." },
                    { name: "🛰️-status", type: ChannelType.GuildText, topic: "Bot status." },
                    { name: "💡-suggestions", type: ChannelType.GuildText, allowCitizen: true, topic: "Submit suggestions." },
                    { name: "🐛-bugs", type: ChannelType.GuildText, allowCitizen: true, topic: "Report bugs." }
                ]
            },
            {
                name: "🏦 MONEY CATEGORY",
                permissions: [
                    { id: guild.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.SendMessages] }
                ],
                channels: [
                    { name: "🛒-shop", type: ChannelType.GuildText, topic: "Buy items and perks." },
                    { name: "💰-daily", type: ChannelType.GuildText, topic: "Claim daily money." },
                    { name: "📈-stocks", type: ChannelType.GuildText, topic: "Stock market updates." }
                ]
            },
            {
                name: "📂 ARCHIVE CATEGORY",
                permissions: [
                    { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: enforcerRole?.id, allow: [PermissionFlagsBits.ViewChannel] }
                ],
                channels: [
                    { name: "📁-old-cases", type: ChannelType.GuildText, topic: "Closed tickets." },
                    { name: "📜-history", type: ChannelType.GuildText, topic: "Old logs." }
                ]
            },
            {
                name: "🔊 VOICE CATEGORY",
                permissions: [
                    { id: guild.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect], deny: [] }
                ],
                channels: [
                    { name: "🔊 Public Voice", type: ChannelType.GuildVoice },
                    { name: "🎮 Gaming Voice", type: ChannelType.GuildVoice },
                    { name: "🎵 Music Room", type: ChannelType.GuildVoice },
                    { name: "🤫 Private Voice", type: ChannelType.GuildVoice },
                    { name: "🥃 Staff Voice", type: ChannelType.GuildVoice, isStaff: true }
                ]
            }
        ];

        for (const section of blueprint) {
            const overwrites: OverwriteResolvable[] = (section.permissions as any[]).map(p => ({
                id: p.id,
                allow: p.allow || [],
                deny: p.deny || []
            }));
            
            const category = await guild.channels.create({
                name: section.name,
                type: ChannelType.GuildCategory,
                permissionOverwrites: overwrites
            });

            for (const c of section.channels) {
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
            .setTitle('✅ Server Setup Complete')
            .setDescription(`The server has been set up! All channels and roles are ready to go.`)
            .setColor(0x2ecc71)
            .setThumbnail(interaction.client.user?.displayAvatarURL()!)
            .setFooter({ text: footerText('Server Setup') })
            .setTimestamp();

        await interaction.editReply({ embeds: [successEmbed] });

        // 3. ROLE INFORMATION PAYLOAD
        const infoChannel = guild.channels.cache.find(c => (c.name === "📜-role-info" || c.name === "📜-role-information") && c.type === ChannelType.GuildText) as TextChannel;
        if (infoChannel) {
            const roleEmbed = new EmbedBuilder()
                .setTitle('📜 SERVER ROLES')
                .setDescription('Here is a list of all the roles and what they are for.')
                .setColor(0x3498db)
                .addFields(
                    { name: '🌟 OWNER', value: 'Server owner and top boss.', inline: true },
                    { name: '🛡️ ADMIN', value: 'Admins who help run the server.', inline: true },
                    { name: '💠 HEAD MOD', value: 'Top-tier moderators.', inline: true },
                    { name: '👮 MODERATOR', value: 'Standard moderators.', inline: true },
                    { name: '🔦 TRIAL MOD', value: 'New moderators in training.', inline: true },
                    { name: '🛡️ HELPER', value: 'Entry-level help.', inline: true },
                    { name: '🧪 RESEARCHER', value: 'Special helpers and devs.', inline: true },
                    { name: '🎖️ VETERAN', value: 'Long-time members.', inline: true },
                    { name: '🎨 CREATIVE', value: 'Members recognized for their art.', inline: true },
                    { name: '📣 ANNOUNCER', value: 'Official announcers.', inline: true },
                    { name: '💎 BOOSTER', value: 'People who boosted the server.', inline: true },
                    { name: '✨ PIONEER', value: 'Founding members.', inline: true },
                    { name: '🤖 BOT', value: 'Server bots.', inline: true },
                    { name: '👥 CITIZEN', value: 'Standard server members.', inline: true }
                )
                .addFields({ 
                    name: '🏆 LEVEL REWARDS', 
                    value: '• `👑 LVL 200`: King of the server\n• `🎖️ LVL 150`: Grand Master\n• `🏆 LVL 100`: Expert Member\n• `🥇 LVL 75`: Pro Member\n• `🥇 LVL 50`: Veteran Member\n• `🥈 LVL 25`: Senior Member\n• `🥈 LVL 15`: Advanced Member\n• `🥉 LVL 10`: Standard Member\n• `🎖️ LVL 5`: Junior Member\n• `🎖️ LVL 1`: New Member' 
                })
                .setFooter({ text: footerText('Server Setup') })
                .setTimestamp();

            await infoChannel.send({ embeds: [roleEmbed] });
        }

        // 4. BRIEFING (OWNER DM)
        const owner = await interaction.client.users.fetch('1320058519642177668').catch(() => null);
        if (owner) {
            const briefingEmbed = new EmbedBuilder()
                .setTitle('🛰️ SETUP COMPLETE: Recommendations')
                .setDescription('The server is set up. You might want to add these other bots to help out:')
                .setColor(0xf1c40f)
                .addFields(
                    { name: '⚔️ Dyno / MEE6', value: 'Good for extra commands and custom stuff.' },
                    { name: '🎵 Jockie Music / FredBoat', value: 'Great for playing music in voice channels.' },
                    { name: '📊 Statbot', value: 'To track how active your server is.' },
                    { name: '🎮 Mudae / Dank Memer', value: 'Fun games for your members.' },
                    { name: '🛡️ Wick Bot', value: 'Extra protection against raids and nukes.' }
                )
                .setFooter({ text: footerText('Server Setup') })
                .setTimestamp();

            await owner.send({ embeds: [briefingEmbed] }).catch(() => logger.warn('Failed to send briefing to owner.'));
        }
    }
};
