module.exports = function (req) {
    var ua = req.headers['user-agent'];
    req.agent = {};
    if (/mobile/i.test(ua)) { req.agent.mobile = true; }

    if (/like Mac OS X/.test(ua)) {
        req.agent.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
        req.agent.iPhone = /iPhone/.test(ua);
        req.agent.iPad = /iPad/.test(ua);
    }

    if (/Android/.test(ua)) {
        req.agent.android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];
    }
    req.agent.web = !req.agent.mobile && !req.agent.iOS && !req.agent.android;
};