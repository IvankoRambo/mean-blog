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
			.when('/login', {
				controller: 'LoginController',
				templateUrl: 'views/login.html',
				controllerAs: '$login'
			})
			.otherwise({
				redirectTo: '/posts'
			});
		
		$locationProvider.html5Mode(true);
		$resourceProvider.defaults.stripTrailingSlashes = false;
	})
	.run(function($rootScope){
		$rootScope.colors = JSON.stringify(['000000', 'FF9966', '6699FF', '99FF66', 'CC0000', '00CC00', '0000CC', '333333', '0066FF', 'FFFFFF']);
	});
