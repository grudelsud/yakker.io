/**
* MainApp Module
*
* Description
*/
angular.module('MainApp', ['ui.bootstrap']).

config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/rooms', {templateUrl: 'partials/content.rooms.html', controller: 'RoomsCtrl'}).
		when('/contacts', {templateUrl: 'partials/content.contacts.html', controller: 'ContactsCtrl'}).
		when('/summary', {templateUrl: 'partials/content.summary.html', controller: 'SummaryCtrl'}).
		otherwise({redirectTo: '/rooms'});
}]).

controller('RoomsCtrl', ['$scope', '$location', '$anchorScroll', function($scope, $location, $anchorScroll) {
	$scope.title = 'Rooms';
	$scope.subtitle = 'ongoing conversations';
	$scope.rooms = [{
		"title": "Agency #123 on proj. Alpha",
		"messages": [
			{
				"imageUrl": "assets/avatars/user.jpg",
				"displayName": "gianni",
				"role": "owner",
				"at": "4 min ago",
				"body": "it would be really clever if we could add a simple file versioning tool"
			},
			{
				"imageUrl": "assets/avatars/avatar4.png",
				"displayName": "tom",
				"role": "admin",
				"at": "2 min ago",
				"body": "yeah, I'm writing a snippet that connects to a project repo and stores everything there so we can use github's versioning"
			}
		]
	}];

	var createTags = function(text) {
		var _text = text.split(' ');
		if (_text.length > 3) {
			var index = Math.floor(_text.length * Math.random());
			return [_text[index]];
		}
		else {
			return [];
		}
	}

	$scope.selectRoom = function(index) {
		console.log('room selected', index);
	}

	$scope.send = function() {
		var newMessage = {
			"imageUrl": "assets/avatars/user.jpg",
			"displayName": "gianni",
			"role": "owner",
			"at": "now",
			"body": $scope.message,
			"tags": createTags($scope.message)
		}
		$scope.rooms[0].messages.push(newMessage);
		$scope.message = '';
		$location.hash('bottom');
		$anchorScroll();
	}
}]).

controller('ContactsCtrl', ['$scope', function($scope) {
	$scope.title = 'Contacts';
	$scope.subtitle = 'profile pages';	
}]).

controller('SummaryCtrl', ['$scope', function($scope) {

}]);