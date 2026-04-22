import { ShardingManager } from 'discord.js';
import { config } from './core/config';
import logger from './core/logger';
import * as path from 'path';

const manager = new ShardingManager(path.join(__dirname, 'bot.ts'), {
    token: config.token,
    totalShards: 'auto', // Or specify 1 if you want to force one shard as requested
    respawn: true,
    execArgv: ['-r', 'ts-node/register']
});

manager.on('shardCreate', shard => {
    logger.info(`🛰️ SHARD [${shard.id}] INITIALIZED: Deploying tactical assets...`);
});

manager.spawn().catch(err => {
    logger.error(`🚨 SHARDING MANAGER FAILURE: ${err}`);
});
