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
	})
	.component('subscribePopup', {
		bindings: {
			showSubscribePopup: '='
		},
		controller: subscribePopupController,
		templateUrl: 'views/components/subscribePopup.html'
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

subscribePopupController.$inject = ['Subscribes', '$rootScope'];

function subscribePopupController(Subscribes, $rootScope){
	var self = this;
	this.submitted = false;
	
	$rootScope.$on('show.popup', function(){
		self.showSubscribePopup = true;
	});
	
	this.triggerHideSubscribtionPopup = function($rootScope){
		self.showSubscribePopup = false;
		self.submitted = false;
		self.emailAddress = '';
	}
	
	this.submitForm = function(form, evt){
		evt.preventDefault();
		var subscribeData = {
			'email': self.emailAddress
		};
		
		Subscribes.set(subscribeData)
			.then(function(response){
				var data = response.data;
				if(data){
					self.subscribeResponse = data;
					self.submitted = true;
					self.emailAddress = '';
				}
			});
	}
}