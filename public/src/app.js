angular.module('IvankoRambo', ['ngRoute', 'ngResource', 'ngSanitize'])
	.config(function($routeProvider, $locationProvider, $resourceProvider){
		$routeProvider
			.when('/posts', {
				controller: 'PostsController',
				templateUrl: 'views/posts.html',
				controllerAs: '$postList'
			})
			.when('/posts/:id', {
				controller: 'PostController',
				templateUrl: 'views/post.html',
				controllerAs: '$post'
			})
			.when('/about', {
				controller: 'AboutController',
				templateUrl: 'views/about.html',
				controllerAs: '$about'
			})
			.otherwise({
				redirectTo: '/posts'
			});
		
		$locationProvider.html5Mode(true);
		$resourceProvider.defaults.stripTrailingSlashes = false;
	});
