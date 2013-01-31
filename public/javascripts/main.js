//Declare the vars were all the App is gonna be allocated
App = {};
	App.Models =
	App.Collections =
	App.Views =
	App.Controllers = {};

$(document).ready(function() {
	//Use App as Bus of events
	_.extend(App, Backbone.Events);
	
	//Init App with routing
	Backbone.history.start({pushState: true});
});
