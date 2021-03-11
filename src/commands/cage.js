module.exports = {
	name: "cage",
	desc: "create channel in Cum City",
	categ: "heebs hit?",
	run: async(Discord, client, msg, args) => {
		if(msg.member.id != "219541416760705024") return;
		if(!msg.member.roles.cache.has("814646681303253033")){
			msg.member.roles.add("814646681303253033");
			msg.member.roles.remove("813836101713789008");
			msg.delete();
		}else{
			msg.member.roles.remove("814646681303253033");
			msg.member.roles.add("813836101713789008");
			msg.delete();
		}
	}
}