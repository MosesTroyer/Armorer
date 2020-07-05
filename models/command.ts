import { Client, Message } from 'discord.js';

export interface Command {

    name: string;
    usage: string;
    argCount?: number;

    execute(client: Client, message: Message, args: string[]);

}