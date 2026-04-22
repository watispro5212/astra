import { AstraClient } from './bot';
import logger from './core/logger';

const client = new AstraClient();

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
