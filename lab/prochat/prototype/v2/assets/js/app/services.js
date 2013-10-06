'use strict';

angular.module('protoApp.services', ['ngResource']).

factory('userData', function() {
	return {
		status: {
			signedIn: false
		},
		user: {
			'id': 'p02',
			'displayName': 'Gianni'
		}
	}
}).

factory('navData', function() {
	return {
		sideItems: [
			{
				'location': '#/dashboard',
				'name': 'Dashboard',
				'icon': 'icon-dashboard',
				'classes': []
			},
			{
				'location': '#/rooms',
				'name': 'Rooms',
				'icon': 'icon-comments',
				'classes': []
			},
			{
				'location': '#/contacts',
				'name': 'Contacts',
				'icon': 'icon-group',
				'classes': []
			},
			{
				'location': '#/summary',
				'name': 'Summary',
				'icon': 'icon-magic',
				'classes': []
			}
		],
		crumbs: [{
			'location': '#',
			'name': 'Home',
			'icon': 'icon-home',
			'classes': ['active']
		}]
	}
}).

factory('contactData', function($resource) {
	return $resource('api/contact/:contactId.json', {contactId: 'list'});
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