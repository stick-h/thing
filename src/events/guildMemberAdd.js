module.exports = async(mongoose, Guild, client, member) => {
	await Guild.findOne({ guildID: member.guild.id }).then(config => {
		if(!config) return console.log(`guild ${member.guild.name} not found`);
		
		if(config.autorole) member.guild.roles.fetch(config.autorole).then(role => {
			if(!role) return console.log(`autorole not found for guild ${member.guild.name}`);
			member.roles.add(role.id);
		});
	}).catch(console.error);
}