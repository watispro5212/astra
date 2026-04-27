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
        .setDescription('📊 See info about the server and the bot.')
        .setDMPermission(false)
        .addSubcommand(sub =>
            sub.setName('avatar')
                .setDescription('🖼️ Get someone\'s profile picture.')
                .addUserOption(opt => opt.setName('target').setDescription('The person to look at.'))
        )
        .addSubcommand(sub =>
            sub.setName('stats')
                .setDescription('📈 See how the bot is doing.')
        )
        .addSubcommand(sub =>
            sub.setName('user')
                .setDescription('👤 Get info about a member.')
                .addUserOption(opt => opt.setName('target').setDescription('The member to check.'))
        )
        .addSubcommand(sub =>
            sub.setName('server')
                .setDescription('🏰 See details about this server.')
        )
        .addSubcommand(sub =>
            sub.setName('role')
                .setDescription('🎖️ See details about a role.')
                .addRoleOption(opt => opt.setName('role').setDescription('The role to check.').setRequired(true))
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
                .setTitle(`🖼️ PROFILE PICTURE: ${user.username.toUpperCase()}`)
                .setImage(avatarUrl)
                .setDescription(`[🔗 Download](${avatarUrl})`)
                .setFooter({ text: `Astra Bot` })
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

            const connectionInfo = `\`\`\`ansi\n\u001b[1;36mShard   :\u001b[0m ${shardId + 1}/${totalShards}\n\u001b[1;35mPing    :\u001b[0m ${interaction.client.ws.ping}ms\n\u001b[1;32mServers :\u001b[0m ${interaction.client.guilds.cache.size}\`\`\``;
            const systemInfo = `\`\`\`ansi\n\u001b[1;36mRAM     :\u001b[0m ${memUsage.toFixed(1)}MB / ${(totalMem).toFixed(0)}MB\n\u001b[1;35mCPU     :\u001b[0m ${os.loadavg()[0].toFixed(2)} avg\n\u001b[1;32mNode    :\u001b[0m ${process.version}\`\`\``;
            const versionInfo = `\`\`\`ansi\n\u001b[1;36mBot     :\u001b[0m ${VERSION}\n\u001b[1;35mdjs     :\u001b[0m v${djsVersion}\n\u001b[1;32mHost    :\u001b[0m ${os.hostname()}\`\`\``;

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle('📈 BOT STATUS')
                .setThumbnail(interaction.client.user?.displayAvatarURL()!)
                .addFields(
                    { name: '🌐 Connection', value: connectionInfo, inline: true },
                    { name: '💻 System', value: systemInfo, inline: true },
                    { name: '⏱️ Uptime', value: `\`\`\`ansi\n\u001b[1;32m${days}d ${hours}h ${minutes}m ${seconds}s\u001b[0m\`\`\``, inline: true },
                    { name: '📊 Memory Usage', value: `\`\`\`ansi\n\u001b[1;36m[${memBar}] ${memPct}%\u001b[0m\`\`\``, inline: false },
                    { name: '🤖 Version', value: versionInfo, inline: false },
                )
                .setFooter({ text: `Bot is online.` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'user') {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
            const user   = interaction.options.getUser('target') || interaction.user;
            const member = await guild.members.fetch(user.id).catch(() => null);

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle(`👤 USER INFO: ${user.username.toUpperCase()}`)
                .setThumbnail(user.displayAvatarURL({ size: 512 }))
                .addFields(
                    { name: '🆔 User ID',      value: `\`${user.id}\``,                                      inline: true },
                    { name: '🤖 Bot',          value: `\`${user.bot ? 'Yes' : 'No'}\``,                      inline: true },
                    { name: '📅 Joined Discord', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,   inline: true },
                    { name: '🎖️ Highest Role', value: member?.roles.highest.name || '—',                     inline: true },
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
                    { name: '📥 Joined Server', value: `<t:${Math.floor(member.joinedTimestamp! / 1000)}:D> (<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>)`, inline: false },
                    { name: `📜 Roles [${member.roles.cache.size - 1}]`, value: roles.length > 1024 ? roles.substring(0, 1020) + '…' : roles, inline: false },
                );
            }

            embed.setFooter({ text: `Astra Bot` }).setTimestamp();
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
                .setTitle(`🏰 SERVER INFO: ${guild.name.toUpperCase()}`)
                .setThumbnail(guild.iconURL({ size: 512 }))
                .setImage(guild.bannerURL({ size: 1024 }) ?? null)
                .addFields(
                    { name: '🆔 Server ID',     value: `\`${guild.id}\``,                                         inline: true },
                    { name: '👑 Owner',         value: `${owner.user}`,                                           inline: true },
                    { name: '📅 Created',       value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`,      inline: true },
                    { name: '👥 Members',       value: `\`\`\`Total : ${guild.memberCount}\nHumans: ${guild.memberCount - bots}\nBots  : ${bots}\`\`\``, inline: true },
                    { name: '📐 Channels',      value: `\`\`\`Text : ${textChs}\nVoice: ${voiceChs}\nCategories: ${catChs}\`\`\``, inline: true },
                    { name: '✨ Server Level',   value: `\`\`\`Boosts: ${guild.premiumSubscriptionCount || 0}\nLevel : ${guild.premiumTier}\nVerify: ${guild.verificationLevel}\`\`\``, inline: true },
                )
                .setFooter({ text: `Astra Server Info` })
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
                .setTitle(`🎖️ ROLE INFO: ${role.name.toUpperCase()}`)
                .addFields(
                    { name: '🆔 Role ID',       value: `\`${role.id}\``,                                          inline: true },
                    { name: '🎨 Color',         value: `\`${role.hexColor}\``,                                    inline: true },
                    { name: '📌 Position',      value: `\`#${role.position}\``,                                   inline: true },
                    { name: '👥 Members',       value: `\`${memberCount}\``,                                      inline: true },
                    { name: '🔔 Mentionable',    value: `\`${role.mentionable ? 'Yes' : 'No'}\``,                  inline: true },
                    { name: '📌 Hoisted',        value: `\`${role.hoist ? 'Yes' : 'No'}\``,                        inline: true },
                    { name: '📅 Created',       value: `<t:${Math.floor(role.createdTimestamp / 1000)}:D>`,        inline: true },
                    { name: '🤖 Bot Role',      value: `\`${role.managed ? 'Yes' : 'No'}\``,                    inline: true },
                    { name: '🔑 Permissions',   value: `\`\`\`${perms}\`\`\``,                                   inline: false },
                )
                .setFooter({ text: `Astra Bot` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }
    }
};

export default command;
