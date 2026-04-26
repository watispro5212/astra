import { WebhookClient, EmbedBuilder } from 'discord.js';
import { config } from '../core/config';
import logger from '../core/logger';
import os from 'os';

const VERSION = 'v7.2.0 "Omega Protocol"';
const ACCENT  = 0x5865F2; // blurple-ish accent for all status embeds
const GREEN   = 0x2ecc71;
const RED     = 0xe74c3c;
const BLUE    = 0x3498db;
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

    private static getWebhook(): WebhookClient | null {
        if (!this.webhook && config.statusWebhookUrl) {
            this.webhook = new WebhookClient({ url: config.statusWebhookUrl });
        }
        return this.webhook;
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
            .setTitle('💓 SYSTEM HEARTBEAT — TITAN v7.5.0')
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
