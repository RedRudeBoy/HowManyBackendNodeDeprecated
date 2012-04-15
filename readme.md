
# Node Backbone Project Sample #

### (Work in progress) ###

It is a starter project for a Node/HTML5 application optimized separately for desktop browsers (web), generic mobile platforms using jQuery Mobile (jquerymobile) and iPhone (iphone). Its server side Node template is based on [robrighter / node-boilerplate](https://github.com/robrighter/node-boilerplate) and its client side Backbone templates for web/jquerymobile/iphone are based on [ccoenraets / backbone-directory](https://github.com/ccoenraets/backbone-directory).

It is a work in progress and any improvements are greatly appreciated.

## Goals ##
1. Quickly get started with a Node/Backbone application
2. Full set of BDD tests
3. Easily deployable on a Joyent Node SmartMachine

## Technologies ##
### Server ###
1. Node
2. Express - web framework and router
3. Mongoose - to use MongoDB for persistence
4. Redis - for sessions (no need to burden MongoDB with sessions)
5. Socket.io - for chat etc
6. Jade - only for error pages
7. Mocha - BDD testing framework

### Client ###
1. Backbone
2. jQuery
3. Underscore
4. Handlebars templating
5. Twitter Bootstrap (on browsers)
6. jQuery Mobile (on generic mobile platforms)

## The Application ##

It is a simple Employee Directory application that allows you to look up employees by name, view the details of an employee, and navigate up and down the Org Chart by clicking the employee’s manager or any of his/her direct reports.

There are four versions of the application available in this repository:

1. Backbone.js + Twitter Bootstrap (located in the [/web](https://github.com/vinkaga/node-backbone/tree/master/web) directory).
	- Read more about original MySQL version [here](http://coenraets.org/blog/2012/02/sample-app-with-backbone-js-and-twitter-bootstrap/)
	- Try original MySQL version [here](http://coenraets.org/directory/)
2. Backbone.js + jQuery Mobile (located in the [/jquerymobile](https://github.com/vinkaga/node-backbone/tree/master/jquerymobile) directory).
	- Read more about original MySQL version [here](http://coenraets.org/blog/2012/03/employee-directory-sample-app-with-backbone-js-and-jquery-mobile/)
	- Try original MySQL version [here](http://coenraets.org/backbone/directory/jquerymobile/)
3. Backbone.js + native-looking iPhone skins (located in the [/iphone](https://github.com/vinkaga/node-backbone/tree/master/iphone) directory).
	- Read more about original MySQL version [here](http://coenraets.org/blog/2012/03/crafting-native-looking-ios-apps-with-html-backbone-js-and-phonegap/)
	- Try original MySQL version [here](http://coenraets.org/backbone/directory/iphone/)
4. Backbone.js + native-looking iPhone skins and a local database implementation (located in the [/localdb](https://github.com/vinkaga/node-backbone/tree/master/localdb) directory).
	- Read more about original MySQL version [here](http://coenraets.org/blog/2012/04/building-mobile-apps-with-html-and-a-local-database/)
	- Try original MySQL version [here](http://coenraets.org/backbone/directory/localdb/)

The Twitter Bootstrap and jQuery Mobile versions use JSON services. Instructions to set up these services are provided below. The "native-looking iPhone" versions use sample in-memory data and don't have any dependency on external services.

### Set Up: ###

1. Create a MongoDB collection named "directory"
2. Load seeddata.js to create and populate the "employee" table  
 mongo seeddata.js
