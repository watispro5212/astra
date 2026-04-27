import { WebhookClient, EmbedBuilder } from 'discord.js';
import { config } from '../core/config';
import { db } from '../core/database';
import { THEME, VERSION } from '../core/constants';
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
            .setTitle(`🪐 ASTRA ${VERSION} — UPDATE`)
            .setAuthor({ name: 'ASTRA NEWS', iconURL: client.user?.displayAvatarURL() })
            .setDescription('I have updated how my brain works! I now use a smarter and faster way to talk to you using new AI tools. This means I can answer you even faster than before.')
            .setThumbnail('https://cdn-icons-png.flaticon.com/512/8654/8654162.png')
            .addFields(
                {
                    name: '✨ NEW BRAIN UPDATES',
                    value: [
                        '> **Faster Thinking** — I can now think much faster by using more efficient pathways.',
                        '> **Free Model Usage** — I can use new, free AI models to help answer your questions.',
                        '> **Better Backup** — If one brain gets tired, I can quickly switch to another one.'
                    ].join('\n')
                },
                {
                    name: '🗑️ CLEANED UP STUFF',
                    value: [
                        '> **Old Code** — Removed old ways of thinking that were slow.',
                        '> **Better Storage** — Changed how I remember things to be more reliable.'
                    ].join('\n')
                },
                {
                    name: '🔧 BEHIND THE SCENES',
                    value: [
                        '• **Bug Fixes** — Fixed some errors where my brain would get confused.',
                        '• **Smoother Experience** — Made everything feel a bit more snappy.',
                        '• **Status Update** — My status now updates correctly with my version.'
                    ].join('\n')
                },
                {
                    name: '🚀 WHAT IS NEXT',
                    value: [
                        '• **Picture Scanning** — I will soon be able to look at pictures you send!',
                        '• **Leaderboards** — See who is the richest or smartest in the world.',
                        '• **Safety Tools** — More ways to keep your server safe and happy.'
                    ].join('\n')
                }
            )
            .setImage('https://i.imgur.com/8Qx8R1k.png')
            .setFooter({ text: `Astra Update • ${VERSION}` })
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
            .setTitle('🟢 ASTRA IS ONLINE')
            .setDescription(`I am ready to help! All systems are working perfectly.`)
            .setThumbnail(client.user?.displayAvatarURL() ?? null)
            .addFields(
                { name: '🛰️ Version',         value: `\`${VERSION}\``,                                     inline: true },
                { name: '🌐 Servers',          value: `\`${client.guilds.cache.size} servers\``,              inline: true },
                { name: '👥 Users',            value: `\`${memberCount.toLocaleString()} members\``,         inline: true },
                { name: '💻 Computer',         value: `\`${os.hostname()}\``,                                inline: true },
                { name: '🖥️ System',           value: `\`${os.type()} ${os.arch()}\``,                      inline: true },
                { name: '📡 Connection',       value: `\`${client.ws.ping}ms\``,                             inline: true },
                { name: '🔋 Memory',           value: `\`${usedMem.toFixed(0)}MB / ${totalMem.toFixed(0)}MB\`\n${memBar(usedMem, totalMem)}`, inline: false },
                { name: '⚙️ Node.js',          value: `\`${process.version}\``,                              inline: true },
                { name: '🕐 Boot Time',        value: `<t:${Math.floor(Date.now() / 1000)}:R>`,              inline: true },
            )
            .setFooter({ text: `Astra Support • ${new Date().toUTCString()}` })
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
            .setTitle(`💓 I AM ALIVE — ${VERSION}`)
            .setDescription('Everything is running smoothly. My brain is working just fine.')
            .setThumbnail('https://cdn-icons-png.flaticon.com/512/8654/8654162.png')
            .addFields(
                { name: '⏱️ Uptime',          value: `\`${uptimeString(uptime)}\``,                          inline: true },
                { name: '📡 Speed',           value: `\`${ping}ms\``,                                        inline: true },
                { name: '⚙️ Workload',        value: `\`${os.loadavg()[0].toFixed(2)}%\``,                   inline: true },
                { name: '🌐 Servers',         value: `\`${client.guilds.cache.size}\``,                      inline: true },
                { name: '👥 Users',           value: `\`${memberCount.toLocaleString()}\``,                   inline: true },
                { name: '💾 Brain Memory',    value: `\`${heapUsed.toFixed(2)}MB / ${heapTotal.toFixed(2)}MB\``, inline: true },
                { name: '🔋 Extra Memory',    value: `\`${rss.toFixed(2)}MB\``,                              inline: true },
            )
            .setFooter({ text: `Astra Bot • Live Status Update` })
            .setTimestamp();

        await webhook.send({ 
            username: 'Astra Status', 
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
            .setTitle('🏥 HOW AM I DOING?')
            .addFields(
                { name: '📡 Connection',      value: `${pingStatus} \`${ping}ms\``,                          inline: true  },
                { name: '💾 Brain Power',     value: `${memStatus} \`${heapUsed.toFixed(0)}MB\``,            inline: true  },
                { name: '🔋 Extra Power',     value: `\`${rss.toFixed(0)}MB\``,                              inline: true  },
                { name: '⏱️ How long awake',  value: `\`${uptimeString(process.uptime())}\``,                inline: true  },
                { name: '🌐 Total Servers',   value: `\`${client.guilds.cache.size}\``,                      inline: true  },
                { name: '💻 Busy level',      value: `\`${os.loadavg()[0].toFixed(2)}\``,                    inline: true  },
            )
            .setFooter({ text: `Astra Health • ${VERSION}` })
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
            .setTitle('🚨 SOMETHING WENT WRONG')
            .setDescription('I have found an error. I have sent the details to my team to fix it.')
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
            .setTitle(joined ? '📥 NEW SERVER' : '📤 LEFT A SERVER')
            .setDescription(joined
                ? `I have been added to a new server: **${guildName}**`
                : `I have been removed from a server: **${guildName}**`)
            .addFields(
                { name: '🌐 Total Servers', value: `\`${client.guilds.cache.size} servers\``, inline: true }
            )
            .setFooter({ text: `Astra Bot • ${VERSION}` })
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
