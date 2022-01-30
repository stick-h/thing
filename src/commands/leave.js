module.exports = {
	name: "leave",
	categ: "vc",
	run: async(Discord, client, msg, args, config) => {
		const self = msg.guild.me;
		if(self.voice.channel == null) msg.channel.send("not connected to channel").catch(e => console.log(e));
		else self.voice.channel.leave();
	}
}