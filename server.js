var express = require('express'),
	server = express(),
	api = require('./api/rest'),
	user = require('./api/user');

var expressApp = express();

expressApp.set('view engine', 'ejs');
	
server.use(express.static('./public'))
	.use('/api', user)
	.use('/api', api)
	.get('*', function(req, res){
		res.sendFile(__dirname + '/public/main.html');
	})
	.listen(process.env.PORT || '3000');
