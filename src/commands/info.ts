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
import { THEME, VERSION, footerText } from '../core/constants';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('📊 Bot information, server stats, and help.')
        .setDMPermission(true)
        .addSubcommand(sub =>
            sub.setName('help')
                .setDescription('📡 See all Astra commands — works in DMs too!')
        )
        .addSubcommand(sub =>
            sub.setName('stats')
                .setDescription('📈 See how the bot is doing.')
        )
        .addSubcommand(sub =>
            sub.setName('avatar')
                .setDescription('🖼️ Get someone\'s profile picture.')
                .addUserOption(opt => opt.setName('target').setDescription('The person to look at.'))
        )
        .addSubcommand(sub =>
            sub.setName('user')
                .setDescription('👤 Get info about a server member.')
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
        const guild = interaction.guild;

        // ── HELP ──────────────────────────────────────────────────────────────
        if (subcommand === 'help') {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle('📡 ASTRA COMMAND LIST')
                .setThumbnail(interaction.client.user?.displayAvatarURL()!)
                .setDescription('All commands now use `/astra` as the unified entry point. Most work in **DMs** too!\nType `/astra info help` in any chat to see the full list.')
                .addFields(
                    {
                        name: '💰 Economy',
                        value: '`/astra economy daily` `work` `mine` `gamble` `slots` `coinflip` `rob` `balance` `pay` `bank` `harvest`',
                        inline: false
                    },
                    {
                        name: '📈 Leveling',
                        value: '`/astra leveling rank` `leaderboard`',
                        inline: false
                    },
                    {
                        name: '🛡️ Moderation',
                        value: '`/astra mod warn` `kick` `ban` `timeout` `purge` `history` `case`',
                        inline: false
                    },
                    {
                        name: '📊 Stock Market',
                        value: '`/astra stockmarket market` `buy` `sell` `portfolio`',
                        inline: false
                    },
                    {
                        name: '🛒 Shop',
                        value: '`/astra shop view` `buy` `inventory`',
                        inline: false
                    },
                    {
                        name: '🎉 Community',
                        value: '`/astra giveaway start` `end` `reroll` — `/astra ticket create` `close` — `/astra welcome setup`',
                        inline: false
                    },
                    {
                        name: '🤖 AI Assistant (DM-native)',
                        value: '`/astra ai model` `status` `info` — or just **DM me anything!**',
                        inline: false
                    },
                    {
                        name: '⚙️ Utility & Info',
                        value: '`/astra profile` `info help` `/astra utility remind` `poll` `/astra system status` `ping`',
                        inline: false
                    },
                )
                .setFooter({ text: footerText('Help') })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });

        // ── STATS ──────────────────────────────────────────────────────────────
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
            const barFilled = Math.min(10, Math.max(0, Math.round((memUsage / totalMem) * 10)));
            const memBar    = `${'█'.repeat(barFilled)}${'░'.repeat(10 - barFilled)}`;

            const shardId     = interaction.client.shard?.ids[0] ?? 0;
            const totalShards = interaction.client.shard?.count ?? 1;

            const connectionInfo = `\`\`\`ansi\n[1;36mShard   :[0m ${shardId + 1}/${totalShards}\n[1;35mPing    :[0m ${interaction.client.ws.ping}ms\n[1;32mServers :[0m ${interaction.client.guilds.cache.size}\`\`\``;
            const systemInfo    = `\`\`\`ansi\n[1;36mRAM     :[0m ${memUsage.toFixed(1)}MB / ${totalMem.toFixed(0)}MB\n[1;35mCPU     :[0m ${os.loadavg()[0].toFixed(2)} avg\n[1;32mNode    :[0m ${process.version}\`\`\``;
            const versionInfo   = `\`\`\`ansi\n[1;36mBot     :[0m ${VERSION}\n[1;35mdjs     :[0m v${djsVersion}\n[1;32mHost    :[0m ${os.hostname()}\`\`\``;

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle('📈 BOT STATUS')
                .setThumbnail(interaction.client.user?.displayAvatarURL()!)
                .addFields(
                    { name: '🌐 Connection', value: connectionInfo, inline: true },
                    { name: '💻 System',     value: systemInfo,     inline: true },
                    { name: '⏱️ Uptime',     value: `\`\`\`ansi\n[1;32m${days}d ${hours}h ${minutes}m ${seconds}s[0m\`\`\``, inline: true },
                    { name: '📊 Memory',     value: `\`\`\`ansi\n[1;36m[${memBar}] ${memPct}%[0m\`\`\``, inline: false },
                    { name: '🤖 Version',    value: versionInfo,    inline: false },
                )
                .setFooter({ text: footerText('Stats') })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });

        // ── AVATAR ─────────────────────────────────────────────────────────────
        } else if (subcommand === 'avatar') {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
            const user      = interaction.options.getUser('target') || interaction.user;
            const avatarUrl = user.displayAvatarURL({ size: 2048 });

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle(`🖼️ ${user.username.toUpperCase()}'S AVATAR`)
                .setImage(avatarUrl)
                .setDescription(`[🔗 Open full size](${avatarUrl})`)
                .setFooter({ text: footerText('Astra') })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });

        // ── USER ───────────────────────────────────────────────────────────────
        } else if (subcommand === 'user') {
            if (!guild) {
                return interaction.reply({ content: '❌ This subcommand only works in a server.', flags: [MessageFlags.Ephemeral] });
            }
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
            const user   = interaction.options.getUser('target') || interaction.user;
            const member = await guild.members.fetch(user.id).catch(() => null);

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle(`👤 USER: ${user.username.toUpperCase()}`)
                .setThumbnail(user.displayAvatarURL({ size: 512 }))
                .addFields(
                    { name: '🆔 User ID',        value: `\`${user.id}\``,                                   inline: true },
                    { name: '🤖 Bot',            value: `\`${user.bot ? 'Yes' : 'No'}\``,                   inline: true },
                    { name: '📅 Joined Discord', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: '🎖️ Highest Role',   value: member?.roles.highest.name || '—',                  inline: true },
                    { name: '🚦 Status',          value: `\`${member?.presence?.status ?? 'offline'}\``,     inline: true },
                    { name: '🏷️ Nickname',        value: member?.nickname ? `\`${member.nickname}\`` : '`None`', inline: true },
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

            embed.setFooter({ text: footerText('Astra') }).setTimestamp();
            return interaction.editReply({ embeds: [embed] });

        // ── SERVER ─────────────────────────────────────────────────────────────
        } else if (subcommand === 'server') {
            if (!guild) {
                return interaction.reply({ content: '❌ This subcommand only works in a server.', flags: [MessageFlags.Ephemeral] });
            }
            await interaction.deferReply();
            const owner    = await guild.fetchOwner();
            const channels = guild.channels.cache;
            const textChs  = channels.filter(c => c.type === 0).size;
            const voiceChs = channels.filter(c => c.type === 2).size;
            const catChs   = channels.filter(c => c.type === 4).size;
            const bots     = guild.members.cache.filter(m => m.user.bot).size;

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle(`🏰 SERVER: ${guild.name.toUpperCase()}`)
                .setThumbnail(guild.iconURL({ size: 512 }))
                .setImage(guild.bannerURL({ size: 1024 }) ?? null)
                .addFields(
                    { name: '🆔 Server ID',   value: `\`${guild.id}\``,                                    inline: true },
                    { name: '👑 Owner',       value: `${owner.user}`,                                      inline: true },
                    { name: '📅 Created',     value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
                    { name: '👥 Members',     value: `\`\`\`Total : ${guild.memberCount}\nHumans: ${guild.memberCount - bots}\nBots  : ${bots}\`\`\``, inline: true },
                    { name: '📐 Channels',    value: `\`\`\`Text : ${textChs}\nVoice: ${voiceChs}\nCats : ${catChs}\`\`\``, inline: true },
                    { name: '✨ Server Level', value: `\`\`\`Boosts: ${guild.premiumSubscriptionCount || 0}\nLevel : ${guild.premiumTier}\nVerify: ${guild.verificationLevel}\`\`\``, inline: true },
                )
                .setFooter({ text: footerText('Server') })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });

        // ── ROLE ───────────────────────────────────────────────────────────────
        } else if (subcommand === 'role') {
            if (!guild) {
                return interaction.reply({ content: '❌ This subcommand only works in a server.', flags: [MessageFlags.Ephemeral] });
            }
            await interaction.deferReply();
            const role = interaction.options.getRole('role') as Role;
            if (!role?.permissions) {
                return interaction.editReply({ content: '❌ Could not resolve role data.' });
            }

            await guild.members.fetch();
            const memberCount = guild.members.cache.filter(m => m.roles.cache.has(role.id)).size;
            const perms = role.permissions.toArray()
                .map(p => p.replace(/([A-Z])/g, ' $1').trim())
                .slice(0, 10)
                .join('\n') || 'No special permissions';

            const embed = new EmbedBuilder()
                .setColor(role.color || 0x7f8c8d)
                .setTitle(`🎖️ ROLE: ${role.name.toUpperCase()}`)
                .addFields(
                    { name: '🆔 Role ID',     value: `\`${role.id}\``,                                  inline: true },
                    { name: '🎨 Color',       value: `\`${role.hexColor}\``,                            inline: true },
                    { name: '📌 Position',    value: `\`#${role.position}\``,                           inline: true },
                    { name: '👥 Members',     value: `\`${memberCount}\``,                              inline: true },
                    { name: '🔔 Mentionable', value: `\`${role.mentionable ? 'Yes' : 'No'}\``,         inline: true },
                    { name: '📌 Hoisted',     value: `\`${role.hoist ? 'Yes' : 'No'}\``,               inline: true },
                    { name: '📅 Created',     value: `<t:${Math.floor(role.createdTimestamp / 1000)}:D>`, inline: true },
                    { name: '🤖 Bot Role',    value: `\`${role.managed ? 'Yes' : 'No'}\``,             inline: true },
                    { name: '🔑 Permissions', value: `\`\`\`${perms}\`\`\``,                           inline: false },
                )
                .setFooter({ text: footerText('Astra') })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }
    }
};

export default command;
