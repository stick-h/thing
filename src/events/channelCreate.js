module.exports = async(mongoose, Guild, client, channel) => {
	channel.guild.fetchAuditLogs().then(log => {
		const entry = log.entries.find(entry => entry.target.id == channel.id);
		if(entry.target.parent.id == "813868386231517184") entry.target.overwritePermissions([
			{"id": entry.executor.id, "allow": ["MANAGE_CHANNELS", "MANAGE_ROLES", "SEND_MESSAGES", "MANAGE_MESSAGES", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS"]},
			{"id": channel.guild.roles.everyone.id, "deny": ["MANAGE_CHANNELS"]},
			{"id": "814646681303253033", "deny": ["VIEW_CHANNELS"]}
		]).catch(err => console.log(err));
	});
}