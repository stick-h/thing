const cats = require("./cats.json");
const cooldown = require("../util/cooldown.js");

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
					if(cooldown.bool(msg.member.id, "cat")) return;
					if(!obj.file) msg.channel.send(obj.text);
					else msg.channel.send(obj.text, {files: [obj.file]});
					cooldown.count(msg.member.id, "cat");
				}
			}
		}
		
		msg.content = msg.content.toLowerCase();
		let msgA = msg.content.replace(/\W/g, " ").split(" ");
		
		for(const cat in cats) detect(cat, cats[cat]);
		if(config.triggers) config.triggers.forEach(obj => detect(obj.name, obj));
	}
}
