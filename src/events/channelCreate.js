module.exports = async(mongoose, Guild, client, channel) => {
	channel.guild.fetchAuditLogs().then(log => {
		const entry = log.entries.find(entry => entry.target.id == channel.id);
		let perms;
		if(entry.target.parent) if(entry.target.parent.permissionOverwrites) perms = entry.target.parent.permissionOverwrites.find(pO => pO.id == "972880537381404692");
		
		if(perms) entry.target.overwritePermissions([
			{"id": entry.executor.id, "allow": perms.allow, "deny": perms.deny},
			{"id": channel.guild.roles.everyone.id, "deny": ["MANAGE_CHANNELS"]}
		]).catch(err => console.log(err));
	});
}