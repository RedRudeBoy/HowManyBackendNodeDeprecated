var config = require('../config.js');
var assetManager = require('connect-assetmanager');
var assetHandler = require('connect-assetmanager-handlers');

// Setup groups for CSS / JS assets
// Make sure they match with index for each type of device
var assetSettings = {
	// for /web
	'webjs': {
		'route': /\/web\/js\/cache\/[a-z0-9]+\/.*\.js/
		, 'path': '.'
		, 'dataType': 'javascript'
		, 'files': [
			'/web/lib/underscore-min.js'
			, '/web/lib/backbone-min.js'
			, '/web/lib/bootstrap-dropdown.js'
			, '/web/js/utils.js'
			, '/web/js/models/employeemodel.js'
			, '/web/js/views/header.js'
			, '/web/js/views/home.js'
			, '/web/js/views/contact.js'
			, '/web/js/views/employeelist.js'
			, '/web/js/views/employeedetails.js'
			, '/web/js/chat.js'
			, '/web/js/main.js'
		]
		, 'stale': true
		, 'postManipulate': {
			'^': [
				assetHandler.uglifyJsOptimize
				, function insertSocketIoPort(file, path, index, isLast, callback) {
					callback(file.replace(/.#socketIoPort#./, config.port));
				}
			]
		}
	}
	, 'webcss': {
		'route': /\/web\/css\/cache\/[a-z0-9]+\/.*\.css/
		, 'path': './web/css/'
		, 'dataType': 'css'
		, 'files': [
			'bootstrap.css'
			, 'styles.css'
		]
		, 'stale': true
		, 'postManipulate': {
			'^': [
				assetHandler.fixVendorPrefixes
				, assetHandler.fixGradients
				, assetHandler.yuiCssOptimize
			]
		}
	}
};

module.exports = assetManager(assetSettings);