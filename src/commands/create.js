module.exports = {
	name: "create",
	args: "<text | voice> <name>",
	desc: "create channel in Cum City",
	categ: "heebs hit?",
	run: async(Discord, client, msg, args) => {
		const contract = "814735535976349706";
		const role = msg.guild.roles.cache.get(contract);
		if(!msg.member.roles.cache.has(contract)) return msg.channel.send(`role **${role.name}** required to use this command`);
		if(!msg.guild.members.cache.get(client.user.id).hasPermission("MANAGE_CHANNELS")) return msg.channel.send("missing permission: manage channels");
		if(!args[1]) return msg.channel.send("missing arguments");
		if(args[0] != "text" && args[0] != "voice") return msg.channel.send("invalid channel type");
		
		msg.guild.channels.create(msg.content.split(" ").slice(2).join(" "), {
			parent: "813868386231517184", type: args[0]
		}).then(channel => {
			msg.member.roles.remove(contract);
			msg.channel.send(`new channel <#${channel.id}> created`);
			channel.updateOverwrite(msg.member.id, {"MANAGE_CHANNELS": true, "MANAGE_ROLES": true, "SEND_MESSAGES": true, "MANAGE_MESSAGES": true});
		}).catch(err => msg.channel.send(`an error occured \n\`${err}\``));
	}
}