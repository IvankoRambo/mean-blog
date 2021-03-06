angular.module('IvankoRambo')
	.filter('ISODate', function(){
		return function(time){
			var dateRegExp = /(\d){4}-(\d){2}-(\d){2}/;
			if(typeof time === 'number'){
				var fullISODate = new Date(time).toISOString(),
					ISODateArr = fullISODate.match(dateRegExp);
					
				if(ISODateArr && ISODateArr.length){
					return ISODateArr[0];
				}
			}
			return time;
		}
	})
	.filter('labelCase', function(){
		return function(text){
			text = text.replace(/([A-Z])/g, ' $1');
			return text[0].toUpperCase() + text.slice(1);
		}
	})
	.filter('previewText', function(){
		return function(text){
			var formattedText = text.replace(/(<(img[^>]+)>(\s)?)/ig, '');
			return formattedText.length > 300 ? formattedText.substring(0, 300) + '...' : formattedText;
		}
	})
	.filter('trustHTML', function($sce){
		return function(text){
			return $sce.trustAsHtml(text);
		};
	});
