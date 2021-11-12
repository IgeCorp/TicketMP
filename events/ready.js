module.exports = async (client) => {
    const guild = client.guilds?.cache.get(client.testGuild);
    let commands;

    if (guild) {
        commands = guild?.commands;
    } else {
        commands = client.application?.commands;
    }

    const slashs = client.slashs?.toJSON()

    commands?.set(slashs);

    console.log(`${client.user?.tag} is ready.`);
}