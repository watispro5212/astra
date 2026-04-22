import { AstraClient } from './bot';
import logger from './core/logger';
import http from 'http';

const client = new AstraClient();

// --- KOYEB/RENDER KEEP-ALIVE SYSTEM ---
// This listens for health checks to keep the bot alive on free hosting tiers.
const PORT = parseInt(process.env.PORT || '8080');
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Astra Tactical System: ONLINE');
}).listen(PORT, '0.0.0.0', () => {
    logger.info(`Health check server listening on port ${PORT}`);
});
// --------------------------------------

client.init().catch(err => {
    logger.error(`Critical Failure during startup: ${err}`);
    process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    logger.info('Shutting down Astra...');
    client.destroy();
    process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});
