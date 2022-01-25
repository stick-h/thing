module.exports = {
	name: "mod",
	args: [
		"list", 
		"<add | rem> <role>"
	],
	categ: "server",
	config: true,
	run: async(Discord, client, msg, args, config, mongoose) => {
		const modroles = config.modroles;
		
		if(args[0] == "list"){
			if(!msg.guild.members.cache.get(client.user.id).hasPermission("EMBED_LINKS")) return msg.channel.send("missing permission: embed links");
			let desc = "no roles to show";
			if(modroles.length > 0) desc = `<@&${modroles.join(">\n<@&")}>`
			const embed = new Discord.MessageEmbed().addField(`List of Mod Roles in ${msg.guild.name}`, desc);
			return msg.channel.send(embed);
		}

		if(!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("`Manage Guild` permission required to use this command");
		let role = msg.mentions.roles.first();
		if(!role) return msg.channel.send("no role provided");
		const inArr = modroles.find(roleID => roleID == role.id);
			
		if(args[0] == "add"){
			if(inArr) return msg.channel.send("role already has mod perms");
			await config.updateOne({$push: {modroles: role.id}});
			return msg.channel.send("gave role mod perms");
		}
		
		if(args[0] == "rem"){
			if(!inArr) return msg.channel.send("role doesnt have mod perms");
			await config.updateOne({$pull: {modroles: role.id}});
			return msg.channel.send("removed role mod perms");
		}
	}
}