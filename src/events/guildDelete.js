module.exports = async(mongoose, Guild, client, guild) => {
    await Guild.findOneAndDelete({ guildID: guild.id }).then(res => {
		if(res) console.log(`guild ${res.guildName} removed`);
		else console.log(`guild ${guild.name} not found`);
	}).catch(console.error);
}