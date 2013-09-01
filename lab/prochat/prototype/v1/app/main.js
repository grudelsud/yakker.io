/**
* MainApp Module
*
* Description
*/
angular.module('MainApp', []).

config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/rooms', {templateUrl: 'partials/content.rooms.html', controller: 'RoomsCtrl'}).
		when('/contacts', {templateUrl: 'partials/content.contacts.html', controller: 'ContactsCtrl'}).
		when('/summary', {templateUrl: 'partials/content.summary.html', controller: 'SummaryCtrl'}).
		otherwise({redirectTo: '/rooms'});
}]).

controller('RoomsCtrl', ['$scope', function($scope) {
	$scope.title = 'Rooms';
	$scope.subtitle = 'ongoing conversations';
}]).

controller('ContactsCtrl', ['$scope', function($scope) {
	$scope.title = 'Contacts';
	$scope.subtitle = 'profile pages';	
}]).

controller('SummaryCtrl', ['$scope', function($scope) {
	
}]);