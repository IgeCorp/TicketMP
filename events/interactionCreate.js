const { IgeClient } = require("@igecorp/ige-djs");

module.exports = async (client, interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "deleteMpTicket") {
            if (!interaction?.channel.name.startsWith("🎫・ticket-")) return;

            const user = await client.users.fetch(interaction?.channel?.topic);

            await user?.send({
                content: `> **Votre ticket sur ${interaction?.guild?.name} à été fermé.**`
            });
            await interaction?.reply({ content: `**Fermeture du ticket dans 5 secondes...**` })
            return setTimeout(async () => {
                await interaction?.channel?.delete()
            }, 5000);
        }
    } else if (interaction.isCommand()) {
        const { commandName } = interaction;

        if (!client.slashs.has(commandName)) return;
        return client.slashs.get(commandName)?.run(client, interaction);
    }
}