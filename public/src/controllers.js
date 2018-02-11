angular.module('IvankoRambo')
	.controller('PostsController', ['$routeParams', 'Posts', '$location', '$sce', 
	                                function PostsController($rP, Posts, $l, $s){
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
	.controller('PostController', ['$routeParams', 'Posts', 
	                               function PostController($rP, Posts){
		this.post = Posts.query({id: $rP.id});
		this.headerFields = ['postDate', 'title'];
		this.bodyFields = ['text'];
	}]);
