exports = module.exports = function(req, res, next) {

	return function(req, res, next) {
		var source = req.get('user-agent');
		source = source.replace(/^\s*/, '').replace(/\s*$/, '');
		
		var agent = {};
		agent.mobile = (/mobile/i).test(source);
		agent.iphone = (/iPhone/).test(source);
		agent.ipad = (/iPad/).test(source);
		agent.ipod = (/iPod/).test(source);
		agent.android = (/Android/).test(source);
		agent.ios = agent.iphone || agent.ipad || agent.ipod;
		agent.mobile = agent.mobile || agent.android || agent.ios;

		req.useragent = agent;
		res.locals("useragent", agent);
		next();
	};
};
