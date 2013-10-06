/**
* MainApp Module
*
* Description
*/
angular.module('protoApp', ['protoApp.services', 'protoApp.directives', 'ui.bootstrap']).

config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/rooms', {templateUrl: 'partials/ctrl.rooms.html', controller: 'RoomsCtrl', reloadOnSearch: false}).
		when('/contacts', {templateUrl: 'partials/content.contacts.html', controller: 'ContactsCtrl', reloadOnSearch: false}).
		when('/summary', {templateUrl: 'partials/content.summary.html', controller: 'SummaryCtrl'}).
		otherwise({redirectTo: '/rooms'});
}]).

controller('RoomsCtrl', ['$scope', 'roomData', '$location', function($scope, roomData, $location) {

	$scope.title = 'Rooms';
	$scope.subtitle = 'ongoing conversations';

	$scope.rooms = roomData.query();
	$scope.activeRoom = $location.hash();

	$scope.selectRoom = function() {
		$location.hash(this.room.id);
		$scope.activeRoom = this.room.id;
	}
}]).

controller('ContactsCtrl', ['$scope', 'profileData', '$location', function($scope, profileData, $location) {
	$scope.title = 'Contacts';
	$scope.subtitle = 'profile pages';	

	$scope.profiles = profileData.query();
	$scope.activeProfile = $location.hash();

	$scope.selectProfile = function() {
		$location.hash(this.profile.id);
		$scope.activeProfile = this.profile.id;
	}
}]).

controller('SummaryCtrl', ['$scope', function($scope) {

}]);