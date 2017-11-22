angular.module('IvankoRambo')
	.controller('PostsController', ['$routeParams', 'Posts', function PostsController($routeParams, Posts){
		this.posts = Posts.query();
		console.log('just checking for now', this.posts);
	}]);
