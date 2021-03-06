const {Client, CommandInteraction, MessageEmbed} = require("discord.js");
const { moderation_embed_colour, guild_logs_id, unban_disabled} = require("../../structures/config");

module.exports = {
	name: "unban",
	description: "Used to unban a target id.",
	permission: "BAN_MEMBERS",
	usage: "/unban",
	options: [{
			name: "id",
			description: "Provide a user id to unban.",
			type: "STRING",
			required: true
		},
		{
			name: "reason",
			description: "Provide a reason for the unban.",
			type: "STRING",
			required: true
		}
	],
	/**
	 * @param {CommandInteraction} interaction
     * @param {Client} client
	 */
	execute(interaction, client) {
		if(unban_disabled) {return interaction.reply({embeds: [new MessageEmbed().setColor("DARK_RED").setTitle("**Command Disabled** ❌")], ephemeral: true})};

		const options = interaction.options
		const userID = options.getString("id");
		const user = interaction.member
		const name = interaction.commandName
		const error = "User not banned or doesn't exist"
		const reason2 = "Invalid Permissions"
		const per = this.permission

		const Embed1 = new MessageEmbed().setTitle("❌ Error Running Command ❌").setColor("RED").setTimestamp()
			.addFields({name: "Command:", value: name}, 
            {name: "Reason", value: reason2}, 
            {name: "Needed Permissions", value: per}
            )

		if (!user.permissions.has("BAN_MEMBERS"))
			return interaction.reply({embeds: [Embed1],ephemeral: true}).catch((err) => {console.log(err)})

		const reason = options.getString("reason");

		if (reason.length > 512)
            return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setTitle("❌ Error ❌").setDescription("Reason can't be more than 512 characters.").setTimestamp()], ephemeral: true});
		
        const SuccessEmbed = new MessageEmbed()
            .setColor(moderation_embed_colour)
            .addFields(
              { name: "Member unbanned", value: `<@${userID}>` },
              { name: "Reason", value: `${reason}` },
              { name: "Unbanned by", value: `${interaction.member.user}` }
            )
        
            const ErrorEmbed = new MessageEmbed()
			.setTitle(`❌ Couldn't Unban <@${userID}> From ${interaction.guild.name} ❌`)
			.setColor("RED")
			.setTimestamp()
			.addFields({
				name: "Reason It Failed:",
				value: error
			})
        
        const guild_logs = client.channels.cache.get(guild_logs_id)

		interaction.guild.members.unban(userID).then(() => {interaction.reply({embeds: [SuccessEmbed], ephemeral: true})}).then(() => {guild_logs.send({ embeds: [SuccessEmbed] })})
            .catch(() => {interaction.reply({embeds: [ErrorEmbed],ephemeral: true})})
        
	}
}