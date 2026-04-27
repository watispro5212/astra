import { REST, Routes } from 'discord.js';
import { config } from './src/core/config';
import fs from 'fs';
import path from 'path';

async function test() {
    console.log("Loading commands...");
    const commands: any[] = [];
    const commandFiles = fs.readdirSync(path.join(__dirname, 'src', 'commands')).filter((f: string) => f.endsWith('.ts'));
    for (const file of commandFiles) {
        const cmd = require(path.join(__dirname, 'src', 'commands', file)).default || require(path.join(__dirname, 'src', 'commands', file)).command;
        if (cmd?.data) {
            commands.push(cmd.data.toJSON());
        }
    }

    console.log("Commands loaded:", commands.length);
    console.log("Syncing to Discord API...");
    const rest = new REST({ version: '10' }).setToken(config.token);
    try {
        await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands });
        console.log("DONE");
    } catch (e: any) {
        console.error("DISCORD ERROR:", e?.rawError?.errors || e);
    }
}
test();
