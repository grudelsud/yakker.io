'use strict';

angular.module('protoApp.services', ['ngResource']).

factory('profileData', function($resource) {
	return $resource('api/profile/:profileId.json', {profileId: 'list'});
}).

factory('roomData', function($resource) {
	return $resource('api/room/:roomId.json', {roomId: 'list'});
}).

factory('nlp', function() {
	return {
		createTags: function(text) {
			var _text = text.split(' ');
			if (_text.length > 3) {
				var index = Math.floor(_text.length * Math.random());
				return [_text[index]];
			}
			else {
				return [];
			}
		}
	}
});