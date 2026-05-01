import { ShardingManager } from 'discord.js';
import { config } from './core/config';
import logger from './core/logger';
import * as path from 'path';

const isDev = process.env.NODE_ENV !== 'production';
const shardFile = path.join(__dirname, isDev ? 'bot.ts' : 'bot.js');
const execArgv = isDev ? ['-r', 'ts-node/register'] : [];

if (isDev) {
    process.env.TS_NODE_TRANSPILE_ONLY = 'true';
}

const manager = new ShardingManager(shardFile, {
    token: config.token,
    totalShards: 'auto',
    respawn: true,
    execArgv
});

manager.on('shardCreate', shard => {
    logger.info(`🛰️ SHARD [${shard.id}] INITIALIZED: Deploying tactical assets...`);
});

manager.spawn().catch(err => {
    logger.error(`🚨 SHARDING MANAGER FAILURE: ${err}`);
});
