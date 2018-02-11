angular.module('IvankoRambo', ['ngRoute', 'ngResource', 'ngSanitize'])
	.config(function($routeProvider, $locationProvider, $resourceProvider){
		$routeProvider
			.when('/posts', {
				controller: 'PostsController',
				templateUrl: 'views/posts.html',
				controllerAs: '$postList'
			});
		
		$locationProvider.html5Mode(true);
		$resourceProvider.defaults.stripTrailingSlashes = false;
	});
