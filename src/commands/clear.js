module.exports = {
	name: "clear",
	args: "<num> [user]",
	desc: "clears messages",
	categ: "Mod",
	mod: true,
	run: async(Discord, client, msg, args, config, mod) => {
		if(isNaN(args[0])) return msg.channel.send("invalid arguments");
		if(!mod) return msg.channel.send("mod role required to use this command");
		
		const self = msg.guild.members.cache.get(client.user.id);
		if(!msg.channel.permissionsFor(self).has("MANAGE_MESSAGES")) return msg.channel.send("missing permission: manage messages");
		if(!msg.channel.permissionsFor(self).has("READ_MESSAGE_HISTORY")) return msg.channel.send("missing permission: read message history");
		
		if(!msg.mentions.users.first()){
			if(args[0] >= 1 && args[0] <= 100) await msg.delete(); 
			msg.channel.bulkDelete(args[0]).then(msgs => {
				msg.channel.send(`${msgs.size} messages deleted`).then(dmsg => setTimeout(() => dmsg.delete(), 3000));
			}).catch(err => msg.channel.send(`an error has occured\n\`${err}\``));
		}else{
			let num = 0;
            msg.channel.messages.fetch({ limit: 100 }).then(async messages => {
                let filtered = messages.filter(message => message.author == msg.mentions.users.first());
				const arr = [];
				await filtered.forEach(fmsg => {
					if(num < args[0]){
						arr.push(fmsg);
						num++;
					}
				});
				filtered = filtered.filter(message => arr.includes(message));
				msg.channel.bulkDelete(filtered).then(() => msg.channel.send(`${num} messages deleted`).then(dmsg => setTimeout(() => dmsg.delete(), 3000))).catch(err => msg.channel.send(`an error has occured\n\`${err}\``));
            });
		}
	}
}
