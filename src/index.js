/*
Discord.js Documentation

    Collection : https://discord.js.org/#/docs/collection/main/class/Collection
    Partials : https://discord.js.org/#/docs/discord.js/main/typedef/Partials
    Client : https://discord.js.org/#/docs/discord.js/main/class/Client
*/

const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config()
const config = require('./config.json'); 

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


global.config = config
module.exports = client

client.commands = new Collection();

// Imports for loaders
const { readdir } = require("fs/promises");
const chalk = require('chalk-v2');

// Loads all commands
async function commandLoad() {
    let dirs = await readdir('./commands')
    
    dirs.forEach(dir => {

        let files = require(`./commands/${dir}/`).filter(file => file.endsWith('.js'));
        if(!files || files.length <= 0) return console.log(chalk.red('No commands'))

        let loaded = 0;

        files.forEach(file => {
            let command = require(`../commands/${dir}/${file}`).catch(err => {
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
        require(`../util/events/${file}`).catch(err => {
            console.log(chalk.red(`Error ( Loading : util/events/${file} ) : `, err.code))
            loaded =- 1
            return
        })

        loaded =+ 1
    })

    console.log(chalk.green(`Loaded ( ${loaded} ) file(s) succesfully`))
}

commandLoad(), eventLoad(), client.login(process.env.TOKEN);

