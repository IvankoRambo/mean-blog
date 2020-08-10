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
	})
	.directive('lovelyForm', function () {
		return function (scope, elm, attr) {
			var jEl = jQuery(elm);
			var jForm = jEl.children('.js-lovely-form');
			var jPicture = jEl.children('.js-lovely-picture');
			jForm.delay(3000).fadeOut(1000, function () {
				$(this).remove();
				jPicture.delay(500).slideDown(400);
			});
		}
	});