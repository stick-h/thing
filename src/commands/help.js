const fs = require("fs");

function collection(map, dir){
	const files = fs.readdirSync(dir).filter(file => file.endsWith(".js"));
	files.forEach(file => {
		const exp = require(`${dir}/${file}`);
		map.set(exp.name, exp); 
	});
}

module.exports = {
	name: "help",
	args: "[category]",
	categ: "info",
	run: async(Discord, client, msg, args, config) => {
		if(!msg.guild.members.cache.get(client.user.id).hasPermission("EMBED_LINKS")) return msg.channel.send("missing permission: embed links");
		const embed = new Discord.MessageEmbed().setTitle("Help Menu").setColor("#7289da").setThumbnail(client.user.avatarURL());
		
		client.commands = new Discord.Collection();
		collection(client.commands, __dirname);
		let categs = {};
		
		client.commands.forEach(cmd => {
			if(categs[cmd.categ] == undefined) categs[cmd.categ] = [];
			const content = [];
			
			let str = config.prefix + cmd.name;
			if(typeof cmd.args === "string") str += " " + cmd.args;
			content.push("`" + str + "`");
			if(cmd.args instanceof Array) for(i = 0; i < cmd.args.length; i++) content.push("- `" + cmd.args[i] + "`");
			categs[cmd.categ].push(content.join("\n"));
		});
		
		if(!args[0]) embed.addField("categories", "`" + Object.keys(categs).join("`\n`") + "`");
		else{
			if(categs[args[0]] == undefined) return msg.channel.send("category not found");
			embed.addField(args[0], categs[args[0]].join("\n\n")).setFooter(`<>: required argument • []: optional argument • |: choose between given options`);
		}
		
		msg.channel.send(embed);
	}
}