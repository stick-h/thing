module.exports = async(mongoose, Guild, client, role) => {
	await Guild.findOne({ guildID: role.guild.id }).then(async config => {
		if(!config) return console.log(`guild ${role.guild.name} not found`);
		
		if(config.autorole == role.id) await config.updateOne({autorole: null});
		config.rolemenus.forEach(async rmenu => {
			const obj = rmenu.objs.find(obj => obj.role == role.id);
			if(obj) await config.updateOne({$pull: {"rolemenus.$[obj].objs": obj}}, {arrayFilters: [{obj: rmenu}]});
		});
	}).catch(console.error);
};