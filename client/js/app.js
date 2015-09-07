var app = angular.module('MyApp', ['ngRoute']);

var baseUrl = 'http://localhost:3000';

app.config(function($routeProvider) {
    $routeProvider.
		when('/login', {
			templateUrl: 'partials/login.html',
			controller: 'SessionCtrl as s'
		}).
		when('/posts', {
			templateUrl: 'partials/posts.html',
			controller: 'PostsCtrl as p'
		}).
		otherwise({
			redirectTo: '/login'
		});
	}
);

app.run(function($rootScope, $location, $window) {
	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		if(!$window.localStorage['token']){
			$location.path('/login');
		}
	});
});

app.factory('socket', function ($rootScope) {
  var socket = io();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

app.controller('SessionCtrl', function($http, $window, $location, $q){
	var url = baseUrl+'/api/users/session';
	var thisCtrl = this;
	this.login = function(){
		$http.post(url, {username: thisCtrl.username, password: thisCtrl.password}).success(function(res){
			if(res.data.token){
				$window.localStorage['token'] = res.data.token;
				$location.path('/posts');
				thisCtrl.invalid = false;
			}else{
				thisCtrl.invalid = true;
			}
		});
	};
});

app.controller('PostsCtrl', function($scope, $http, $window, socket){
	if($window.localStorage.token){
		$http.defaults.headers.common.Authorization = 'Bearer ' + $window.localStorage.token;
	}
	var url = baseUrl+'/api/posts';
	var thisCtrl = this;
	$http.get(url).success(function(res){
		thisCtrl.posts = res.data.posts;
	});
  thisCtrl.send = function(){
    $http.post(url,{ body: thisCtrl.msg }).then(function(res){
      thisCtrl.msg = '';
    }, function(res){
		});
    //socket.emit('chat message', thisCtrl.msg);
  };
  socket.on('chat message', function(msg){
    thisCtrl.posts.unshift({
			body: msg.body, 
			User: {
				fullname: msg.User.fullname
			}, 
			created_at: msg.created_at
		});
  });
});