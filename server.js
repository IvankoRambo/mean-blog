var express = require('express'),
	server = express();
	
server.use(express.static('./public')).
	get('*', function(req, res){
		res.sendFile(__dirname + '/public/main.html');
	})
	.listen('3000');
