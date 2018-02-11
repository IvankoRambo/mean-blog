angular.module('IvankoRambo')
	.factory('Posts', function($resource){
		return $resource('/api/posts/:id', {id: '@id'}, {
			'query': {method: 'GET', isArray: false},
			'update': { method: 'PUT' }
		});
	})
	.factory('Users', function($http){
		var postUrl = '/api/login',
			getUrl = '/api/login_status';
		
		return {
			get: function(){
				return $http.get(getUrl);
			},
			set: function(data){
				return $http({
					method: 'POST',
					url: postUrl,
					data: data,
					headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				});
			}
		};
	});
