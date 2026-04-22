import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    EmbedBuilder, 
    PermissionFlagsBits 
} from 'discord.js';
import { Command } from '../types';
import { db } from '../core/database';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('🛒 Access the Apex Marketplace.')
        .addSubcommand(sub => 
            sub.setName('view')
               .setDescription('Audit available inventory in the marketplace.')
        )
        .addSubcommand(sub => 
            sub.setName('buy')
               .setDescription('Purchase an item from the warehouse.')
               .addIntegerOption(opt => opt.setName('id').setDescription('Target item ID.').setRequired(true))
        )
        .addSubcommandGroup(group =>
            group.setName('admin')
                 .setDescription('🛡️ Administrative inventory management.')
                 .addSubcommand(sub =>
                    sub.setName('add')
                       .setDescription('Add a new item to the marketplace.')
                       .addStringOption(opt => opt.setName('name').setDescription('Item name.').setRequired(true))
                       .addIntegerOption(opt => opt.setName('price').setDescription('Credit cost.').setRequired(true))
                       .addRoleOption(opt => opt.setName('role').setDescription('Role to grant (optional).').setRequired(false))
                       .addIntegerOption(opt => opt.setName('production-rate').setDescription('Passive income per hour.').setRequired(false))
                       .addStringOption(opt => opt.setName('description').setDescription('Item description.').setRequired(false))
                 )
                 .addSubcommand(sub =>
                    sub.setName('remove')
                       .setDescription('Decommission an item from the warehouse.')
                       .addIntegerOption(opt => opt.setName('id').setDescription('Target item ID.').setRequired(true))
                 )
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const subcommand = interaction.options.getSubcommand();
        const group = interaction.options.getSubcommandGroup();
        const guildId = interaction.guildId!;

        if (group === 'admin') {
            if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
                await interaction.reply({ content: '❌ **CLEARANCE DENIED**: Administrator authority required.', ephemeral: true });
                return;
            }

            if (subcommand === 'add') {
                const name = interaction.options.getString('name')!;
                const price = interaction.options.getInteger('price')!;
                const role = interaction.options.getRole('role');
                const productionRate = interaction.options.getInteger('production-rate') || 0;
                const description = interaction.options.getString('description') || 'No description provided.';

                await db.execute(
                    'INSERT INTO shop_items (guild_id, name, description, role_id, price, production_rate) VALUES (?, ?, ?, ?, ?, ?)',
                    guildId, name, description, role?.id || null, price, productionRate
                );

                await interaction.reply({ content: `✅ **INVENTORY LOGGED**: **${name}** has been added to the warehouse for \`${price}\` credits. (Yield: \`${productionRate}/hr\`)`, ephemeral: true });

            } else if (subcommand === 'remove') {
                const id = interaction.options.getInteger('id')!;
                await db.execute('DELETE FROM shop_items WHERE id = ? AND guild_id = ?', id, guildId);
                await interaction.reply({ content: `✅ **DECOMMISSIONED**: Item ID \`${id}\` has been purged from the marketplace.`, ephemeral: true });
            }

        } else if (subcommand === 'view') {
            const items = await db.fetchAll('SELECT id, name, description, price, production_rate FROM shop_items WHERE guild_id = ?', guildId);

            const embed = new EmbedBuilder()
                .setTitle(`🛒 APEX MARKETPLACE: ${interaction.guild!.name}`)
                .setColor(0xf1c40f)
                .setDescription(items.length > 0
                    ? items.map(i => `**[${i.id}] ${i.name}** - \`${i.price}\` Credits\n*${i.description}*${i.production_rate > 0 ? `\n📊 **Yield**: \`${i.production_rate}/hr\`` : ''}`).join('\n\n')
                    : 'The warehouse is currently empty. Check back later.')
                .setFooter({ text: 'Astra Commerce Division v7.0.0' })
                .setTimestamp();
            
            // Special visualization for Windmills if present
            if (items.some(i => i.name.toLowerCase().includes('windmill'))) {
                embed.setThumbnail('https://i.imgur.com/your-image-link.png'); // I will replace this with a valid embedding in the response
            }

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'buy') {
            const id = interaction.options.getInteger('id')!;
            const item = await db.fetchOne('SELECT * FROM shop_items WHERE id = ? AND guild_id = ?', id, guildId);

            if (!item) {
                await interaction.reply({ content: '❌ **INVALID TARGET**: Item ID not found in current sector warehouse.', ephemeral: true });
                return;
            }

            const user = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', interaction.user.id);
            if (!user || user.balance < item.price) {
                await interaction.reply({ content: `❌ **INSUFFICIENT CREDITS**: This acquisition requires \`${item.price}\` credits.`, ephemeral: true });
                return;
            }

            const role = await interaction.guild!.roles.fetch(item.role_id).catch(() => null);
            if (!role) {
                await interaction.reply({ content: '❌ **SYSTEM ERROR**: The linked role no longer exists in this sector.', ephemeral: true });
                return;
            }

            // Execute Transaction
            await db.execute('UPDATE users SET balance = balance - ? WHERE user_id = ?', item.price, interaction.user.id);
            
            if (role) {
                await (interaction.member as any).roles.add(role).catch(() => {});
            }

            if (item.production_rate > 0) {
                await db.execute(
                    'INSERT INTO user_inventory (user_id, item_id, quantity, last_harvest) VALUES (?, ?, 1, ?)',
                    interaction.user.id, item.id, new Date().toISOString()
                );
            }

            await interaction.reply({ content: `✅ **ACQUISITION SUCCESS**: You have purchased **${item.name}** for \`${item.price}\` credits.${role ? ' The role has been granted.' : ''}${item.production_rate > 0 ? ' The asset is now producing passive income.' : ''}` });
        }
    }
};

export default command;
