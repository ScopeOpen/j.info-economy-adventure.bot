module.exports = {
    NAME: "ping",
    CATEGORY: "nothing",
    USAGE: "",
    DESCRIPTION: "lol",
    COOLDOWN: 0,
    SLASH: {

    },
    msgRun: async (client, message, args) => {
        message.reply({ content: "pong" })
    },
    slashRun: async () => {

    }
}