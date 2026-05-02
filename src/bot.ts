import { 
    Client, 
    GatewayIntentBits, 
    Collection, 
    Events, 
    ActivityType, 
    REST, 
    Routes,
    EmbedBuilder,
    Options,
    GuildMember,
    MessageFlags
} from 'discord.js';
import { config } from './core/config';
import logger from './core/logger';
import { db } from './core/database';
import { VERSION } from './core/constants';
import { Command } from './types';
import { ErrorReporter } from './core/error_reporter';
import { StatusService } from './services/statusService';
import { PassiveIncomeService } from './services/passiveIncomeService';
import { ShopService } from './services/shopService';
import { AIService } from './services/aiService';
import * as path from 'path';
import * as fs from 'fs';

// ── GLOBAL ANOMALY INTERCEPTORS ───────────────────────────────────────────
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    StatusService.sendError(reason).catch(() => {});
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    StatusService.sendError(error).catch(() => {});
});

export class AstraClient extends Client {
    public commands = new Collection<string, Command>();

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.DirectMessages
            ],
            makeCache: Options.cacheWithLimits({
                ...Options.DefaultMakeCacheSettings,
                MessageManager: 10,
                GuildMemberManager: {
                    maxSize: 50,
                    keepOverLimit: (member: GuildMember) => member.id === config.ownerId,
                },
                PresenceManager: 0,
            }),
            sweepers: {
                ...Options.DefaultSweeperSettings,
                messages: {
                    interval: 3600, // Every hour
                    lifetime: 1800, // 30 minutes
                }
            }
        });
    }

    async init() {
        logger.info('Starting Astra Bot...');

        try {
            // Connect to Database
            await db.initializeTables();

            // Load Commands
            await this.loadCommands(path.join(__dirname, 'commands'));

            // Register Events
            this.registerEvents();

            // Login
            await this.login(config.token);

            // Background services run only on shard 0 to avoid duplicate processing
            if (!this.shard || this.shard.ids.includes(0)) {
                PassiveIncomeService.startService();
            }
        } catch (error) {
            logger.error(`Initialization Failure: ${error}`);
            process.exit(1);
        }
    }

    private async loadCommands(dir: string) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.lstatSync(filePath);

            if (stat.isDirectory()) {
                await this.loadCommands(filePath);
            } else if ((file === 'astra.ts' || file === 'astra.js') && (file.endsWith('.ts') || file.endsWith('.js'))) {
                try {
                    const commandModule = require(filePath);
                    const command: Command = commandModule.default || commandModule;

                    if (command && 'data' in command && 'execute' in command) {
                        this.commands.set(command.data.name, command);
                        logger.info(`Loaded Command: ${command.data.name}`);
                    }
                } catch (err) {
                    logger.error(`Failed to load command at ${filePath}: ${err}`);
                }
            }
        }
    }

    private registerEvents() {
        this.on(Events.Error, async (error) => {
            logger.error(`Discord client error: ${error}`);
            StatusService.sendError(error).catch(() => {});
        });

        this.on(Events.ShardError, async (error, shardId) => {
            logger.error(`Shard ${shardId} error: ${error}`);
            StatusService.sendError(error).catch(() => {});
        });

        this.on(Events.ShardDisconnect, (closeEvent, shardId) => {
            logger.warn(`Shard ${shardId} disconnected: ${closeEvent.code} ${closeEvent.reason}`);
        });

        this.once(Events.ClientReady, async (c) => {
            logger.info(`Astra Online: Logged in as ${c.user.tag}`);
            
            // Always sync globally so commands work in DMs and all servers.
            // In dev, also push to the target guild for instant testing (no 1-hr delay).
            if (!this.shard || this.shard.ids.includes(0)) {
                logger.info('Synchronizing commands globally (DM + server support) on shard 0...');
                await this.syncCommands('global');
                if (config.guildId && (process.env.NODE_ENV !== 'production')) {
                    await this.syncCommands('guild_only');
                }
            } else {
                logger.info(`Skipping command sync on shard ${this.shard.ids[0]}.`);
            }

            // Statuses
            const statuses = [
                    () => ({ name: `v${VERSION} | /astra info help`, type: 0 }),
                () => ({ name: `${c.users.cache.size} People`, type: 2 }),
                () => ({ name: `Helping Everyone`, type: 1 })
            ];

            let currentIndex = 0;
            setInterval(() => {
                const status = statuses[currentIndex]();
                c.user.setActivity(status.name, { type: status.type as any });
                currentIndex = (currentIndex + 1) % statuses.length;
            }, 60000);

            // Start Background Services
            const { ReminderService } = require('./services/reminderService');
            ReminderService.startChecker(this);
            const { GiveawayService } = require('./services/giveawayService');
            GiveawayService.startChecker(this);

            this.user?.setActivity(`v${VERSION} | /info help`, { type: ActivityType.Watching });

            // Status & heartbeat
            await StatusService.sendSystemOnline(c);
            StatusService.startHeartbeat(this);
            StatusService.startHealthCheck(this);

        });

        // Leveling System
        const xpCooldowns = new Map<string, number>();

        this.on(Events.MessageCreate, async (message) => {
            if (message.author.bot) return;

            // ── DMs ───────────────────────────────────────────────────────
            if (!message.guild) {
                const PREFIX = '-';
                const content = message.content.trim();

                if (content.startsWith(PREFIX)) {
                    const args = content.slice(PREFIX.length).trim().split(/\s+/);
                    const cmd  = args.shift()?.toLowerCase() ?? '';

                    // ── help ──────────────────────────────────────────────
                    if (cmd === 'help') {
                        return await message.reply([
                            '📡 **ASTRA DM COMMANDS** — prefix: `-`',
                            '',
                            '**Economy**',
                            '`-balance` `-daily` `-work` `-mine` `-gamble <amount>` `-coinflip <amount> <heads/tails>` `-slots`',
                            '',
                            '**Info**',
                            '`-rank` `-ping` `-help`',
                            '',
                            '**AI**',
                            'Just type any message without a prefix to chat with my AI!',
                            '',
                            '💡 Slash commands also work in DMs — type `/` to see the full list.',
                        ].join('\n'));
                    }

                    // ── ping ──────────────────────────────────────────────
                    if (cmd === 'ping') {
                        return await message.reply(`📡 **Pong!** WebSocket: \`${this.ws.ping}ms\``);
                    }

                    // ── balance ───────────────────────────────────────────
                    if (cmd === 'balance' || cmd === 'bal' || cmd === 'wallet') {
                        const row = await db.fetchOne('SELECT balance, bank_balance FROM users WHERE user_id = ?', message.author.id);
                        const cash = row?.balance ?? 0;
                        const bank = row?.bank_balance ?? 0;
                        return await message.reply(
                            `💰 **${message.author.username}'s Balance**\n` +
                            `Cash: \`${cash.toLocaleString()} money\`\n` +
                            `Bank: \`${bank.toLocaleString()} money\`\n` +
                            `Total: \`${(cash + bank).toLocaleString()} money\``
                        );
                    }

                    // ── rank ──────────────────────────────────────────────
                    if (cmd === 'rank' || cmd === 'level' || cmd === 'xp') {
                        const row = await db.fetchOne('SELECT xp, level FROM users WHERE user_id = ?', message.author.id);
                        if (!row) return await message.reply('❌ No XP yet — join a server and start chatting!');
                        const xpNeeded = 25 * row.level * row.level + 250 * row.level + 500;
                        return await message.reply(
                            `📈 **${message.author.username}'s Rank**\n` +
                            `Level: \`${row.level}\`\n` +
                            `XP: \`${row.xp} / ${xpNeeded}\``
                        );
                    }

                    // ── daily ─────────────────────────────────────────────
                    if (cmd === 'daily') {
                        const user = await db.fetchOne('SELECT last_daily, daily_streak FROM users WHERE user_id = ?', message.author.id);
                        const now  = Date.now();
                        if (user?.last_daily && now - parseInt(user.last_daily) < 86400000) {
                            const left = 86400000 - (now - parseInt(user.last_daily));
                            const h = Math.floor(left / 3600000);
                            const m = Math.ceil((left % 3600000) / 60000);
                            return await message.reply(`⏳ Daily resets in **${h}h ${m}m**.`);
                        }
                        let streak = (user?.last_daily && now - parseInt(user.last_daily) < 172800000) ? (user.daily_streak || 0) + 1 : 1;
                        const bonus = Math.min(streak * 100, 5000);
                        const total = 2500 + bonus;
                        await db.execute(
                            'INSERT INTO users (user_id, balance, total_earned, last_daily, daily_streak) VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = users.balance + ?, total_earned = users.total_earned + ?, last_daily = ?, daily_streak = ?',
                            message.author.id, total, total, now.toString(), streak, total, total, now.toString(), streak
                        );
                        return await message.reply(`💰 **Daily claimed!** +\`${total.toLocaleString()} money\` (🔥 ${streak}-day streak)`);
                    }

                    // ── work ──────────────────────────────────────────────
                    if (cmd === 'work') {
                        const user = await db.fetchOne('SELECT last_work FROM users WHERE user_id = ?', message.author.id);
                        const now  = Date.now();
                        if (user?.last_work && now - parseInt(user.last_work) < 3600000) {
                            const left = 3600000 - (now - parseInt(user.last_work));
                            const m = Math.ceil(left / 60000);
                            return await message.reply(`⏳ Work cooldown: **${m} min** remaining.`);
                        }
                        const earned = Math.floor(Math.random() * 501) + 250;
                        await db.execute(
                            'INSERT INTO users (user_id, balance, total_earned, last_work) VALUES (?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = users.balance + ?, total_earned = users.total_earned + ?, last_work = ?',
                            message.author.id, earned, earned, now.toString(), earned, earned, now.toString()
                        );
                        return await message.reply(`🔧 **Work done!** You earned \`+${earned.toLocaleString()} money\`.`);
                    }

                    // ── mine ──────────────────────────────────────────────
                    if (cmd === 'mine') {
                        const user = await db.fetchOne('SELECT last_mine, balance FROM users WHERE user_id = ?', message.author.id);
                        const now  = Date.now();
                        if (user?.last_mine && now - parseInt(user.last_mine) < 1800000) {
                            const left = 1800000 - (now - parseInt(user.last_mine));
                            const m = Math.ceil(left / 60000);
                            return await message.reply(`⏳ Mining cooldown: **${m} min** remaining.`);
                        }
                        const success = Math.random() > 0.30;
                        const current = user?.balance ?? 0;
                        const delta   = success
                            ? Math.floor(Math.random() * 2000) + 500
                            : -Math.min(Math.floor(Math.random() * 1000), current);
                        await db.execute(
                            'INSERT INTO users (user_id, balance, last_mine) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET balance = GREATEST(0, users.balance + ?), last_mine = ?',
                            message.author.id, Math.max(0, delta), now.toString(), delta, now.toString()
                        );
                        return await message.reply(success
                            ? `⛏️ **Mining success!** Found \`+${delta.toLocaleString()} money\`.`
                            : `💥 **Mining failed!** Lost \`${Math.abs(delta).toLocaleString()} money\` in repairs.`
                        );
                    }

                    // ── gamble ────────────────────────────────────────────
                    if (cmd === 'gamble' || cmd === 'bet') {
                        const amount = parseInt(args[0]);
                        if (isNaN(amount) || amount < 100) return await message.reply('❌ Usage: `-gamble <amount>` (min 100)');
                        const row = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', message.author.id);
                        if (!row || row.balance < amount) return await message.reply('❌ Not enough money.');
                        const win  = Math.random() < 0.45;
                        const delta = win ? Math.floor(amount * 1.8) - amount : -amount;
                        await db.execute('UPDATE users SET balance = GREATEST(0, balance + ?), total_earned = total_earned + ? WHERE user_id = ?', delta, win ? delta : 0, message.author.id);
                        return await message.reply(win
                            ? `🎰 **Win!** You gained \`+${delta.toLocaleString()} money\`.`
                            : `🎰 **Loss.** You lost \`${amount.toLocaleString()} money\`.`
                        );
                    }

                    // ── coinflip ──────────────────────────────────────────
                    if (cmd === 'coinflip' || cmd === 'cf') {
                        const amount = parseInt(args[0]);
                        const choice = args[1]?.toLowerCase();
                        if (isNaN(amount) || amount < 1 || !['heads', 'tails', 'h', 't'].includes(choice ?? ''))
                            return await message.reply('❌ Usage: `-coinflip <amount> <heads/tails>`');
                        const row = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', message.author.id);
                        if (!row || row.balance < amount) return await message.reply('❌ Not enough money.');
                        const result    = Math.random() < 0.5 ? 'heads' : 'tails';
                        const userPick  = choice.startsWith('h') ? 'heads' : 'tails';
                        const win       = result === userPick;
                        await db.execute('UPDATE users SET balance = GREATEST(0, balance + ?), total_earned = total_earned + ? WHERE user_id = ?', win ? amount : -amount, win ? amount : 0, message.author.id);
                        return await message.reply(`🪙 **${result.toUpperCase()}** — You ${win ? `won \`+${amount.toLocaleString()}\`` : `lost \`${amount.toLocaleString()}\``} money.`);
                    }

                    // ── slots ─────────────────────────────────────────────
                    if (cmd === 'slots') {
                        const COST = 50;
                        const row  = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', message.author.id);
                        if (!row || row.balance < COST) return await message.reply(`❌ Slots cost **${COST} money**.`);
                        await db.execute('UPDATE users SET balance = balance - ? WHERE user_id = ?', COST, message.author.id);
                        const REELS   = ['🔫','💎','⚡','🪙','🛸','💀'];
                        const [a,b,c] = Array.from({ length: 3 }, () => REELS[Math.floor(Math.random() * REELS.length)]);
                        const PAYS: Record<string,number> = { '💎':50,'🛸':20,'⚡':10,'🔫':8,'🪙':5,'💀':0 };
                        let payout = 0;
                        let result = '❌ No match';
                        if (a===b && b===c) { payout = COST * (PAYS[a]??3); result = payout > COST*10 ? '🎊 JACKPOT!' : '✨ Triple match!'; }
                        else if (a===b || b===c || a===c) { payout = Math.floor(COST * 1.5); result = '🔸 Partial match'; }
                        if (payout > 0) await db.execute('UPDATE users SET balance = balance + ?, total_earned = total_earned + ? WHERE user_id = ?', payout, payout, message.author.id);
                        return await message.reply(`🎰 \`[ ${a}  ${b}  ${c} ]\` — ${result} | Net: \`${payout - COST >= 0 ? '+' : ''}${(payout - COST).toLocaleString()} money\``);
                    }

                    // ── unknown ───────────────────────────────────────────
                    return await message.reply(`❓ Unknown command \`${cmd}\`. Type \`-help\` to see what I can do!`);
                }

                // ── Free-text → AI ────────────────────────────────────────
                try {
                    await message.channel.sendTyping();
                    const response = await AIService.generateResponse(message.author.id, content);
                    const chunks   = response.match(/[\s\S]{1,2000}/g) ?? [response];
                    for (const chunk of chunks) await message.reply(chunk);
                } catch (err) {
                    logger.error(`AI DM Error: ${err}`);
                    await message.reply('⚠️ My AI had a little trouble. Try again in a second!').catch(() => {});
                }
                return;
            }

            // ── GUILD XP SYSTEM ────────────────────────────────────────────────
            const now = Date.now();
            const cooldown = xpCooldowns.get(message.author.id);

            // 90-second cooldown between XP grants — prevents spam-leveling
            if (!cooldown || now - cooldown >= 90000) {
                xpCooldowns.set(message.author.id, now);

                // 10–20 XP per qualifying message (avg 15)
                const xpAdd = Math.floor(Math.random() * 11) + 10;

                let user = await db.fetchOne('SELECT xp, level, blacklisted FROM users WHERE user_id = ?', message.author.id);

                // Skip XP for blacklisted users
                if (user?.blacklisted) return;

                if (!user) {
                    await db.execute(
                        'INSERT INTO users (user_id, xp, level) VALUES (?, ?, ?)',
                        message.author.id, xpAdd, 0
                    );
                } else {
                    const level   = Number(user.level || 0);
                    const newXp   = Number(user.xp || 0) + xpAdd;
                    // Quadratic formula: much slower early, much harder late
                    // Level 0→1: 500 XP | Level 5→6: 2375 XP | Level 10→11: 5500 XP
                    const nextLevelXp = 25 * level * level + 250 * level + 500;

                    if (newXp >= nextLevelXp) {
                        const newLevel = level + 1;
                        const carryXp  = newXp - nextLevelXp;

                        await db.execute(
                            'UPDATE users SET xp = ?, level = ? WHERE user_id = ?',
                            carryXp, newLevel, message.author.id
                        );

                        const cfg = await db.fetchOne(
                            'SELECT announcement_channel_id FROM leveling_configs WHERE guild_id = ?',
                            message.guild.id
                        );
                        const milestoneRole = await db.fetchOne(
                            'SELECT role_id FROM level_roles WHERE guild_id = ? AND level = ?',
                            message.guild.id, newLevel
                        );

                        if (milestoneRole) {
                            const role = await message.guild.roles.fetch(milestoneRole.role_id).catch(() => null);
                            if (role) await message.member?.roles.add(role).catch(() => {});
                        }

                        const nextXpReq   = 25 * newLevel * newLevel + 250 * newLevel + 500;
                        const barFilled   = Math.min(10, Math.max(0, Math.round((carryXp / nextXpReq) * 10)));
                        const progressBar = `${'█'.repeat(barFilled)}${'░'.repeat(10 - barFilled)}`;

                        const levelEmbed = new EmbedBuilder()
                            .setColor(0x9b59b6)
                            .setTitle('🎊 LEVEL UP!')
                            .setDescription(
                                `**${message.author.username}** reached **Level ${newLevel}**!` +
                                (milestoneRole ? `\n\n🎖️ You earned a role: <@&${milestoneRole.role_id}>` : '')
                            )
                            .setThumbnail(message.author.displayAvatarURL())
                            .addFields(
                                { name: '⭐ New Level',  value: `\`${newLevel}\``,                              inline: true },
                                { name: '🎯 Next Level', value: `\`${nextXpReq.toLocaleString()} XP\``,         inline: true },
                                { name: '📊 Progress',   value: `\`[${progressBar}] ${carryXp}/${nextXpReq}\``, inline: false },
                            )
                            .setFooter({ text: `Astra ${VERSION}` })
                            .setTimestamp();

                        let targetChannel: any = message.channel;
                        if (cfg?.announcement_channel_id) {
                            try {
                                const ch = await message.guild.channels.fetch(cfg.announcement_channel_id);
                                if (ch?.isTextBased()) targetChannel = ch;
                            } catch (_) {}
                        }
                        await targetChannel.send({ content: `<@${message.author.id}>`, embeds: [levelEmbed] }).catch(() => {});
                    } else {
                        await db.execute('UPDATE users SET xp = ? WHERE user_id = ?', newXp, message.author.id);
                    }
                }
            }

        });

        this.on(Events.GuildCreate, async (guild) => {
            try { 
                await StatusService.sendServerCountUpdate(this, true, guild.name); 
                await ShopService.seedGuildShop(guild.id);
            } catch (_) {}
        });

        this.on(Events.GuildDelete, async (guild) => {
            try { await StatusService.sendServerCountUpdate(this, false, guild.name); } catch (_) {}
        });

        // Welcome & Farewell System
        this.on(Events.GuildMemberAdd, async (member) => {
            try {
                const cfg = await db.fetchOne('SELECT * FROM welcome_configs WHERE guild_id = ?', member.guild.id);
                if (!cfg) return;
                if (cfg.channel_id) {
                    const channel = await member.guild.channels.fetch(cfg.channel_id).catch(() => null);
                    if (channel && channel.isTextBased()) {
                        const msg = (cfg.message || 'Welcome {user} to **{server}**!').replace('{user}', `<@${member.id}>`).replace('{server}', member.guild.name);
                        const welcomeEmbed = new EmbedBuilder()
                            .setColor(0x2ecc71)
                            .setTitle('👋 Welcome to the server!')
                            .setDescription(msg)
                            .setThumbnail(member.user.displayAvatarURL())
                            .setFooter({ text: `Astra Welcome • v${VERSION}` })
                            .setTimestamp();
                        await (channel as any).send({ embeds: [welcomeEmbed] });
                    }
                }
                if (cfg.auto_role_id) {
                    const role = await member.guild.roles.fetch(cfg.auto_role_id).catch(() => null);
                    if (role) await member.roles.add(role).catch(() => {});
                }
            } catch (err) {
                logger.error(`Welcome system error: ${err}`);
            }
        });

        this.on(Events.GuildMemberRemove, async (member) => {
            try {
                const cfg = await db.fetchOne('SELECT * FROM welcome_configs WHERE guild_id = ?', member.guild.id);
                if (!cfg || !cfg.farewell_channel_id) return;
                const channel = await member.guild.channels.fetch(cfg.farewell_channel_id).catch(() => null);
                if (channel && channel.isTextBased()) {
                    const msg = (cfg.farewell_message || '**{user}** has left the sector.').replace('{user}', member.user.username).replace('{server}', member.guild.name);
                    const farewellEmbed = new EmbedBuilder()
                        .setColor(0xe74c3c)
                        .setTitle('👋 Goodbye!')
                        .setDescription(msg)
                        .setFooter({ text: `Astra • v${VERSION}` })
                        .setTimestamp();
                    await (channel as any).send({ embeds: [farewellEmbed] });
                }
            } catch (err) {
                logger.error(`Farewell system error: ${err}`);
            }
        });

        this.on(Events.InteractionCreate, async (interaction) => {
            if (interaction.isChatInputCommand()) {
                const command = this.commands.get(interaction.commandName);
                if (!command) return;

                // Owner Check
                if (command.ownerOnly && interaction.user.id !== config.ownerId) {
                    return interaction.reply({ content: '❌ Only my developer can use this command.', flags: [MessageFlags.Ephemeral] });
                }

                try {
                    await command.execute(interaction);
                } catch (error: any) {
                    // Gracefully ignore harmless "Unknown Interaction" or "Acknowledged" network timeouts
                    if (error.code === 10062 || error.code === 40060) return;

                    logger.error(`Execution Error [/${interaction.commandName}]: ${error}`);
                    
                    // Send error report to developer
                    await ErrorReporter.report(this, error, {
                        commandName: interaction.commandName,
                        guild: interaction.guild,
                        user: interaction.user
                    }).catch(() => {});

                    // Log error to status service
                    await StatusService.sendError(error).catch(() => {});

                    const errorEmbed = new EmbedBuilder()
                        .setColor(0xff0000)
                        .setTitle('⚠️ Something went wrong')
                        .setDescription(`I had a little trouble running that command. I have told my developer so they can fix it!\n\`\`\`${error.message || error}\`\`\``);

                    try {
                        if (interaction.replied || interaction.deferred) {
                            await interaction.editReply({ embeds: [errorEmbed] });
                        } else {
                            await interaction.reply({ embeds: [errorEmbed], flags: [MessageFlags.Ephemeral] });
                        }
                    } catch (replyError) {
                        logger.error(`Failed to send error response: ${replyError}`);
                    }
                }
            } else if (interaction.isAutocomplete()) {
                const command = this.commands.get(interaction.commandName);
                if (command?.autocomplete) {
                    await command.autocomplete(interaction);
                }
            }
        });
    }

    public async syncCommands(scope: 'global' | 'guild' | 'guild_only' | 'clear' | 'full_purge' = 'guild') {
        const rest = new REST({ version: '10' }).setToken(config.token);
        const commandData = Array.from(this.commands.values()).map(c => c.data.toJSON());

        try {
            logger.info(`[SYNC] Setting up commands (${scope})...`);

            if (scope === 'full_purge') {
                logger.info('[SYNC] Cleaning up old commands...');
                if (config.guildId) {
                    await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: [] });
                }
                await rest.put(Routes.applicationCommands(config.clientId), { body: [] });
                logger.info('[SYNC] All old commands removed. Setting up the new ones...');
                
                // Re-deploy immediately after purge
                await rest.put(Routes.applicationCommands(config.clientId), { body: commandData });
                return commandData.length;
            }

            if (scope === 'clear') {
                if (config.guildId) {
                    await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: [] });
                }
                await rest.put(Routes.applicationCommands(config.clientId), { body: [] });
                logger.info('Successfully cleared all command registrations.');
                return 0;
            }

            if (scope === 'global') {
                const data: any = await rest.put(Routes.applicationCommands(config.clientId), { body: commandData });
                logger.info(`Synchronized ${data.length} global commands.`);
                return data.length;
            }

            if (scope === 'guild_only') {
                // Push to guild without touching global commands (dev fast-path)
                if (!config.guildId) return 0;
                const data: any = await rest.put(
                    Routes.applicationGuildCommands(config.clientId, config.guildId),
                    { body: commandData }
                );
                logger.info(`Synchronized ${data.length} guild commands (dev fast-path).`);
                return data.length;
            }

            // Legacy 'guild' scope
            if (!config.guildId) {
                logger.warn('GUILD_ID not configured, skipping guild sync.');
                return 0;
            }
            const data: any = await rest.put(
                Routes.applicationGuildCommands(config.clientId, config.guildId),
                { body: commandData }
            );
            logger.info(`Synchronized ${data.length} guild commands.`);
            return data.length;
        } catch (error) {
            logger.error(`Sync Failure: ${error}`);
            throw error;
        }
    }
}

new AstraClient().init();
