import { WebhookClient, EmbedBuilder } from 'discord.js';
import { config } from '../core/config';
import logger from '../core/logger';
import os from 'os';

export class StatusService {
    private static webhook: WebhookClient | null = null;

    private static getWebhook() {
        if (!this.webhook && config.statusWebhookUrl) {
            this.webhook = new WebhookClient({ url: config.statusWebhookUrl });
        }
        return this.webhook;
    }

    public static async sendSystemOnline(client: any) {
        const webhook = this.getWebhook();
        if (!webhook) return;

        const embed = new EmbedBuilder()
            .setTitle('🟢 SYSTEM ONLINE')
            .setDescription('Astra Tactical Engine has been initialized and is now monitoring all sectors.')
            .setColor(0x2ecc71)
            .addFields(
                { name: '🛰️ Version', value: 'v7.0.0 "Enterprise"', inline: true },
                { name: '📡 Sectors', value: `${client.guilds.cache.size.toString()}`, inline: true },
                { name: '👤 Operatives', value: `${client.users.cache.size.toString()}`, inline: true }
            )
            .addFields(
                { name: '💻 Host OS', value: `${os.type()} ${os.release()}`, inline: true },
                { name: '🔋 Memory', value: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)}GB / ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}GB`, inline: true }
            )
            .setTimestamp();

        await webhook.send({ embeds: [embed] }).catch(err => logger.error(`Status Webhook Error: ${err}`));
    }

    public static async sendHeartbeat(client: any) {
        const webhook = this.getWebhook();
        if (!webhook) return;

        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);

        const embed = new EmbedBuilder()
            .setTitle('💓 SYSTEM HEARTBEAT')
            .setDescription('Sector stability confirmed. Astra remains operational.')
            .setColor(0x3498db)
            .addFields(
                { name: '⏱️ Uptime', value: `${days}d ${hours}h ${minutes}m`, inline: true },
                { name: '📶 Latency', value: `${client.ws.ping}ms`, inline: true },
                { name: '⚙️ CPU Load', value: `${os.loadavg()[0].toFixed(2)}%`, inline: true }
            )
            .setTimestamp();

        await webhook.send({ embeds: [embed] }).catch(err => logger.error(`Status Webhook Error: ${err}`));
    }

    public static async sendError(error: any) {
        const webhook = this.getWebhook();
        if (!webhook) return;

        const embed = new EmbedBuilder()
            .setTitle('🚨 SYSTEM ANOMALY')
            .setDescription('A critical error has been detected in the tactical core.')
            .setColor(0xe74c3c)
            .addFields(
                { name: '⚠️ Error Message', value: `\`\`\`${error.message || error}\`\`\`` },
                { name: '📂 Trace', value: `\`\`\`${(error.stack || 'No stack trace available').substring(0, 1000)}\`\`\`` }
            )
            .setTimestamp();

        await webhook.send({ embeds: [embed] }).catch(err => logger.error(`Status Webhook Error: ${err}`));
    }

    public static startHeartbeat(client: any) {
        // Send heartbeat every 30 minutes
        setInterval(() => {
            this.sendHeartbeat(client);
        }, 30 * 60 * 1000);
    }
}
