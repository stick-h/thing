module.exports = {
	name: "join",
	categ: "vc",
	run: async(Discord, client, msg, args, config) => {
		const channel = msg.member.voice.channel;
		if(channel == null) msg.channel.send("ur not in a channel").catch(e => console.log(e));
		else channel.join().catch(e => {msg.channel.send("can't join channel"); console.log(e)});
	}
}