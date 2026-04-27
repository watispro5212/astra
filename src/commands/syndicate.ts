import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';
import { THEME, VERSION } from '../core/constants';

const CREATE_COST = 50000;

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('syndicate')
        .setDescription('🦹 Establish or manage a powerful Syndicate faction.')
        .setDMPermission(false)
        .addSubcommand(sub => 
            sub.setName('create')
               .setDescription(`🏗️ Found a new Syndicate. Costs ${CREATE_COST} credits.`)
               .addStringOption(opt => 
                   opt.setName('name')
                      .setDescription('The name of your Syndicate.')
                      .setRequired(true)
               )
        )
        .addSubcommand(sub =>
            sub.setName('info')
               .setDescription('📊 View your current Syndicate stats.')
        )
        .addSubcommand(sub =>
            sub.setName('leave')
               .setDescription('🚪 Leave your current Syndicate.')
        )
        .addSubcommand(sub =>
            sub.setName('deposit')
               .setDescription('💎 Deposit credits into the Syndicate bank.')
               .addIntegerOption(opt =>
                   opt.setName('amount')
                      .setDescription('Amount of credits to deposit.')
                      .setRequired(true)
               )
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        if (subcommand === 'create') {
            const name = interaction.options.getString('name')!;

            await interaction.deferReply();

            // Check if user already in a syndicate
            const existingMember = await db.fetchOne('SELECT * FROM syndicate_members WHERE user_id = $1', [userId]);
            if (existingMember) {
                return interaction.editReply({ content: '❌ You are already part of a Syndicate. You must leave it before founding a new one.' });
            }

            // Check if syndicate name exists
            const existingName = await db.fetchOne('SELECT * FROM syndicates WHERE name = $1', [name]);
            if (existingName) {
                return interaction.editReply({ content: '❌ A Syndicate with that name already exists in the sector.' });
            }

            // Check funds
            let userEco = await db.fetchOne('SELECT * FROM users WHERE id = $1', [userId]);
            if (!userEco || (userEco.credits || 0) < CREATE_COST) {
                return interaction.editReply({ content: `❌ You have insufficient funds. Founding a Syndicate costs **${CREATE_COST}** credits.` });
            }

            try {
                // Deduct credits
                await db.execute('UPDATE users SET credits = credits - $1 WHERE id = $2', [CREATE_COST, userId]);
                
                // Construct Syndicate
                await db.execute(
                    'INSERT INTO syndicates (name, owner_id) VALUES ($1, $2)', 
                    [name, userId]
                );

                const newSyn = await db.fetchOne('SELECT id FROM syndicates WHERE name = $1', [name]);

                if (!newSyn) throw new Error("Creation failed to return ID.");

                // Add owner to members array
                await db.execute(
                    'INSERT INTO syndicate_members (syndicate_id, user_id, role) VALUES ($1, $2, $3)',
                    [newSyn.id, userId, 'owner']
                );

                const embed = new EmbedBuilder()
                    .setColor(THEME.SUCCESS)
                    .setTitle('🦹 SYNDICATE ESTABLISHED')
                    .setDescription(`You have successfully founded the **${name}** Syndicate.\nEstablish your dominance across the sector.`)
                    .setFooter({ text: `Astra Syndicate Engine • v${VERSION}` })
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } catch (err) {
                console.error(err);
                await interaction.editReply({ content: '❌ A critical protocol error occurred while establishing the Syndicate.' });
            }

        } else if (subcommand === 'info') {
            await interaction.deferReply();

            const memberInfo = await db.fetchOne('SELECT * FROM syndicate_members WHERE user_id = $1', [userId]);
            if (!memberInfo) {
                return interaction.editReply({ content: 'ℹ️ You are not currently affiliated with any Syndicate. Establish one with `/syndicate create`.' });
            }

            const synInfo = await db.fetchOne('SELECT * FROM syndicates WHERE id = $1', [memberInfo.syndicate_id]);
            if (!synInfo) {
                return interaction.editReply({ content: '❌ Error: Syndicate data corrupted or missing.' });
            }

            const totalMembersRow = await db.execute('SELECT COUNT(*) as count FROM syndicate_members WHERE syndicate_id = $1', [synInfo.id]);
            const memberCount = totalMembersRow.rows[0].count;
            const ownerUser = interaction.client.users.cache.get(synInfo.owner_id) || await interaction.client.users.fetch(synInfo.owner_id).catch(() => null);

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle(`🦹 SYNDICATE: ${synInfo.name.toUpperCase()}`)
                .setDescription(`A powerful faction operating in the shadows of the sector.`)
                .addFields(
                    { name: '👑 Overseer', value: ownerUser ? ownerUser.username : 'Unknown', inline: true },
                    { name: '👥 Operatives', value: `${memberCount}`, inline: true },
                    { name: '⭐ Level', value: `${synInfo.level || 1}`, inline: true },
                    { name: '💎 Bank Reserve', value: `${synInfo.bank || 0} Credits`, inline: true },
                    { name: '🛡️ Your Rank', value: `${memberInfo.role.toUpperCase()}`, inline: true }
                )
                .setFooter({ text: `Astra Syndicate Engine • v${VERSION}` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'leave') {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

            const memberInfo = await db.fetchOne('SELECT * FROM syndicate_members WHERE user_id = $1', [userId]);
            if (!memberInfo) {
                return interaction.editReply({ content: '❌ You cannot leave a Syndicate because you are not in one.' });
            }

            if (memberInfo.role === 'owner') {
                return interaction.editReply({ content: '❌ You are the Overseer. You must transfer leadership or disband the Syndicate entirely.' });
            }

            await db.execute('DELETE FROM syndicate_members WHERE user_id = $1', [userId]);
            await interaction.editReply({ content: '🚪 You have officially severed all ties with your Syndicate.' });

        } else if (subcommand === 'deposit') {
            const amount = interaction.options.getInteger('amount')!;
            
            if (amount <= 0) {
                return interaction.reply({ content: '❌ Deposit amount must be greater than zero.', ephemeral: true });
            }

            await interaction.deferReply();

            const memberInfo = await db.fetchOne('SELECT * FROM syndicate_members WHERE user_id = $1', [userId]);
            if (!memberInfo) {
                return interaction.editReply({ content: '❌ You must be in a Syndicate to deposit funds.' });
            }

            let userEco = await db.fetchOne('SELECT * FROM users WHERE id = $1', [userId]);
            if (!userEco || (userEco.credits || 0) < amount) {
                return interaction.editReply({ content: '❌ You do not have enough credits to fulfill this deposit.' });
            }

            try {
                // Deduct from user
                await db.execute('UPDATE users SET credits = credits - $1 WHERE id = $2', [amount, userId]);
                // Add to Syndicate
                await db.execute('UPDATE syndicates SET bank = bank + $1 WHERE id = $2', [amount, memberInfo.syndicate_id]);
                
                await interaction.editReply({ content: `💎 Successfully deposited **${amount}** credits into the Syndicate bank vault.` });
            } catch (err) {
                console.error(err);
                await interaction.editReply({ content: '❌ Failed to process the deposit due to a network anomaly.' });
            }
        }
    }
};

export default command;
