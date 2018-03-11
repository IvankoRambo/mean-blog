angular.module('IvankoRambo')
	.directive('postsScroll', function(){
		return function(scope, elm, attr){
			var eventName = 'scroll.posts';
			if(!scope.$postList.endOfDocument){
				angular.element(window).on(eventName, function(){
					 if((window.scrollY + window.innerHeight) >= document.body.offsetHeight){
						 scope.$postList.paginateOnScroll(eventName);
					 }
				});
			}
		}
	});