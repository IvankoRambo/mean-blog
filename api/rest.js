var express = require('express'),
	fs = require('fs'),
	Datastore = require('nedb'),
	db = {},
	bodyParser = require('body-parser'),
	commonHelpers = require('./commonHelpers'),
	publisher = require('./publisher');
	
var router = express.Router();

db.posts = new Datastore({
	filename: 'db/posts',
	autoload: false
});

router
	.route('/posts')
	.get(function(req, res){
		var limitParam = parseInt(req.query.limit) || 0,
			stepParam = parseInt(req.query.step) || 0;
		
		db.posts.loadDatabase(function(dbErr){
			db.posts.find({}).sort({postDate: -1}).skip(stepParam).limit(limitParam).exec(function(err, data){
				if(err || data == null){
					res.status(404);
					res.end();
					return;
				}
				res.status(200);
				res.json({posts: data, postsCount: data.length});
			});
		});
	});
	
router
	.use(bodyParser.urlencoded({extended: false}))
	.use(bodyParser.json())
	.route('/posts')
	.post(function(req, res){
		var post = req.body;
		post.postDate = new Date().getTime();
		
		if(req.session.userId){
			db.posts.loadDatabase(function(dbErr){
				db.posts.insert(post, function(err, newPost){
					if(err || newPost == null){
						res.status(500);
						res.json({success: false});
						return;
					}
					
					var postID = newPost._id,
						host = req.headers.host,
						postLink = host + '/posts/' + postID,
						title = newPost.title;
					publisher.emit('publish', postLink, title, host);
					commonHelpers.uploadToS3Bucket('db/posts', 'posts');
					res.status(200);
					res.json({success: true, postID: newPost._id});
				});
			});
		}
		else{
			res.status(401);
			res.json({success: false});
		}
	});
	
router
	.use(bodyParser.urlencoded({extended: false}))
	.use(bodyParser.json())
	.param('id', function(req, res, next){
		req.dbQuery = {'_id': req.params.id};
		next();
	})
	.route('/posts/:id')
	.get(function(req, res){
		db.posts.loadDatabase(function(errDB){
			db.posts.findOne(req.dbQuery, function(err, post){
				if(err || post == null){
					res.status(404);
					res.end();
					return;
				}
				
				res.status(200);
				res.json({post: post});
			});
		});
	})
	.delete(function(req, res){
		if(req.session.userId){
			db.posts.loadDatabase(function(errDB){
				db.posts.remove(req.dbQuery, {}, function(err, removedAmount){
					if(err){
						res.json({removed: 0});
					}
					
					commonHelpers.uploadToS3Bucket('db/posts', 'posts');
					res.json({removed: removedAmount});
				});
			});
		}
		else{
			res.status(401);
			res.json({success: false});
		}
	})
	.put(function(req, res){
		var updatedPost = req.body;
		'$promise' in updatedPost && delete updatedPost.$promise;
		'$resolved' in updatedPost && delete updatedPost.$resolved;
		
		if(req.session.userId){
			db.posts.loadDatabase(function(errDB){
				db.posts.update(req.dbQuery, {$set: updatedPost}, {}, function(err, updatedAmount){
					if(err){
						res.json({updated: 0});
					}
					
					commonHelpers.uploadToS3Bucket('db/posts', 'posts');
					res.json({updated: updatedAmount});
				});
			});
		}
		else{
			res.status(401);
			res.json({success: false});
		}
	});

router
	.use(bodyParser.json())
	.route('/subscribe')
	.post(function(req, res){
		var body = req.body,
			email,
			subscribeToDB = new Promise(function(resolve, reject){
				email = body.email;
				publisher.emit('subscribe', email, resolve, reject);
			});
		
		subscribeToDB.then(function(info){
			res.status(200);
			res.json(info);
		}, function(){
			res.status(500);
			res.end();
		});
	})
	.delete(function(req, res){
		var email = req.query.email,
			unsubscribeFromDB = new Promise(function(resolve, reject){
				publisher.emit('unsubscribe', email, resolve, reject);
			});
		
		unsubscribeFromDB.then(function(info){
			res.status(200);
			res.json(info);
		}, function(){
			res.status(500);
			res.end();
		});
	});
	
	
module.exports = router;
