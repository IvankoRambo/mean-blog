var events = require('events'),
	Datastore = require('nedb'),
	nodemailer = require('nodemailer'),
	ejs = require('ejs');

var publisher = new events.EventEmitter(),
	emailSettingsFile = new Datastore({
		filename: 'db/emailSettings',
		autoload: true
	}),
	emailSettings,
	transporter;
publisher.subscribers = new Datastore({
	filename: 'db/subscribers',
	autoload: true
});

publisher.on('subscribe', function(email, resolve, reject){
	if(email != null){
		this.subscribers.insert({'email': email}, function(err){
			if(err){
				reject();
			}
			else{
				resolve();
			}
		});
	}
	else{
		reject();
	}
});

publisher.on('publish', function(link, title, host){
	if(emailSettings && link && title && host){
		this.subscribers.find({}, function(err, subscribers){
			if(!err){
				for(var subscriber of subscribers){
					var currentEmail = subscriber.email,
						unsubscribeLink = host + '/unsubscribe?email=' + currentEmail;
					
					ejs.renderFile('./api/templates/notify/html.ejs', {link: link, title: title, unsubscribeLink: unsubscribeLink}, function(err, htmlContent){
						var emailOptions = {
							from: emailSettings.username,
							to: currentEmail,
							subject: 'Check out new the post from IR blog!',
							html: htmlContent
						};
						
						transporter.sendMail(emailOptions, function(err, info){
							if(err){
								console.log(err);
							}
							else{
								console.log("The response: " + info.response);
							}
						});
					});
				}
			}
		});
	}
});

emailSettingsFile.find({}, function(err, data){
	if(!err && data && data.length){
		emailSettings = data[0];
		transporter = nodemailer.createTransport({
			host: emailSettings.host,
			port: emailSettings.port,
			secure: true,
			auth: {
				user: emailSettings.username,
				pass: emailSettings.password
			}
		});
	}
});

module.exports = publisher;