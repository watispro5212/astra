import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    EmbedBuilder, 
    Role,
    version as djsVersion 
} from 'discord.js';
import { Command } from '../types';
import * as os from 'os';

const VER = 'v7.2.0';

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
            const user = interaction.options.getUser('target') || interaction.user;
            const avatarUrl = user.displayAvatarURL({ size: 2048 });

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle(`🖼️ AVATAR MATRIX: ${user.username.toUpperCase()}`)
                .setImage(avatarUrl)
                .setDescription(`[🔗 Download High-Res](${avatarUrl})`)
                .setFooter({ text: `Astra Intelligence Agency • ${VER}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'stats') {
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
                .setColor(0x2ecc71)
                .setTitle('📡 ASTRA SYSTEM DIAGNOSTICS')
                .setThumbnail(interaction.client.user?.displayAvatarURL()!)
                .addFields(
                    { name: '🛰️ Network', value: `\`\`\`Shard : ${shardId + 1}/${totalShards}\nPing  : ${interaction.client.ws.ping}ms\nGuilds: ${interaction.client.guilds.cache.size}\`\`\``, inline: true },
                    { name: '💻 Core', value: `\`\`\`RAM  : ${memUsage.toFixed(1)}MB/${(totalMem).toFixed(0)}MB\nCPU  : ${os.loadavg()[0].toFixed(2)} avg\nNode : ${process.version}\`\`\``, inline: true },
                    { name: '⏱️ Uptime', value: `\`${days}d ${hours}h ${minutes}m ${seconds}s\``, inline: true },
                    { name: '📊 Memory', value: `\`[${memBar}] ${memPct}%\``, inline: false },
                    { name: '🤖 Version Control', value: `\`\`\`Astra : ${VER} Omega Protocol\ndiscord.js: v${djsVersion}\nHost  : ${os.hostname()}\`\`\``, inline: false },
                )
                .setFooter({ text: `Astra Global Infrastructure • All systems nominal` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'user') {
            const user   = interaction.options.getUser('target') || interaction.user;
            const member = await guild.members.fetch(user.id).catch(() => null);

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle(`👤 INTELLIGENCE FILE: ${user.username.toUpperCase()}`)
                .setThumbnail(user.displayAvatarURL({ size: 512 }))
                .addFields(
                    { name: '🆔 User ID',      value: `\`${user.id}\``,                                      inline: true },
                    { name: '🤖 Bot Account',  value: `\`${user.bot ? 'Yes' : 'No'}\``,                      inline: true },
                    { name: '📅 Account Age',  value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,   inline: true },
                    { name: '🎖️ Top Role',    value: member?.roles.highest.name || '—',                     inline: true },
                    { name: '🚦 Status',       value: member?.presence?.status ?? '`offline`',                inline: true },
                    { name: '🏷️ Nickname',     value: member?.nickname ? `\`${member.nickname}\`` : '`None\`', inline: true },
                );

            if (member) {
                const roles = member.roles.cache
                    .filter(r => r.id !== guild.id)
                    .sort((a, b) => b.position - a.position)
                    .map(r => `<@&${r.id}>`)
                    .join(' ') || '`No roles`';

                embed.addFields(
                    { name: '📥 Joined Server', value: `<t:${Math.floor(member.joinedTimestamp! / 1000)}:D> (<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>)`, inline: false },
                    { name: `📜 Roles [${member.roles.cache.size - 1}]`, value: roles.length > 1024 ? roles.substring(0, 1020) + '…' : roles, inline: false },
                );
            }

            embed.setFooter({ text: `Astra Intelligence Agency • ${VER}` }).setTimestamp();
            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'server') {
            const owner    = await guild.fetchOwner();
            const channels = guild.channels.cache;
            const textChs  = channels.filter(c => c.type === 0).size;
            const voiceChs = channels.filter(c => c.type === 2).size;
            const catChs   = channels.filter(c => c.type === 4).size;
            const bots     = guild.members.cache.filter(m => m.user.bot).size;

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle(`🏰 SECTOR PROFILE: ${guild.name.toUpperCase()}`)
                .setThumbnail(guild.iconURL({ size: 512 }))
                .setImage(guild.bannerURL({ size: 1024 }) ?? null)
                .addFields(
                    { name: '🆔 Guild ID',      value: `\`${guild.id}\``,                                         inline: true },
                    { name: '👑 Commander',      value: `${owner.user}`,                                           inline: true },
                    { name: '📅 Founded',        value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`,      inline: true },
                    { name: '👥 Personnel',      value: `\`\`\`Total : ${guild.memberCount}\nHumans: ${guild.memberCount - bots}\nBots  : ${bots}\`\`\``, inline: true },
                    { name: '📐 Infrastructure', value: `\`\`\`Text : ${textChs}\nVoice: ${voiceChs}\nCat  : ${catChs}\`\`\``, inline: true },
                    { name: '✨ Sector Status',  value: `\`\`\`Boosts: ${guild.premiumSubscriptionCount || 0}\nTier  : ${guild.premiumTier}\nVerify: ${guild.verificationLevel}\`\`\``, inline: true },
                    { name: '🌐 Locale',         value: `\`${guild.preferredLocale}\``,                           inline: true },
                    { name: '🎭 Roles',          value: `\`${guild.roles.cache.size}\``,                           inline: true },
                    { name: '😀 Emojis',         value: `\`${guild.emojis.cache.size}\``,                          inline: true },
                )
                .setFooter({ text: `Astra Sector Diagnostics • ${VER}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'role') {
            const role = interaction.options.getRole('role') as Role;
            if (!role?.permissions) {
                return interaction.reply({ content: '❌ Could not resolve role data.', ephemeral: true });
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
                .setTitle(`🎖️ ROLE PROFILE: ${role.name.toUpperCase()}`)
                .addFields(
                    { name: '🆔 Role ID',       value: `\`${role.id}\``,                                          inline: true },
                    { name: '🎨 Colour',         value: `\`${role.hexColor}\``,                                    inline: true },
                    { name: '📌 Position',       value: `\`#${role.position}\``,                                   inline: true },
                    { name: '👥 Members',        value: `\`${memberCount}\``,                                      inline: true },
                    { name: '🔔 Mentionable',    value: `\`${role.mentionable ? 'Yes' : 'No'}\``,                  inline: true },
                    { name: '📌 Hoisted',        value: `\`${role.hoist ? 'Yes' : 'No'}\``,                        inline: true },
                    { name: '📅 Created',        value: `<t:${Math.floor(role.createdTimestamp / 1000)}:D>`,        inline: true },
                    { name: '🤖 Managed',        value: `\`${role.managed ? 'Yes (Bot)' : 'No'}\``,               inline: true },
                    { name: '🔑 Key Permissions', value: `\`\`\`${perms}\`\`\``,                                   inline: false },
                )
                .setFooter({ text: `Astra Intelligence Agency • ${VER}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }
    }
};

export default command;
