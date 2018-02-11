angular.module('IvankoRambo')
	.controller('PostsController', ['$routeParams', 'Posts', '$location', '$sce', '$rootScope', 
	                                function PostsController($rP, Posts, $l, $s, $rS){
		$rS.PAGE = 'posts';
		
		this.posts = Posts.query();
		this.headerFields = ['postDate', 'title'];
		this.bodyFields = ['text'];
		
		this.sort = function sort(field){
			this.sort.field = field;
			this.sort.ASC = !!this.sort.ASC;
		}
		
		this.sort.ASC = false;
		
		this.goToPost = function(id){
			if(id != null){
				$l.url('/posts/' + id);
			}
		}
	}])
	.controller('PostController', ['$routeParams', 'Posts', '$rootScope', 
	                               function PostController($rP, Posts, $rS){
		$rS.PAGE = 'post';
		
		this.post = Posts.query({id: $rP.id});
		this.headerFields = ['postDate', 'title'];
		this.bodyFields = ['text'];
	}])
	.controller('AboutController', ['$rootScope', function($rS){
		$rS.PAGE = 'about';
	}]);
