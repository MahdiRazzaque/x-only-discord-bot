const { CommandInteraction, MessageEmbed } = require("discord.js");
const superagent = require("superagent");
const { fun_embed_colour, eight_ball_disabled } = require("../../structures/config");

module.exports = {
  name: "8ball",
  description: "Answers All Your Questions",
  usage: "/8ball [question]",
  cooldown: 10000,
  options: [
    {
      name: "question",
      description: "Ask The Question",
      type: "STRING",
      required: true,
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    if(eight_ball_disabled) {return interaction.reply({embeds: [new MessageEmbed().setColor("DARK_RED").setTitle("**Command Disabled** ❌")], ephemeral: true})};
    if (interaction.member.roles.cache.has("884051641253367839")) {return interaction.reply({embeds: [new MessageEmbed().setColor("DARK_RED").setDescription("Sorry you need to become a member of the clan before you can use commands. ❌")], ephemeral: true})};
    
    let { body } = await superagent.get(`https://nekos.life/api/v2/8ball`);

    const question = interaction.options.getString("question");

    if (question.length > 2000){
      return interaction.reply({embeds: [new MessageEmbed().setTitle("❌ Can't Run Code With The Strings Given ❌").setColor("RED").setDescription("Question Can't Be More Than 2000 Characters")]});
    }

    const Response = new MessageEmbed()
      .setAuthor(interaction.member.user.username, interaction.member.user.avatarURL({dynamic: true, size: 512}))
      .setColor(fun_embed_colour)
      .setTimestamp()
      .setFields({name: "Question", value: question})
      .setImage(body.url)
      .setFooter(`Requested by: ${interaction.member.user.username}`);

    interaction.reply({embeds: [Response]});
  },
};
