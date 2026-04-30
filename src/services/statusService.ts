import { WebhookClient, EmbedBuilder } from 'discord.js';
import { config } from '../core/config';
import { THEME, VERSION } from '../core/constants';
import logger from '../core/logger';
import os from 'os';

const GREEN  = 0x2ecc71;
const RED    = 0xe74c3c;
const YELLOW = 0xf1c40f;

function uptimeString(seconds: number): string {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return d ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`;
}

function memBar(used: number, total: number): string {
    const pct    = Math.round((used / Math.max(total, 1)) * 100);
    const filled = Math.min(10, Math.max(0, Math.round(pct / 10)));
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
        const totalMem    = os.totalmem()  / 1024 / 1024;
        const freeMem     = os.freemem()   / 1024 / 1024;
        const usedMem     = totalMem - freeMem;
        const memberCount = client.guilds.cache.reduce((a: number, g: any) => a + (g.memberCount || 0), 0);
        const ping        = client.ws.ping;
        const pingLabel   = ping < 100 ? '🟢 Excellent' : ping < 200 ? '🟡 Good' : '🔴 Poor';

        const embed = new EmbedBuilder()
            .setColor(GREEN)
            .setTitle('🟢 ASTRA IS ONLINE')
            .setDescription(`All systems are running. Astra is ready to help!`)
            .setThumbnail(client.user?.displayAvatarURL() ?? null)
            .addFields(
                { name: '🛰️ Version',    value: `\`${VERSION}\``,                                         inline: true },
                { name: '🌐 Servers',    value: `\`${client.guilds.cache.size}\``,                         inline: true },
                { name: '👥 Members',    value: `\`${memberCount.toLocaleString()}\``,                     inline: true },
                { name: `${pingLabel}`,  value: `\`${ping}ms\``,                                           inline: true },
                { name: '⚙️ Node.js',    value: `\`${process.version}\``,                                  inline: true },
                { name: '🖥️ Host',       value: `\`${os.hostname()} • ${os.type()} ${os.arch()}\``,       inline: true },
                { name: '🔋 Memory',     value: `\`${usedMem.toFixed(0)}MB / ${totalMem.toFixed(0)}MB\`\n${memBar(usedMem, totalMem)}`, inline: false },
                { name: '🕐 Boot Time',  value: `<t:${Math.floor(Date.now() / 1000)}:F>`,                  inline: false },
            )
            .setFooter({ text: `Astra ${VERSION} • System Boot` })
            .setTimestamp();

        // Webhook notification
        const webhook = this.getWebhook();
        if (webhook) {
            await webhook.send({ username: 'Astra Status', embeds: [embed] })
                .catch(err => logger.error(`Status Webhook Error: ${err}`));
        }

        // DM the owner directly
        if (config.ownerId) {
            try {
                const owner = await client.users.fetch(config.ownerId).catch(() => null);
                if (owner) {
                    const dmEmbed = new EmbedBuilder()
                        .setColor(GREEN)
                        .setTitle('🟢 Astra Is Online')
                        .setDescription(`Your bot has started successfully.`)
                        .addFields(
                            { name: '🛰️ Version', value: `\`${VERSION}\``,                        inline: true },
                            { name: '🌐 Servers', value: `\`${client.guilds.cache.size}\``,        inline: true },
                            { name: '📡 Ping',    value: `\`${ping}ms\``,                          inline: true },
                            { name: '⏱️ Time',    value: `<t:${Math.floor(Date.now() / 1000)}:T>`, inline: true },
                        )
                        .setFooter({ text: 'Astra Boot Notification' })
                        .setTimestamp();
                    await owner.send({ embeds: [dmEmbed] }).catch((err: any) => logger.warn(`Owner DM failed: ${err}`));
                }
            } catch (err) {
                logger.warn(`Could not DM owner on boot: ${err}`);
            }
        }
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
        const ping        = client.ws.ping;
        const pingColor   = ping < 100 ? GREEN : ping < 200 ? YELLOW : RED;
        const pingLabel   = ping < 100 ? '🟢' : ping < 200 ? '🟡' : '🔴';

        const embed = new EmbedBuilder()
            .setColor(pingColor)
            .setTitle(`💓 HEARTBEAT — ${VERSION}`)
            .setDescription('Periodic health check — all systems nominal.')
            .addFields(
                { name: '⏱️ Uptime',       value: `\`${uptimeString(uptime)}\``,                          inline: true },
                { name: `${pingLabel} Ping`, value: `\`${ping}ms\``,                                       inline: true },
                { name: '🌐 Servers',       value: `\`${client.guilds.cache.size}\``,                      inline: true },
                { name: '👥 Members',       value: `\`${memberCount.toLocaleString()}\``,                  inline: true },
                { name: '💾 Heap',          value: `\`${heapUsed.toFixed(1)}MB / ${heapTotal.toFixed(1)}MB\``, inline: true },
                { name: '🔋 RSS',           value: `\`${rss.toFixed(1)}MB\``,                              inline: true },
                { name: '⚙️ CPU',           value: `\`${os.loadavg()[0].toFixed(2)} avg\``,                inline: true },
                { name: '📅 Checked',       value: `<t:${Math.floor(Date.now() / 1000)}:T>`,               inline: true },
            )
            .setFooter({ text: `Astra ${VERSION} • Heartbeat` })
            .setTimestamp();

        await webhook.send({
            username: 'Astra Status',
            avatarURL: 'https://cdn-icons-png.flaticon.com/512/3655/3655611.png',
            embeds: [embed]
        }).catch(err => logger.error(`Heartbeat Webhook Error: ${err}`));
    }

    // ── HEALTH CHECK ──────────────────────────────────────────────────────────
    public static async sendHealthCheck(client: any) {
        const webhook = this.getWebhook();
        if (!webhook) return;

        const ping        = client.ws.ping;
        const pingStatus  = ping < 100 ? '🟢 Excellent' : ping < 200 ? '🟡 Good' : '🔴 Poor';
        const mem         = process.memoryUsage();
        const heapUsed    = mem.heapUsed / 1024 / 1024;
        const heapTotal   = mem.heapTotal / 1024 / 1024;
        const memPct      = ((heapUsed / heapTotal) * 100).toFixed(0);
        const memStatus   = (heapUsed / heapTotal) < 0.8 ? '🟢 OK' : '🔴 High';
        const rss         = mem.rss / 1024 / 1024;

        const embed = new EmbedBuilder()
            .setColor(ping < 150 ? GREEN : YELLOW)
            .setTitle('🏥 HEALTH CHECK')
            .addFields(
                { name: '📡 API Ping',   value: `${pingStatus} \`${ping}ms\``,              inline: true },
                { name: '💾 Memory',     value: `${memStatus} \`${heapUsed.toFixed(0)}MB / ${heapTotal.toFixed(0)}MB (${memPct}%)\``, inline: true },
                { name: '🔋 RSS',        value: `\`${rss.toFixed(0)}MB\``,                  inline: true },
                { name: '⏱️ Uptime',     value: `\`${uptimeString(process.uptime())}\``,     inline: true },
                { name: '🌐 Servers',    value: `\`${client.guilds.cache.size}\``,           inline: true },
                { name: '⚙️ CPU',        value: `\`${os.loadavg()[0].toFixed(2)} avg\``,    inline: true },
            )
            .setFooter({ text: `Astra ${VERSION} • Health Check` })
            .setTimestamp();

        await webhook.send({
            username: 'Astra Health',
            avatarURL: 'https://cdn-icons-png.flaticon.com/512/2913/2913445.png',
            embeds: [embed]
        }).catch(err => logger.error(`Health Webhook Error: ${err}`));
    }

    // ── ERROR ─────────────────────────────────────────────────────────────────
    public static async sendError(error: any, context?: { commandName?: string; userId?: string; guildId?: string }) {
        const webhook = this.getWebhook();
        if (!webhook) return;

        const stack  = (error?.stack || String(error)).substring(0, 900);
        const fields: any[] = [
            { name: '⚠️ Error', value: `\`\`\`${error?.message || error}\`\`\`` },
            { name: '📂 Stack', value: `\`\`\`${stack}\`\`\`` },
        ];

        if (context?.commandName) fields.push({ name: '🔧 Command', value: `\`/${context.commandName}\``, inline: true });
        if (context?.userId)      fields.push({ name: '👤 User',    value: `\`${context.userId}\``,       inline: true });
        if (context?.guildId)     fields.push({ name: '🌐 Guild',   value: `\`${context.guildId}\``,      inline: true });

        const embed = new EmbedBuilder()
            .setColor(RED)
            .setTitle('🚨 ERROR REPORT')
            .setDescription('A runtime error was caught and reported.')
            .addFields(fields)
            .setFooter({ text: `Astra ${VERSION} • Error Reporter` })
            .setTimestamp();

        await webhook.send({ username: 'Astra Errors', embeds: [embed] })
            .catch(err => logger.error(`Error Webhook failed: ${err}`));
    }

    // ── SERVER COUNT ──────────────────────────────────────────────────────────
    public static async sendServerCountUpdate(client: any, joined: boolean, guildName: string) {
        const webhook = this.getWebhook();
        if (!webhook) return;

        const embed = new EmbedBuilder()
            .setColor(joined ? GREEN : RED)
            .setTitle(joined ? '📥 ADDED TO SERVER' : '📤 REMOVED FROM SERVER')
            .setDescription(joined
                ? `Joined: **${guildName}**`
                : `Left: **${guildName}**`)
            .addFields({ name: '🌐 Total Servers', value: `\`${client.guilds.cache.size}\``, inline: true })
            .setFooter({ text: `Astra ${VERSION}` })
            .setTimestamp();

        await webhook.send({ username: 'Astra Status', embeds: [embed] })
            .catch(err => logger.error(`Server Count Webhook Error: ${err}`));
    }

    // ── SCHEDULERS ────────────────────────────────────────────────────────────
    public static startHeartbeat(client: any) {
        setInterval(() => { this.sendHeartbeat(client); }, 30 * 60 * 1000);
    }

    public static startHealthCheck(client: any) {
        setInterval(() => { this.sendHealthCheck(client); }, 60 * 60 * 1000);
    }
}
