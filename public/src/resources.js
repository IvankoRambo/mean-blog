angular.module('IvankoRambo')
	.factory('Posts', function($resource){
		return $resource('/api/posts/:id', {id: '@id'}, {
			'update': { method: 'PUT' }
		});
	});
