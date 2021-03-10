module.exports = {
	name: "command",
	args: [
		"`list`\nlists all custom commands and their indexes for this server",
		"`add <command> <file link>`\nadds new command", 
		"`rem <index>`\nremoves command",
	],
	desc: "creates a custom image command",
	categ: "Server",
	config: true,
	run: async(Discord, client, msg, args, config, mongoose) => {
		if(args[0] == "list"){
			const embed = new Discord.MessageEmbed().setTitle("Custom Commands").setColor("#7289da");
			if(!config.commands) embed.setDescription("No Custom Commands For This Server");
			else for(i = 0; i < config.commands.length; i++) embed.addField(i + " " + config.prefix + config.commands[i].name, config.commands[i].file);
			return msg.channel.send(embed);
		}
		
		if(!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("manage guild permission required to use this command");
		
		if(args[0] == "add"){
			const exists = await config.commands.find(obj => obj.name == args[1]);
			
			if(!args[1]) return msg.channel.send("no command name provided");
			if(exists) return msg.channel.send("command already exists");
			if(!args[2]) return msg.channel.send("no file link provided");
			
			await config.updateOne({$push: {"commands": {name: args[1], file: args[2]}}});
			return msg.channel.send("command created");
		}
		
		if(args[0] == "rem"){
			const index = args[1]*1;
			const name = config.commands[index].name;
			if(isNaN(index) || !config.commands[index]) return msg.channel.send("invalid index");
			await config.updateOne({$pull: {"commands": config.commands[index]}});
			return msg.channel.send(`command ${name} removed`);
		}
	}
}