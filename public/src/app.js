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
			.when('/new-post', {
				controller: 'NewPost',
				templateUrl: 'views/newPost.html',
				controllerAs: '$newPost'
			})
			.when('/unsubscribe', {
				controller: 'UnsubscribeController',
				templateUrl: 'views/unsubscribe.html',
				controllerAs: '$unsubscribe'
			})
			.otherwise({
				redirectTo: '/posts'
			});
		
		$locationProvider.html5Mode(true);
		$resourceProvider.defaults.stripTrailingSlashes = false;
	})
	.run(function($rootScope, $location){
		$rootScope.colors = ['000000', 'FF9966', '6699FF', '99FF66', 'CC0000', '00CC00', '0000CC', '333333', '0066FF', 'FFFFFF'];
		$rootScope.showSubscribePopup = false;
		$rootScope.mobileMenuToggler = false;
		$rootScope.filters = [{
			id: 'filters',
			label: 'Filters',
			disabled: true
		}, {
			id: 'code-projects',
			label: 'Code/Projects'
		}, {
			id: 'music',
			label: 'Music'
		}, {
			id: 'other-shit',
			label: 'Other Sh*t'
		}, {
			id: 'all',
			label: 'All'
		}];

		var filter = localStorage.getItem('filter');
		$rootScope.selectedFilter = false;
		if(filter){
			for(var i = 0; i<$rootScope.filters.length; i++){
				if(filter === $rootScope.filters[i].id){
					$rootScope.selectedFilter = $rootScope.filters[i];
					break;
				}
			}
		}

		$rootScope.triggerShowSubscribtionPopup = function(){
			$rootScope.$broadcast('show.popup');
		}
		$rootScope.toggleMobileMenu = function(){
			$rootScope.mobileMenuToggler = !$rootScope.mobileMenuToggler;
		}
		$rootScope.hideMobileMenu = function($event, forceHide){
			var href = angular.element($event.currentTarget).children('a').attr('href');
			if(angular.element(window).width() < 1024 && (href !== $location.path() || forceHide)){
				$rootScope.mobileMenuToggler = false;
				jQuery("html, body").animate({scrollTop: -80}, 500);
			}
		}
		$rootScope.updateFilter = function(currentFilter){
			if(angular.element(window).width() < 1024 && $location.path() === '/posts'){
				$rootScope.mobileMenuToggler = false;
				jQuery("html, body").scrollTop(-80);
			}

			$rootScope.selectedFilter = currentFilter;
			localStorage.setItem('filter', currentFilter.id);
			$rootScope.$broadcast('start.counter');
		}
	});
