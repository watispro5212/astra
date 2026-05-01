import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    version as djsVersion,
    MessageFlags
} from 'discord.js';
import { Command } from '../types';
import { config } from '../core/config';
import { db } from '../core/database';
import { StatusService } from '../services/statusService';
import { THEME, VERSION, footerText } from '../core/constants';
import logger from '../core/logger';
import os from 'os';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('system')
        .setDescription('⚙️ Bot settings and info.')
        .setDMPermission(false)
        .addSubcommand(sub =>
            sub.setName('sync')
               .setDescription('🔄 Update bot commands across all servers (Owner Only).')
        )
        .addSubcommand(sub =>
            sub.setName('status')
               .setDescription('📡 Check how the bot is running.')
        )
        .addSubcommand(sub =>
            sub.setName('ping')
               .setDescription('🏓 Check the bot speed.')
        )
        .addSubcommand(sub =>
            sub.setName('servers')
               .setDescription('🌐 See which servers the bot is in (Owner Only).')
        )
        .addSubcommand(sub =>
            sub.setName('alert')
               .setDescription('⚠️ Send a message to all servers (Owner Only).')
               .addStringOption(opt => opt.setName('message').setDescription('The message to send').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('update')
               .setDescription('📋 Show the latest bot updates and version info.')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        // ── SYNC ──────────────────────────────────────────────────────────────
        if (subcommand === 'sync') {
            if (interaction.user.id !== config.ownerId) {
                return interaction.reply({ content: '❌ **ACCESS DENIED**: You need to be the Bot Owner to do this.', flags: [MessageFlags.Ephemeral] });
            }

            let deferred = false;
            try {
                await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
                deferred = true;
            } catch (err) {
                logger.warn(`Failed to defer sync interaction: ${err}`);
            }
            
            try {
                await (interaction.client as any).syncCommands('clear');
                const count = await (interaction.client as any).syncCommands(process.env.NODE_ENV === 'production' ? 'global' : 'guild');
                const successMsg = `✅ **UPDATE SUCCESSFUL**: \`${count}\` commands updated. The bot is now running on the latest engine.`;
                
                if (deferred) {
                    await interaction.editReply({ content: successMsg });
                } else {
                    await interaction.followUp({ content: successMsg, flags: [MessageFlags.Ephemeral] });
                }
            } catch (err) {
                if (deferred) {
                    await interaction.editReply({ content: `🚨 **UPDATE FAILED**: ${err}` });
                }
            }

        // ── UPDATE ────────────────────────────────────────────────────────────
        // ── STATUS ────────────────────────────────────────────────────────────
        } else if (subcommand === 'status') {
            await interaction.deferReply();

            const uptime    = process.uptime();
            const d = Math.floor(uptime / 86400);
            const h = Math.floor((uptime % 86400) / 3600);
            const m = Math.floor((uptime % 3600) / 60);

            const mem        = process.memoryUsage();
            const heapUsed   = mem.heapUsed / 1024 / 1024;
            const heapTotal  = mem.heapTotal / 1024 / 1024;
            const rss        = mem.rss / 1024 / 1024;
            
            const memPct    = Math.round((heapUsed / heapTotal) * 100);
            const barFill   = Math.min(10, Math.max(0, Math.round(memPct / 10)));
            const memBar    = `${'█'.repeat(barFill)}${'░'.repeat(10 - barFill)} ${memPct}%`;

            const ping      = interaction.client.ws.ping;
            const pingLabel = ping < 100 ? '🟢' : ping < 200 ? '🟡' : '🔴';
            const shardId   = interaction.client.shard?.ids[0] ?? 0;
            const shards    = interaction.client.shard?.count ?? 1;
            const memberCount = interaction.client.guilds.cache.reduce((a, g) => a + (g.memberCount || 0), 0);

            const embed = new EmbedBuilder()
                .setColor(ping < 150 ? 0x2ecc71 : 0xf1c40f)
                .setTitle(`📡 BOT STATUS`)
                .setThumbnail(interaction.client.user?.displayAvatarURL() ?? null)
                .addFields(
                    { name: '⏱️ Uptime',         value: `\`${d}d ${h}h ${m}m\``,                               inline: true },
                    { name: `${pingLabel} Speed`,   value: `\`${ping}ms\``,                                      inline: true },
                    { name: '⚙️ CPU Load',        value: `\`${os.loadavg()[0].toFixed(2)}%\``,                  inline: true },
                    { name: '🌐 Servers',         value: `\`${interaction.client.guilds.cache.size}\``,          inline: true },
                    { name: '👥 Users',           value: `\`${memberCount.toLocaleString()}\``,                  inline: true },
                    { name: '🔀 Shards',          value: `\`${shardId + 1} / ${shards}\``,                       inline: true },
                    { name: '💾 Heap Memory',     value: `\`${heapUsed.toFixed(0)}MB / ${heapTotal.toFixed(0)}MB\`\n${memBar}`, inline: false },
                    { name: '🔋 Resident Set',    value: `\`${rss.toFixed(0)}MB\``,                              inline: true },
                    { name: '🖥️ Host',            value: `\`${os.hostname()} • ${os.type()}\``,                inline: true },
                )
                .setFooter({ text: footerText('Astra') })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });

        // ── PING ──────────────────────────────────────────────────────────────
        } else if (subcommand === 'ping') {
            const sent = await interaction.reply({ content: '📡 **CHECKING SPEED...**', fetchReply: true });
            const rtt  = sent.createdTimestamp - interaction.createdTimestamp;
            const ws   = interaction.client.ws.ping;

            const wsLabel  = ws  < 100 ? '🟢 Excellent' : ws  < 200 ? '🟡 Good'    : '🔴 Poor';
            const rttLabel = rtt < 150 ? '🟢 Fast'      : rtt < 300 ? '🟡 Average' : '🔴 Slow';

            const embed = new EmbedBuilder()
                .setColor(ws < 100 ? 0x2ecc71 : ws < 200 ? 0xf1c40f : 0xe74c3c)
                .setTitle('🏓 BOT SPEED')
                .addFields(
                    { name: '🔌 WebSocket',  value: `${wsLabel}\n\`${ws}ms\``,    inline: true },
                    { name: '📡 API Speed',  value: `${rttLabel}\n\`${rtt}ms\``,  inline: true },
                )
                .setFooter({ text: footerText('Ping') })
                .setTimestamp();

            return interaction.editReply({ content: '', embeds: [embed] });

        // ── SERVERS ───────────────────────────────────────────────────────────
        } else if (subcommand === 'servers') {
            if (interaction.user.id !== config.ownerId) {
                return interaction.reply({ content: '❌ Access Denied: You need to be the Bot Owner.', ephemeral: true });
            }

            await interaction.deferReply({ ephemeral: true });
            const guilds = interaction.client.guilds.cache;
            const totalMembers = guilds.reduce((a, g) => a + (g.memberCount || 0), 0);

            const guildList = guilds
                .sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0))
                .first(15)
                .map((g, i) => `\`${i + 1}.\` **${g.name}** — \`${g.memberCount?.toLocaleString() ?? '?'}\` members`)
                .join('\n');

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle('🌐 SERVERS LIST')
                .setDescription(guildList || 'The bot is not in any servers.')
                .addFields(
                    { name: '📊 Total Servers',    value: `\`${guilds.size}\``,                     inline: true },
                    { name: '👥 Total Users',      value: `\`${totalMembers.toLocaleString()}\``,    inline: true },
                )
                .setFooter({ text: footerText('Servers') })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });

        // ── ALERT ─────────────────────────────────────────────────────────────
        } else if (subcommand === 'alert') {
            if (interaction.user.id !== config.ownerId) {
                return interaction.reply({ content: '❌ Access Denied: You need to be the Bot Owner.', ephemeral: true });
            }

            const message = interaction.options.getString('message')!;
            await interaction.deferReply({ ephemeral: true });

            let successCount = 0;
            const alertEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('⚠️ MESSAGE FROM THE BOT')
                .setDescription(message)
                .setThumbnail(interaction.client.user?.displayAvatarURL() ?? null)
                .setFooter({ text: footerText('Alert') })
                .setTimestamp();

            for (const guild of interaction.client.guilds.cache.values()) {
                try {
                    const guildConfig = await db.fetchOne('SELECT log_channel_id FROM guilds WHERE guild_id = ?', guild.id);
                    let channel: any = null;

                    if (guildConfig?.log_channel_id) {
                        channel = await guild.channels.fetch(guildConfig.log_channel_id).catch(() => null);
                    }
                    if (!channel) {
                        channel = guild.channels.cache.find(c => c.isTextBased() && c.permissionsFor(guild.members.me!)?.has(PermissionFlagsBits.SendMessages));
                    }
                    if (channel?.isTextBased()) {
                        await (channel as any).send({ embeds: [alertEmbed] });
                        successCount++;
                    }
                } catch (err) {
                    logger.error(`Alert failed for guild ${guild.id}: ${err}`);
                }
            }

            return interaction.editReply({ content: `✅ Message sent. Reached **${successCount}** of **${interaction.client.guilds.cache.size}** servers.` });

        // ── UPDATE ────────────────────────────────────────────────────────────
        } else if (subcommand === 'update') {
            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle(`🚀 Astra ${VERSION} — Latest Updates`)
                .setDescription('**Major Version 9.0.0** — April 30, 2026\n\n' +
                    '🎯 **Major Improvements**\n' +
                    '• Version bump to 9.0.0 reflecting significant improvements\n' +
                    '• Comprehensive code review and optimization across all modules\n' +
                    '• Enhanced security measures and dependency updates\n' +
                    '• Optimized bot performance and reduced resource usage\n\n' +
                    '🔧 **Technical Enhancements**\n' +
                    '• Fixed 7 security vulnerabilities in dependencies\n' +
                    '• Resolved TypeScript compilation errors\n' +
                    '• Improved type safety throughout the codebase\n' +
                    '• Updated documentation and version consistency\n\n' +
                    '📚 **Documentation Updates**\n' +
                    '• Updated README, security policy, and license\n' +
                    '• Synchronized version numbers across all files\n' +
                    '• Enhanced website with current version information')
                .addFields(
                    { name: '📦 Current Version', value: `\`${VERSION}\``, inline: true },
                    { name: '📅 Release Date', value: 'April 30, 2026', inline: true },
                    { name: '🔗 Changelog', value: '[View Full Changelog](https://watispro5212.github.io/astra/changelog.html)', inline: false }
                )
                .setFooter({ text: footerText('Updates') })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        }
    }
};

export default command;
