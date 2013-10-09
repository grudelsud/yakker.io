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
	var home = {
		'location': '#',
		'name': 'Home',
		'icon': 'icon-home',
		'classes': ['active']
	};

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
		crumbsSet: function(path) {
			var pathElems = path.split('/');
			var crumbs = [home];
			if (pathElems.length > 0) {
				home.classes = [];
			}
			for (var pathIndex in pathElems) {
				if (pathElems[pathIndex].length) {
					var path = pathElems[pathIndex];
					var crumb = {'location': '#/' + path, 'name': path[0].toUpperCase() + path.slice(1), 'icon': '', 'classes': []};
					if (pathIndex == pathElems.length - 1) {
						crumb.classes.push('active');
					}
					crumbs.push(crumb);
				}
			}
			return crumbs;
		}
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
			var stopWords = ['is', 'and', 'the', 'a', 'if', 'me', 'that', 'can', 'be', 'we', 'you', 'here', 'there'];
			var textElems = text.split(' ');
			var tags = [];

			for (var textIndex in textElems) {
				var word = textElems[textIndex];
				if (word[0] == '#') {
					tags.push(word.slice(1));
					continue;
				}
				if (word[0].toUpperCase() == word[0]) {
					tags.push(word);
					continue;
				}
			}

			if (textElems.length > 3) {
				var textIndex = Math.floor(textElems.length * Math.random());
				var word = textElems[textIndex];
				if (word.length > 2 && word[0] != '#' && stopWords.indexOf(word.toLowerCase()) == -1) {
					tags.push(word);
				}
			}

			return tags;
		}
	}
});