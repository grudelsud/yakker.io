'use strict';

angular.module('prochatApp.services', ['ngResource']).

factory('Profile', function($resource) {
	return $resource('data/sample/profile/:profileId.json', {profileId: 'list'});
}).

factory('Chatroom', function($resource) {
	return $resource('data/sample/chat/:roomId.json', {roomId: 'list'});
});