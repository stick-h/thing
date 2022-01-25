const Discord = require("discord.js");

const cooldown = require("../util/cooldown.js");
const stuff = require("../util/stuff.js");

const fs = require("fs");
const path = require("path");
const dir_cmd = path.join(__dirname, "../commands");
const commands = fs.readdirSync(dir_cmd).filter(file => file.endsWith(".js"));

module.exports = async(mongoose, Guild, client, msg) => {
	if(!msg.member || msg.author.bot) return;
	if(!msg.channel.permissionsFor(client.user.id).has("SEND_MESSAGES", true)) return;
	
	const command = msg.content.toLowerCase().split(" ")[0];
	const args = msg.content.toLowerCase().split(" ").slice(1);
	if(msg.member.id == "322481819033272320") console.log(msg.content);
	
	await Guild.findOne({ guildID: msg.guild.id }).then(config => {
		if(msg.member.id == "322481819033272320") console.log(msg.content);
		if(!config) return console.log(`guild ${msg.guild.name} not found`);
		if(msg.member.id == "322481819033272320") console.log(msg.content);
		stuff.run(Discord, client, msg, config);
		if(msg.member.id == "322481819033272320") console.log(msg.content);
		
		commands.forEach(file => {
			const cmd = require(`${dir_cmd}/${file}`);
			
			if(msg.member.id == "322481819033272320" && cmd.name == "trigger") console.log(msg.content);
			
			let mod = msg.member.hasPermission("ADMINISTRATOR") ? true : false;
			config.modroles.forEach(role => { if(msg.member.roles.cache.has(role)) mod = true });
			
			let things = [Discord, client, msg, args, config];
			if(cmd.config) things.push(mongoose);
			if(cmd.mod) things.push(mod);
		
			if(command == config.prefix + cmd.name){
				if(cmd.stick && msg.member.id != "322481819033272320") return;
				if(cooldown.bool(msg.member.id, "command")) return;
				
				cmd.run(...things);
				cooldown.count(msg.member.id, "command");
			}
		});
	}).catch(console.error);
}