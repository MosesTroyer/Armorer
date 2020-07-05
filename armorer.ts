
import { Message } from 'discord.js';

const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const config = require('./config.json')

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
    const commandFile = require(`./commands/${file}`);

    client.commands.set(commandFile.command.name, commandFile.command);
}

/*
    TODO




*/

client.once('ready', () => {
    console.log('Armorer at his station.');
});

client.on('message', (message: Message) => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) {
        return;
    }

    const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) {
        return;
    }

    const command = client.commands.get(commandName);

    if (command.argCount && args.length < command.argCount) {
        message.reply(`Not enough arguments given! Usage: ${ command.usage }`)
        return;
    }

    try {
        command.execute(client, message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error while performing your request.');
    }
});

client.login(config.token);