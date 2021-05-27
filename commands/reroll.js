const Command = require("../base/commands_base");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");

class Reroll extends Command {
  constructor(client) {
    super(client, {
      name: "reroll",
      aliases: []
    });
  }

  async run(message, args, Discord) {
    if (!message.member.hasPermission("MANAGE_GUILD") && !message.member.roles.cache.some(r => r.name.toLowerCase() === "giveaway")) return message.channel.send(new MessageEmbed().setDescription("❌ | You don't have `MANAGE_GUILD` permission to manage giveaways!"));
    let id = args[0];
    if (!id) return message.channel.send(new MessageEmbed().setDescription("❌ | Please type the giveaway id."));
    let hasGiveaway = this.client.GiveawayManager.giveaways.find((g) => g.messageID === id);
    if (!hasGiveaway) {
      return message.channel(new MessageEmbed().setDescription('I Can\'t Find This giveaway with id `' + id + '`'));
    }
    this.client.GiveawayManager.reroll(hasGiveaway.messageID, {
      messages: {
        congrat: "🎉 New winner(s) : {winners}! 🎉",
        error: "❌ No valid participations!"
      }
    })
      .then(() => {
        if (message.deletable) message.delete();
        console.log('Reolled The giveaway' + id)
      })
      .catch((e) => {
        message.channel.send(new MessageEmbed().setDescription("❌ | Invalid giveaway id!"));
      });
  }
}

module.exports = Reroll;