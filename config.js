module.exports = {
    sessionSecret: 'your secret',
    port: 8080,
    uri: 'http://localhost:8080', // Without trailing /
	dbname: 'my_database',
    environment: (process.env.NODE_ENV !== 'production') ? 'development' : 'production'
};

if (module.exports.environment == 'production') {
    module.exports.uri = 'http://yourname.no.de';
    module.exports.port = process.env.PORT || 80; // Joyent SmartMachine uses process.env.PORT
}
