import { Client, Message, User, Collection, Snowflake, MessageReaction } from 'discord.js';
import { Command } from '../models/command';

const Discord = require('discord.js');

class Poll implements Command {

    emojis = [ '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣' ];

    minimum = 2;
    maximum = 9;

    name = 'poll';
    usage = `!poll followed by the name of the poll, the time in minutes, and a comma separated list of all options. (minimum ${ this.minimum } options, max ${ this.maximum }) 
Ex: !poll Fast Food, 5, Taco Bell, Burger King`;

    execute(client: Client, message: Message, args: string[]) {
        const pollArgs = message.content.split(/ (.+)/)[1].split(',');

        if (pollArgs.length < this.minimum + 1 || pollArgs.length > this.maximum + 1) {
            this.sendError(message);
            return;
        }

        pollArgs.forEach((arg: string, index: number) => this[index] = arg.trim());

        const pollName = pollArgs.shift();
        let pollTime = parseFloat(String(pollArgs.shift()));

        if (isNaN(pollTime)) {
            this.sendError(message);
            return;
        }

        const embed = new Discord.MessageEmbed()
            .setColor('#000')
            .setTitle(`Poll: ${ pollName }`)
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setDescription(`React to this message to vote for the poll. Voting ends in ${ pollTime } minutes.`)
            .setTimestamp();

        pollArgs.forEach((arg: string, index: number) => {
            embed.addField(`${ arg }`, `${ this.emojis[index] }`);
        });

        message.channel.send('@here Please vote for this poll!');

        message.channel.send(embed).then((embedMessage: Message) => {
            pollArgs.forEach(async (arg: string, index: number) => {
                await embedMessage.react(this.emojis[index]);
            });

            const filter = (): boolean => { return true; };

            embedMessage.awaitReactions(filter, { time: 1000 * 60 * pollTime })
                .then((reactions: Collection<Snowflake, MessageReaction>) => {
                    const results = [];
                    const voters = new Map<string, User>();

                    reactions.forEach((reaction: MessageReaction) => {
                        results.push({
                            option: pollArgs[this.emojis.indexOf(reaction.emoji.name)],
                            votes: reaction.count - 1
                        });
                        reaction.users.cache.forEach((user: User) => {
                            if (voters.has(user.id) || user.id === client.user.id) {
                                return;
                            }

                            voters.set(user.id, user);
                        });
                    });

                    results.sort((a, b) => {
                       return b.votes - a.votes;
                    });

                    const winner = results[0];

                    message.channel.send(`${ winner.option } wins with ${ winner.votes } votes!`);

                    let votersPing = 'Attention: ';
                    Array.from(voters.values()).forEach((user: User) => {
                        votersPing += `<@${ user.id }> `
                    });

                    message.channel.send(votersPing);
                });
        });
    }

    sendError(message: Message) {
        message.reply(`Unable to create poll. Usage: ${ this.usage }`);
    }
}

module.exports = {
    command: new Poll()
}