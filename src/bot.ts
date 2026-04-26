import { 
    Client, 
    GatewayIntentBits, 
    Collection, 
    Events, 
    ActivityType, 
    REST, 
    Routes,
    EmbedBuilder
} from 'discord.js';
import { config } from './core/config';
import logger from './core/logger';
import { db } from './core/database';
import { Command } from './types';
import { ErrorReporter } from './core/error_reporter';
import { StatusService } from './services/statusService';
import { PassiveIncomeService } from './services/passiveIncomeService';
import { ShopService } from './services/shopService';
import * as path from 'path';
import * as fs from 'fs';

export class AstraClient extends Client {
    public commands = new Collection<string, Command>();

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildPresences
            ]
        });
    }

    async init() {
        logger.info('Initializing Astra Tactical Bot (TypeScript)...');

        try {
            // Connect to Database
            await db.initializeTables();

            // Load Commands
            await this.loadCommands(path.join(__dirname, 'commands'));

            // Register Events
            this.registerEvents();

            // Login
            await this.login(config.token);
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
            } else if (file.endsWith('.ts') || file.endsWith('.js')) {
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
        this.once(Events.ClientReady, async (c) => {
            logger.info(`Astra Online: Logged in as ${c.user.tag}`);
            
            // Auto-Sync Logic
            const isProduction = process.env.RAILWAY_ENVIRONMENT_ID || process.env.NODE_ENV === 'production';
            if (isProduction) {
                logger.info('Production environment detected. Synchronizing commands globally...');
                await this.syncCommands('global');
            } else {
                await this.syncCommands('guild');
            }

            // Rotating Status Engine
            const statuses = [
                () => ({ name: `Omega v7.3.0 | /system update`, type: 0 }),
                () => ({ name: `${c.guilds.cache.size} Sectors`, type: 3 }),
                () => ({ name: `${c.users.cache.size} Members`, type: 2 }),
                () => ({ name: `Tactical Excellence`, type: 1 })
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

            this.user?.setActivity('Omega v7.3.0 | /system update', { type: ActivityType.Watching });

            // Sentinel Status Pulse
            await StatusService.sendSystemOnline(c);
            StatusService.startHeartbeat(this);
            StatusService.startHealthCheck(this);

            // Industrial Yield Engine
            PassiveIncomeService.startService();
        });

        // Tactical Intelligence (Leveling System)
        const xpCooldowns = new Map<string, number>();

        this.on(Events.MessageCreate, async (message) => {
            if (message.author.bot || !message.guild) return;

            const now = Date.now();
            const cooldown = xpCooldowns.get(message.author.id);

            if (cooldown && now - cooldown < 60000) return;
            xpCooldowns.set(message.author.id, now);

            const xpAdd = Math.floor(Math.random() * 11) + 15; // 15-25 XP
            
            let user = await db.fetchOne('SELECT xp, level FROM users WHERE user_id = ?', message.author.id);
            
            if (!user) {
                await db.execute('INSERT INTO users (user_id, xp, level) VALUES (?, ?, ?)', message.author.id, xpAdd, 0);
                user = { xp: xpAdd, level: 0 };
            } else {
                const newXp = (user.xp || 0) + xpAdd;
                const nextLevelXp = ((user.level || 0) + 1) * 500;

                if (newXp >= nextLevelXp) {
                    const newLevel = (user.level || 0) + 1;
                    const carryXp  = newXp - nextLevelXp; // carry remainder into next level
                    await db.execute('UPDATE users SET xp = ?, level = ? WHERE user_id = ?', carryXp, newLevel, message.author.id);
                    
                    // Fetch Leveling Configs
                    const cfg = await db.fetchOne('SELECT announcement_channel_id FROM leveling_configs WHERE guild_id = ?', message.guild.id);
                    const milestoneRole = await db.fetchOne('SELECT role_id FROM level_roles WHERE guild_id = ? AND level = ?', message.guild.id, newLevel);

                    if (milestoneRole) {
                        const role = await message.guild.roles.fetch(milestoneRole.role_id).catch(() => null);
                        if (role) await message.member?.roles.add(role).catch(() => {});
                    }

                    // XP bar for new level
                    const nextXpReq    = (newLevel + 1) * 500;
                    const barFilled    = Math.round((carryXp / nextXpReq) * 10);
                    const progressBar  = `${'█'.repeat(barFilled)}${'░'.repeat(10 - barFilled)}`;

                    const levelEmbed = new EmbedBuilder()
                        .setColor(0x9b59b6)
                        .setTitle('🎊 LEVEL UP — INTELLIGENCE ELEVATED')
                        .setDescription(`**${message.author.username}** has advanced to **Level ${newLevel}**!${milestoneRole ? `\n\n🎖️ **Role Reward:** <@&${milestoneRole.role_id}>` : ''}`)
                        .setThumbnail(message.author.displayAvatarURL())
                        .addFields(
                            { name: '⭐ New Level',     value: `\`${newLevel}\``,                          inline: true },
                            { name: '🎯 Next Level',     value: `\`${nextXpReq} XP\``,                      inline: true },
                            { name: '📊 Progress',       value: `\`[${progressBar}] ${carryXp}/${nextXpReq}\``, inline: false },
                        )
                        .setFooter({ text: 'Astra Intelligence Matrix • v7.3.0' })
                        .setTimestamp();

                    let targetChannel: any = message.channel;
                    if (cfg?.announcement_channel_id) {
                        try {
                            const announcementChan = await message.guild.channels.fetch(cfg.announcement_channel_id);
                            if (announcementChan && announcementChan.isTextBased()) {
                                targetChannel = announcementChan;
                            }
                        } catch (err) {
                            logger.warn(`Failed to fetch announcement channel ${cfg.announcement_channel_id}: ${err}`);
                        }
                    }

                    await targetChannel.send({ content: `<@${message.author.id}>`, embeds: [levelEmbed] }).catch((err: any) => {
                        logger.error(`Failed to send level-up message: ${err}`);
                    });
                } else {
                    await db.execute('UPDATE users SET xp = ? WHERE user_id = ?', newXp, message.author.id);
                }
            }
        });

        // Server Count Webhook
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
                            .setTitle('👋 New Operative Arrived')
                            .setDescription(msg)
                            .setThumbnail(member.user.displayAvatarURL())
                            .setFooter({ text: `Astra Welcome System • v7.0.0` })
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
                        .setTitle('👋 Operative Departed')
                        .setDescription(msg)
                        .setFooter({ text: 'Astra Welcome System • v7.0.0' })
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
                    return interaction.reply({ content: '❌ Access Denied: Administrator clearance required.', ephemeral: true });
                }

                try {
                    await command.execute(interaction);
                } catch (error) {
                    logger.error(`Execution Error [/${interaction.commandName}]: ${error}`);
                    
                    // Transmit Diagnostic Packet to Developer
                    await ErrorReporter.report(this, error, {
                        commandName: interaction.commandName,
                        guild: interaction.guild,
                        user: interaction.user
                    });

                    // Sentinel Anomaly Report
                    await StatusService.sendError(error);

                    const errorEmbed = new EmbedBuilder()
                        .setColor(0xff0000)
                        .setTitle('⚠️ Tactical Error')
                        .setDescription(`An unexpected error occurred during command execution. The system developer has been notified.\n\`\`\`${error}\`\`\``);

                    if (interaction.replied || interaction.deferred) {
                        await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
                    } else {
                        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
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

    public async syncCommands(scope: 'global' | 'guild' | 'clear' | 'full_purge' = 'guild') {
        const rest = new REST({ version: '10' }).setToken(config.token);
        const commandData = Array.from(this.commands.values()).map(c => c.data.toJSON());

        try {
            logger.info(`[SYNC] Initiating Command Synchronization (Scope: ${scope})...`);

            if (scope === 'full_purge') {
                logger.info('[SYNC] NUCLEAR PURGE: Eradicating all legacy command records from Discord servers...');
                if (config.guildId) {
                    await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: [] });
                }
                await rest.put(Routes.applicationCommands(config.clientId), { body: [] });
                logger.info('[SYNC] All sectors cleared of command echoes. Re-deploying Titan suite...');
                
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
                // Clear guild commands first to avoid duplication
                if (config.guildId) {
                    await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: [] });
                    logger.info('Cleared guild commands before global sync.');
                }
                const data: any = await rest.put(
                    Routes.applicationCommands(config.clientId),
                    { body: commandData }
                );
                logger.info(`Successfully synchronized ${data.length} Global commands.`);
                return data.length;
            } else {
                if (!config.guildId) {
                    logger.warn('GUILD_ID not configured. Defaulting to minimal sync.');
                    return 0;
                }
                // Clear global commands in development to avoid confusion
                await rest.put(Routes.applicationCommands(config.clientId), { body: [] });
                
                const data: any = await rest.put(
                    Routes.applicationGuildCommands(config.clientId, config.guildId),
                    { body: commandData }
                );
                logger.info(`Successfully synchronized ${data.length} Guild commands.`);
                return data.length;
            }
        } catch (error) {
            logger.error(`Sync Failure: ${error}`);
            throw error;
        }
    }
}

new AstraClient().init();
