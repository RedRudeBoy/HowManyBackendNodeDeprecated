/**
 * This provides the definition of the mongo store if used
 */

var MongoDB = require("perstore/store/mongodb").MongoDB,
	// url takes this form - mongodb://<user>:<password>@<mongo-server>:<port>/<database>
	url = process.env.MONGO_URL;

exports.calendarsStore = MongoDB({
	collection: "Calendars",
	url: url
});

exports.usersStore = MongoDB({
	collection: "Users",
	url: url
});

exports.historyStore = MongoDB({
	collection: "History",
	url: url
});
