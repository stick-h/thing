module.exports = async(mongoose, Guild, client, msg) => {
	if(!msg.guild) return;
	await Guild.findOne({ guildID: msg.guild.id }).then(async config => {
		if(!config) return console.log(`guild ${msg.guild.name} not found`);
		
		const rmenu = config.rolemenus.find(rolemenu => rolemenu.id == msg.id); 
		if(rmenu) await config.updateOne({$pull: {rolemenus: rmenu}});
	}).catch(console.error);
}