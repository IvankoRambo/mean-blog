var express = require('express'),
	Datastore = require('nedb'),
	db = {},
	bodyParser = require('body-parser'),
	commonHelpers = require('./commonHelpers');
	
var router = express.Router();

db.posts = new Datastore({
	filename: 'db/posts',
	autoload: true
});

router
	.route('/posts')
	.get(function(req, res){
		db.posts.find({}).sort({postDate: -1}).exec(function(err, data){
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
	.route('/post')
	.post(function(req, res){
		var post = req.body;
		post.postDate = new Date().getTime();
		
		db.posts.insert(post, function(err, newPost){
			if(err || newPost == null){
				res.status(500);
				res.json({success: false});
				return;
			}
			
			res.status(200);
			res.json({success: true});
		});
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
		db.posts.remove(req.dbQuery, {}, function(err, removedAmount){
			if(err){
				res.json({removed: 0});
			}
			
			res.json({removed: removedAmount});
		});
	})
	.put(function(req, res){
		var updatedPost = req.body;
		'$promise' in updatedPost && delete updatedPost.$promise;
		'$resolved' in updatedPost && delete updatedPost.$resolved;
		
		db.posts.update(req.dbQuery, {$set: updatedPost}, {}, function(err, updatedAmount){
			if(err){
				res.json({updated: 0});
			}
			
			res.json({updated: updatedAmount});
		});
	});
	
	
module.exports = router;
