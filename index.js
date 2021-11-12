const { IgeClient } = require("@igecorp/ige-djs");

require("dotenv").config();

const client = new IgeClient(process.env.TOKEN, {
    replies: true,
    prefix: process.env.PREFIX,
    owner: process.env.OWNER,
    testGuild: process.env.TEST_GUILD
});

client.params({
    commandsDir: "commands",
    slashsDir: "slashs",
    eventsDir: "events"
});