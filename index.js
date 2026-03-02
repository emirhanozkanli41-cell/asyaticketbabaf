const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const express = require('express');

// 1. RENDER İÇİN WEB SUNUCUSU (Hata almanı engeller)
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot 7/24 Aktif!');
});

app.listen(port, () => {
  console.log(`Port dinleniyor: ${port}`);
});

// 2. DISCORD BOT AYARLARI
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ]
});

const TOKEN = process.env.TOKEN; 
const CATEGORY_ID = 'KATEGORI_ID_BURAYA'; // Buraya Discord'daki kategori ID'sini yaz

client.once('ready', () => {
    console.log(`${client.user.tag} olarak giriş yapıldı!`);
});

// Kurulum Komutu (!setup)
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

        await message.channel.send
