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
		db.posts.find({}, function(err, data){
			if(err || data == null){
				res.status(404);
				res.end();
			}
			res.status(200);
			res.json({posts: data, postsCount: data.length});
		});
	});
	
router.
	use(function(req, res, next){
		if(!req.user){
			req.user = {id: 1};
		}
		next();
	})
	.use(bodyParser.json())
	.route('/post')
	.post(function(req, res){
		var post = req.body;
		post.postDate = commonHelpers.getISODate();
		
		db.posts.insert(post, function(err, newPost){
			if(err || newPost == null){
				res.status(500);
				res.json({success: false});
			}
			
			res.status(200);
			res.json({success: true});
		});
	});
	
module.exports = router;
