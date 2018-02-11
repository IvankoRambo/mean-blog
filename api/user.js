var express = require('express'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	Datastore = require('nedb'),
	db = {},
	commonHelpers = require('./commonHelpers');

var router = express.Router();

db.users = {
	filename: 'db/users',
	autoload: true
};

router
	.use(bodyParser.urlencoded({extended: false}))
	.use(session({
		secret: commonHelpers.generateStr(20),
		resave: true,
		saveUninitialized: true
	}))
	.post('/login', function(req, res){
		console.log('just checking', commonHelpers.sha256Hash('kolaider16'));
		res.end();
	});

module.exports = router;