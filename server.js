var express = require('express');
var server = express();
var api = require('./api/rest');
var user = require('./api/user');
var fs = require('fs');
var AWS = require('aws-sdk');

var expressApp = express();

expressApp.set('view engine', 'ejs');

server.enable('trust proxy');

server
	.all(/.*/, function (req, res, next) {
		var host = req.header('host');
		var url = req.url;
		var protocol = req.header('x-forwarded-proto');
		var isWithWWW = host.match(/^www\..*/i);
		if (isWithWWW && protocol === 'https') {
			next();
		} else {
			var redirectStr = 'https://' + (!isWithWWW ? 'www.' : '') + host + url;
			res.redirect(301, redirectStr);
		}
	})
	.use(express.static('./public'))
	.use('/api', user)
	.use('/api', api)
	.get('*', function(req, res){
		res.sendFile(__dirname + '/public/main.html');
	})
	.listen('3000', function(){
		AWS.config.update({
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
			region: 'eu-west-1'
		});
		console.log('Try to download file of posts');
		var s3 = new AWS.S3();
		var postsOptions = {
			Bucket: 'ivankorambo',
			Key:	'posts'
		};
		var subscribersOptions = {
			Bucket: 'ivankorambo',
			Key:	'subscribers'
		};
		var emailOptions = {
			Bucket: 'ivankorambo',
			Key:	'emailSettings'
		};
		var usersOptions = {
			Bucket:	'ivankorambo',
			Key:	'users'
		};
		var postsFile = fs.createWriteStream('db/posts');
		var subscribersFile = fs.createWriteStream('db/subscribers');
		var emailSettingsFile = fs.createWriteStream('db/emailSettings');
		var usersFile = fs.createWriteStream('db/users');
		s3.getObject(postsOptions).createReadStream().pipe(postsFile);
		console.log('try to download file of subscribers');
		s3.getObject(subscribersOptions).createReadStream().pipe(subscribersFile);
		console.log('try to download file of emeilSettings');
		s3.getObject(emailOptions).createReadStream().pipe(emailSettingsFile);
		console.log('try to download file of users');
		s3.getObject(usersOptions).createReadStream().pipe(usersFile);
	});
