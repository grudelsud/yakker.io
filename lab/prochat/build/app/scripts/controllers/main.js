'use strict';

angular.module('prochatApp.controllers', ['ui.bootstrap']).

config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/profiles', {templateUrl: 'views/app.profiles.html', controller: 'ProfileCtrl'})
		.when('/chatrooms', {templateUrl: 'views/app.chatrooms.html', controller: 'ChatroomCtrl'})
		.otherwise({redirectTo: '/profiles'});
}]).

controller('ProfileCtrl', ['$scope', 'Profile', function($scope, Profile) {
	$scope.whereAmI = 'Profile';

	$scope.profiles = Profile.query();

	$scope.showProfile = false;
	$scope.activeProfile = undefined;

	$scope.viewProfile = function() {
		$scope.showProfile = true;
		$scope.activeProfile = $scope.profiles[this.$index];
	};
}]).

controller('ChatroomCtrl', ['$scope', 'Chatroom', function($scope, Chatroom) {
	$scope.whereAmI = 'Chatroom';

	$scope.rooms = Chatroom.query();
	$scope.activeRooms = [];

	$scope.viewRoom = function() {
		console.log(this);
	}
}]);
