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
import { THEME, VERSION, PROTOCOL } from '../core/constants';
import logger from '../core/logger';
import os from 'os';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('system')
        .setDescription('⚙️ Core system operations and diagnostics.')
        .setDMPermission(false)
        .addSubcommand(sub =>
            sub.setName('sync')
               .setDescription('🔄 Force a complete synchronization of all tactical slash commands (Owner Only).')
        )
        .addSubcommand(sub =>
            sub.setName('update')
               .setDescription('📋 View the latest Astra patch notes and system changes.')
        )
        .addSubcommand(sub =>
            sub.setName('status')
               .setDescription('📡 Live system health, latency, and resource diagnostics.')
        )
        .addSubcommand(sub =>
            sub.setName('ping')
               .setDescription('🏓 Analyze network heartbeat and API response times.')
        )
        .addSubcommand(sub =>
            sub.setName('servers')
               .setDescription('🌐 View top sectors where Astra is currently deployed (Owner Only).')
        )
        .addSubcommand(sub =>
            sub.setName('alert')
               .setDescription('⚠️ Broadcast a system-wide emergency transmission (Owner Only).')
               .addStringOption(opt => opt.setName('message').setDescription('The emergency message to broadcast').setRequired(true))
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        // ── SYNC ──────────────────────────────────────────────────────────────
        if (subcommand === 'sync') {
            if (interaction.user.id !== config.ownerId) {
                return interaction.reply({ content: '❌ **ACCESS DENIED**: Owner clearance required for Sector Synchronization.', flags: [MessageFlags.Ephemeral] });
            }

            await interaction.reply({ content: '🔄 **INITIATING COMMAND SYNCHRONIZATION...**\nPurging legacy command echoes and re-deploying Titan v7.5.0 assets.', flags: [MessageFlags.Ephemeral] });
            
            try {
                await (interaction.client as any).syncCommands('clear');
                const count = await (interaction.client as any).syncCommands(process.env.NODE_ENV === 'production' ? 'global' : 'guild');
                await interaction.editReply({ content: `✅ **SYNCHRONIZATION SUCCESSFUL**: \`${count}\` tactical assets successfully deployed across the network. All sectors are now running the Titan v7.5.0 engine.` });
            } catch (err) {
                await interaction.editReply({ content: `🚨 **SYNCHRONIZATION FAILURE**: ${err}` });
            }

        // ── UPDATE ────────────────────────────────────────────────────────────
        } else if (subcommand === 'update') {
            const embed = StatusService.getUpdateEmbed(interaction.client);
            return interaction.reply({ embeds: [embed] });

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
            const memBar    = `${'█'.repeat(Math.round(memPct / 10))}${'░'.repeat(10 - Math.round(memPct / 10))} ${memPct}%`;

            const ping      = interaction.client.ws.ping;
            const pingLabel = ping < 100 ? '🟢' : ping < 200 ? '🟡' : '🔴';
            const shardId   = interaction.client.shard?.ids[0] ?? 0;
            const shards    = interaction.client.shard?.count ?? 1;
            const memberCount = interaction.client.guilds.cache.reduce((a, g) => a + (g.memberCount || 0), 0);

            const embed = new EmbedBuilder()
                .setColor(ping < 150 ? 0x2ecc71 : 0xf1c40f)
                .setTitle('📡 SYSTEM STATUS — TITAN v7.5.0 DIAGNOSTICS')
                .setThumbnail(interaction.client.user?.displayAvatarURL() ?? null)
                .addFields(
                    { name: '⏱️ Uptime',         value: `\`${d}d ${h}h ${m}m\``,                               inline: true },
                    { name: `${pingLabel} Latency`, value: `\`${ping}ms\``,                                      inline: true },
                    { name: '⚙️ CPU Load',        value: `\`${os.loadavg()[0].toFixed(2)}%\``,                  inline: true },
                    { name: '🌐 Sectors',         value: `\`${interaction.client.guilds.cache.size}\``,          inline: true },
                    { name: '👥 Operatives',      value: `\`${memberCount.toLocaleString()}\``,                  inline: true },
                    { name: '🔀 Shards',          value: `\`${shardId + 1} / ${shards}\``,                       inline: true },
                    { name: '💾 Heap Memory',     value: `\`${heapUsed.toFixed(0)}MB / ${heapTotal.toFixed(0)}MB\`\n${memBar}`, inline: false },
                    { name: '🔋 Resident Set',    value: `\`${rss.toFixed(0)}MB\``,                              inline: true },
                    { name: '🖥️ Host',            value: `\`${os.hostname()} • ${os.type()}\``,                inline: true },
                )
                .setFooter({ text: `Astra Intelligence Division • ${VERSION} • TITAN CORE` })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });

        // ── PING ──────────────────────────────────────────────────────────────
        } else if (subcommand === 'ping') {
            const sent = await interaction.reply({ content: '📡 **ANALYZING HEARTBEAT...**', fetchReply: true });
            const rtt  = sent.createdTimestamp - interaction.createdTimestamp;
            const ws   = interaction.client.ws.ping;

            const wsLabel  = ws  < 100 ? '🟢 Excellent' : ws  < 200 ? '🟡 Good'    : '🔴 Poor';
            const rttLabel = rtt < 150 ? '🟢 Fast'      : rtt < 300 ? '🟡 Average' : '🔴 Slow';

            const embed = new EmbedBuilder()
                .setColor(ws < 100 ? 0x2ecc71 : ws < 200 ? 0xf1c40f : 0xe74c3c)
                .setTitle('🏓 HEARTBEAT ANALYSIS')
                .addFields(
                    { name: '🔌 WebSocket',  value: `${wsLabel}\n\`${ws}ms\``,    inline: true },
                    { name: '📡 API (RTT)',  value: `${rttLabel}\n\`${rtt}ms\``,  inline: true },
                )
                .setFooter({ text: `Astra Network Telemetry • ${VERSION}` })
                .setTimestamp();

            return interaction.editReply({ content: '', embeds: [embed] });

        // ── SERVERS ───────────────────────────────────────────────────────────
        } else if (subcommand === 'servers') {
            if (interaction.user.id !== config.ownerId) {
                return interaction.reply({ content: '❌ Access Denied: Owner clearance required.', ephemeral: true });
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
                .setTitle('🌐 SECTOR DEPLOYMENT OVERVIEW')
                .setDescription(guildList || 'No sectors online.')
                .addFields(
                    { name: '📊 Total Sectors',    value: `\`${guilds.size}\``,                     inline: true },
                    { name: '👥 Total Operatives', value: `\`${totalMembers.toLocaleString()}\``,    inline: true },
                )
                .setFooter({ text: `Showing top 15 by member count • ${VERSION}` })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });

        // ── ALERT ─────────────────────────────────────────────────────────────
        } else if (subcommand === 'alert') {
            if (interaction.user.id !== config.ownerId) {
                return interaction.reply({ content: '❌ Access Denied: Owner clearance required.', ephemeral: true });
            }

            const message = interaction.options.getString('message')!;
            await interaction.deferReply({ ephemeral: true });

            let successCount = 0;
            const alertEmbed = new EmbedBuilder()
                .setColor(0xff0000)
                .setTitle('⚠️ SYSTEM-WIDE ALERT')
                .setDescription(message)
                .setThumbnail(interaction.client.user?.displayAvatarURL() ?? null)
                .setFooter({ text: `Official Transmission from Astra Core • ${VERSION}` })
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

            return interaction.editReply({ content: `✅ Alert broadcast complete. Reached **${successCount}** of **${interaction.client.guilds.cache.size}** sectors.` });
        }
    }
};

export default command;
