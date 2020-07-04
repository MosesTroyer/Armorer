
import { Client, Message } from 'discord.js';

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', (message: Message) => {
    if (message.content === '!ping') {
        message.channel.send('Pong');
    }
});

client.login('');