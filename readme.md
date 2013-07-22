# How Many Days #
How Many Days have been since... ~ How many days have passed since...

## The Application ##
A la recerca de possibles necessitats,
 i les seves solucions respectives, m'he dit...

Quan cullons fa que no rego les plantes?
Quants dies fa que no visito l'àvia?
Quants dies fa que no llegeixo?
Quants mesos fa que no faig una escapada?

### [Try It Here](http://www.cat/) ###

## My Goals ##
1. Get started with a Node/Backbone application
    1. Optimize separately for browsers and mobile devices
	2. Serve assets compressed in production but uncompressed during development
2. BDD tests
3. Use always free standars & reusable code (vCal,json,templates...)
4. Storage with MongoDB & Redis
5. Easily deployable

### Status - @ToDo ###
1. Design UX in 4 phases
	1. HowMany - Recursivitat lliure
	2. Repetit dates fixes - Recursivitat fixe
	3. Event únic
	4. Planificador
	0. 
	0. And two versions:
	1. Browser version (/web)
	2. Mobile version (/jquerymobile)
2. NodeJS REST Backend based in web.schema
	1. vCalendar
	2. UserManagement
3. Web.JSON
	1. Browser Runtime Backbone Client
	2. HTML preCooked with Web.JSON
	3. Assetic
	4. Tests
4. HowMany.Web.Json

## Software architecture ##
My initial boilerplates was: node-backbone, express, locomotive.  
I also look at chaplin (I'm not ready for coffescript...I love semicolons), socketstream (in this project, I thought that sockets are unnecessary) & persevere (rhino? RingoJS? JSGI? WTF?).
```
Folder Hierarchy:
/app				//All the code specific for this app
    /controllers	//Logic of the app, act as middleware
    /models			//Stores
    /routes			//Redirect an external petition to the right controller
    /views			//Js templates
	asset.js		//Define the files necessaries for the client
/lib
	useragent.js	//Little middleware for recognize the requests from mobile browsers
/public				//Public files like: images, js, css...
/test				//Testing suite
    /functional
    /unit
LICENSE				//Free source, free code, free pull request (but obviously "AS IS")
Makefile			//Add a "make test" target
Procfile			//For easy deploy in Joyent Node SmartMachine
app.js				//The server init file
config.js			//Actual configurations of the app
config.sample.js	//Example configuration file
package.json		//For npm install
readme.md			//Infinite loop alert!
```

## Technologies ##
### Protocols ###
1. [iCal/vCalendar](http://tools.ietf.org/html/rfc5545) - [Used and supported by a large number of products (gmail, hotmail, apple...)](http://en.wikipedia.org/wiki/ICalendar)
2. [¿json-schema?](http://json-schema.org/calendar) - Another calendar protocol, interesting with [backbone-schema](https://github.com/salsita/backbone-schema)
3. web.schema.json
3. REST(full?) (Backbone)
4. webfinger?
5. ajax

### Server ###
1. Node
2. [Express](http://expressjs.com/api.html) - web framework and router
3. [¿Locomotive?](http://locomotivejs.org/guide) - MVC for nodejs
4. Mongoose/MongoDB - for persistence, I spend a lot of time choosing between mongoDB & couchDB, I decide to use mongoDB for respect the REST architecture, but... [Backbone-PouchDB](http://jo.github.io/backbone-pouch) looks very nice.
5. Redis - for sessions
6. Twig & ¿Jade?  - template engine
7. EJS? - for serving production/development index
8. Mocha? - BDD testing framework

### Client ###
1. HTML5
2. [Backbone](https://github.com/documentcloud/backbone) - MVC for browser
4. [Underscore](https://github.com/documentcloud/underscore) - JS Utils
3. jQuery - Cross-browser compatibility for DOM manipulation, ajax...
5. Twitter Bootstrap (on browsers)
6. jQuery Mobile (on mobile platforms)


### Installation ###
1. Install and run MongoDB
2. Install and run Redis.io
3. Create your own file config.js based on config.sample.js, check if you are running MongoDB or Redis.io from another machine or non-default port
4. Start server by typing "node app.js"

### Try out mobile version on a desktop browser ###
You can try out different versions of this application using Google Chrome's built-in user-agent switcher. [Read more.](http://www.learnwithnirab.com/2012/01/how-to-use-google-chromes-built-in-user.html)
