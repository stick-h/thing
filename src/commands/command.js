module.exports = {
	name: "command",
	args: {
		"list" : "lists all custom commands and their indexes for this server",
		"add <command> <file link>" : "adds new command", 
		"rem <index>" : "removes command",
	},
	categ: "Custom",
	config: true,
	run: async(Discord, client, msg, args, config, mongoose) => {
		if(args[0] == "list"){
			const embed = new Discord.MessageEmbed().setTitle("Custom Commands").setColor("#7289da");
			if(config.commands.length == 0) embed.setDescription("No Custom Commands For This Server");
			else{
				const page  = args[1] ? args[1] : 1;
				if(isNaN(page) || page < 1 || page > Math.ceil(config.commands.length/5)) return msg.channel.send("invalid page number");
				embed.setFooter(`${page}/${Math.ceil(config.commands.length/5)}`);
				
				for(i = (page-1)*5; i < config.commands.length && i < page*5; i++) embed.addField(i + " " + config.prefix + config.commands[i].name, config.commands[i].file);
			}
			return msg.channel.send(embed);
		}
		
		if(!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("manage guild permission required to use this command");
		
		if(args[0] == "add"){
			const exists = await config.commands.find(obj => obj.name == args[1]);
			
			if(!args[1]) return msg.channel.send("no command name provided");
			if(exists) return msg.channel.send("command already exists");
			if(!args[2]) return msg.channel.send("no file link provided");
			
			try{
				await msg.channel.send({files: [args[2]]}).catch();
				await config.updateOne({$push: {"commands": {name: args[1], file: args[2]}}});
				return msg.channel.send("command created");
			}catch(err){
				msg.channel.send("invalid file link");
			}
		}
		
		if(args[0] == "rem"){
			if(isNaN(args[1]) || !config.commands[args[1]]) return msg.channel.send("invalid index");
			const name = config.commands[args[1]].name;
			await config.updateOne({$pull: {"commands": config.commands[args[1]]}});
			return msg.channel.send(`command ${name} removed`);
		}
	}
}