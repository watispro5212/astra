import { ShardingManager } from 'discord.js';
import { config } from './core/config';
import logger from './core/logger';
import * as path from 'path';

process.env.TS_NODE_TRANSPILE_ONLY = 'true';

const manager = new ShardingManager(path.join(__dirname, 'bot.ts'), {
    token: config.token,
    totalShards: 'auto', 
    respawn: true,
    execArgv: ['-r', 'ts-node/register']
});

manager.on('shardCreate', shard => {
    logger.info(`🛰️ SHARD [${shard.id}] INITIALIZED: Deploying tactical assets...`);
});

manager.spawn().catch(err => {
    logger.error(`🚨 SHARDING MANAGER FAILURE: ${err}`);
});
