var express = require('express'),
	server = express(),
	api = require('./api/rest'),
	user = require('./api/user'),
	fs = require('fs'),
	AWS = require('aws-sdk'),
	configAWS = require('./configSet/configAWS.json');

var expressApp = express();

expressApp.set('view engine', 'ejs');
	
server.use(express.static('./public'))
	.use('/api', user)
	.use('/api', api)
	.get('*', function(req, res){
		res.sendFile(__dirname + '/public/main.html');
	})
	.listen('3000', function(){
		AWS.config.update({
			accessKeyId: configAWS.accessKeyId,
			secretAccessKey: configAWS.secretAccessKey,
			region: configAWS.region
		});
		console.log('Try to download file of posts');
		var s3 = new AWS.S3(),
			postsOptions = {
				Bucket: configAWS.Bucket,
				Key:	'posts'
			},
			subscribersOptions = {
				Bucket: configAWS.Bucket,
				Key:	'subscribers'
			},
			emailOptions = {
				Bucket: configAWS.Bucket,
				Key:	'emailSettings'
			},
			usersOptions = {
				Bucket:	configAWS.Bucket,
				Key:	'users'
			},
			postsFile = fs.createWriteStream('db/posts'),
			subscribersFile = fs.createWriteStream('db/subscribers'),
			emailSettingsFile = fs.createWriteStream('db/emailSettings'),
			usersFile = fs.createWriteStream('db/users');
		s3.getObject(postsOptions).createReadStream().pipe(postsFile);
		console.log('try to download file of subscribers');
		s3.getObject(subscribersOptions).createReadStream().pipe(subscribersFile);
		console.log('try to download file of emeilSettings');
		s3.getObject(emailOptions).createReadStream().pipe(emailSettingsFile);
		console.log('try to download file of users');
		s3.getObject(usersOptions).createReadStream().pipe(usersFile);
	});
