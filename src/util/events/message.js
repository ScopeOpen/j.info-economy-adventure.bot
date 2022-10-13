import { client } from '../../index.js'

client.on('messageCreate', (message) => {

    const PREFIX = client.config.Prefix
    const args = message.content.slice(prefix.length).trim().split(/ + /g);
    const invoke = args.shift().toLowerCase();

    const command = client.commands.get(invoke)
    
    if(message.user == bot) return;
    if(!message.content.startsWith(PREFIX)) return;

    if(command.CATEGORY == 'Owner' && !client.config.Owners.includes(message.author.id)) {
        message.reply({ content: 'This command is only accessible to devs/owners.' })
    }
})