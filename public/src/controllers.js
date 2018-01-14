angular.module('IvankoRambo')
	.controller('PostsController', ['$routeParams', 'Posts', '$location', function PostsController($rP, Posts, $l){
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
	}]);
