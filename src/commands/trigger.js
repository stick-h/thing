module.exports = {
	name: "trigger",
	args: {
		"list [page]" : "lists all triggers and their indexes for this server",
		"add <trigger>" : "adds new trigger", 
		"rem <index>" : "removes trigger",
		"<index> <text | file | reaction> <message | file link | emoji | null>" : "assigns a response to a trigger",
	},
	categ: "Custom",
	config: true,
	run: async(Discord, client, msg, args, config, mongoose) => {
		console.log("2 " + msg.content);
		if(args[0] == "list"){
			const embed = new Discord.MessageEmbed().setTitle("Triggers").setColor("#7289da");
			if(config.triggers.length == 0) embed.setDescription("No Triggers For This Server");
			else{
				const page  = args[1] ? args[1] : 1;
				if(isNaN(page) || page < 1 || page > Math.ceil(config.triggers.length/5)) return msg.channel.send("invalid page number");
				embed.setFooter(`${page}/${Math.ceil(config.triggers.length/5)}`);
				
				for(i = (page-1)*5; i < config.triggers.length && i < page*5; i++){
					const trigger = config.triggers[i];
					embed.addField(`${i} - ${trigger.name}`, `\`text\` - ${trigger.text}\n\`file\` - ${trigger.file}\n\`reaction\` - ${trigger.reaction}`);
				}
			}
			return msg.channel.send(embed);
		}
		
		if(!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("manage guild permission required to use this command");
		
		if(args[0] == "add"){
			const str = msg.content.split(" ").slice(2).join(" ");
			const exists = await config.triggers.find(obj => obj.name == str);
			
			if(!str) return msg.channel.send("no text provided");
			if(exists) return msg.channel.send("trigger already exists");
			
			await config.updateOne({$push: {"triggers": {name: str, text: null, file: null, reaction: null}}});
			return msg.channel.send(`trigger ${config.triggers.length} created`);
		}
		
		if(args[0] == "rem"){
			if(isNaN(args[1]) || !config.triggers[args[1]]) return msg.channel.send("invalid index");
			const name = config.triggers[args[1]].name;
			await config.updateOne({$pull: {"triggers": config.triggers[args[1]]}});
			return msg.channel.send(`trigger ${name} removed`);
		}
		
		if(isNaN(args[0]) || !config.triggers[args[0]]) return msg.channel.send("invalid index");
		if(args[1] != "text" && args[1] != "file" && args[1] != "reaction") return msg.channel.send("invalid arguments");
		
		let response = msg.content.split(" ").slice(3).join(" ");
		if(args[2] == "null") response = null;
		let file;
		if(args[1] == "file"){
			if(msg.attachments.size == 0) file = null;
			else file = msg.attachments.first();
		}
		
		switch(args[1]){
			case "text": await config.updateOne({$set: {"triggers.$[obj].text": response}}, {arrayFilters: [{obj: config.triggers[args[0]]}]}); break;
			case "file": await config.updateOne({$set: {"triggers.$[obj].file": file}}, {arrayFilters: [{obj: config.triggers[args[0]]}]}); break;
			case "reaction": await config.updateOne({$set: {"triggers.$[obj].reaction": args[2]}}, {arrayFilters: [{obj: config.triggers[args[0]]}]}); break;
		}
		
		return msg.channel.send("trigger updated");
	}
}