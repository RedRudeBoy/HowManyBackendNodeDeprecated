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
var server = express.createServer();
server.configure(function() {
	server.set('environment', config.environment);
	server.set('views', __dirname+'/views');
	server.set('view options', { layout:false });
	server.use(express.bodyParser());
	server.use(express.cookieParser());
	server.use(express.session({ 'store':sessionStore, secret:config.sessionSecret }));
	server.use(webdir, 		express.static(__dirname+webdir));
	server.use(iphonedir,	express.static(__dirname+iphonedir));
	server.use(mobiledir,	express.static(__dirname+mobiledir));
	server.use(server.router);
});

//setup the errors
server.error(function(err, req, res, next) {
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
server.listen(config.port);

//Setup Socket.IO
var io = sio.listen(server);
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
server.get('/', function(req, res) {
	useragent(req, res);
	var index = req.agent.iOS ? iphonedir : (req.agent.mobile ? mobiledir : webdir);
	res.sendfile(__dirname+index+'/index.html');
});

// API routes return JSON
server.get('/api/employees', employee.getEmployees);
server.get('/api/employees/:id', employee.getEmployee);
server.get('/api/employees/:id/reports', employee.getReports);
server.get('/api/employees/search/:query', employee.findByName);

//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res) {
	throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res) {
	throw new NotFound();
});

function NotFound(msg) {
	this.name = 'NotFound';
	Error.call(this, msg);
	Error.captureStackTrace(this, arguments.callee);
}

console.log('Listening on http://0.0.0.0:' + config.port);
