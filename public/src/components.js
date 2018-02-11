angular.module('IvankoRambo')
	.component('htmlMarkup', {
		bindings: {
			originText: '@'
		},
		templateUrl: 'views/components/htmlContent.html'
	});