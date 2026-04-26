import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    WebhookClient,
    version as djsVersion
} from 'discord.js';
import { Command } from '../types';
import { config } from '../core/config';
import { db } from '../core/database';
import { StatusService } from '../services/statusService';
import logger from '../core/logger';
import os from 'os';

const VERSION = 'v7.3.0 "Omega Protocol"';
const THEME   = 0x3498db;

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('system')
        .setDescription('⚙️ Core system operations and diagnostics.')
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
               .setDescription('🏓 Measure WebSocket heartbeat and API round-trip latency.')
        )
        .addSubcommand(sub =>
            sub.setName('servers')
               .setDescription('🌐 View sector count and deployment statistics (Owner Only).')
        )
        .addSubcommand(sub =>
            sub.setName('alert')
               .setDescription('📢 Broadcast a system-wide alert to all sectors (Owner Only).')
               .addStringOption(opt => opt.setName('message').setDescription('Transmission content.').setRequired(true))
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();

        // ── UPDATE ────────────────────────────────────────────────────────────
        if (subcommand === 'update') {
            const embed = new EmbedBuilder()
                .setColor(THEME)
                .setTitle(`🚀 ASTRA ${VERSION} — PATCH NOTES`)
                .setDescription('The **Omega Protocol** update is a proprietary, high-performance release delivering a full economy overhaul, advanced marketplace logic, and synchronized telemetry pipelines.')
                .setThumbnail(interaction.client.user?.displayAvatarURL() ?? null)
                .addFields(
                    {
                        name: '🔐 Proprietary Status',
                        value: '• Astra v7.3.0 is **NOT open source**. This software is private property.\n• Redistribution or commercial use without authorization is prohibited.'
                    },
                    {
                        name: '💰 Economy & Fiscal Protocols',
                        value: [
                            '• `/economy leaderboard` — Now resolves **usernames** globally',
                            '• `/economy harvest` — Collect passive income from assets',
                            '• `/economy rob` — 40% heist success rate with risk penalty',
                            '• `/economy slots` — High-stakes jackpot system (×50 multiplier)',
                            '• All fiscal actions now report **balance delta** in real-time',
                        ].join('\n')
                    },
                    {
                        name: '🛒 Apex Marketplace',
                        value: [
                            '• `/shop admin add` — Enhanced item categorization and tracking',
                            '• `/shop sell` — Liquidate assets for 50% market value',
                            '• Auto-inventory tracking fixed for all transaction types',
                            '• Improved description and stock handling for rare assets',
                        ].join('\n')
                    },
                    {
                        name: '📡 System Intelligence',
                        value: [
                            '• Dual-webhook synchronization: Status (Health) vs Updates (Announcements)',
                            '• `/system update` — Automatically broadcasts to the official update channel',
                            '• `/system status` — Refined memory bar and resource diagnostics',
                            '• Latency tracking upgraded to full WebSocket + API RTT analysis',
                        ].join('\n')
                    },
                    {
                        name: '⚙️ Infrastructure',
                        value: [
                            `• discord.js \`v${djsVersion}\``,
                            '• Database schema v7.3.0 — Synchronized user lookup optimization',
                            '• Logic re-engineered for closed-source deployment stability',
                        ].join('\n')
                    }
                )
                .setFooter({ text: `Astra Tactical Systems • ${VERSION} • Proprietary Build` })
                .setTimestamp();

            // Fire the updates webhook so the official channel receives patch notes automatically
            if (config.updatesWebhookUrl) {
                try {
                    const wh = new WebhookClient({ url: config.updatesWebhookUrl });
                    await wh.send({ username: 'Astra Updates', embeds: [embed] });
                } catch (err) {
                    logger.warn(`Updates webhook failed: ${err}`);
                }
            }

            return interaction.reply({ embeds: [embed] });

        // ── STATUS ────────────────────────────────────────────────────────────
        } else if (subcommand === 'status') {
            await interaction.deferReply();

            const uptime    = process.uptime();
            const d = Math.floor(uptime / 86400);
            const h = Math.floor((uptime % 86400) / 3600);
            const m = Math.floor((uptime % 3600) / 60);

            const totalMem  = os.totalmem()  / 1024 / 1024;
            const usedMem   = (os.totalmem() - os.freemem()) / 1024 / 1024;
            const memPct    = Math.round((usedMem / totalMem) * 100);
            const memBar    = `${'█'.repeat(Math.round(memPct / 10))}${'░'.repeat(10 - Math.round(memPct / 10))} ${memPct}%`;

            const ping      = interaction.client.ws.ping;
            const pingLabel = ping < 100 ? '🟢' : ping < 200 ? '🟡' : '🔴';
            const shardId   = interaction.client.shard?.ids[0] ?? 0;
            const shards    = interaction.client.shard?.count ?? 1;
            const memberCount = interaction.client.guilds.cache.reduce((a, g) => a + (g.memberCount || 0), 0);

            const embed = new EmbedBuilder()
                .setColor(ping < 150 ? 0x2ecc71 : 0xf1c40f)
                .setTitle('📡 SYSTEM STATUS — LIVE DIAGNOSTICS')
                .setThumbnail(interaction.client.user?.displayAvatarURL() ?? null)
                .addFields(
                    { name: '⏱️ Uptime',         value: `\`${d}d ${h}h ${m}m\``,                               inline: true },
                    { name: `${pingLabel} Latency`, value: `\`${ping}ms\``,                                      inline: true },
                    { name: '⚙️ CPU Load',        value: `\`${os.loadavg()[0].toFixed(2)}%\``,                  inline: true },
                    { name: '🌐 Sectors',         value: `\`${interaction.client.guilds.cache.size}\``,          inline: true },
                    { name: '👥 Operatives',      value: `\`${memberCount.toLocaleString()}\``,                  inline: true },
                    { name: '🔀 Shards',          value: `\`${shardId + 1} / ${shards}\``,                       inline: true },
                    { name: '🔋 Memory',          value: `\`${usedMem.toFixed(0)}MB / ${totalMem.toFixed(0)}MB\`\n${memBar}`, inline: false },
                    { name: '🖥️ Host',            value: `\`${os.hostname()} • ${os.type()} ${os.arch()}\``,   inline: true },
                    { name: '🔢 Runtime',         value: `\`Node.js ${process.version} • discord.js v${djsVersion}\``, inline: true },
                )
                .setFooter({ text: `Astra Intelligence Division • ${VERSION}` })
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
                .setColor(THEME)
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

            // Also fire the webhook so you can track it
            await StatusService.sendError(
                new Error(`SYSTEM ALERT broadcast to ${successCount} sectors: "${message}"`),
                { commandName: 'system alert', userId: interaction.user.id }
            ).catch(() => {});

            return interaction.editReply({ content: `✅ Alert broadcast complete. Reached **${successCount}** of **${interaction.client.guilds.cache.size}** sectors.` });
        }
    }
};

export default command;
