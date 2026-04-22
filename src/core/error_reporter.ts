import { EmbedBuilder, Client, Guild, User } from 'discord.js';
import { config } from './config';
import logger from './logger';

export class ErrorReporter {
    /**
     * Transmits a high-fidelity diagnostic packet to the system developer.
     */
    static async report(client: Client, error: any, context: { commandName?: string, guild?: Guild | null, user?: User | null }) {
        if (!config.ownerId) {
            logger.warn('Vanguard Error Reporter: No ownerId configured. Transmission aborted.');
            return;
        }

        try {
            const owner = await client.users.fetch(config.ownerId).catch(() => null);
            if (!owner) return;

            const diagnosticEmbed = new EmbedBuilder()
                .setColor(0xe74c3c) // Tactical Red
                .setTitle('🚨 VANGUARD DIAGNOSTIC PACKET')
                .setThumbnail(context.guild?.iconURL() || null)
                .addFields(
                    { name: '🛰️ Sector Name', value: context.guild?.name || 'Global/Direct', inline: true },
                    { name: '🆔 Sector ID', value: `\`${context.guild?.id || 'N/A'}\``, inline: true },
                    { name: '👤 Operative', value: context.user ? `${context.user.tag} (\`${context.user.id}\`)` : 'System Architecture', inline: false },
                    { name: '📡 Protocol', value: context.commandName ? `\`/${context.commandName}\`` : 'Internal Kernel', inline: true },
                    { name: '⚠️ Anomaly Detected', value: `\`\`\`${error.message || error}\`\`\`` }
                )
                .setTimestamp()
                .setFooter({ text: 'Astra Vanguard Error Reporting Service' });

            await owner.send({ embeds: [diagnosticEmbed] }).catch(err => {
                logger.error(`Failed to deliver diagnostic packet to developer: ${err}`);
            });
            
            logger.info(`Vanguard Diagnostic Packet transmitted to developer for error in [${context.guild?.name || 'Global'}]`);
        } catch (err) {
            logger.error(`Critical Failure in Error Reporter: ${err}`);
        }
    }
}
