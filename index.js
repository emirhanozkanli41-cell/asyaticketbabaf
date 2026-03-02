const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const express = require('express');

// RENDER PORT HATASINI ENGELLEMEK İÇİN
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot Aktif!'));
app.listen(port, () => console.log(`Port dinleniyor: ${port}`));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ]
});

const TOKEN = process.env.TOKEN; 
const CATEGORY_ID = 'KATEGORI_ID_BURAYA'; // Buraya kendi kategori ID'ni yaz kanka

client.once('ready', () => {
    console.log(`${client.user.tag} aktif!`);
});

client.on('messageCreate', async (message) => {
    if (message.content === '!setup' && message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('create_ticket')
                .setLabel('Destek Talebi Aç')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🎫')
        );

        await message.channel.send({
            content: 'Destek talebi açmak için butona bas!',
            components: [row]
        });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'create_ticket') {
        try {
            const channel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: ChannelType.GuildText,
                parent: CATEGORY_ID,
                permissionOverwrites: [
                    { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
                ],
            });
            await interaction.reply({ content: `Kanal açıldı: ${channel}`, ephemeral: true });
        } catch (e) {
            console.error(e);
            await interaction.reply({ content: 'Hata oluştu!', ephemeral: true });
        }
    }
});

client.login(TOKEN);
