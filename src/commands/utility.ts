import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    MessageFlags
} from 'discord.js';
import { ReminderService } from '../services/reminderService';
import { Command } from '../types';
import { THEME } from '../core/constants';

const EIGHT_BALL_RESPONSES = [
    // Positive
    '✅ It is certain.',
    '✅ Without a doubt.',
    '✅ Yes, definitely.',
    '✅ You may rely on it.',
    '✅ As I see it, yes.',
    '✅ Most likely.',
    '✅ Outlook good.',
    '✅ Yes.',
    '✅ Signs point to yes.',
    // Neutral
    '🔮 Reply hazy, try again.',
    '🔮 Ask again later.',
    '🔮 Better not tell you now.',
    '🔮 Cannot predict now.',
    '🔮 Concentrate and ask again.',
    // Negative
    '❌ Don\'t count on it.',
    '❌ My reply is no.',
    '❌ My sources say no.',
    '❌ Outlook not so good.',
    '❌ Very doubtful.',
];

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('utility')
        .setDescription('🛠️ Useful tools: reminders, polls, and fun extras.')
        .setDMPermission(true)
        .addSubcommand(sub =>
            sub.setName('ping')
               .setDescription('Check the bot\'s response speed.')
        )
        .addSubcommand(sub =>
            sub.setName('remind')
               .setDescription('Set a reminder for yourself.')
               .addIntegerOption(opt => opt.setName('minutes').setDescription('How many minutes from now.').setRequired(true).setMinValue(1).setMaxValue(10080))
               .addStringOption(opt => opt.setName('message').setDescription('What to remind you about.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('poll')
               .setDescription('Create a poll for people to vote on.')
               .addStringOption(opt => opt.setName('question').setDescription('The question.').setRequired(true))
               .addStringOption(opt => opt.setName('options').setDescription('Comma-separated choices (2–10).').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('8ball')
               .setDescription('Ask the magic 8-ball a yes/no question.')
               .addStringOption(opt => opt.setName('question').setDescription('Your question.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('choose')
               .setDescription('Let the bot pick from a list of options for you.')
               .addStringOption(opt => opt.setName('options').setDescription('Comma-separated choices.').setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('coinflip')
               .setDescription('Flip a coin — heads or tails.')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const sub = interaction.options.getSubcommand();

        // ── PING ──────────────────────────────────────────────────────────
        if (sub === 'ping') {
            const sent = await interaction.reply({ content: '🏓 Pinging...', fetchReply: true, flags: [MessageFlags.Ephemeral] });
            const latency = sent.createdTimestamp - interaction.createdTimestamp;

            return interaction.editReply({ content: '', embeds: [new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle('🏓 PING')
                .addFields(
                    { name: '🔌 WebSocket', value: `\`${interaction.client.ws.ping}ms\``, inline: true },
                    { name: '📡 API',       value: `\`${latency}ms\``,                    inline: true }
                )
                .setFooter({ text: 'All good!' })] });

        // ── REMIND ────────────────────────────────────────────────────────
        } else if (sub === 'remind') {
            const minutes = interaction.options.getInteger('minutes')!;
            const message = interaction.options.getString('message')!;

            if (message.length > 300) {
                return interaction.reply({ content: '❌ Reminder message must be under 300 characters.', flags: [MessageFlags.Ephemeral] });
            }

            const remindAt = new Date(Date.now() + minutes * 60000);
            await ReminderService.createReminder(
                interaction.guildId,
                interaction.channelId,
                interaction.user.id,
                message,
                remindAt
            );

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(THEME.SUCCESS)
                .setTitle('🔔 REMINDER SET')
                .setDescription(`I'll remind you in **${minutes} minute${minutes !== 1 ? 's' : ''}**.`)
                .addFields({ name: '📝 Message', value: `\`\`\`${message}\`\`\`` })
                .setFooter({ text: `At ${remindAt.toUTCString()}` })] });

        // ── POLL ──────────────────────────────────────────────────────────
        } else if (sub === 'poll') {
            const question = interaction.options.getString('question')!;
            const opts     = interaction.options.getString('options')!
                .split(',').map(o => o.trim()).filter(o => o.length > 0);

            if (opts.length < 2 || opts.length > 10) {
                return interaction.reply({ content: '❌ Polls need between 2 and 10 options.', flags: [MessageFlags.Ephemeral] });
            }

            const emojis = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
            const description = opts.map((o, i) => `${emojis[i]} **${o}**`).join('\n');

            const msg = await interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle(`📊 ${question}`)
                .setDescription(description)
                .setFooter({ text: `Poll by ${interaction.user.username}` })
                .setTimestamp()], fetchReply: true });

            for (let i = 0; i < opts.length; i++) {
                await msg.react(emojis[i]).catch(() => {});
            }

        // ── 8BALL ─────────────────────────────────────────────────────────
        } else if (sub === '8ball') {
            const question = interaction.options.getString('question')!;
            const answer   = EIGHT_BALL_RESPONSES[Math.floor(Math.random() * EIGHT_BALL_RESPONSES.length)];

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(THEME.SECONDARY)
                .setTitle('🎱 Magic 8-Ball')
                .addFields(
                    { name: '❓ Question', value: question },
                    { name: '🔮 Answer',   value: `**${answer}**` }
                )
                .setFooter({ text: 'The 8-ball has spoken' })] });

        // ── CHOOSE ────────────────────────────────────────────────────────
        } else if (sub === 'choose') {
            const opts = interaction.options.getString('options')!
                .split(',').map(o => o.trim()).filter(o => o.length > 0);

            if (opts.length < 2) {
                return interaction.reply({ content: '❌ Give at least 2 options separated by commas.', flags: [MessageFlags.Ephemeral] });
            }

            const pick = opts[Math.floor(Math.random() * opts.length)];

            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(THEME.ACCENT)
                .setTitle('🎲 I Choose...')
                .setDescription(`**${pick}**`)
                .setFooter({ text: `From ${opts.length} options` })] });

        // ── COINFLIP ──────────────────────────────────────────────────────
        } else if (sub === 'coinflip') {
            const result = Math.random() < 0.5 ? 'Heads 🪙' : 'Tails 🔘';
            return interaction.reply({ embeds: [new EmbedBuilder()
                .setColor(THEME.WARNING)
                .setTitle('🪙 Coin Flip')
                .setDescription(`The coin landed on **${result}**!`)
                .setFooter({ text: 'Fair 50/50' })] });
        }
    }
};

export default command;
