import { Message } from 'discord.js';

export interface Command {

    name: string;
    usage: string;

    execute(message: Message, args: string[]);

}