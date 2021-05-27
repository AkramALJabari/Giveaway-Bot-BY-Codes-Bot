const Command = require("../base/commands_base");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const num = require("num-parse");

class GCreate extends Command {
  constructor(client) {
    super(client, {
      name: "create",
      aliases: ["start"]
    });
  }

  async run(message, args, Discord) {
    if (!message.member.hasPermission("MANAGE_GUILD") && !message.member.roles.cache.some(r => r.name.toLowerCase() === "giveaway")) return message.channel.send(new MessageEmbed().setDescription("❌ | You don't have `MANAGE_GUILD` to create giveaways!"));
    if (this.client.GiveawayManager.giveaways.filter((g) => g.guildID === message.guild.id && !g.ended).length + 1 > 3) return message.channel.send(new MessageEmbed().setDescription("❌ | You can't create more than 3 giveaways!"));
    let time = args[0];
    if (!time) return message.channel.send(new MessageEmbed().setDescription("❌ | Please Type The Giveaway Time!\nExapmle: " + `${process.env.PREFIX}create 10h 1w G-NITRO`));
    if (ms(time) > ms("10d")) {
      return message.channel.send(new MessageEmbed().setDescription("❌ | The giveaway time can't be more than 10 days!"));
    }
    let winners = args[1];
    if (!winners) return message.channel.send(new MessageEmbed().setDescription("❌ | Please Type The Giveaway winners number!\nExapmle: " + `${process.env.PREFIX}create 10h 1w G-NITRO`));
    winners = num(winners, 1);
    if (winners > 15) return message.channel.send(new MessageEmbed().setDescription("❌ | The Giveaway winners can't be more than 15!"));
    let prize = args.slice(2).join(" ");
    if (!prize) return message.channel.send(new MessageEmbed().setDescription("❌ | Please type the giveaway prize!\nExapmle: " + `${process.env.PREFIX}create 10h 1w G-NITRO`));

    this.client.GiveawayManager.start(message.channel, {
      time: ms(time),
      winnerCount: winners,
      prize: prize,
      hostedBy: message.author,
      messages: {
        giveaway: "🎉 **Giveaway** 🎉",
        giveawayEnded: "🎊 **Giveaway Ended!** 🎊",
        timeRemaining: "Time left: **{duration}**!",
        inviteToParticipate: "React with 🎉 to participate!",
        winMessage: "🎊 Congrats, {winners} for winning The **{prize}**!",
        embedFooter: `${this.client.user.tag}`,
        noWinner: "Nobody won because of the invalid participations!",
        hostedBy: "Hosted by: {user}",
        winners: "winner(s)",
        endedAt: "Ended at",
        units: {
          seconds: "seconds",
          minutes: "minutes",
          hours: "hours",
          days: "days"
        }
      }
    });
    if (message.deletable) message.delete();
    return console.log('Giveaway created')
  }
}

module.exports = GCreate;
