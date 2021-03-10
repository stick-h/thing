module.exports = async(mongoose, Guild, client, guild) => {
    new Guild({
		_id: mongoose.Types.ObjectId(),
		guildID: guild.id,
		guildName: guild.name,
		prefix: "~",
		autorole: null,
		modroles: [],
		rolemenus: [],
		triggers: [],
		commands: []
	}).save().then(save => console.log(`guild ${save.guildName} added`)).catch(console.error);
}