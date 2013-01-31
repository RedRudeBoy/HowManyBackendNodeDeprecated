var	Model = require("perstore/model").Model,
	Notifying = require("perstore/store/notifying").Notifying,
	Inherited = require("perstore/store/inherited").Inherited,
	promiseModule = require("promised-io/promise"),
	when = promiseModule.when,
	usersStore = require("./MongoStore").usersStore,
	historyModel = require("./History").HisotryModel;
	
	
	//Maybe is better to have first MongoStore and after the different stores, is possible?


var originalUserStore = usersStore;
usersStore = Notifying(Inherited(usersStore));
exports.UserSuper = UserSuper = Model(Inherited(originalUserStore));

	// now we create a class, all central model logic is defined here (make Page be a global for convenience) 
User = exports.User = Model(usersStore, {
	"extends": UserSuper,
/* CRUD METHODS */
	construct: function(user, directives){
		// set initial properties on object instantiation
		user.createdBy = promiseModule.currentContext.currentUser;
		user.status = "published";
		return user;
	},
	put: function(user, options){ // handle puts to add to history and define attribution
		user.lastModifiedBy = promiseModule.currentContext.currentUser;
		user.status = "published";
		// do the default action of saving to the store
		return when(usersStore.put(user, options) || user.id, function(id){
			// create a new change entry in the history log
			new historyModel({
				content: 'newUser: '+user.id,
				from: 'user'
			});
		});
	},
	"delete": function(id){
		return when(usersStore["delete"](id) || user.id, function(id){
			// create a new change entry in the history log
			new historyModel({
				content: 'deleteUser: '+id,
				from: 'user'
			});
		});
	},
	//The path module provides a resolver function that can be used to resolve dot 
	//delimited paths and JSON Schema links:
// 	get: require("perstore/path").resolver(pageStore,function(){
//		return require("./app").DataModel;
//	}),

/* schema definitions for property types (these are optional) */
	properties: {
		username: {
			type: "string",
			indexed: true
		},
		email: {
			type: "string",
			indexed: true
		},
		password: String
	},

	prototype: { // define the methods available on the model object instances
/*		getTitle: function(item){
			return item.name;
		},*/
	},
	links: [ // define the link relations with other objects
/*		{
			rel: "history", // link to the list of changes for a page
			href: "../PageChange/?pageId={id}"
		}
*/
	],
	// this is flag to indicate that if Perstore should check to see an object exists when a PUT occurs, and call construct if it doesn't. The default is false	
	// noConstructPut: false,
	
/*	other functions */
	findById: function (id, fn) {
		var idx = id - 1;
		usersStore.get(idx);
		if (users[idx]) fn(null, users[idx]);
		else fn(new Error('User ' + id + ' does not exist'));
	},

	findByUsername: function(username, fn) {
		for (var i = 0, len = users.length; i < len; i++) {
			var user = users[i];
			if (user.username === username) {
				return fn(null, user);
			}
		}
		return fn(null, null);
	}
});