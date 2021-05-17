const cats = require("../util/cats.json");

module.exports = {
	name: "nya",
	desc: "random cat",
	categ: "Cats",
	run: async(Discord, client, msg, args, config) => {
		const files = [];
		for(const cat in cats) if(cats[cat].desc) files.push(cats[cat].file);
		
		const r = Math.floor(Math.random()*files.length);
		msg.channel.send({files: [files[r]]});
	}
}