module.exports = {
	name: "leave",
	stick: true,
	run: async(Discord, client, msg, args, config) => {
		const guild = client.guilds.cache.get(args[0]);
		guild.leave();
	}
}