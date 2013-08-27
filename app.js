
/**
 * Module dependencies.
 */
var express = require('express')
  , redisStore = require('connect-redis')(express)
//  , mongoose = require('mongoose')
  , config = require('./config.js')
  , routing = require('./app/routes/express/routing')
  , http = require('http')
  , path = require('path');

/**
 * Init App
 */
var app = express();
//By default express add the header X-Powered-By:Express, to customize this use:
//https://github.com/jaredhanson/connect-powered-by
//For disable add this:
//app.disable('x-powered-by');

/**
 * Init storages
 */
var sessionStore = new redisStore(config.redis);
//mongoose.connect(config.mongodb);


app.configure(function(){
	app.set('port', config.port);
	
	//Ignore GET /favicon.ico
	app.use(express.favicon());
	//Log requests
	app.use(express.logger('dev'));
	//Parse request bodies. Supports: application/json, application/x-www-form-urlencoded & multipart/form-data
	app.use(express.bodyParser());
	//Check X-HTTP-Method-Override
	app.use(express.methodOverride());

	//Pass a secret to cookieParser() for signed cookies
	app.use(express.cookieParser(config.sessionSecret));
	//For persistent login sessions with cookie support
	app.use(express.session({'store':sessionStore, secret:config.sessionSecret, cookie: { maxAge: null }}));
	
	//For use this, the key "connect-useragent": "*", is required in package.json
	//Add useragent information in req.agent
//	app.use(require('connect-useragent')());
	//Add useragent information in req.useragent
	app.use(require('./lib/useragent.js')());
	
	//Test custom middleware
//	app.use(count());
	//simple logger example
//	app.use(function(req, res, next){
//		console.log('%s %s', req.method, req.url);
//		next();
//	});
	//Simple respone example
//	app.use(function(req, res, next){
//		res.send('Hello World');
//	});
});

routing(app);

app.configure('development', function(){
	app.use(express.errorHandler()); //{dumpExceptions: true, showStack: true}
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on uri " + config.uri+' with environment: '+config.environment);
});

//Test custom middleware
function count(req, res, next) {
	return function(req, res, next){
		console.log(req.agent);
//		req.session.count = req.session.count || 0;
		if(typeof req.session.count === undefined) {
			req.session.count = 0;
		} else {
			req.session.count++;
		}
		console.log('count: '+req.session.count);
		next();
	}
}
