const cats = require("./cats.json");
const cooldown = require("../util/cooldown.js");

module.exports = {
	name: "stuff.js",
	run: async(Discord, client, msg, config) => {
		function detect(str, obj){
			let strA = str.split(" ");
			let found = 0;
			
			for(i = 0; i < msgA.length; i++){
				for(j = 0; j < strA.length; j++) if(msgA[i + j] == strA[j]) found++;
				if(found == strA.length) i = msgA.length;
				else found = 0;
			}
			
			if(found == strA.length){
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
		let msgA = msg.content;
		const symb = " `~!@#$%^&*()_+-=[]\;',./{}|:\"<>?​\n".split("");
		symb.forEach(sym => {msgA = msgA.split(sym).join(" ")});
		msgA = msgA.split(" ");
		
		for(const cat in cats) detect(cat, cats[cat]);
		if(config.triggers) config.triggers.forEach(obj => detect(obj.name, obj));
	}
}
