var express = require('express'),
	server = express(),
	api = require('./api/rest'),
	user = require('./api/user');
	
server.use(express.static('./public'))
	.use('/api', user)
	.use('/api', api)
	.get('*', function(req, res){
		res.sendFile(__dirname + '/public/main.html');
	})
	.listen('3000');
