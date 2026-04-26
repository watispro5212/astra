import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    Role,
    EmbedBuilder,
    version as djsVersion,
    MessageFlags
} from 'discord.js';
import { Command } from '../types';
import * as os from 'os';
import { THEME, VERSION, PROTOCOL } from '../core/constants';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('📊 Access sector intelligence and system diagnostics.')
        .addSubcommand(sub =>
            sub.setName('avatar')
                .setDescription('🛰️ Extract high-fidelity avatar data of an operative.')
                .addUserOption(opt => opt.setName('target').setDescription('The target to analyze.'))
        )
        .addSubcommand(sub =>
            sub.setName('stats')
                .setDescription('📡 System performance and network diagnostics.')
        )
        .addSubcommand(sub =>
            sub.setName('user')
                .setDescription('👤 Detailed intelligence report on a server member.')
                .addUserOption(opt => opt.setName('target').setDescription('The member to analyze.'))
        )
        .addSubcommand(sub =>
            sub.setName('server')
                .setDescription('🏰 Sector configuration and population statistics.')
        )
        .addSubcommand(sub =>
            sub.setName('role')
                .setDescription('🎖️ Detailed breakdown of a role\'s configuration.')
                .addRoleOption(opt => opt.setName('role').setDescription('The role to analyze.').setRequired(true))
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const guild = interaction.guild!;

        if (subcommand === 'avatar') {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
            const user = interaction.options.getUser('target') || interaction.user;
            const avatarUrl = user.displayAvatarURL({ size: 2048 });

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle(`🖼️ AVATAR MATRIX: ${user.username.toUpperCase()}`)
                .setImage(avatarUrl)
                .setDescription(`[🔗 Download High-Res](${avatarUrl})`)
                .setFooter({ text: `Astra Intelligence Agency • ${VERSION} ${PROTOCOL}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'stats') {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
            const uptime = process.uptime();
            const days    = Math.floor(uptime / 86400);
            const hours   = Math.floor(uptime / 3600) % 24;
            const minutes = Math.floor(uptime / 60) % 60;
            const seconds = Math.floor(uptime) % 60;

            const memUsage  = process.memoryUsage().heapUsed / 1024 / 1024;
            const totalMem  = os.totalmem() / 1024 / 1024;
            const memPct    = ((memUsage / totalMem) * 100).toFixed(1);
            const barFilled = Math.round((memUsage / totalMem) * 10);
            const memBar    = `${'█'.repeat(barFilled)}${'░'.repeat(10 - barFilled)}`;

            const shardId     = interaction.client.shard?.ids[0] ?? 0;
            const totalShards = interaction.client.shard?.count ?? 1;

            const embed = new EmbedBuilder()
                .setColor(THEME.ACCENT)
                .setTitle('📡 ASTRA SYSTEM DIAGNOSTICS')
                .setThumbnail(interaction.client.user?.displayAvatarURL()!)
                .addFields(
                    { name: '🛰️ Network Telemetry', value: `\`\`\`Shard : ${shardId + 1}/${totalShards}\nPing  : ${interaction.client.ws.ping}ms\nGuilds: ${interaction.client.guilds.cache.size}\`\`\``, inline: true },
                    { name: '💻 Computational Core', value: `\`\`\`RAM  : ${memUsage.toFixed(1)}MB/${(totalMem).toFixed(0)}MB\nCPU  : ${os.loadavg()[0].toFixed(2)} avg\nNode : ${process.version}\`\`\``, inline: true },
                    { name: '⏱️ Operational Uptime', value: `\`${days}d ${hours}h ${minutes}m ${seconds}s\``, inline: true },
                    { name: '📊 Memory Allocation', value: `\`[${memBar}] ${memPct}%\``, inline: false },
                    { name: '🤖 Protocol Versioning', value: `\`\`\`Astra : ${VERSION} ${PROTOCOL}\ndiscord.js: v${djsVersion}\nHost  : ${os.hostname()}\`\`\``, inline: false },
                )
                .setFooter({ text: `Astra Global Infrastructure • All sectors nominal` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'user') {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
            const user   = interaction.options.getUser('target') || interaction.user;
            const member = await guild.members.fetch(user.id).catch(() => null);

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle(`👤 INTELLIGENCE FILE: ${user.username.toUpperCase()}`)
                .setThumbnail(user.displayAvatarURL({ size: 512 }))
                .addFields(
                    { name: '🆔 User ID',      value: `\`${user.id}\``,                                      inline: true },
                    { name: '🤖 Bot Account',  value: `\`${user.bot ? 'Yes' : 'No'}\``,                      inline: true },
                    { name: '📅 Account Age',  value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,   inline: true },
                    { name: '🎖️ Top Role',    value: member?.roles.highest.name || '—',                     inline: true },
                    { name: '🚦 Status',       value: `\`${member?.presence?.status ?? 'offline'}\``,         inline: true },
                    { name: '🏷️ Nickname',     value: member?.nickname ? `\`${member.nickname}\`` : '`None`', inline: true },
                );

            if (member) {
                const roles = member.roles.cache
                    .filter(r => r.id !== guild.id)
                    .sort((a, b) => b.position - a.position)
                    .map(r => `<@&${r.id}>`)
                    .join(' ') || '`No roles`';

                embed.addFields(
                    { name: '📥 Sector Admission', value: `<t:${Math.floor(member.joinedTimestamp! / 1000)}:D> (<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>)`, inline: false },
                    { name: `📜 Clearance Roles [${member.roles.cache.size - 1}]`, value: roles.length > 1024 ? roles.substring(0, 1020) + '…' : roles, inline: false },
                );
            }

            embed.setFooter({ text: `Astra Intelligence Agency • ${VERSION}` }).setTimestamp();
            await interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'server') {
            await interaction.deferReply();
            const owner    = await guild.fetchOwner();
            const channels = guild.channels.cache;
            const textChs  = channels.filter(c => c.type === 0).size;
            const voiceChs = channels.filter(c => c.type === 2).size;
            const catChs   = channels.filter(c => c.type === 4).size;
            const bots     = guild.members.cache.filter(m => m.user.bot).size;

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle(`🏰 SECTOR PROFILE: ${guild.name.toUpperCase()}`)
                .setThumbnail(guild.iconURL({ size: 512 }))
                .setImage(guild.bannerURL({ size: 1024 }) ?? null)
                .addFields(
                    { name: '🆔 Sector ID',     value: `\`${guild.id}\``,                                         inline: true },
                    { name: '👑 Commander',      value: `${owner.user}`,                                           inline: true },
                    { name: '📅 Commissioned',   value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`,      inline: true },
                    { name: '👥 Personnel',      value: `\`\`\`Total : ${guild.memberCount}\nHumans: ${guild.memberCount - bots}\nBots  : ${bots}\`\`\``, inline: true },
                    { name: '📐 Infrastructure', value: `\`\`\`Text : ${textChs}\nVoice: ${voiceChs}\nCat  : ${catChs}\`\`\``, inline: true },
                    { name: '✨ Sector Status',  value: `\`\`\`Boosts: ${guild.premiumSubscriptionCount || 0}\nTier  : ${guild.premiumTier}\nVerify: ${guild.verificationLevel}\`\`\``, inline: true },
                )
                .setFooter({ text: `Astra Sector Diagnostics • ${VERSION}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'role') {
            await interaction.deferReply();
            const role = interaction.options.getRole('role') as Role;
            if (!role?.permissions) {
                return interaction.editReply({ content: '❌ Could not resolve role data.' });
            }

            // Count members with role
            await guild.members.fetch();
            const memberCount = guild.members.cache.filter(m => m.roles.cache.has(role.id)).size;

            const perms = role.permissions.toArray()
                .map(p => p.replace(/([A-Z])/g, ' $1').trim())
                .slice(0, 10)
                .join('\n') || 'No special permissions';

            const embed = new EmbedBuilder()
                .setColor(role.color || 0x7f8c8d)
                .setTitle(`🎖️ CLEARANCE PROFILE: ${role.name.toUpperCase()}`)
                .addFields(
                    { name: '🆔 Role ID',       value: `\`${role.id}\``,                                          inline: true },
                    { name: '🎨 Tactical Color', value: `\`${role.hexColor}\``,                                    inline: true },
                    { name: '📌 Hierarchy',      value: `\`#${role.position}\``,                                   inline: true },
                    { name: '👥 Assigned',       value: `\`${memberCount}\``,                                      inline: true },
                    { name: '🔔 Mentionable',    value: `\`${role.mentionable ? 'Yes' : 'No'}\``,                  inline: true },
                    { name: '📌 Hoisted',        value: `\`${role.hoist ? 'Yes' : 'No'}\``,                        inline: true },
                    { name: '📅 Established',    value: `<t:${Math.floor(role.createdTimestamp / 1000)}:D>`,        inline: true },
                    { name: '🤖 Automated',      value: `\`${role.managed ? 'Yes (Bot)' : 'No'}\``,               inline: true },
                    { name: '🔑 Key Permissions', value: `\`\`\`${perms}\`\`\``,                                   inline: false },
                )
                .setFooter({ text: `Astra Intelligence Agency • ${VERSION}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }
    }
};

export default command;
