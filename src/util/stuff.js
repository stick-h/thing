const cats = require("./cats.json");
const cooldown = require("../util/cooldown.js");
const fs = require("fs");
const gnns = fs.readdirSync(`${__dirname}/gnn`).filter(file => file.endsWith(".jpg"));

module.exports = {
	name: "stuff.js",
	run: async(Discord, client, msg, config) => {
		function detect(str, obj){
			let found = 0;
			
			if(str == str.replace(/\W/g, " ")){
				let strA = str.split(" ");
				for(i = 0; i < msgA.length; i++){
					for(j = 0; j < strA.length; j++) if(msgA[i + j] == strA[j]) found++;
					if(found == strA.length) i = msgA.length;
					else found = 0;
				}
				found = (found == strA.length) ? true : false;
			}else found = (msg.content.indexOf(str) != -1) ? true : false;
			
			if(found){
				if(obj.reaction) msg.react(obj.reaction);
				if(obj.text || obj.file){
					if(cooldown.bool(msg.member.id, "stuff")) return;
					if(!obj.file) msg.channel.send(obj.text);
					else msg.channel.send(obj.text, {files: [obj.file]});
					cooldown.count(msg.member.id, "stuff");
				}else{
					if(cooldown.bool(msg.member.id, "stuff")) return;
					if(str == "gnn") msg.channel.send({files: [obj]});
					cooldown.count(msg.member.id, "stuff");
				}
			}
		}
		
		msg.content = msg.content.toLowerCase();
		if(msg.content.includes("thank") && (msg.content.includes("thing") || msg.mentions.users.find(user => user.id == client.user.id))) msg.react("💜");
		
		let msgA = msg.content.split(/\W|_/g);
		for(i = 0; i < msgA.length; i++) if(msgA[i] == ""){msgA.splice(i,1); i--;}
		
		for(const cat in cats) detect(cat, cats[cat]);
		if(config.triggers) config.triggers.forEach(obj => detect(obj.name, obj));
		
		detect("gnn", `${__dirname}/gnn/${gnns[Math.floor(Math.random()*gnns.length)]}`);
	}
}