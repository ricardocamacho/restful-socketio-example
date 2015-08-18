var app = angular.module('MyApp', []);

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

app.controller('PostsCtrl', function($scope, $http, socket){
	var url = 'http://localhost:3000/api/posts';
	var thisCtrl = this;
	$http.get(url).success(function(res){
		thisCtrl.posts = res;
	});
  thisCtrl.send = function(){
    $http.post(url,{ body: thisCtrl.msg, user_id: 1 }).success(function(res){
      thisCtrl.msg = '';
    });
    //socket.emit('chat message', thisCtrl.msg);
  };
  socket.on('chat message', function(msg){
    thisCtrl.posts.unshift({body: msg.body, created_at: msg.created_at});
  });
});