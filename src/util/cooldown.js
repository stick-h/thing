const cooldown = require("./cooldown.json");

module.exports = {
	bool: (userID, counter) => {
		if(cooldown[userID]) if(cooldown[userID][counter] == 0) return true;
	},
	count: (userID, counter) => {
		if(!cooldown[userID]) cooldown[userID] = {};
		if(!cooldown[userID][counter]) cooldown[userID][counter] = 3;
		cooldown[userID][counter] -= 1;
		
		const countdown = setInterval(function(){
			cooldown[userID][counter] = 3;
			if(cooldown[userID][counter] == 3) clearInterval(countdown);
		}, 6000);
	}
}