/**
 * Main Routing file
 */
var express = require('express')
  , path = require('path')
  , routes_pages = require('./pagesRoutes')
  , routes_user = require('./userRoutes')
  , routes_vcal = require('./vCalRoutes');


module.exports = function(app){
	console.log('routes routing');
	
//	app.get('/', helloWorld);
	
	//Routes have all app context for apply the correct views
	//routes_pages(app);
	
	//User & vCal are middleware
	app.use(routes_user);
	app.use(routes_vcal);
	
	//Routing Static & Public
	app.use(require('less-middleware')({ src: __dirname + '/public' }));
	app.use(express.static(path.join(__dirname, 'public')));
	
	//A Route for Creating a 500 Error (Useful to keep around)
	app.get('/500', function(req, res) {
		throw new Error('This is a 500 Error');
	});
	
	app.get('/*', function(req, res) {
		throw new NotFound();
	});
}

function NotFound(msg) {
	this.name = 'NotFound';
	Error.call(this, msg);
	Error.captureStackTrace(this, arguments.callee);
}
/*
function helloWorld (req,res,next) {
	console.log('helloWorld!');
	console.log(req.agent);
	res
		//Set header
//		.set('Content-Type', 'text/plain')
		//Shortcut of previous
//		.type('html');
//		.type('json');
//		.type('application/json');
		//Send a response ([body|status], [body])
		.send('hello world');
		//Send a JSON response
//		.json([1,2,3]);
		//Render a view (view, [locals], callback)
//		.render('index', { title: 'Express' });
}
*/
