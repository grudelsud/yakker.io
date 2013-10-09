/**
* MainApp Module
*
* Description
*/
angular.module('protoApp', ['protoApp.services', 'protoApp.directives', 'ngRoute', 'ui.bootstrap']).

controller('TopNavCtrl', ['$scope', 'userData', function($scope, userData) {
	$scope.status = userData.status;
	$scope.user = userData.user;
}]).

controller('SideNavCtrl', ['$scope', '$location', 'navData', 'userData', function($scope, $location, navData, userData) {
	$scope.sideItems = navData.sideItems;
	$scope.status = userData.status;
	$scope.user = userData.user;

	$scope.classes = function() {
		var classes = [];
		if (this.item.location == '#' + $location.path()) {
			classes.push('active');
		}
		return classes;
	}
}]).

controller('CrumbsCtrl', ['$scope', '$location', 'navData', function($scope, $location, navData) {
	$scope.crumbs = navData.crumbsSet($location.path());
	console.log('# [crumbs]', 'hash:', $location.hash(), 'path:', $location.path(), 'search:', $location.search(), 'url:', $location.url());
}]).

config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/welcome', {templateUrl: 'partials/ctrl.landing.html', controller: 'LandingCtrl', reloadOnSearch: false}).
		when('/signup', {templateUrl: 'partials/ctrl.signup.html', controller: 'SignupCtrl', reloadOnSearch: false}).
		when('/dashboard', {templateUrl: 'partials/ctrl.dashboard.html', controller: 'DashboardCtrl', reloadOnSearch: false}).
		when('/rooms', {templateUrl: 'partials/ctrl.rooms.html', controller: 'RoomsCtrl', reloadOnSearch: false}).
		when('/contacts', {templateUrl: 'partials/ctrl.contacts.html', controller: 'ContactsCtrl', reloadOnSearch: false}).
		when('/summary', {templateUrl: 'partials/ctrl.summary.html', controller: 'SummaryCtrl'}).

		otherwise({redirectTo: '/welcome'});
}]).

controller('LandingCtrl', ['$scope', 'userData', function($scope, userData) {
	$scope.status = userData.status;
	userData.status.signedIn = false;
}]).

controller('SignupCtrl', ['$scope', function($scope) {

}]).

controller('DashboardCtrl', ['$scope', 'userData', function($scope, userData) {
	$scope.status = userData.status;
	userData.status.signedIn = true;
}]).

controller('RoomsCtrl', ['$scope', 'userData', 'roomData', '$location', function($scope, userData, roomData, $location) {

	$scope.status = userData.status;
	userData.status.signedIn = true;

	$scope.title = 'Rooms';
	$scope.subtitle = 'ongoing conversations';

	$scope.rooms = roomData.query();
	$scope.activeRoom = $location.hash();

	$scope.selectRoom = function() {
		$location.hash(this.room.id);
		$scope.activeRoom = this.room.id;
		this.room.active = true;
	}
}]).

controller('ContactsCtrl', ['$scope', 'userData', 'contactData', '$location', function($scope, userData, contactData, $location) {

	$scope.status = userData.status;
	userData.status.signedIn = true;

	$scope.title = 'Contacts';
	$scope.subtitle = 'contact pages';	

	$scope.contacts = contactData.query();
	$scope.activeContact = $location.hash();

	$scope.selectContact = function() {
		$location.hash(this.contact.id);
		$scope.activeContact = this.contact.id;
		this.contact.active = true;
	}
}]).

controller('SummaryCtrl', ['$scope', 'userData', function($scope, userData) {
	$scope.status = userData.status;
	userData.status.signedIn = true;
}]);