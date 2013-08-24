'use strict';

angular.module('prochatApp.controllers', ['ui.bootstrap']).

config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/profiles', {templateUrl: 'views/partials/profiles.tpl.html', controller: 'ProfileCtrl'})
		.when('/chatrooms', {templateUrl: 'views/partials/chatrooms.tpl.html', controller: 'ChatroomCtrl'})
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

controller('ChatroomCtrl', ['$scope', function($scope) {
	$scope.whereAmI = 'Chatroom';
}]);
