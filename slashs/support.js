const { IgeSlash } = require("@igecorp/ige-djs");
const { MessageEmbed } = require("discord.js");

class support extends IgeSlash {
    constructor(){
        super({
            name: "support",
            description: "Donne des informations de comment contacter le support.",
            guildOnly: true
        });
    }
    async run(client, interaction) {
        await interaction?.reply({
            content: null,
            embeds: [
                new MessageEmbed()
                .setTitle("IgeCorp Support System")
                .setDescription("> Vous pouvez me contacter avec me message privés pour contacter le support et poser vos questions ou images.")
                .setThumbnail(interaction.user?.displayAvatarURL({ dynamic: true }))
                .setAuthor(interaction.user.tag)
            ]
        });
    }
}

module.exports = new support;
