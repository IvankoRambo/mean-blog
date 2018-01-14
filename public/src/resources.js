angular.module('IvankoRambo')
	.factory('Posts', function($resource){
		return $resource('/api/posts/:id', {id: '@id'}, {
			'query': {method: 'GET', isArray: false},
			'update': { method: 'PUT' }
		});
	});
