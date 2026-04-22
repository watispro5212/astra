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

            // Start Background Services
            const { ReminderService } = require('./services/reminderService');
            ReminderService.startChecker(this);

            this.user?.setActivity('Protecting the Sector | /about', { type: ActivityType.Watching });
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
                    const errorEmbed = new EmbedBuilder()
                        .setColor(0xff0000)
                        .setTitle('⚠️ Tactical Error')
                        .setDescription(`An unexpected error occurred during command execution.\n\`\`\`${error}\`\`\``);

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

    public async syncCommands(scope: 'global' | 'guild' | 'clear' = 'guild') {
        const rest = new REST({ version: '10' }).setToken(config.token);
        const commandData = Array.from(this.commands.values()).map(c => c.data.toJSON());

        try {
            logger.info(`Synchronizing Commands (Scope: ${scope})...`);

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
