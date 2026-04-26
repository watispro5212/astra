import { WebhookClient, EmbedBuilder } from 'discord.js';
import { config } from '../core/config';
import { db } from '../core/database';
import { THEME, VERSION, PROTOCOL } from '../core/constants';
import logger from '../core/logger';
import os from 'os';

const GREEN   = 0x2ecc71;
const RED     = 0xe74c3c;
const YELLOW  = 0xf1c40f;

function uptimeString(seconds: number): string {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return d ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`;
}

function memBar(used: number, total: number): string {
    const pct = Math.round((used / total) * 100);
    const filled = Math.round(pct / 10);
    return `${'█'.repeat(filled)}${'░'.repeat(10 - filled)} ${pct}%`;
}

export class StatusService {
    private static webhook: WebhookClient | null = null;
    private static updatesWebhook: WebhookClient | null = null;

    private static getWebhook(): WebhookClient | null {
        if (!this.webhook && config.statusWebhookUrl) {
            this.webhook = new WebhookClient({ url: config.statusWebhookUrl });
        }
        return this.webhook;
    }

    private static getUpdatesWebhook(): WebhookClient | null {
        if (!this.updatesWebhook && config.updatesWebhookUrl) {
            this.updatesWebhook = new WebhookClient({ url: config.updatesWebhookUrl });
        }
        return this.updatesWebhook;
    }

    // ── VERSION TRACKER ──────────────────────────────────────────────────────
    /**
     * Checks if the bot has been updated since the last broadcast.
     * If a new version is detected, it automatically fires the update webhook.
     */
    public static async checkVersionUpdate(client: any) {
        try {
            const currentVersion = VERSION;
            
            // Atomic update: only succeeds if the version in DB is different from current
            // This prevents race conditions in sharded environments
            const result = await db.execute(
                'UPDATE system_meta SET value = ? WHERE key = ? AND value != ?', 
                currentVersion, 'last_broadcasted_version', currentVersion
            );

            // If no rows were updated, it might be because the key doesn't exist yet
            if (result.count === 0) {
                const meta = await db.fetchOne('SELECT value FROM system_meta WHERE key = ?', 'last_broadcasted_version');
                if (!meta) {
                    // First time initialization
                    await db.execute('INSERT INTO system_meta (key, value) VALUES (?, ?)', 'last_broadcasted_version', currentVersion);
                    logger.info(`🚀 INITIAL VERSION LOCK: ${currentVersion}. Broadcasting mission update...`);
                    await this.broadcastUpdate(client);
                }
            } else {
                // Successful update from a previous version
                logger.info(`🚀 NEW VERSION DETECTED: ${currentVersion}. Broadcasting mission update...`);
                await this.broadcastUpdate(client);
            }
        } catch (err) {
            logger.error(`Version check failure: ${err}`);
        }
    }

    public static async broadcastUpdate(client: any) {
        const webhook = this.getUpdatesWebhook();
        if (!webhook) return;

        const embed = this.getUpdateEmbed(client);
        
        await webhook.send({ 
            username: 'ASTRA MISSION CONTROL', 
            avatarURL: 'https://cdn-icons-png.flaticon.com/512/3655/3655611.png',
            embeds: [embed] 
        }).catch(err => logger.error(`Update Webhook Error: ${err}`));
    }

    public static getUpdateEmbed(client: any): EmbedBuilder {
        return new EmbedBuilder()
            .setColor(THEME.PRIMARY)
            .setTitle(`🪐 ASTRA ${VERSION} — MISSION UPDATE`)
            .setAuthor({ name: 'ASTRA INTELLIGENCE COMMAND', iconURL: client.user?.displayAvatarURL() })
            .setDescription('The **Titan Core Engine** has been successfully transitioned to a high-performance cloud infrastructure. This update ensures permanent data persistence and superior operational stability.')
            .setThumbnail('https://cdn-icons-png.flaticon.com/512/8654/8654162.png')
            .addFields(
                {
                    name: '✨ NEW OPERATIONAL ASSETS',
                    value: [
                        '> **Supabase Cloud Infrastructure** — Enterprise-grade PostgreSQL persistence layer.',
                        '> **High-Throughput Pooling** — Optimized database connection management.',
                        '> **Titan v7.5.0 Core** — Refined telemetry and high-fidelity aesthetics.',
                        '> **Prefix Protocol** — Message-based interface now active (Default: `-`).',
                        '> **ATX Speculation** — Advanced stock market analysis tools.'
                    ].join('\n')
                },
                {
                    name: '🗑️ DECOMMISSIONED SYSTEMS',
                    value: [
                        '> **Local SQLite Storage** — Purged for enhanced reliability.',
                        '> **Legacy Status Page** — Replaced by high-fidelity Webhook telemetry.',
                        '> **Transient Memory** — Data no longer resets during deployment cycles.'
                    ].join('\n')
                },
                {
                    name: '🔧 SYSTEM OPTIMIZATIONS',
                    value: [
                        '• **Command Indexing** — Fixed visibility issues for `/economy harvest`.',
                        '• **Intelligence Rank** — Stabilized Postgres subqueries for global rankings.',
                        '• **Interaction Engine** — Resolved timeout anomalies during high-load periods.',
                        '• **iOS Compatibility** — Fixed Safari-specific user-selection rendering.'
                    ].join('\n')
                },
                {
                    name: '🚀 FUTURE TELEMETRY',
                    value: [
                        '• **AI Sentinel** — Neural-network powered threat detection (Internal Testing).',
                        '• **Cross-Sector Rankings** — Global intelligence and wealth leaderboards.',
                        '• **Advanced Automation** — Enhanced server protection protocols.'
                    ].join('\n')
                }
            )
            .setImage('https://i.imgur.com/8Qx8R1k.png')
            .setFooter({ text: `Astra Mission Update • ${PROTOCOL} • ${VERSION}` })
            .setTimestamp();
    }

    // ── BOOT ─────────────────────────────────────────────────────────────────
    public static async sendSystemOnline(client: any) {
        const webhook = this.getWebhook();
        if (!webhook) return;

        const totalMem   = os.totalmem()  / 1024 / 1024;
        const freeMem    = os.freemem()   / 1024 / 1024;
        const usedMem    = totalMem - freeMem;
        const memberCount = client.guilds.cache.reduce((a: number, g: any) => a + (g.memberCount || 0), 0);

        const embed = new EmbedBuilder()
            .setColor(GREEN)
            .setTitle('🟢 ASTRA ONLINE — BOOT SEQUENCE COMPLETE')
            .setDescription(`**${VERSION}** has initialized successfully. All systems are nominal.`)
            .setThumbnail(client.user?.displayAvatarURL() ?? null)
            .addFields(
                { name: '🛰️ Version',         value: `\`${VERSION}\``,                                     inline: true },
                { name: '🌐 Sectors',          value: `\`${client.guilds.cache.size} guilds\``,              inline: true },
                { name: '👥 Operatives',       value: `\`${memberCount.toLocaleString()} members\``,         inline: true },
                { name: '💻 Host',             value: `\`${os.hostname()}\``,                                inline: true },
                { name: '🖥️ Platform',         value: `\`${os.type()} ${os.arch()}\``,                      inline: true },
                { name: '📡 WebSocket',        value: `\`${client.ws.ping}ms\``,                             inline: true },
                { name: '🔋 Memory',           value: `\`${usedMem.toFixed(0)}MB / ${totalMem.toFixed(0)}MB\`\n${memBar(usedMem, totalMem)}`, inline: false },
                { name: '⚙️ Node.js',          value: `\`${process.version}\``,                              inline: true },
                { name: '🕐 Boot Time',        value: `<t:${Math.floor(Date.now() / 1000)}:R>`,              inline: true },
            )
            .setFooter({ text: `Astra Intelligence Division • ${new Date().toUTCString()}` })
            .setTimestamp();

        await webhook.send({ username: 'Astra Status', embeds: [embed] })
            .catch(err => logger.error(`Status Webhook Error: ${err}`));
    }

    // ── HEARTBEAT ─────────────────────────────────────────────────────────────
    public static async sendHeartbeat(client: any) {
        const webhook = this.getWebhook();
        if (!webhook) return;

        const uptime     = process.uptime();
        const mem        = process.memoryUsage();
        const heapUsed   = mem.heapUsed / 1024 / 1024;
        const heapTotal  = mem.heapTotal / 1024 / 1024;
        const rss        = mem.rss / 1024 / 1024;
        
        const memberCount = client.guilds.cache.reduce((a: number, g: any) => a + (g.memberCount || 0), 0);
        const ping       = client.ws.ping;
        const pingColor  = ping < 100 ? GREEN : ping < 200 ? YELLOW : RED;

        const embed = new EmbedBuilder()
            .setColor(pingColor)
            .setTitle(`💓 SYSTEM HEARTBEAT — ${PROTOCOL} ${VERSION}`)
            .setDescription('Operational stability pulse. Core tactical matrix is nominal.')
            .setThumbnail('https://cdn-icons-png.flaticon.com/512/8654/8654162.png')
            .addFields(
                { name: '⏱️ Uptime',          value: `\`${uptimeString(uptime)}\``,                          inline: true },
                { name: '📡 Latency',         value: `\`${ping}ms\``,                                        inline: true },
                { name: '⚙️ CPU Load',        value: `\`${os.loadavg()[0].toFixed(2)}%\``,                   inline: true },
                { name: '🌐 Sectors',         value: `\`${client.guilds.cache.size}\``,                      inline: true },
                { name: '👥 Operatives',      value: `\`${memberCount.toLocaleString()}\``,                   inline: true },
                { name: '💾 Heap Memory',     value: `\`${heapUsed.toFixed(2)}MB / ${heapTotal.toFixed(2)}MB\``, inline: true },
                { name: '🔋 Resident Set',    value: `\`${rss.toFixed(2)}MB\``,                              inline: true },
            )
            .setFooter({ text: `Astra Intelligence Division • Pulse Telemetry` })
            .setTimestamp();

        await webhook.send({ 
            username: 'ASTRA TITAN STATUS', 
            avatarURL: 'https://cdn-icons-png.flaticon.com/512/3655/3655611.png',
            embeds: [embed] 
        }).catch(err => logger.error(`Status Webhook Error: ${err}`));
    }

    // ── HEALTH CHECK ──────────────────────────────────────────────────────────
    public static async sendHealthCheck(client: any) {
        const webhook = this.getWebhook();
        if (!webhook) return;

        const ping       = client.ws.ping;
        const pingStatus = ping < 100 ? '🟢 Excellent' : ping < 200 ? '🟡 Degraded' : '🔴 Critical';
        
        const mem        = process.memoryUsage();
        const heapUsed   = mem.heapUsed / 1024 / 1024;
        const rss        = mem.rss / 1024 / 1024;
        const memStatus  = (heapUsed / (mem.heapTotal / 1024 / 1024)) < 0.8 ? '🟢 Nominal' : '🔴 Critical';

        const embed = new EmbedBuilder()
            .setColor(ping < 150 ? GREEN : YELLOW)
            .setTitle('🏥 SYSTEM HEALTH DIAGNOSTICS')
            .addFields(
                { name: '📡 WebSocket',       value: `${pingStatus} \`${ping}ms\``,                          inline: true  },
                { name: '💾 Matrix Heap',     value: `${memStatus} \`${heapUsed.toFixed(0)}MB\``,            inline: true  },
                { name: '🔋 Resident Memory', value: `\`${rss.toFixed(0)}MB\``,                              inline: true  },
                { name: '⏱️ System Uptime',   value: `\`${uptimeString(process.uptime())}\``,                inline: true  },
                { name: '🌐 Total Sectors',   value: `\`${client.guilds.cache.size}\``,                      inline: true  },
                { name: '💻 Load Average',    value: `\`${os.loadavg()[0].toFixed(2)}\``,                    inline: true  },
            )
            .setFooter({ text: `Astra Health Monitor • TITAN CORE` })
            .setTimestamp();

        await webhook.send({ 
            username: 'ASTRA HEALTH', 
            avatarURL: 'https://cdn-icons-png.flaticon.com/512/2913/2913445.png',
            embeds: [embed] 
        }).catch(err => logger.error(`Status Webhook Error: ${err}`));
    }

    // ── ERROR ─────────────────────────────────────────────────────────────────
    public static async sendError(error: any, context?: { commandName?: string; userId?: string; guildId?: string }) {
        const webhook = this.getWebhook();
        if (!webhook) return;

        const stack = (error?.stack || String(error)).substring(0, 900);
        const fields: any[] = [
            { name: '⚠️ Error', value: `\`\`\`${error?.message || error}\`\`\`` },
            { name: '📂 Stack', value: `\`\`\`${stack}\`\`\`` },
        ];

        if (context?.commandName) fields.push({ name: '🔧 Command', value: `\`/${context.commandName}\``, inline: true });
        if (context?.userId)      fields.push({ name: '👤 User',    value: `\`${context.userId}\``,       inline: true });
        if (context?.guildId)     fields.push({ name: '🌐 Guild',   value: `\`${context.guildId}\``,      inline: true });

        const embed = new EmbedBuilder()
            .setColor(RED)
            .setTitle('🚨 SYSTEM ANOMALY DETECTED')
            .setDescription('A critical error has been captured by the Astra error pipeline.')
            .addFields(fields)
            .setFooter({ text: `Astra Error Reporter • ${VERSION}` })
            .setTimestamp();

        await webhook.send({ username: 'Astra Errors', embeds: [embed] })
            .catch(err => logger.error(`Status Webhook Error: ${err}`));
    }

    // ── SERVER COUNT EVENT ────────────────────────────────────────────────────
    public static async sendServerCountUpdate(client: any, joined: boolean, guildName: string) {
        const webhook = this.getWebhook();
        if (!webhook) return;

        const embed = new EmbedBuilder()
            .setColor(joined ? GREEN : RED)
            .setTitle(joined ? '📥 NEW SECTOR ADDED' : '📤 SECTOR DEPARTED')
            .setDescription(joined
                ? `Astra has been deployed to a new sector: **${guildName}**`
                : `Astra has been removed from sector: **${guildName}**`)
            .addFields(
                { name: '🌐 Total Sectors', value: `\`${client.guilds.cache.size} guilds\``, inline: true }
            )
            .setFooter({ text: `Astra Intelligence Division • ${VERSION}` })
            .setTimestamp();

        await webhook.send({ username: 'Astra Status', embeds: [embed] })
            .catch(err => logger.error(`Status Webhook Error: ${err}`));
    }

    // ── SCHEDULERS ────────────────────────────────────────────────────────────
    public static startHeartbeat(client: any) {
        // Heartbeat every 30 minutes
        setInterval(() => { this.sendHeartbeat(client); }, 30 * 60 * 1000);
    }

    public static startHealthCheck(client: any) {
        // Health check every hour
        setInterval(() => { this.sendHealthCheck(client); }, 60 * 60 * 1000);
    }
}
