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
        .addSubcommand(sub =>
            sub.setName('inventory')
               .setDescription('View your owned assets and passive income rates.')
        )
        .addSubcommandGroup(group =>
            group.setName('admin')
                 .setDescription('🛡️ Administrative inventory management.')
                 .addSubcommand(sub =>
                    sub.setName('add')
                       .setDescription('Add a new item to the marketplace.')
                       .addStringOption(opt => opt.setName('name').setDescription('Item name.').setRequired(true))
                       .addIntegerOption(opt => opt.setName('price').setDescription('Credit cost.').setRequired(true))
                       .addIntegerOption(opt => opt.setName('production-rate').setDescription('Passive income per hour (0 = none).'))
                       .addStringOption(opt => opt.setName('description').setDescription('Item description.'))
                       .addIntegerOption(opt => opt.setName('stock').setDescription('Stock quantity (-1 = unlimited).'))
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
                const productionRate = interaction.options.getInteger('production-rate') ?? 0;
                const description = interaction.options.getString('description') ?? 'No description provided.';
                const stock = interaction.options.getInteger('stock') ?? -1;

                await db.execute(
                    'INSERT INTO shop_items (guild_id, name, description, price, production_rate, stock) VALUES (?, ?, ?, ?, ?, ?)',
                    guildId, name, description, price, productionRate, stock
                );

                await interaction.reply({
                    content: `✅ **INVENTORY LOGGED**: **${name}** added for \`${price}\` credits${productionRate > 0 ? ` · Yield: \`${productionRate}/hr\`` : ''}${stock > 0 ? ` · Stock: \`${stock}\`` : ''}`,
                    ephemeral: true
                });

            } else if (subcommand === 'remove') {
                const id = interaction.options.getInteger('id')!;
                const item = await db.fetchOne('SELECT name FROM shop_items WHERE id = ? AND guild_id = ?', id, guildId);
                if (!item) {
                    await interaction.reply({ content: `❌ Item ID \`${id}\` not found in this sector's marketplace.`, ephemeral: true });
                    return;
                }
                await db.execute('DELETE FROM shop_items WHERE id = ? AND guild_id = ?', id, guildId);
                await interaction.reply({ content: `✅ **DECOMMISSIONED**: **${item.name}** has been purged from the marketplace.`, ephemeral: true });
            }

            return;
        }

        if (subcommand === 'view') {
            const items = await db.fetchAll(
                'SELECT id, name, description, price, production_rate, stock FROM shop_items WHERE guild_id = ?',
                guildId
            );

            const embed = new EmbedBuilder()
                .setTitle(`🛒 APEX MARKETPLACE: ${interaction.guild!.name}`)
                .setColor(0xf1c40f)
                .setFooter({ text: 'Astra Commerce Division v7.0.0' })
                .setTimestamp();

            if (items.length === 0) {
                embed.setDescription('The warehouse is currently empty. An administrator can add items with `/shop admin add`.');
            } else {
                embed.setDescription(
                    items.map(i => {
                        const stockStr = i.stock === -1 ? '∞' : `${i.stock}`;
                        const yieldStr = i.production_rate > 0 ? `\n📊 Yield: \`${i.production_rate} cr/hr\`` : '';
                        return `**[${i.id}] ${i.name}** — \`${i.price.toLocaleString()}\` cr · Stock: \`${stockStr}\`\n*${i.description}*${yieldStr}`;
                    }).join('\n\n')
                );
            }

            await interaction.reply({ embeds: [embed] });

        } else if (subcommand === 'buy') {
            const id = interaction.options.getInteger('id')!;
            const item = await db.fetchOne(
                'SELECT * FROM shop_items WHERE id = ? AND guild_id = ?',
                id, guildId
            );

            if (!item) {
                await interaction.reply({ content: '❌ **INVALID TARGET**: Item ID not found in current sector warehouse.', ephemeral: true });
                return;
            }

            if (item.stock === 0) {
                await interaction.reply({ content: '❌ **OUT OF STOCK**: This item is no longer available.', ephemeral: true });
                return;
            }

            const user = await db.fetchOne('SELECT balance FROM users WHERE user_id = ?', interaction.user.id);
            if (!user || user.balance < item.price) {
                await interaction.reply({
                    content: `❌ **INSUFFICIENT CREDITS**: You need \`${item.price.toLocaleString()}\` credits. Your balance: \`${(user?.balance ?? 0).toLocaleString()}\``,
                    ephemeral: true
                });
                return;
            }

            await db.execute('UPDATE users SET balance = balance - ? WHERE user_id = ?', item.price, interaction.user.id);

            if (item.stock > 0) {
                await db.execute('UPDATE shop_items SET stock = stock - 1 WHERE id = ?', id);
            }

            if (item.production_rate > 0) {
                await db.execute(
                    'INSERT INTO user_inventory (user_id, item_id, quantity, last_harvest) VALUES (?, ?, 1, ?)',
                    interaction.user.id, item.id, new Date().toISOString()
                );
            }

            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(0x2ecc71)
                    .setTitle('✅ ACQUISITION CONFIRMED')
                    .setDescription(`You have purchased **${item.name}** for \`${item.price.toLocaleString()}\` credits.${item.production_rate > 0 ? `\n\n📊 This asset generates \`${item.production_rate} cr/hr\` in passive income. Use \`/economy harvest\` to collect.` : ''}`)
                    .setFooter({ text: 'Astra Commerce Division v7.0.0' })]
            });

        } else if (subcommand === 'inventory') {
            const inventory = await db.fetchAll(`
                SELECT ui.quantity, ui.last_harvest, si.name, si.production_rate, si.item_id
                FROM user_inventory ui
                JOIN shop_items si ON ui.item_id = si.id
                WHERE ui.user_id = ?
            `, interaction.user.id);

            if (!inventory || inventory.length === 0) {
                await interaction.reply({ content: '❌ Your inventory is empty. Visit `/shop view` to browse available assets.', ephemeral: true });
                return;
            }

            const lines = inventory.map(inv => {
                const pending = Math.floor(
                    ((Date.now() - new Date(inv.last_harvest).getTime()) / 3600000) * inv.production_rate
                );
                return `**${inv.name}** ×${inv.quantity} — \`${inv.production_rate} cr/hr\` · Pending: \`${pending} cr\``;
            });

            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(0x3498db)
                    .setTitle(`📦 ASSET INVENTORY: ${interaction.user.username}`)
                    .setDescription(lines.join('\n'))
                    .setFooter({ text: 'Passive income auto-processes every 5 minutes via the Industrial Yield Engine.' })
                    .setTimestamp()]
            });
        }
    }
};

export default command;
