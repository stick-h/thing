const mongoose = require("mongoose");

module.exports = {
	init: () => {
		mongoose.connect(`mongodb+srv://stick:${process.env.PASSWORD}@cluster0.4kup7cd.mongodb.net/db0?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});
		mongoose.set("useFindAndModify", false);
		
		mongoose.connection.on("connected", () => console.log("mongoose connected"));
		mongoose.connection.on("err", err => console.error(`mongoose connection error: \n${err.stack}`));
		mongoose.connection.on("disconnected", () => console.warn("mongoose connection lost"));
	}
}