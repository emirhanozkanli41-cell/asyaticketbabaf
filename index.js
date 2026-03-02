const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const TOKEN = process.env.TOKEN; // Render üzerinde "Environment Variable" olarak ekleyeceğiz
const CATEGORY_ID = 'KATEGORI_ID_BURAYA'; // Ticketların açılacağı kategori ID'si

client.once('ready', () => {
    console.log(`${client.user.tag} aktif!`);
});

// Ticket Başlatma Mesajı Komutu (Örn: !setup)
client.on('messageCreate', async (message) => {
    if (message.content === '!setup' && message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('create_ticket')
                    .setLabel('Destek Talebi Aç')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🎫'),
            );

        await message.channel.send({
            content: 'Bir sorununuz mu var? Aşağıdaki butona basarak destek ekibimize ulaşabilirsiniz.',
            components: [row]
        });
    }
});

// Buton Etkileşimi
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'create_ticket') {
        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: CATEGORY_ID,
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
            ],
        });

        await interaction.reply({ content: `Kanalın oluşturuldu: ${channel}`, ephemeral: true });
        await channel.send(`Hoş geldin ${interaction.user}! Yetkililer birazdan burada olacak.`);
    }
});

client.login(TOKEN);