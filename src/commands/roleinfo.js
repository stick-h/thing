module.exports = {
	name: "roleinfo",
	args: "<role>",
	desc: "self explanatory",
	categ: "Info",
	run: async(Discord, client, msg, args, config) => {
		if(!msg.mentions.roles.first()) return msg.channel.send("no role provided");
		if(!msg.guild.members.cache.get(client.user.id).hasPermission("EMBED_LINKS")) return msg.channel.send("missing permission: embed links");
		
		const role = msg.mentions.roles.first();
		const bits = (Discord.Permissions.DEFAULT).toString(2).split("").reverse();
		const arr = [];
		const permsD = [];
		
		for(i = 0; i < bits.length; i++){
			for(const key in Discord.Permissions.FLAGS) if(Discord.Permissions.FLAGS[key] == bits[i] << i) permsD.push(key.toString());
		}
		
		if(role.permissions.has("ADMINISTRATOR")) arr.push("ADMINISTRATOR");
		else for(const key in Discord.Permissions.FLAGS){
			if(role.permissions.has(key.toString()) && !permsD.find(perm => perm == key.toString())) arr.push(key.toString());
		}
		
		var perms = arr.join(" • ").split("_").join(" ").toLowerCase();
		if(arr.length == 0) perms = "None";
		
		const desc = [];
		if(role.hoisted) desc.push("Hoisted");
		if(role.mentionable) desc.push("Mentionable");
		
		const pos = msg.guild.roles.cache.size - role.position;
		var color = role.hexColor;
		if(color == "#000000") color = "None";
		
		const embed = new Discord.MessageEmbed().setTitle(role.name).setDescription(desc.join("\n"))
			.addFields(
				{name: "ID", value: role.id, inline: true},
				{name: "Color", value: color, inline: true},
				{name: "Ranking", value: `#${pos}/${msg.guild.roles.cache.size}`, inline: true},
				{name: "Key Permissions", value: perms},
			);
		if(color == role.hexColor) embed.setColor(role.hexColor);
		msg.channel.send(embed);
	}
}