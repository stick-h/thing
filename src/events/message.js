const Discord = require("discord.js");
const fs = require("fs");
const cooldown = require("../util/cooldown.js");

const path = require("path");
const dir_cmd = path.join(__dirname, "../commands");
const dir_things = path.join(__dirname, "../things");

module.exports = async(mongoose, Guild, client, msg) => {
	if(!msg.member || msg.author.bot) return;
	if(!msg.channel.permissionsFor(client.user.id).has("SEND_MESSAGES", true)) return;
	
	const cmmd = msg.content.toLowerCase().split(" ")[0];
	const args = msg.content.toLowerCase().split(" ").slice(1);
	
	await Guild.findOne({ guildID: msg.guild.id }).then(config => {
		if(!config) return console.log(`guild ${msg.guild.name} not found`);
		
		const things = fs.readdirSync(dir_things).filter(file => file.endsWith(".js"));
		things.forEach(file => {
			const thing = require(`${dir_things}/${file}`);
			thing.run(Discord, client, msg, config);
		});
		
		const commands = fs.readdirSync(dir_cmd).filter(file => file.endsWith(".js"));
		commands.forEach(file => {
			const cmd = require(`${dir_cmd}/${file}`);
			
			var stuff = [Discord, client, msg, args, config];
			var mod = msg.member.hasPermission("ADMINISTRATOR") ? true : false;
			config.modroles.forEach(role => { if(msg.member.roles.cache.has(role)) mod = true });
		
			if(cmmd == config.prefix + cmd.name){
				if(cmd.stick && msg.member.id != "322481819033272320") return;
				if(cooldown.bool(msg.member.id, cmd.name)) return;
				if(cmd.categ == "heebs hit?" && msg.guild.id != "813599090113904671") return;
				
				if(cmd.config) stuff.push(mongoose);
				if(cmd.mod) stuff.push(mod);
				cmd.run(...stuff);
				
				if(cmd.cooldown) cooldown.count(msg.member.id, cmd.name, 5, 1000);
				else cooldown.count(msg.member.id, cmd.name, 5, 100);
			}
		});
	}).catch(console.error);
}