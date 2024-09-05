const cooldown = require("../util/cooldown.js");
const fs = require("fs");
const gnns = fs.readdirSync(`${__dirname}/gnn`).filter(file => file.endsWith(".jpg"));

module.exports = {
	name: "stuff.js",
	run: async(Discord, client, msg, config) => {
		function detect(str){
			let found;
			str = " " + str + " ";
			
			if(str == str.replace(/\W|_/g, " ")){
				str = " " + str + " ";
				found = (msg0.indexOf(str) != -1) ? true : false;
			}else found = (msg.content.indexOf(str) != -1) ? true : false;
			
			if(found) cooldown.count(msg.member.id, "stuff");
			return found;
		}
		
		if(cooldown.bool(msg.member.id, "stuff")) return;
		msg.content = msg.content.toLowerCase();
		let msg0 = msg.content.replace(/\W|_/g, " ");
		msg0 = " " + msg0.replace(/( ){1,}/g, " ") + " ";
		
		if(config.triggers) config.triggers.forEach(obj => {
			if(detect(obj.name)){
				if(obj.file) msg.channel.send(obj.text, {files: [obj.file]});
				else if(obj.text) msg.channel.send(obj.text);
				if(obj.reaction) msg.react(obj.reaction);
			}
		});
		
		if(detect("gnn")) msg.channel.send({files: [`${__dirname}/gnn/${gnns[Math.floor(Math.random()*gnns.length)]}`]})
		
		if(msg.content.includes("thank") && detect("thing") || msg.mentions.users.find(user => user.id == client.user.id))) msg.react("💜");
	}
}