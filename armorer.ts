
import { Message } from 'discord.js';

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json')

client.once('ready', () => {
    console.log('Armorer at his station.');
});

client.on('message', (message: Message) => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) {
        return;
    }

    const args = message.content.slice(config.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'avatar') {
        let target = message.author;
        let preamble = 'here\'s the link to your avatar:';

        if (message.mentions.users.size) {
            target = message.mentions.users.first();
            preamble = `here's the link to ${ target.username }'s avatar:`;
        }

        message.reply(`${ preamble } <${ target.displayAvatarURL({ format: 'png', dynamic: true }) }>`);
    }
});

client.login(config.token);