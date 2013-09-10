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

controller('RoomsCtrl', ['$scope', '$location', '$anchorScroll', '$timeout', function($scope, $location, $anchorScroll, $timeout) {
	$scope.title = 'Rooms';
	$scope.subtitle = 'ongoing conversations';

	$scope.indexSelected = 0;
	$scope.message = [];

	$scope.bots = [
		{
			"displayName": "tom",
			"imageUrl": "assets/avatars/avatar4.png"
		},
		{
			"displayName": "bobby estates",
			"imageUrl": "assets/avatars/avatar1.png"
		}
	];
	$scope.rooms = [
		{
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
					"imageUrl": $scope.bots[0].imageUrl,
					"displayName": $scope.bots[0].displayName,
					"role": "admin",
					"at": "2 min ago",
					"body": "yeah, I'm writing a snippet that connects to a project repo and stores everything there so we can use github's versioning"
				}
			]
		},{
			"title": "To buy or not to buy?",
			"messages": [
				{
					"imageUrl": "assets/avatars/user.jpg",
					"displayName": "gianni",
					"role": "owner",
					"at": "4 min ago",
					"body": "so is it something really interesting?"
				},
				{
					"imageUrl": $scope.bots[1].imageUrl,
					"displayName": $scope.bots[1].displayName,
					"role": "",
					"at": "2 min ago",
					"body": "you should see it, bathtubs everywhere, even in the garden shed..."
				}
			]
		}
	];

	$location.hash('bottom');

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
		$scope.indexSelected = index;
	}

	$scope.send = function() {
		var newMessage = {
			"imageUrl": "assets/avatars/user.jpg",
			"displayName": "gianni",
			"role": "owner",
			"at": "now",
			"body": $scope.message[$scope.indexSelected],
			"tags": createTags($scope.message[$scope.indexSelected])
		}
		$scope.rooms[$scope.indexSelected].messages.push(newMessage);
		$scope.message[$scope.indexSelected] = '';
		$anchorScroll();

		$timeout(function() {
			var newMessage = {
				"imageUrl": $scope.bots[$scope.indexSelected].imageUrl,
				"displayName": $scope.bots[$scope.indexSelected].displayName,
				"role": "admin",
				"at": "now",
				"body": "I see what you mean, let me thing about it, ok?",
				"tags": []
			}
			$scope.rooms[$scope.indexSelected].messages.push(newMessage);
			$anchorScroll();

		}, 400);
	}
}]).

controller('ContactsCtrl', ['$scope', function($scope) {
	$scope.title = 'Contacts';
	$scope.subtitle = 'profile pages';	
}]).

controller('SummaryCtrl', ['$scope', function($scope) {

}]);