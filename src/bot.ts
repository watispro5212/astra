import { Client, GatewayIntentBits, Collection, Events, ActivityType } from 'discord.js';
import { config } from './core/config';
import logger from './core/logger';
import { db } from './core/database';
import * as path from 'path';
import * as fs from 'fs';

export class AstraClient extends Client {
    public commands = new Collection<string, any>();

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
        logger.info('Initializing Astra Bot (TypeScript Core)...');

        // Connect to Database
        await db.initializeTables();

        // Load Commands
        await this.loadCommands();

        // Register Events
        this.registerEvents();

        // Login
        await this.login(config.token);
    }

    private async loadCommands() {
        const commandsPath = path.join(__dirname, 'commands');
        if (!fs.existsSync(commandsPath)) fs.mkdirSync(commandsPath);

        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath).default;
            if (command && 'data' in command && 'execute' in command) {
                this.commands.set(command.data.name, command);
                logger.info(`Loaded command: ${command.data.name}`);
            }
        }
    }

    private registerEvents() {
        this.once(Events.ClientReady, async (c) => {
            logger.info(`Logged in as ${c.user.tag}`);
            
            // Sync Commands
            await this.syncCommands();

            this.user?.setActivity('Helping the community | /about', { type: ActivityType.Playing });
        });

        this.on(Events.InteractionCreate, async (interaction) => {
            if (!interaction.isChatInputCommand()) return;

            const command = this.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                logger.error(`Error executing ${interaction.commandName}: ${error}`);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        });
    }

    private async syncCommands() {
        try {
            logger.info('Started refreshing application (/) commands.');

            const commandData = Array.from(this.commands.values()).map(c => c.data.toJSON());

            if (config.guildId) {
                const guild = await this.guilds.fetch(config.guildId);
                await guild.commands.set(commandData);
                logger.info(`Successfully reloaded ${commandData.length} guild (/) commands.`);
            } else {
                await this.application?.commands.set(commandData);
                logger.info(`Successfully reloaded ${commandData.length} global (/) commands.`);
            }
        } catch (error) {
            logger.error(`Sync Error: ${error}`);
        }
    }
}
