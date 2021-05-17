const cooldown = require("../util/cooldown.js");

module.exports = async(mongoose, Guild, client, reaction, user) => {
	const guild = reaction.message.guild;
	const self = guild.members.cache.get(client.user.id);
	if(!self.hasPermission("MANAGE_ROLES") || user.bot || !guild) return;
	if(user.bot) return;
	
	await Guild.findOne({ guildID: guild.id }).then(config => {
		if(!config) return console.log(`guild ${guild.name} not found`);
		const rmenu = config.rolemenus.find(rolemenu => rolemenu.id == reaction.message.id);
		if(!rmenu) return;
		
		const emoji = reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name;
		const obj = rmenu.objs.find(obj => obj.reaction == emoji);
		if(!obj) return;
		if(cooldown.bool(user.id, "react")){
			if(cooldown.bool(user.id, "reactDM")) return;
			user.createDM().then(dmChannel => dmChannel.send("you are attempting to change roles too fast"));
			return cooldown.count(user.id, "reactDM");
		}
		
		guild.members.fetch(user.id).then(async member => member.roles.remove(obj.role));
		cooldown.count(user.id, "react");
	}).catch(console.error);
}