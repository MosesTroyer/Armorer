import { Client, Message } from 'discord.js';

import { Command } from '../models/command';

class Avatar implements Command {

    name = 'avatar';
    usage = 'Use !avatar by itself or with a mention to get a link to a Discord avatar.'

    execute(client: Client, message: Message, args: string[]) {
        let target = message.author;
        let preamble = 'here\'s the link to your avatar:';

        if (message.mentions.users.size) {
            target = message.mentions.users.first();
            preamble = `here's the link to ${ target.username }'s avatar:`;
        }

        message.reply(`${ preamble } <${ target.displayAvatarURL({ format: 'png', dynamic: true }) }>`);
    }

}

module.exports = {
    command: new Avatar()
}
