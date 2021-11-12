const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

/* Buttons */
const confirmMp = new MessageButton()
    .setStyle("SUCCESS")
    .setCustomId("confirmMpMessage")
    .setEmoji("📥");
const cancelMp = new MessageButton()
    .setStyle("DANGER")
    .setCustomId("cancelMpMessage")
    .setEmoji("❌");
const deleteMp = new MessageButton()
    .setStyle("DANGER")
    .setCustomId("deleteMpTicket")
    .setEmoji("🗑️");

/* Rows */
const rowMp = new MessageActionRow()
    .addComponents(confirmMp, cancelMp);
const rowDelete = new MessageActionRow()
    .addComponents(deleteMp);

/* Embeds */
const mpEmbed = new MessageEmbed()
    .setTitle("Support en MP")
    .setColor('#2F3136')
    .setDescription("> **Bonjour,**\n> **Voulez vous envoyer un message au support ?**\n> **Si oui, cliquez sur le bouton ci dessous.**")
    .setFooter("IgeCorp Support");
const deleteMpEmbed = new MessageEmbed()
    .setTitle("Support en MP")
    .setColor('#2F3136')
    .setDescription("> **Pour pouvoir supprimer le ticket, cliquez sur le bouton ci-dessous.**")
    .setFooter("IgeCorp Support");

module.exports = async (client, message) => {
    if (message.author.bot) return;

  /* MP SYSTEM */

  if (message.channel.type === "DM") {
    const guild = client?.guilds?.cache.get(client.testGuild),
        ticket = guild?.channels?.cache.find(x => x.name === `🎫・ticket-${message.author.discriminator}` && x?.topic === `${message.author.id}`);

    if (ticket) {
        const webhooks = await ticket?.fetchWebhooks(),
            hook = webhooks?.first();
        if (message?.attachments) {
            if (message?.content) {
                await hook?.send({
                    content: message.content,
                    files: [...message.attachments?.values()]
                });
            } else {
                await hook?.send({
                    content: null,
                    files: [...message.attachments?.values()]
                });
            }
        } else {
            await hook?.send({
                content: message?.content
            });
        }
        return message.react("📨");
    }

    const msg = await message.author?.send({
        content: null,
        embeds: [mpEmbed],
        components: [rowMp]
    });

    const filter = (btn) => (btn.customId === "confirmMpMessage" || btn.customId === "cancelMpMessage") && btn.user.id === message.author.id;
    const collector = await msg.channel?.createMessageComponentCollector({ filter, componentType: "BUTTON" });

    collector.on("collect", async (button) => {
        if (button.user.id === message.author.id) {
            if (button.customId === "confirmMpMessage") {
                if (!ticket) {
                    guild?.channels.create(`🎫・ticket-${message.author.discriminator}`, {
                        type: 'GUILD_TEXT',
                        permissionOverwrites: [
                            {
                                id: guild?.id,
                                deny: ["VIEW_CHANNEL"]
                            }, {
                                id: process.env.TICKET_SUPPORT,
                                allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "ADD_REACTIONS", "SEND_MESSAGES", "ATTACH_FILES"]
                            }
                        ],
                    parent: process.env.TICKET_CAT,
                    topic: `${message.author.id}`
                }).then(async ch => {
                    const hook = await ch?.createWebhook(message.author.username, {
                        avatar: message.author?.displayAvatarURL()
                    });

                    ch.send({
                        embeds: [deleteMpEmbed],
                        components: [rowDelete]
                    });

                    if (message.attachments) {
                        if (message.content) {
                            await hook.send({
                                content: message.content,
                                files: [...message.attachments.values()]
                            });
                        } else {
                            await hook.send({
                                content: null,
                                files: [...message.attachments.values()]
                            });
                        }
                    } else {
                        await hook.send({
                            content: message.content
                        });
                    }
                });

                await button.update({
                    content: "> **Votre message à bien été envoyé au support.**",
                    embeds: [],
                    components: []
                });
                await collector.stop();
                }
            } else if (button.customId === "cancelMpMessage") {
                await button.message?.delete();
                await collector.stop();
            }
        }
    });

    return;
    }

  /* Guild System */

    if (message.channel.name.startsWith("🎫・ticket-")) {
        const user = await client.users.fetch(message.channel?.topic);
        if (message.content?.startsWith("!")) return
        if (message.author?.bot) return

        const supportMp = new MessageEmbed()
            .setTitle(message.author.tag)
            .setThumbnail(message.author.displayAvatarURL())
            .setDescription(message.content);
        const noContentSupportMp = new MessageEmbed()
            .setTitle(message.author.tag)
            .setThumbnail(message.author?.displayAvatarURL())


        if (message?.attachments) {
            if (message?.content) {
                await user?.send({
                    content: null,
                    embeds: [supportMp],
                    files: [...message.attachments.values()]
                });
            } else {
                await user?.send({
                    content: null,
                    embeds: [noContentSupportMp],
                    files: [...message.attachments.values()]
                });
            }
        } else {
            await user?.send({
                content: null,
                embeds: [supportMp]
            });
        }

        return message.react("📨");
  }

  if (message?.content.includes(client?.user.username)) return message.react("👀");
};
