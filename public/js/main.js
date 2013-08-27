//Declare the vars were all the App is gonna be allocated
App = {};
	App.Models =
	App.Collections =
	App.Views =
	App.Controllers = {};

$(document).ready(function() {
    //Maybe change the default id attribute (@deprecated method?)
    //Backbone.Model.prototype.idAttribute = '_id';
    
	//Use App as Bus of events
	_.extend(App, Backbone.Events);
	
    //Init Routing?
    //App.routing = new App.Routing();
    
	//Init App with routing
	Backbone.history.start({pushState: true});
});
