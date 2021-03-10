module.exports = {
	name: "rolemenu",
	args: [
		"`list`\nlists all rolemenus in the server", 
		"`<message id> <create | delete>`\ncreates or deletes a rolemenu on a message",
		"`<message id> <add | rem> <role>`\nadds or removes role from rolemenu",
		"`<message id> toggle`\ntoggles if the rolemenu toggles"
	],
	categ: "Server",
	config: true,
	run: async(Discord, client, msg, args, config, mongoose) => {
		if(!args[0]) return msg.channel.send("missing arguments");
		var emoji;
		
		if(args[0] == "list"){
			const embed = new Discord.MessageEmbed().setTitle(`${msg.guild.name} Rolemenus`);
			if(config.rolemenus.length == 0) embed.addField("No Rolemenus For This Server", "\u200b");
			else config.rolemenus.forEach(rmenu => {
				const arr = [];
				rmenu.objs.forEach(obj => {
					let gEmoji = client.emojis.cache.get(obj.reaction);
					if(isNaN(obj.reaction*1)) emoji = `${obj.reaction}`;
					else emoji = `<:${gEmoji.name}:${gEmoji.id}>`;
					arr.push(`${emoji} <@&${obj.role}>`);
				});
				embed.addField(rmenu.id, arr.join("\n"));
			});
			return msg.channel.send(embed);
		}
		
		if(!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("manage guild permission required to use this command");
		
		const rmenu = config.rolemenus.find(rolemenu => rolemenu.id == args[0]);
		if(args[1] == "create"){
			if(rmenu) return msg.channel.send("rolemenu already exists");
			await config.updateOne({$push: {"rolemenus": {id: args[0], toggle: false, objs: []}}});
			return msg.channel.send("rolemenu created");
		}
		
		if(!rmenu) return msg.channel.send("invalid rolemenu");
		if(args[1] == "delete"){
			await config.updateOne({$pull: {"rolemenus": rmenu}});
			return msg.channel.send("rolemenu deleted");
		}
		
		if(args[1] == "toggle"){
			let bool;
			if(!rmenu.toggle) bool = true;
			else bool = false;
			await config.updateOne({"rolemenus.$[rolmenu].toggle": bool}, {arrayFilters: [{rolmenu: rmenu}]});
			return msg.channel.send("rolemenu toggle set to " + bool);
		}
		
		msg.channel.messages.fetch(rmenu.id).then(async rmsg => {
			const role = msg.guild.roles.cache.get(args[2]) ? msg.guild.roles.cache.get(args[2]) : msg.mentions.roles.first();
			const obj = rmenu.objs.find(obj => obj.role == role.id);
			if(!role) return msg.channel.send("no role provided");
			
			if(args[1] == "add"){
				if(obj) return msg.channel.send("role is already in rolemenu");
				
				msg.channel.send("react to this message with an emoji for the role").then(emsg => {
					emsg.awaitReactions((reactions, user) => user.id == msg.member.id, {max: 1, time: 30000 }).then(async reactions => {
						const reaction = reactions.first().emoji;
						
						if(reaction.id){
							if(!client.guilds.cache.has(reaction.guild.id)) return msg.channel.send("i cannot use an emoji from a server im not in");
							emoji = reaction.id;
						}else emoji = reaction.name;

						await config.updateOne({$push: {"rolemenus.$[rolmenu].objs": {role: role.id, reaction: emoji}}}, {arrayFilters: [{rolmenu: rmenu}]});
						rmsg.react(emoji);
						return msg.channel.send("role added");
					}).catch(err => {console.log(err)});
				});
			}
			
			if(args[1] == "rem"){
				if(!obj) return msg.channel.send("role isnt in rolemenu");
				await config.updateOne({$pull: {"rolemenus.$[rolmenu].objs": obj}}, {arrayFilters: [{rolmenu: rmenu}]});
				return msg.channel.send("role removed");
			}
		});
	}
}
