import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ComponentType,
    MessageFlags
} from 'discord.js';
import { Command } from '../types';
import { THEME, VERSION, CODENAME, footerText } from '../core/constants';

// ── Category definitions ──────────────────────────────────────────────────
const CATEGORIES = [
    {
        value: 'economy',
        label: 'Economy',
        emoji: '💰',
        description: 'Earn, spend, and gamble money',
        color: THEME.WARNING,
        title: '💰 Economy Commands',
        fields: [
            { name: '`/economy daily`',    value: 'Claim your daily reward — streak bonuses stack up to +5,000/day.', inline: false },
            { name: '`/economy work`',     value: 'Work for 250–750 money. 1-hour cooldown.', inline: false },
            { name: '`/economy mine`',     value: 'Mine for crystals — 70% success, 30% risk. 30-min cooldown.', inline: false },
            { name: '`/economy gamble`',   value: 'Bet money for a 45% chance to win 1.8×. Min 100.', inline: false },
            { name: '`/economy slots`',    value: 'Spin the slot machine for 50 money. Triple 💎 pays 50×.', inline: false },
            { name: '`/economy coinflip`', value: 'Call heads or tails. Win double or lose it all.', inline: false },
            { name: '`/economy rob`',      value: 'Steal 10–20% from someone. 40% success, 2h cooldown.', inline: false },
            { name: '`/economy balance`',  value: 'Check your cash and bank. Works in DMs.', inline: false },
            { name: '`/economy bank`',     value: 'Deposit or withdraw. Bank money is safe from robbery.', inline: false },
            { name: '`/economy pay`',      value: 'Send money to another user.', inline: false },
            { name: '`/economy harvest`',  value: 'Collect passive income from shop items you own.', inline: false },
            { name: '`/economy stats`',    value: 'View your full money stats and daily streak.', inline: false },
        ]
    },
    {
        value: 'leveling',
        label: 'Leveling',
        emoji: '📈',
        description: 'XP, ranks, and level rewards',
        color: 0x9b59b6,
        title: '📈 Leveling Commands',
        fields: [
            { name: '`/leveling rank`',        value: 'View your XP progress, level, and global rank. Works in DMs.', inline: false },
            { name: '`/leveling leaderboard`', value: 'Top 15 users by level globally. Works in DMs.', inline: false },
            { name: '`/leveling setxp`',       value: 'Set a user\'s XP. **Admin only.**', inline: false },
            { name: '`/leveling setlevel`',    value: 'Set a user\'s level (XP resets). **Admin only.**', inline: false },
            { name: '`/leveling reset`',       value: 'Wipe a user\'s XP and level to zero. **Admin only.**', inline: false },
            { name: '`/leveling_config channel`', value: 'Set the channel for level-up announcements.', inline: false },
            { name: '`/leveling_config reward`',  value: 'Bind a role to a level milestone.', inline: false },
            { name: '`/leveling_config view`',    value: 'View all milestone roles and announcement settings.', inline: false },
        ]
    },
    {
        value: 'moderation',
        label: 'Moderation',
        emoji: '🛡️',
        description: 'Keep your server safe',
        color: THEME.DANGER,
        title: '🛡️ Moderation Commands',
        fields: [
            { name: '`/mod warn`',    value: 'Warn a user. Saves a case and DMs them the reason.', inline: false },
            { name: '`/mod kick`',    value: 'Kick a member from the server.', inline: false },
            { name: '`/mod ban`',     value: 'Permanently ban a user. Optionally delete 0–7 days of messages.', inline: false },
            { name: '`/mod unban`',   value: 'Remove a ban by user ID.', inline: false },
            { name: '`/mod timeout`', value: 'Mute a member for 1 min up to 28 days.', inline: false },
            { name: '`/mod purge`',   value: 'Bulk-delete up to 100 messages.', inline: false },
            { name: '`/mod case`',    value: 'View a specific case by number.', inline: false },
            { name: '`/mod history`', value: "See a user's full moderation history.", inline: false },
            { name: '`/mod note`',    value: 'Add a note to an existing case.', inline: false },
            { name: '`/mod close`',   value: 'Mark a case as closed.', inline: false },
            { name: '`/mod config log-channel`', value: 'Set the channel where mod actions are auto-logged.', inline: false },
        ]
    },
    {
        value: 'community',
        label: 'Community',
        emoji: '🎉',
        description: 'Giveaways, tickets, and welcome',
        color: THEME.SUCCESS,
        title: '🎉 Community Commands',
        fields: [
            { name: '`/giveaway start`',    value: 'Create a timed giveaway. Users react 🎉 to enter.', inline: false },
            { name: '`/giveaway end`',      value: 'End a giveaway early and pick winners.', inline: false },
            { name: '`/giveaway reroll`',   value: 'Re-pick new winners for an ended giveaway.', inline: false },
            { name: '`/ticket create`',     value: 'Open a private support channel with staff.', inline: false },
            { name: '`/ticket close`',      value: 'Close and delete the current ticket.', inline: false },
            { name: '`/ticket add`',        value: 'Add a user to this ticket.', inline: false },
            { name: '`/ticket remove`',     value: "Remove a user's access from this ticket.", inline: false },
            { name: '`/welcome setup`',     value: 'Configure welcome messages and auto-role for new members.', inline: false },
        ]
    },
    {
        value: 'shop',
        label: 'Shop & Stocks',
        emoji: '🛒',
        description: 'Server shop and stock market',
        color: THEME.SECONDARY,
        title: '🛒 Shop & Stock Market',
        fields: [
            { name: '`/shop view`',       value: 'Browse all items available in this server\'s shop.', inline: false },
            { name: '`/shop buy`',        value: 'Purchase an item by ID.', inline: false },
            { name: '`/shop sell`',       value: 'Sell an item for 50% of its price.', inline: false },
            { name: '`/shop inventory`',  value: 'View your owned items and pending passive income.', inline: false },
            { name: '`/shop admin`',      value: 'Add, edit, or remove shop items. **Admin only.**', inline: false },
            { name: '`/stockmarket market`',    value: 'View all 5 stocks with current prices and trends.', inline: false },
            { name: '`/stockmarket buy`',       value: 'Buy shares of a stock.', inline: false },
            { name: '`/stockmarket sell`',      value: 'Sell your shares.', inline: false },
            { name: '`/stockmarket portfolio`', value: 'View your holdings, profit/loss, and net worth.', inline: false },
            { name: '`/syndicate create`',  value: 'Start a group for 50,000 money.', inline: false },
            { name: '`/syndicate info`',    value: 'View your group stats and members.', inline: false },
            { name: '`/syndicate deposit`', value: 'Add money to the group bank.', inline: false },
            { name: '`/syndicate kick`',    value: 'Remove a member. **Owner only.**', inline: false },
            { name: '`/syndicate disband`', value: 'Delete the group and refund the bank. **Owner only.**', inline: false },
        ]
    },
    {
        value: 'ai',
        label: 'AI Assistant',
        emoji: '🤖',
        description: 'Chat with AI in your DMs',
        color: THEME.ACCENT,
        title: '🤖 AI Assistant',
        fields: [
            { name: 'DM — just send a message', value: 'Message Astra directly in your DMs — the AI replies instantly. No command needed.', inline: false },
            { name: '`/ai model`',  value: 'Switch between AI models (Smart, Fast, Expert). Works in DMs.', inline: false },
            { name: '`/ai info`',   value: 'See descriptions of all available AI models.', inline: false },
            { name: '`/ai status`', value: 'Check if the AI systems are online.', inline: false },
        ]
    },
    {
        value: 'utility',
        label: 'Utility',
        emoji: '🛠️',
        description: 'Reminders, polls, and more',
        color: THEME.INFO,
        title: '🛠️ Utility Commands',
        fields: [
            { name: '`/info help`',      value: 'See this help menu — works in DMs!', inline: false },
            { name: '`/info stats`',     value: 'Bot uptime, memory, ping, and shard info.', inline: false },
            { name: '`/info avatar`',    value: 'Get a full-size version of any user\'s avatar.', inline: false },
            { name: '`/info user`',      value: 'Get info about a server member.', inline: false },
            { name: '`/info server`',    value: "View the server's stats, channels, and boost level.", inline: false },
            { name: '`/profile`',        value: 'View your identity card — level, wealth, syndicate.', inline: false },
            { name: '`/utility ping`',     value: 'Check the bot\'s WebSocket and API speed.', inline: false },
            { name: '`/utility remind`',   value: 'Set a reminder for yourself.', inline: false },
            { name: '`/utility poll`',     value: 'Create a poll with up to 10 options.', inline: false },
            { name: '`/utility 8ball`',    value: 'Ask the magic 8-ball a yes/no question.', inline: false },
            { name: '`/utility choose`',   value: 'Let the bot randomly pick from your options.', inline: false },
            { name: '`/utility coinflip`', value: 'Flip a coin — heads or tails, no money involved.', inline: false },
            { name: '`/leaderboard`',    value: 'Server XP leaderboard, global leaderboard, or wealth ranking.', inline: false },
        ]
    },
    {
        value: 'system',
        label: 'System',
        emoji: '⚙️',
        description: 'Bot settings and owner tools',
        color: THEME.PRIMARY,
        title: '⚙️ System Commands',
        fields: [
            { name: '`/system status`',  value: 'Live bot health — uptime, memory, ping, shards.', inline: false },
            { name: '`/system ping`',    value: 'Real-time WebSocket and API latency.', inline: false },
            { name: '`/system sync`',    value: 'Force-re-register all slash commands globally. **Owner only.**', inline: false },
            { name: '`/system servers`', value: 'List all servers the bot is in. **Owner only.**', inline: false },
            { name: '`/system alert`',   value: 'Broadcast a message to all servers. **Owner only.**', inline: false },
            { name: '`/system update`',  value: 'Show latest bot updates and version information.', inline: false },
            { name: '`/invite`',         value: 'Get the invite link to add Astra to a server or profile.', inline: false },
            { name: '`/blacklist`',      value: 'Manage user blacklists. **Owner only.**', inline: false },
            { name: '`/dev`',            value: 'Developer diagnostics. **Owner only.**', inline: false },
        ]
    },
] as const;

// ── Overview embed shown before any selection ─────────────────────────────
function buildOverview(clientAvatar: string): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(THEME.PRIMARY)
        .setAuthor({ name: `Astra ${VERSION} ${CODENAME}`, iconURL: clientAvatar })
        .setTitle('📡 Help Center')
        .setDescription(
            `Welcome! Astra has **${CATEGORIES.reduce((n, c) => n + c.fields.length, 0)}+ commands** across 8 categories.\n\n` +
            `Use the menu below to browse by category. Most commands work in **DMs** too — type \`/\` to see the full list.\n​`
        )
        .addFields(
            CATEGORIES.map(c => ({
                name: `${c.emoji} ${c.label}`,
                value: c.description,
                inline: true,
            }))
        )
        .setThumbnail(clientAvatar)
        .setFooter({ text: footerText('Help') })
        .setTimestamp();
}

// ── Category embed ────────────────────────────────────────────────────────
function buildCategory(cat: typeof CATEGORIES[number], clientAvatar: string): EmbedBuilder {
    const embed = new EmbedBuilder()
        .setColor(cat.color as number)
        .setTitle(cat.title)
        .setThumbnail(clientAvatar)
        .setFooter({ text: footerText(cat.label) })
        .setTimestamp();

    // Discord limits: max 25 fields, max 1024 chars per value
    // Chunk into two columns by inserting a blank separator after 8 fields
    const fields = cat.fields.slice(0, 25);
    embed.addFields(fields);

    return embed;
}

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('📡 Browse every Astra command — works in DMs too!')
        .setDMPermission(true),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const avatar = interaction.client.user?.displayAvatarURL() ?? '';

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help_category_select')
            .setPlaceholder('Choose a category…')
            .addOptions(
                CATEGORIES.map(c =>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(c.label)
                        .setDescription(c.description)
                        .setEmoji(c.emoji)
                        .setValue(c.value)
                )
            );

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

        const response = await interaction.editReply({
            embeds: [buildOverview(avatar)],
            components: [row],
        });

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 120_000,
        });

        collector.on('collect', async i => {
            const cat = CATEGORIES.find(c => c.value === i.values[0]);
            if (!cat) return;

            // Update the selected option's default state visually
            const updatedMenu = new StringSelectMenuBuilder()
                .setCustomId('help_category_select')
                .setPlaceholder(`Viewing: ${cat.label}`)
                .addOptions(
                    CATEGORIES.map(c =>
                        new StringSelectMenuOptionBuilder()
                            .setLabel(c.label)
                            .setDescription(c.description)
                            .setEmoji(c.emoji)
                            .setValue(c.value)
                            .setDefault(c.value === cat.value)
                    )
                );

            await i.update({
                embeds: [buildCategory(cat, avatar)],
                components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(updatedMenu)],
            });
        });

        collector.on('end', () => {
            const disabledMenu = new StringSelectMenuBuilder()
                .setCustomId('help_category_select')
                .setPlaceholder('Menu expired — run /help again')
                .setDisabled(true)
                .addOptions(
                    new StringSelectMenuOptionBuilder().setLabel('Expired').setValue('expired')
                );
            interaction.editReply({
                components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(disabledMenu)],
            }).catch(() => {});
        });
    },
};

export default command;
