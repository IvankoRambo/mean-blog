angular.module('IvankoRambo', ['ngRoute', 'ngResource'])
	.config(function($routeProvider, $locationProvider){
		$routeProvider
			.when('/posts', {
				controller: 'PostsController',
				templateUrl: 'views/posts.html',
				controllerAs: 'postList'
			});
		
		$locationProvider.html5Mode(true);
	});
