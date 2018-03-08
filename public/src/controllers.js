angular.module('IvankoRambo')
	.controller('PostsController', ['$routeParams', 'Posts', 'Users', '$location', '$rootScope', 
	                                function PostsController($rP, Posts, Users, $l, $rS){
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
	.controller('PostController', ['$routeParams', 'Posts', 'Users', '$rootScope', '$location', 
	                               function PostController($rP, Posts, Users, $rS, $l){
		$rS.PAGE = 'post';
		
		var self = this;
		
		this.post = Posts.query({id: $rP.id});
		this.headerFields = ['postDate', 'title'];
		this.bodyFields = ['text'];
		this.loggedIn = false;
		this.contenteditable = false;
		this.colors = $rS.colors;
		
		checkUserStatus.call(this, Users);
		
		this.deletePost = function(evt){
			evt.preventDefault();
			Posts.remove({id: $rP.id}).$promise.then(function(data){
				if(data.removed){
					$l.url('/posts');
				}
			});
		}
		
		this.changeEdit = function(evt){
			evt.preventDefault();
			self.contenteditable = !self.contenteditable;
		}
		
		this.updatePost = function(evt){
			evt.preventDefault();
			var title = document.querySelector('.value-title'),
				text = document.querySelector('.html-content'),
				updateData;
			
			if(title && text){
				updateData = {
					title: title.textContent,
					text: text.innerHTML
				};
				
				Posts.update({id: $rP.id}, updateData).$promise.then(function(data){
					self.updateMessage = data.updated ? "Was updated!" : "Was\'nt updated";
				}, function(data){
					self.updateMessage = "Some troubles with request occured";
				});
			}
			else{
				self.updateMessage = "The needed post elements are not presented on a page";
			}
		}
		
	}])
	.controller('NewPost', ['Posts', 'Users', '$rootScope', '$location', 
	                        function NewPost(Posts, Users, $rS, $l){
		var self = this;
		
		this.loggedIn = false;
		this.colors = $rS.colors;
		this.titleText = '';
		this.errorMessage = false;
		
		checkUserStatus.call(this, Users);
		
		this.savePost = function(evt){
			evt.preventDefault();
			var text = document.querySelector('.html-content'),
				saveData;
			
			if(text){
				saveData = {
					title: self.titleText,
					text: text.innerHTML
				};
				
				Posts.save({}, saveData).$promise.then(function(data){
					
					if(data.success){
						$l.url('/posts/' + data.postID);
					}
					else{
						self.errorMessage = 'Some error occured during saving. Check db.';
					}
					
				}, function(){
					self.errorMessage = 'Some error occured during saving. Check db';
				});
			}
		}
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
