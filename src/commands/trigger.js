module.exports = {
	name: "trigger",
	args: [
		"list [page]",
		"add <trigger>", 
		"rem <index>",
		"<index> <text | file | reaction> <message | file | emoji | null>"
	],
	categ: "custom",
	config: true,
	run: async(Discord, client, msg, args, config, mongoose) => {
		if(args[0] == "list"){
			const embed = new Discord.MessageEmbed().setTitle("Triggers").setColor("#7289da");
			if(config.triggers.length == 0) embed.setDescription("No Triggers For This Server");
			else{
				const page  = args[1] ? args[1] : 1;
				if(isNaN(page) || page < 1 || page > Math.ceil(config.triggers.length/5)) return msg.channel.send("invalid page number");
				embed.setFooter(`${page}/${Math.ceil(config.triggers.length/5)}`);
				
				for(i = (page-1)*5; i < config.triggers.length && i < page*5; i++){
					const trigger = config.triggers[i];
					const url = trigger.file ? trigger.file.url : null;
					embed.addField(`${i} - ${trigger.name}`, `\`text\` - ${trigger.text}\n\`file\` - ${url}\n\`reaction\` - ${trigger.reaction}`);
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

		switch(args[1]){
			case "text":
				let response = msg.content.split(" ").slice(3).join(" ");
				if(response == "" || response == "null") response = null;
				await config.updateOne({$set: {"triggers.$[obj].text": response}}, {arrayFilters: [{obj: config.triggers[args[0]]}]});
				break;
			case "file":
				let file = null;
				if(msg.attatchments) file = msg.attachments.first();
				await config.updateOne({$set: {"triggers.$[obj].file": file}}, {arrayFilters: [{obj: config.triggers[args[0]]}]});
				break;
			case "reaction":
				if(args[2] == "" || args[2] == "null") args[2] = null;
				else msg.react(args[2]).catch(e => {msg.channel.send("invalid reaction"); args[2] == config.triggers[args[0]].reaction;});
				await config.updateOne({$set: {"triggers.$[obj].reaction": args[2]}}, {arrayFilters: [{obj: config.triggers[args[0]]}]}); 
				break;
		}
		
		return msg.channel.send("trigger updated");
	}
}