import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js'
import dotenv from 'dotenv'
import config from './config.json' 

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildBans
    ],
    partials: [
        Partials.Message, Partials.User, Partials.Channel
    ]
})

dotenv.config()
global.config = config
module.exports = client

client.commands = new Collection();

// Imports for loaders
import { readdir } from "fs/promises";
import chalk from 'chalk'

// Loads all commands
async function commandLoad() {
    let dirs = await readdir('./commands')
    
    dirs.forEach(dir => {

        let files = readdir(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
        if(!files || files.length <= 0) return console.log(chalk.red('No commands'))

        let loaded = 0;

        files.forEach(file => {
            let command = import(`../commands/${dir}/${file}`).catch(err => {
                console.log(chalk.red(`Error ( Loading : commands/${dir}/${file} ) : `, err.code))
                loaded =- 1 
                return
            })

            if(!command) return;

            loaded =+ 1
            client.commands.set(command, command.NAME)
        })

        console.log(chalk.green(`Loaded ( ${loaded} ) file(s) successfully`))
    })
}

// Loads all events
async function eventLoad() {
    let files = await readdir('./util/events').filter(file => file.endsWith('.js'));
    if(!files || files.length <= 0) return console.log(chalk.red('No events'))

    let loaded = 0;

    files.forEach(file => {
        import(`../util/events/${file}`).catch(err => {
            console.log(chalk.red(`Error ( Loading : util/events/${file} ) : `, err.code))
            loaded =- 1
            return
        })

        loaded =+ 1
    })

    console.log(chalk.green(`Loaded ( ${loaded} ) file(s) succesfully`))
}

commandLoad(), eventLoad(), client.login(process.env.TOKEN);

