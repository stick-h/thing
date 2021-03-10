module.exports = {
	name: "prefix",
	args: "<prefix>",
	desc: "sets server prefix",
	categ: "Server",
	config: true,
	run: async(Discord, client, msg, args, config, mongoose) => {
		const prefixNew = msg.content.split(" ")[1];
		
		if(!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("manage guild permission required to use this command");
		if(args.length > 1) return msg.channel.send("prefix cannot contain spaces");
		if(!prefixNew) return msg.channel.send("missing arguments");
		
		await config.updateOne({prefix: prefixNew});
		msg.channel.send("prefix updated");
	}
}