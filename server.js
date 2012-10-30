//setup Dependencies
var config = require('./config.js');
var express = require('express');
var RedisStore = require('connect-redis')(express);
var sessionStore = new RedisStore(config.redis);
var mongoose = require('mongoose');

var useragent = require('./lib/useragent.js');
//var employee = require('./lib/employee.js'); //Remove it!

//Login
//@todo: change this for the modelUsers!
var users = [
	{ id: 1, username: 'bob', password: 'bob', email: 'bob@example.com' },
	{ id: 2, username: 'joe', password: 'joe', email: 'joe@example.com' }
];

function findById(id, fn) {
	var idx = id - 1;
	if (users[idx]) fn(null, users[idx]);
	else fn(new Error('User ' + id + ' does not exist'));
}

function findByUsername(username, fn) {
	for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i];
		if (user.username === username) {
			return fn(null, user);
		}
	}
	return fn(null, null);
}

var passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy;

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
	function(username, password, done) {
	// asynchronous verification, for effect...
		process.nextTick(function () {
			//@todo: Change this
		// Find the user by username.  If there is no user with the given
		// username, or the password is not correct, set the user to `false` to
		// indicate failure and set a flash message.  Otherwise, return the
		// authenticated `user`.
			findByUsername(username, function(err, user) {
				if (err) { return done(err); }
				if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
				if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
				return done(null, user);
			})
		});
	}
));

//If no session is required
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	findById(id, function (err, user) {
		done(err, user);
	});
});
//remove until here

var staticdir = '/static';	// common content
var webdir = '/web';
//var iphonedir = '/iphone';
//var mobiledir = '/jquerymobile';
var mobiledir = '/iUI';
var iphonedir = '/iUI';
//I preffer iUI

// Connect to data
mongoose.connect(config.mongodb);

// Init seed data - this may not be needed in your application
//employee.seed();  //Remove it!
//require('./lib/Models/Populate').populate();

// Setup server
var app = express.createServer();
app.listen(config.port);
var io = require('./lib/chat.js')(app);  //Remove it?
var assetMiddleware = require('./lib/asset.js');
app.configure(function() {
	app.set('views', __dirname+'/views');
	app.set('view options', {layout:false});
	//Login?
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.staticCache());
	app.use(assetMiddleware);
	app.use(express.session({'store':sessionStore, secret:config.sessionSecret}));
	app.use(passport.initialize());
	app.use(passport.session()); //For persistent login sessions
	app.use(staticdir, 	express.static(__dirname+staticdir));
	app.use(webdir, 	express.static(__dirname+webdir));
	app.use(iphonedir,	express.static(__dirname+iphonedir));
	app.use(mobiledir,	express.static(__dirname+mobiledir));
	app.use(app.router);
});

// Make assets available to index.ejs
app.dynamicHelpers({
	'assetsCache': function(req, res) {
		return assetMiddleware.cacheHashes;
	},
	'isProduction': function(req, res) {
		return 'production' === config.environment;
	}
});

//setup the errors
app.error(function(err, req, res, next) {
	if (err instanceof NotFound) {
		res.render('404.jade', {locals:{
			title:'404 - Not Found',
			description:'',
			author:'',
			analyticssiteid:'XXXXXXX'
		}, status:404});
	} else {
		res.render('500.jade', {locals:{
			title:'The Server Encountered an Error',
			description:'',
			author:'',
			analyticssiteid:'XXXXXXX',
			error:err
		}, status:500});
	}
});


///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// App						///////////
// Index route - depends upon the useragent
app.get('/', function(req, res) {
	useragent(req, res);
	var index = req.useragent.ios ? iphonedir : (req.useragent.mobile ? mobiledir : webdir);
//	var index = iphonedir;
	console.log('index: ', index, config.environment);
	res.render(__dirname+index+'/index.ejs');
});



/////// API routes return JSON	///////////
app.post('/login',
	function(req,res,next) {
		console.log('login try');
//		console.log(req);
//		console.log(res);
//		console.log(typeof next);
		next();
	},
	passport.authenticate('local'),
//	{
//		successRedirect: '/logged',
//		failureRedirect: '/loginFail',
//		failureFlash: true
//	},
	function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` property contains the authenticated user.
//		app.get('/calendar',calendar);
		console.log('Login correct!!!');
		console.log(req.user);
		res.redirect('/logged2');
	}
);

//Resource Routing in a separate module, just for keep the code clean
routes = require('./lib/Models/Routing')(app);

//app.get('/api/employees', employee.getEmployees);
//app.get('/api/employees/:id', employee.getEmployee);
//app.get('/api/employees/:id/reports', employee.getReports);
//app.get('/api/employees/search/:query', employee.findByName);

//A Route for Creating a 500 Error (Useful to keep around)
app.get('/500', function(req, res) {
	throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('/*', function(req, res) {
	throw new NotFound();
});

function NotFound(msg) {
	this.name = 'NotFound';
	Error.call(this, msg);
	Error.captureStackTrace(this, arguments.callee);
}

console.log('Listening on http://0.0.0.0:' + config.port);
