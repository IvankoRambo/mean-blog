angular.module('IvankoRambo')
	.controller('PostsController', ['$routeParams', 'Posts', 'Users', '$location', '$rootScope', '$timeout',
	                                function PostsController($rP, Posts, Users, $l, $rS, $time){
		var self = this;

		$rS.PAGE = 'posts';
		this.limit = 5;
		this.step = 0;
		this.falseCount = false;
		this.filterID = $rS.selectedFilter ? $rS.selectedFilter.id : 'all';
		this.endOfDocument = false;
		this.posts = [];

		getPaginatedPosts.call(this, Posts, $time);
		this.headerFields = ['postDate', 'title'];
		this.bodyFields = ['text'];

		this.loggedIn = false;

		checkUserStatus.call(this, Users);

		$rS.$on('start.counter', function(){
			self.step = 0;
			self.posts = [];
			self.filterID = $rS.selectedFilter ? $rS.selectedFilter.id : 'all;'
			self.endOfDocument = false;
			getPaginatedPosts.call(self, Posts, $time);
		});

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

		this.paginateOnScroll = function(eventName){
			self.step += self.limit;
			if(!self.endOfDocument){
				var postBack = Posts.query({step: self.step, limit: self.limit, filter: self.filterID});
				postBack.$promise.then(function(response){
					self.endOfDocument = response.postsCount < self.limit;
					self.posts = self.posts.concat(response.posts);
				});
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
	.controller('ProjectsController', ['$rootScope', function ($rS) {
		$rS.PAGE = 'projects';

		this.projectList = [{
			img: 'static/backupimages/object-fly-simulator-2.gif',
			url: '/object-fly-simulator',
			title: 'Object fly simulator',
			text: 'Dev Challenge XVII (2020) task regarding thrown object simulation by defining physical initial parameters based on pure HTML animations and Canvas.'
		}, {
			img: 'static/backupimages/moneymap.png',
			url: 'https://www.moneymap.one/',
			title: 'Moneymap',
			text: 'Web part of complex digital wallet application written on React.js for client side and on Express.js-based back-end middleware to interact with core services.'
		}];
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
					text: text.innerHTML,
					filter: self.postFilter
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
	.controller('UnsubscribeController', ['$rootScope', 'Subscribes', '$location',
	                                      function($rS, Subscribes, $l){
		var self = this;
		var params = $l.search();

		$rS.PAGE = 'unsubscribe';
		Subscribes.delete(params)
			.then(function(response){
				var data = response.data;
				if(data){
					self.subscribeResponse = data.message;
				}
			});

	}])
	.controller('MyLovelyController', ['$rootScope',
									function ($rS) {
		this.submitForm = function submitForm(form, evt) {
			evt.preventDefault();
		}
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

function getPaginatedPosts(PostsResource, timeout, step){
	step = step || this.step;
	var postBlocks = document.querySelectorAll('article');
	var viewPortTop = document.body.scrollTop;
	var viewPortBottom = viewPortTop + window.innerHeight;
	var lastPostBlock;
	var postTop;
	var postBottom;
	if(postBlocks && postBlocks.length){
		lastPostBlock = postBlocks[postBlocks.length - 1];
		postTop = lastPostBlock.offsetTop;
		postBottom = postTop + ( parseInt(document.defaultView.getComputedStyle(lastPostBlock, '').getPropertyValue('height')) +
				parseInt(document.defaultView.getComputedStyle(lastPostBlock, '').getPropertyValue('margin-top')) +
				parseInt(document.defaultView.getComputedStyle(lastPostBlock, '').getPropertyValue('margin-bottom')) +
				parseInt(document.defaultView.getComputedStyle(lastPostBlock, '').getPropertyValue('padding-top')) +
				parseInt(document.defaultView.getComputedStyle(lastPostBlock, '').getPropertyValue('padding-bottom')) );
	}

	if(step === 0 || (lastPostBlock && postBottom < viewPortBottom)){
		var self = this;
		var postBack = PostsResource.query({limit: self.limit, step: step, filter: self.filterID});

		postBack.$promise.then(function(response){
			self.endOfDocument = response.postsCount < self.limit;
			if(response.postsCount){
				self.posts = self.posts.concat(response.posts);
			}
			if(!self.endOfDocument && response.postsCount){
				self.step += self.limit;
				self.falseCount = true;
				timeout(function(){
					getPaginatedPosts.call(self, PostsResource, timeout);
				});
			}
		});
	}
	else if(this.falseCount){
		this.falseCount = false;
		this.step -= this.limit;
	}
}

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
