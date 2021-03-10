const fs = require("fs");
const cats = require("../things/cats.json");

function collection(map, dir){
	const files = fs.readdirSync(dir).filter(file => file.endsWith(".js"));
	files.forEach(file => {
		const exp = require(`${dir}/${file}`);
		map.set(exp.name, exp); 
	});
}

module.exports = {
	name: "help",
	desc: "self explanatory",
	categ: "Info",
	cooldown: true,
	run: async(Discord, client, msg, args, config) => {
		if(!msg.guild.members.cache.get(client.user.id).hasPermission("EMBED_LINKS")) return msg.channel.send("missing permission: embed links");
		const embed = new Discord.MessageEmbed().setTitle("Help Menu").setColor("#7289da")
			.setThumbnail(client.user.avatarURL())
			.setFooter("<>: required argument • []: optional argument •  |: choose between the options given")
			.setAuthor("Cats drawn by @misunet", "https://i.redd.it/sywglt58ngg01.jpg", "https://www.instagram.com/misunet/");
		
		client.commands = new Discord.Collection();
		collection(client.commands, __dirname);
		var categs = {};
		var str;
		
		categs["Cats"] = [];
		for(var cat in cats) if(cats[cat].desc) categs["Cats"].push(`\`${cat}\` | ${cats[cat].desc}`);
		
		client.commands.forEach(cmd => {
			if(cmd.stick || !cmd.categ) return;
			if(cmd.categ == "heebs hit?" && msg.guild.id !== "813599090113904671") return;
			if(categs[cmd.categ] == undefined) categs[cmd.categ] = [];
			str = config.prefix + cmd.name;
			
			if(cmd.args){
				if(Array.isArray(cmd.args)) categs[cmd.categ].push(`\`${str}\`\n- ${cmd.args.join("\n\n- ")}\n`)
				else categs[cmd.categ].push(`\`${str} ${cmd.args}\`\n${cmd.desc}\n`);
			}else categs[cmd.categ].push(`\`${str}\`\n${cmd.desc}\n`);
		});
		
		for(var categ in categs) embed.addField(categ, categs[categ].join("\n"));
		msg.channel.send(embed);
	}
}