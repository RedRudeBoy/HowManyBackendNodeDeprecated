/**
 * Routing to the pages
 */
var path = require('path')
  , engines = require('consolidate')
  ,	controller = require('../controllers/pagesController'); //c? cntl? cont?

module.exports = function(app){
	//Check the user-agent & Redirect to the correct path view
	app.use(function(req, res, next){
//		app.set('view engine', 'jade');	//The default engine extension to use when omitted
//		app.engine('haml', engines.haml);
//		app.engine('html', engines.hogan);

		//Define the view directory path
		if(req.useragent.mobile) {
			app.set('views', path.join(__dirname, 'views','mobile'));
		} else {
			app.set('views', path.join(__dirname, 'views','desktop'));
		}
		next();
	});
	/**
	app.param('id', /^\d+$/);

	app.get('/user/:id', function(req, res){
		res.send('user ' + req.params.id);
	});

	app.param('range', /^(\w+)\.\.(\w+)?$/);

	app.get('/range/:range', function(req, res){
		var range = req.params.range;
		res.send('from ' + range[1] + ' to ' + range[2]);
	});
	 */
	//Home Page
	//User List (Logged user, register & login buttons)
	app.get('/', function(req, res) {
		console.log('Routing pages');
//		res.send('hello world pages');
		//Call pages_controller
		controller.homePage(req,res);
	});
	
	//User CRUD
//	app.get('/')
	//How Many List
	
	//How Many CRUD
	
	//How Many Done
	
	//Congratulations
	
	//Configuration
}