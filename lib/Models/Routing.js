//App routes
module.exports = function(app){
	
    var vCal = require('./vCal'),
	vCalModel = vCal.models.vCalModel,
	vEventModel = vCal.models.vEventModel,
	vToDoModel = vCal.models.vToDoModel;
	
    //Create a new Person and save it
//    person = function(req, res){
//        var person = new Person({name: req.body.name, lastName: req.body.lastName});
//        person.save();
//        res.end();
//    };
    //find all people
//    list = function(req, res){
//        vCalModel.find(function(err, vCal) {
//			if (err) return console.log(err);
//            res.send(vCal);
//        });
//    };
    //find one person (this is a sample only... it should be a unique identifier
//    find = (function(req, res) {
//        Person.findOne({name: req.params.name}, function(err, vCal) {
//			if (err) return console.log(err);
//            res.send(vCal);
//        })
//    });
	
	//Get the own calendar or the default with user null
	getCal = function(req,res,next) {
		var user = (req.user)? req.user : null;
		vCalModel.findOne({user: user},function(err, vCal) {
			if (err) return console.log(err);
			req.vCal = vCal;
			next(req,res);
        });
	}
	
	
	getCalendar = function(req,res) {
		getCal(req,res,function (req,res){
			res.send(req.vCal);
		});
	}
	
	getEvents = function(req,res) {
		getCal(req,res,function (req,res){
			res.send(req.vCal.events);
		});
	}
	
	getToDos = function(req,res) {
		getCal(req,res,function (req,res){
			res.send(req.vCal.toDos);
		});
	}
	
	newEvent = function(req,res) {
		getCal(req,res,function(req,res) {
			//create the event
			var vEvent = new vEventModel( req.params );
//			var person = new Person({name: req.body.name, lastName: req.body.lastName});
			req.vCal.events.add(vEvent).save();
			res.send('ok');
		});
	}
	
//	MyModel.update({ name: 'Tobi' }, { ferret: true }, { multi: true }, function (err, numberAffected, raw) {
//		if (err) return handleError(err);
//		console.log('The number of updated documents was %d', numberAffected);
//		console.log('The raw response from Mongo was ', raw);
//	});
	
	//Act as middleware & check authoritzation?
//	app.all('/calendar/*', requireAuthentication);
	
    //Link routes and functions
    app.get('/calendar', getCalendar);
	//Get
    app.get('/calendar/events', getEvents);
//	app.get('/calendar/events', getEvents);
//	app.post('/calendar/event/:id', postEvent);
	app.get('/calendar/todo', getToDos);
//	app.get('/calendar/events', getEvents);
//	app.get('/calendar/todo', getToDos);
	
	
	/* Maybe change the routing for express-resource
	 * https://github.com/panta/express-resource, like this:
	
	var Resource = require('express-resource');
	
	var forumsMiddleware = {
		'*': authMiddleware,
		new: [authMiddleware, adminMiddleware],
		create: [authMiddleware, adminMiddleware],
		edit: [authMiddleware, adminMiddleware],
		update: [authMiddleware, adminMiddleware],
		destroy: [authMiddleware, adminMiddleware]
	};
	app.resource(
		'forums', 
		require('./forum'),
		{
			middleware: forumsMiddleware,
//			format: 'json'
		});
	
	/* Or even better, automatic routing with
	 * https://github.com/panta/express-mongoose-resource, like this:
	
	var r_forum = app.resource({model: Forum});
	var r_thread = app.resource({model: Thread});

	r_forum.add(r_thread, {pivotField: 'forum'}); //Children
	 */
}

