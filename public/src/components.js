angular.module('IvankoRambo')
	.component('htmlMarkup', {
		bindings: {
			originText: '@',
			contenteditableAttribute: '@'
		},
		templateUrl: 'views/components/htmlContent.html'
	})
	.component('editToolbar', {
		bindings: {
			colors: '<'
		},
		controller: EditToolbarController,
		templateUrl: 'views/components/editToolbar.html'
	});


/*Component controllers*/
function EditToolbarController(){
	this.doCommand = function(evt){
		evt.preventDefault;
		var element = evt.target,
			command = element.dataset.command;
		
		if(command == 'h1' || command == 'h2' || command == 'p'){
			document.execCommand('formatBlock', false, command);
		}
		else if((command == 'forecolor' || command == 'backcolor') && element.dataset.value){
			document.execCommand(command, false, element.dataset.value);
		}
		else if(command == 'createlink' || command == 'insertimage'){
			var url = prompt('Enter the link here: ', 'http:\/\/');
			document.execCommand(command, false, url);
		}
		else{
			document.execCommand(command, false, null);
		}
	}
}