var express = require('express'),
	Datastore = require('nedb'),
	db = {},
	bodyParser = require('body-parser'),
	commonHelpers = require('./commonHelpers'),
	publisher = require('./publisher');
	
var router = express.Router();

db.posts = new Datastore({
	filename: 'db/posts',
	autoload: true
});

router
	.route('/posts')
	.get(function(req, res){
		var limitParam = parseInt(req.query.limit) || 0,
			stepParam = parseInt(req.query.step) || 0;
		
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
	
router
	.use(bodyParser.urlencoded({extended: false}))
	.use(bodyParser.json())
	.route('/posts')
	.post(function(req, res){
		var post = req.body;
		post.postDate = new Date().getTime();
		
		if(req.session.userId){
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
				res.status(200);
				res.json({success: true, postID: newPost._id});
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
		db.posts.findOne(req.dbQuery, function(err, post){
			if(err || post == null){
				res.status(404);
				res.end();
				return;
			}
			
			res.status(200);
			res.json({post: post});
		});
	})
	.delete(function(req, res){
		if(req.session.userId){
			db.posts.remove(req.dbQuery, {}, function(err, removedAmount){
				if(err){
					res.json({removed: 0});
				}
				
				res.json({removed: removedAmount});
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
			db.posts.update(req.dbQuery, {$set: updatedPost}, {}, function(err, updatedAmount){
				if(err){
					res.json({updated: 0});
				}
				
				res.json({updated: updatedAmount});
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
		
		subscribeToDB.then(function(){
			res.status(200);
			res.end();
		}, function(){
			res.status(500);
			res.end();
		});
	});
	
	
module.exports = router;
