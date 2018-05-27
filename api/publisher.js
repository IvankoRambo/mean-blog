var events = require('events'),
	Datastore = require('nedb'),
	nodemailer = require('nodemailer'),
	ejs = require('ejs'),
	commonHelpers = require('./commonHelpers');

var publisher = new events.EventEmitter(),
	emailSettingsFile = new Datastore({
		filename: 'db/emailSettings',
		autoload: false
	}),
	emailSettings,
	transporter;
publisher.subscribers = new Datastore({
	filename: 'db/subscribers',
	autoload: false
});

publisher.on('subscribe', function(email, resolve, reject){
	var pub = this;
	if(email != null){
		pub.subscribers.loadDatabase(function(errDB){
			pub.subscribers.findOne({'email': email}, function(err, subscriber){
				if(err){
					reject();
				}
				else{
					if(subscriber != null){
						resolve({'error': true, 'message': 'You\'re already subscribed'});
					}
					else{
						pub.subscribers.insert({'email': email}, function(err){
							if(err){
								reject();
							}
							else{
								commonHelpers.uploadToS3Bucket('db/subscribers', 'subscribers');
								resolve({'error': false, 'message': 'You have subscribed!'});
							}
						});
					}
				}
			});
		});
	}
	else{
		resolve({'error': true, 'message': 'Please, provide an email to subscribe'});
	}
});

publisher.on('unsubscribe', function(email, resolve, reject){
	var pub = this;
	if(email != null){
		pub.subscribers.loadDatabase(function(errDB){
			pub.subscribers.findOne({'email': email}, function(err, subscriber){
				if(err){
					reject();
				}
				else{
					if(subscriber == null){
						resolve({'message': 'You have already unsubscribed or never subscribed'});
					}
					else{
						pub.subscribers.remove({'email': email}, {}, function(err, removedAmount){
							if(err || !removedAmount){
								reject();
							}
							else{
								commonHelpers.uploadToS3Bucket('db/subscribers', 'subscribers');
								resolve({'message': 'You have successfully unsubscribed. I hope, you\'ll get back some day.'});
							}
						});
					}
				}
			});
		});
	}
	else{
		resolve({'message': 'Please, provide an email to unsubscribe'});
	}
});

publisher.on('publish', function(link, title, host){
	var pub = this;
	
	emailSettingsFile.loadDatabase(function(errDB){
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
				
				if(emailSettings && link && title && host){
					pub.subscribers.loadDatabase(function(errDB){
						pub.subscribers.find({}, function(err, subscribers){
							if(!err){
								for(var subscriber of subscribers){
									var currentEmail = subscriber.email,
										unsubscribeLink = host + '/unsubscribe?email=' + currentEmail;
									
									ejs.renderFile('./api/templates/notify/html.ejs', {link: link, title: title, unsubscribeLink: unsubscribeLink}, function(err, htmlContent){
										if(!err){
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
										}
									});
								}
							}
						});
					});
				}
			}
		});
	});
});

module.exports = publisher;