//setup Dependencies
var express = require('express');
var sio = require('socket.io');
var RedisStore = require('connect-redis')(express);
var sessionStore = new RedisStore();
var mongoose = require('mongoose');
var config = require('./config.js');
var useragent = require('./lib/useragent.js');
var employee = require('./lib/employee.js');

var webdir = '/web';
var iphonedir = '/iphone';
var mobiledir = '/jquerymobile';

// Connect to data
mongoose.connect('mongodb://localhost/' + config.dbname);

// Init seed data - this may not be needed in your application
employee.seed();

//Setup Express
var app = express.createServer();
app.configure(function() {
	app.set('environment', config.environment);
	app.set('views', __dirname+'/views');
	app.set('view options', { layout:false });
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ 'store':sessionStore, secret:config.sessionSecret }));
	app.use(webdir, 		express.static(__dirname+webdir));
	app.use(iphonedir,	express.static(__dirname+iphonedir));
	app.use(mobiledir,	express.static(__dirname+mobiledir));
	app.use(app.router);
});

//setup the errors
app.error(function(err, req, res, next) {
	if (err instanceof NotFound) {
		res.render('404.jade', { locals:{
			title:'404 - Not Found',
			description:'',
			author:'',
			analyticssiteid:'XXXXXXX'
		}, status:404 });
	} else {
		res.render('500.jade', { locals:{
			title:'The Server Encountered an Error',
			description:'',
			author:'',
			analyticssiteid:'XXXXXXX',
			error:err
		}, status:500 });
	}
});
app.listen(config.port);

//Setup Socket.IO
var io = sio.listen(app);
io.sockets.on('connection', function(socket) {
	console.log('Client Connected');
	socket.on('message', function(data) {
		socket.broadcast.emit('server_message', data);
		socket.emit('server_message', data);
	});
	socket.on('disconnect', function() {
		console.log('Client Disconnected.');
	});
});


///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////
// Index route - depends upon the useragent
app.get('/', function(req, res) {
	useragent(req, res);
	var index = req.useragent.ios ? iphonedir : (req.useragent.mobile ? mobiledir : webdir);
	console.log('index: ', index);
	res.sendfile(__dirname+index+'/index.html');
});

// API routes return JSON
app.get('/api/employees', employee.getEmployees);
app.get('/api/employees/:id', employee.getEmployee);
app.get('/api/employees/:id/reports', employee.getReports);
app.get('/api/employees/search/:query', employee.findByName);

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
