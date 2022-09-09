module.exports = {
	name: "em",
	args: "<emoji>",
	categ: "util",
	run: async(Discord, client, msg, args, config) => {
		if(!args[0] || !args[0].split(":")[2]) return msg.channel.send("invalid arguments");
		let id = args[0].split(":")[2].slice(0, -1);
		if(isNaN(id)) return msg.channel.send("invalid arguments");
		msg.channel.send(`https://cdn.discordapp.com/emojis/${id}.png`);
	}
}