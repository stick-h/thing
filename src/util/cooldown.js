const cooldown = require("./cooldown.json");

module.exports = {
	bool: (userID, counter) => {
		if(cooldown[userID]) if(cooldown[userID][counter] > 0) return true;
	},
	count: (userID, counter, units, interval) => {
		if(!cooldown[userID]) cooldown[userID] = {};
		cooldown[userID][counter] = units;
		
		const countdown = setInterval(function(){
			cooldown[userID][counter] -= 1;
			if(cooldown[userID][counter] == 0) clearInterval(countdown);
		}, interval);
	}
}