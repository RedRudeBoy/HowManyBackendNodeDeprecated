/**
 * This class is used for tracking all the changes
 */
var	Model = require("perstore/model").Model,
	Notifying = require("perstore/store/notifying").Notifying,
	Inherited = require("perstore/store/inherited").Inherited,
	promiseModule = require("promised-io/promise"),
	when = promiseModule.when,
	historyStore = require("./MongoStore").historyStore;

var	Permissive = require("perstore/facet").Permissive,
	Restrictive = require("perstore/facet").Restrictive;


// now we create a class, all central model logic is defined here 
exports.historyModel = Model(historyStore, {
	properties: {
		from: {
			type: "string",
			description:"This is nameClass of creator of the event"
		},
		content: {
			type: "string",
			description:"The action done"
		}
	},
	links:[
/*		{
			rel: "current",
			href: "../Page/{pageId}"
		}*/
	]
});

// The facets for accessing the page class

// These are the different facets that are available for accessing this data
// This facet uses the Restrictive constructor, so any modifying action must be explicilty
// be enabled (by defining a handler) 
exports.PublicHistory = Restrictive(historyModel, {
	prototype: {},
	quality:0.5
	
});
// note that general users can't change page history

// This facet is for administrators and grants full access to data
exports.AdminHistory = Permissive(historyModel, {
	properties: {},
	quality: 1
});