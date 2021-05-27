const Command = require("../base/commands_base");
const ms = require("ms");

class GEnd extends Command {
  constructor(client) {
    super(client, {
      name: "end",
      aliases: []
    });
  }

  async run(message, args, Discord) {
    if (!message.member.hasPermission("MANAGE_GUILD") && !message.member.roles.cache.some(r => r.name.toLowerCase() === "giveaway")) return message.channel.send(new MessageEmbed().setDescription("❌ | You don't have `MANAGE_GUILD` permission to manage giveaways!"));
    let id = args[0];
    if (!id) return message.channel.send(new MessageEmbed().setDescription("❌ | Please type the giveaway id."));
    let hasGiveaway = this.client.GiveawayManager.giveaways.find((g) => g.messageID === id);
    if (!hasGiveaway) {
      return message.channel(new MessageEmbed().setDescription('I can\'t find this giveaway `' + id + '`'));
    }
    this.client.GiveawayManager.edit(hasGiveaway.messageID, {
      setEndTimestamp: Date.now()
    })
      .then(() => {
        message.channel.send(new MessageEmbed().setDescription('Giveaway will end in less than ' + (this.client.GiveawayManager.options.updateCountdownEvery / 1000) + ' seconds...').then(m => m.delete({ timeout: 2000 })));
      })
      .catch((e) => {
        message.channel.send(new MessageEmbed().setDescription("Something is wrong: ```js\n" + e.message + "```"));
      });
    if (message.deletable) message.delete();
    return console.log(`Giveaway Has Ben deleted ` + id)
  }
}

module.exports = GEnd;