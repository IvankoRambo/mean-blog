var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var Datastore = require('nedb');
var db = {};
var commonHelpers = require('./commonHelpers');

var router = express.Router();

db.users = new Datastore({
	filename: 'db/users',
	autoload: false
});

router
	.use(bodyParser.urlencoded({extended: false}))
	.use(session({
		secret: commonHelpers.generateStr(20),
		resave: true,
		saveUninitialized: true
	}))
	.post('/login', function(req, res){
		var userObj = {
			username: req.body.username,
			password: commonHelpers.sha256Hash(req.body.password)
		};
		db.users.loadDatabase(function(errDB){
			db.users.findOne(userObj, function(err, user){
				if(user == null){
					res.status(401);
					res.json({'success': false, 'message': 'Incorrect credentials'});
				}
				else{
					req.session.userId = user._id;
					res.status(200);
					res.json({'success': true, 'message': 'Ok'});
				}
			});
		});
	})
	.get('/logout', function(req, res){
		if(req.session.userId){
			req.session.userId = null;
		}
		res.status(200);
		res.end();
	})
	.get('/loginstatus', function(req, res){
		if(req.session.userId){
			var userObj = { '_id': req.session.userId };
			db.users.loadDatabase(function(errDB){
				db.users.findOne(userObj, function(err, user){
					if(user == null){
						res.status(401);
						res.json({'status': false, 'userinfo': null});
					}
					else{
						res.status(200);
						res.json({'status': true, 'userinfo': user.username});
					}
				});
			});
		}
		else{
			res.status(401);
			res.json({'status': false, 'userinfo': null});
		}
	});

module.exports = router;