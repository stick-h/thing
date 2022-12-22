const Discord = require("discord.js");
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const fs = require("fs");
const files = fs.readdirSync(`${__dirname}/events`).filter(file => file.endsWith(".js"));

const mongoose = require("mongoose");
const Guild = require("./util/guild.js");
client.mongoose = require("./util/mongoose.js");

client.once("ready", async() => {
	console.log("ready");
	client.user.setPresence({ activity: { name: "~help" }, status: "online" });
	
	client.guilds.cache.forEach(async guild => {
		await Guild.findOne({ guildID: guild.id }).then(res => {
			if(!res) new Guild({
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
		}).catch(console.error);
	});
});

files.forEach(file => {
	const event = require(`${__dirname}/events/${file}`);
	client.on(file.split(".")[0], event.bind(null, mongoose, Guild, client));
});

client.mongoose.init();
client.login(process.env.TOKEN);