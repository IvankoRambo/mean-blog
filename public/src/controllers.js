angular.module('IvankoRambo')
	.controller('PostsController', ['$routeParams', 'Posts', 'Users', '$location', '$sce', '$rootScope', 
	                                function PostsController($rP, Posts, Users, $l, $s, $rS){
		$rS.PAGE = 'posts';
		
		this.posts = Posts.query();
		this.headerFields = ['postDate', 'title'];
		this.bodyFields = ['text'];
		
		this.loggedIn = false;
		
		checkUserStatus.call(this, Users);
		
		this.sort = function sort(field){
			this.sort.field = field;
			this.sort.ASC = !!this.sort.ASC;
		}
		
		this.sort.ASC = false;
		
		this.goToPost = function(id){
			if(id != null){
				$l.url('/posts/' + id);
			}
		}
	}])
	.controller('PostController', ['$routeParams', 'Posts', 'Users', '$rootScope', 
	                               function PostController($rP, Posts, Users, $rS){
		$rS.PAGE = 'post';
		
		this.post = Posts.query({id: $rP.id});
		this.headerFields = ['postDate', 'title'];
		this.bodyFields = ['text'];
		this.loggedIn = false;
		
		checkUserStatus.call(this, Users);
	}])
	.controller('AboutController', ['$rootScope', function($rS){
		$rS.PAGE = 'about';
	}])
	.controller('LoginController', ['$rootScope', 'Users', '$location',
	                                function($rS, Users, $l){
		var self = this;
		
		$rS.PAGE = 'login';
		this.success = true;
		this.errorMessage = '';
		
		this.formData = {};
		this.submitForm = function submitForm(form, evt){
			evt.preventDefault();
			var postData = 'username=' + self.formData.username + '&password=' + self.formData.password;
			Users.set(postData)
				.then(function(response){
					var data = response.data;
					if(data.success){
						$l.url('/posts');
					}
				}, function(response){
					var data = response.data;
					if('success' in data){
						self.success = data.success;
						self.errorMessage = data.message;
					}
				});
		}
	}]);

function checkUserStatus(UsersResource){
	var self = this;
	
	UsersResource.get()
		.then(function(response){
			var data = response.data;
			self.loggedIn = data.status;
			self.username = data.userinfo;
		}, function(response){
			var data = response.data;
			self.loggedIn = data.status;
		});
}
