angular.module('IvankoRambo')
	.component('htmlMarkup', {
		bindings: {
			originText: '@',
			contenteditable: '@'
		},
		templateUrl: 'views/components/htmlContent.html'
	})
	.component('editToolbar', {
		bindings: {
			colors: '@'
		},
		controller: EditToolbarController,
		templateUrl: 'views/components/editToolbar.html'
	});


/*Component controllers*/
function EditToolbarController(){
	var self = this;
	
	this.doCommand = function(evt){
		evt.preventDefault;
	}
}