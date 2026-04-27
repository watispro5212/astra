import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';
import { THEME, VERSION } from '../core/constants';

const CREATE_COST = 50000;

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('syndicate')
        .setDescription('🦹 Create or manage a group.')
        .setDMPermission(false)
        .addSubcommand(sub => 
            sub.setName('create')
               .setDescription(`🏗️ Start a new group. Costs ${CREATE_COST} money.`)
               .addStringOption(opt => 
                   opt.setName('name')
                      .setDescription('The name of your group.')
                      .setRequired(true)
               )
        )
        .addSubcommand(sub =>
            sub.setName('info')
               .setDescription('📊 See your group stats.')
        )
        .addSubcommand(sub =>
            sub.setName('leave')
               .setDescription('🚪 Leave your current group.')
        )
        .addSubcommand(sub =>
            sub.setName('deposit')
               .setDescription('💎 Put money into the group bank.')
               .addIntegerOption(opt =>
                   opt.setName('amount')
                      .setDescription('How much money to put in.')
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
            const existingMember = await db.fetchOne('SELECT * FROM syndicate_members WHERE user_id = ?', userId);
            if (existingMember) {
                return interaction.editReply({ content: '❌ You are already in a group. You must leave it before starting a new one.' });
            }

            // Check if syndicate name exists
            const existingName = await db.fetchOne('SELECT * FROM syndicates WHERE name = ?', name);
            if (existingName) {
                return interaction.editReply({ content: '❌ A group with that name already exists.' });
            }

            // Check funds - FIXED: user_id instead of id, balance instead of credits
            let userEco = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            if (!userEco || (userEco.balance || 0) < CREATE_COST) {
                const balance = userEco?.balance || 0;
                return interaction.editReply({ content: `❌ You do not have enough money. Starting a group costs **${CREATE_COST.toLocaleString()}** money. (You have: **${balance.toLocaleString()}**)` });
            }

            try {
                // Deduct credits - FIXED: balance instead of credits, user_id instead of id
                await db.execute('UPDATE users SET balance = balance - ? WHERE user_id = ?', CREATE_COST, userId);
                
                // Create Group
                await db.execute(
                    'INSERT INTO syndicates (name, owner_id) VALUES (?, ?)', 
                    name, userId
                );

                const newSyn = await db.fetchOne('SELECT id FROM syndicates WHERE name = ?', name);

                if (!newSyn) throw new Error("Creation failed to return ID.");

                // Add owner to members array
                await db.execute(
                    'INSERT INTO syndicate_members (syndicate_id, user_id, role) VALUES (?, ?, ?)',
                    newSyn.id, userId, 'owner'
                );

                const embed = new EmbedBuilder()
                    .setColor(THEME.SUCCESS)
                    .setTitle('🦹 GROUP CREATED')
                    .setDescription(`You have successfully started the **${name}** group.\nGood luck on your journey!`)
                    .addFields(
                        { name: '💰 Cost', value: `\`${CREATE_COST.toLocaleString()} money\``, inline: true },
                        { name: '👑 Owner', value: `<@${userId}>`, inline: true }
                    )
                    .setFooter({ text: `Astra Groups` })
                    .setTimestamp();

                await interaction.editReply({ embeds: [embed] });
            } catch (err) {
                console.error(err);
                await interaction.editReply({ content: '❌ An error occurred while creating the group.' });
            }

        } else if (subcommand === 'info') {
            await interaction.deferReply();

            const memberInfo = await db.fetchOne('SELECT * FROM syndicate_members WHERE user_id = ?', userId);
            if (!memberInfo) {
                return interaction.editReply({ content: 'ℹ️ You are not in a group. Start one with `/syndicate create`.' });
            }

            const synInfo = await db.fetchOne('SELECT * FROM syndicates WHERE id = ?', memberInfo.syndicate_id);
            if (!synInfo) {
                return interaction.editReply({ content: '❌ Error: Group data is missing.' });
            }

            const totalMembersRow = await db.execute('SELECT COUNT(*) as count FROM syndicate_members WHERE syndicate_id = ?', memberInfo.syndicate_id);
            const memberCount = totalMembersRow.rows[0]?.count || 0;
            const ownerUser = interaction.client.users.cache.get(synInfo.owner_id) || await interaction.client.users.fetch(synInfo.owner_id).catch(() => null);

            const embed = new EmbedBuilder()
                .setColor(THEME.PRIMARY)
                .setTitle(`🦹 GROUP: ${synInfo.name.toUpperCase()}`)
                .setDescription(`A group of players working together.`)
                .addFields(
                    { name: '👑 Owner', value: ownerUser ? ownerUser.username : 'Unknown', inline: true },
                    { name: '👥 Members', value: `${memberCount}`, inline: true },
                    { name: '⭐ Level', value: `${synInfo.level || 1}`, inline: true },
                    { name: '💎 Group Bank', value: `${(synInfo.bank || 0).toLocaleString()} money`, inline: true },
                    { name: '🛡️ Your Rank', value: `${memberInfo.role.toUpperCase()}`, inline: true }
                )
                .setFooter({ text: `Astra Groups` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } else if (subcommand === 'leave') {
            await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

            const memberInfo = await db.fetchOne('SELECT * FROM syndicate_members WHERE user_id = ?', userId);
            if (!memberInfo) {
                return interaction.editReply({ content: '❌ You cannot leave a group because you are not in one.' });
            }

            if (memberInfo.role === 'owner') {
                return interaction.editReply({ content: '❌ You are the Owner. You must give ownership to someone else or delete the group.' });
            }

            await db.execute('DELETE FROM syndicate_members WHERE user_id = ?', userId);
            await interaction.editReply({ content: '🚪 You have left the group.' });

        } else if (subcommand === 'deposit') {
            const amount = interaction.options.getInteger('amount')!;
            
            if (amount <= 0) {
                return interaction.reply({ content: '❌ Deposit amount must be greater than zero.', ephemeral: true });
            }

            await interaction.deferReply();

            const memberInfo = await db.fetchOne('SELECT * FROM syndicate_members WHERE user_id = ?', userId);
            if (!memberInfo) {
                return interaction.editReply({ content: '❌ You must be in a group to deposit money.' });
            }

            let userEco = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', userId);
            if (!userEco || (userEco.balance || 0) < amount) {
                return interaction.editReply({ content: '❌ You do not have enough money.' });
            }

            try {
                // Deduct from user - FIXED: balance instead of credits, user_id instead of id
                await db.execute('UPDATE users SET balance = balance - ? WHERE user_id = ?', amount, userId);
                // Add to Syndicate
                await db.execute('UPDATE syndicates SET bank = bank + ? WHERE id = ?', amount, memberInfo.syndicate_id);
                
                await interaction.editReply({ content: `💎 Successfully put **${amount.toLocaleString()}** money into the group bank.` });
            } catch (err) {
                console.error(err);
                await interaction.editReply({ content: '❌ Failed to process the deposit. Please try again.' });
            }
        }
    }
};

export default command;
