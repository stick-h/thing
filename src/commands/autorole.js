module.exports = {
	name: "autorole",
	args: "[role | reset]",
	desc: "automatically assigns role to new members",
	categ: "Server",
	config: true,
	run: async(Discord, client, msg, args, config, mongoose) => {
		if(!args[0]){
			if(!config.autorole) return msg.channel.send("there is currently no autorole");
			else return msg.channel.send(`autorole is currently set to **${msg.guild.roles.cache.get(config.autorole).name}**`);
		}
		
		const role = msg.guild.roles.cache.get(args[0]) ? msg.guild.roles.cache.get(args[0]) : msg.mentions.roles.first();
		if(!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("manage guild permission required to use this command");
		if(args[0] == "reset"){
			await config.updateOne({autorole: null});
			return msg.channel.send("reset autorole");
		}
		
		if(!role) return msg.channel.send("invalid argument");
		await config.updateOne({autorole: role.id});
		msg.channel.send("autorole updated");
	}
}