var express = require('express'),
	server = express(),
	api = require('./api/rest');
	
server.use(express.static('./public'))
	.use('/api', api)
	.get('*', function(req, res){
		res.sendFile(__dirname + '/public/main.html');
	})
	.listen('3000');
