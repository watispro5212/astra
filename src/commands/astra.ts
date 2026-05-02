import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';
import { Command } from '../types';
import aiCommand from './ai';
import blacklistCommand from './blacklist';
import economyCommand from './economy';
import giveawayCommand from './giveaway';
import infoCommand from './info';
import inviteCommand from './invite';
import leaderboardCommand from './leaderboard';
import levelingCommand from './leveling';
import levelingConfigCommand from './leveling_config';
import moderationCommand from './moderation';
import profileCommand from './profile';
import serverSetupCommand from './server_setup';
import shopCommand from './shop';
import stockmarketCommand from './stockmarket';
import syndicateCommand from './syndicate';
import systemCommand from './system';
import ticketCommand from './ticket';
import utilityCommand from './utility';
import welcomeCommand from './welcome';

const ROOT_COMMANDS: Record<string, Command> = {
    profile: profileCommand,
    invite: inviteCommand,
};

const GROUP_COMMANDS: Record<string, Command> = {
    economy: economyCommand,
    ai: aiCommand,
    utility: utilityCommand,
    info: infoCommand,
    mod: moderationCommand,
    shop: shopCommand,
    ticket: ticketCommand,
    welcome: welcomeCommand,
    system: systemCommand,
    setup: serverSetupCommand,
    giveaway: giveawayCommand,
    blacklist: blacklistCommand,
    leveling: levelingCommand,
    leveling_config: levelingConfigCommand,
    stockmarket: stockmarketCommand,
    leaderboard: leaderboardCommand,
    syndicate: syndicateCommand,
};

function applyOption(builder: any, option: any) {
    switch (option.type) {
        case 3: {
            const opt = builder.addStringOption((o: any) => {
                let next = o.setName(option.name).setDescription(option.description || '');
                if (option.required) next = next.setRequired(true);
                if (option.choices) next = next.addChoices(...option.choices);
                if (option.min_length != null) next = next.setMinLength(option.min_length);
                if (option.max_length != null) next = next.setMaxLength(option.max_length);
                return next;
            });
            return opt;
        }
        case 4: {
            const opt = builder.addIntegerOption((o: any) => {
                let next = o.setName(option.name).setDescription(option.description || '');
                if (option.required) next = next.setRequired(true);
                if (option.min_value != null) next = next.setMinValue(option.min_value);
                if (option.max_value != null) next = next.setMaxValue(option.max_value);
                if (option.choices) next = next.addChoices(...option.choices);
                return next;
            });
            return opt;
        }
        case 10: {
            const opt = builder.addNumberOption((o: any) => {
                let next = o.setName(option.name).setDescription(option.description || '');
                if (option.required) next = next.setRequired(true);
                if (option.min_value != null) next = next.setMinValue(option.min_value);
                if (option.max_value != null) next = next.setMaxValue(option.max_value);
                if (option.choices) next = next.addChoices(...option.choices);
                return next;
            });
            return opt;
        }
        case 5: {
            return builder.addBooleanOption((o: any) => {
                let next = o.setName(option.name).setDescription(option.description || '');
                if (option.required) next = next.setRequired(true);
                return next;
            });
        }
        case 6: {
            return builder.addUserOption((o: any) => {
                let next = o.setName(option.name).setDescription(option.description || '');
                if (option.required) next = next.setRequired(true);
                return next;
            });
        }
        case 7: {
            return builder.addChannelOption((o: any) => {
                let next = o.setName(option.name).setDescription(option.description || '');
                if (option.required) next = next.setRequired(true);
                if (option.channel_types) next = next.addChannelTypes(...option.channel_types);
                return next;
            });
        }
        case 8: {
            return builder.addRoleOption((o: any) => {
                let next = o.setName(option.name).setDescription(option.description || '');
                if (option.required) next = next.setRequired(true);
                return next;
            });
        }
        case 9: {
            return builder.addMentionableOption((o: any) => {
                let next = o.setName(option.name).setDescription(option.description || '');
                if (option.required) next = next.setRequired(true);
                return next;
            });
        }
        default:
            return builder;
    }
}

function buildSubcommand(builder: any, option: any) {
    const sub = builder.addSubcommand((s: any) => {
        let next = s.setName(option.name).setDescription(option.description || '');
        return next;
    });

    if (option.options) {
        for (const opt of option.options) {
            applyOption(sub, opt);
        }
    }
}

function buildSubcommandGroup(group: any, module: Command) {
    const moduleJson = module.data.toJSON();
    group.setName(moduleJson.name).setDescription(moduleJson.description || '');

    for (const option of moduleJson.options ?? []) {
        if (option.type === 1) {
            buildSubcommand(group, option);
        } else if (option.type === 2) {
            for (const sub of option.options ?? []) {
                buildSubcommand(group, {
                    ...sub,
                    name: `${option.name}-${sub.name}`,
                    description: `${sub.description || ''} (${option.name})`,
                });
            }
        }
    }

    return group;
}

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('astra')
        .setDescription('🛡️ One smart command for every Astra feature.')
        .setDMPermission(true)
        .addSubcommand(sub => sub.setName('profile').setDescription('View your full Astra profile.'))
        .addSubcommand(sub => sub.setName('invite').setDescription('Get Astra invite links.'))
        .addSubcommandGroup(group => buildSubcommandGroup(group, economyCommand))
        .addSubcommandGroup(group => buildSubcommandGroup(group, aiCommand))
        .addSubcommandGroup(group => buildSubcommandGroup(group, utilityCommand))
        .addSubcommandGroup(group => buildSubcommandGroup(group, infoCommand))
        .addSubcommandGroup(group => buildSubcommandGroup(group, moderationCommand))
        .addSubcommandGroup(group => buildSubcommandGroup(group, shopCommand))
        .addSubcommandGroup(group => buildSubcommandGroup(group, ticketCommand))
        .addSubcommandGroup(group => buildSubcommandGroup(group, welcomeCommand))
        .addSubcommandGroup(group => buildSubcommandGroup(group, systemCommand))
        .addSubcommandGroup(group => buildSubcommandGroup(group, serverSetupCommand))
        .addSubcommandGroup(group => buildSubcommandGroup(group, giveawayCommand))
        .addSubcommandGroup(group => buildSubcommandGroup(group, blacklistCommand))
        .addSubcommandGroup(group => buildSubcommandGroup(group, levelingCommand))
        .addSubcommandGroup(group => buildSubcommandGroup(group, levelingConfigCommand))
        .addSubcommandGroup(group => buildSubcommandGroup(group, stockmarketCommand))
        .addSubcommandGroup(group => buildSubcommandGroup(group, leaderboardCommand))
        .addSubcommandGroup(group => buildSubcommandGroup(group, syndicateCommand)),

    async execute(interaction: ChatInputCommandInteraction) {
        const group = interaction.options.getSubcommandGroup(false);
        const subcommand = interaction.options.getSubcommand(false);

        if (!group) {
            if (!subcommand) {
                return interaction.reply({ content: '❌ Unknown Astra command. Use `/astra info help` for the full list.', flags: [MessageFlags.Ephemeral] });
            }

            const command = ROOT_COMMANDS[subcommand];
            if (!command) {
                return interaction.reply({ content: '❌ Unknown Astra command. Use `/astra info help` for the full list.', flags: [MessageFlags.Ephemeral] });
            }

            return command.execute(interaction);
        }

        const command = GROUP_COMMANDS[group];
        if (!command) {
            return interaction.reply({ content: '❌ Unknown Astra command group. Use `/astra info help` for the full list.', flags: [MessageFlags.Ephemeral] });
        }

        return command.execute(interaction);
    }
};

export default command;
