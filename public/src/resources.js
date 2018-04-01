angular.module('IvankoRambo')
	.factory('Posts', function($resource){
		return $resource('/api/posts/:id', {id: '@id'}, {
			'query': {method: 'GET', isArray: false, params: {limit: '5', step: 0}},
			'update': { method: 'PUT' }
		});
	})
	.factory('Users', function($http){
		var postUrl = '/api/login',
			getUrl = '/api/loginstatus';
		
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
	})
	.factory('Subscribes', function($http){
		var subscribeUrl = '/api/subscribe';
		
		return {
			set: function(data){
				return $http({
					method: 'POST',
					url: subscribeUrl,
					data: data,
					header: {'Content-Type': 'application/json'}
				});
			},
			delete: function(data){
				return $http({
					method: 'DELETE',
					url: subscribeUrl,
					params: data,
					header: {'Content-Type': 'application/json'}
				});
			}
		}
	});
