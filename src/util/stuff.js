const cooldown = require("../util/cooldown.js");
const fs = require("fs");
const gnns = fs.readdirSync(`${__dirname}/gnn`).filter(file => file.endsWith(".jpg"));

module.exports = {
	name: "stuff.js",
	run: async(Discord, client, msg, config) => {
		function detect(str, obj){
			let found = 0;
			
			if(str == str.replace(/\W|_/g, " ")){
				str = " " + str + " ";
				found = (msg0.content.indexOf(str) != -1) ? true : false;
			}else found = (msg.content.indexOf(str) != -1) ? true : false;
			
			if(found){
				if(cooldown.bool(msg.member.id, "stuff")) return;
				if(obj.text || obj.file){
					if(!obj.file) msg.channel.send(obj.text);
					else msg.channel.send(obj.text, {files: [obj.file]});
					cooldown.count(msg.member.id, "stuff");
				}
				if(obj.reaction){
					msg.react(obj.reaction);
					cooldown.count(msg.member.id, "stuff");
				}
				if(str == "gnn"){
					msg.channel.send({files: [obj]});
					cooldown.count(msg.member.id, "stuff");
				}
			}
		}
		
		msg.content = msg.content.toLowerCase();
		if(msg.content.includes("thank") && (msg.content.includes("thing") || msg.mentions.users.find(user => user.id == client.user.id))) msg.react("💜");
		
		let msg0 = msg.replace(/\W|_/g, " ");
		msg0 = " " + msg0.replace(/( ){1,}/g, " ") + " ";
		
		if(config.triggers) config.triggers.forEach(obj => detect(obj.name, obj));
		detect("gnn", `${__dirname}/gnn/${gnns[Math.floor(Math.random()*gnns.length)]}`);
	}
}