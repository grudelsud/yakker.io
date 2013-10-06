'use strict';

angular.module('protoApp.directives', []).

directive('contactDetail', ['contactData', function(contactData) {
	return {
		restrict: 'EA',
		templateUrl: 'partials/dir.contact-detail.html',
		scope: { 
			'contactId': '=ngModel'
		},
		require: 'ngModel',
		link: function($scope, iElm, iAttrs, controller) {

			$scope.contactData = contactData.get({contactId: $scope.contactId});
		}
	};
}]).

directive('chatRoom', ['roomData', 'nlp', '$timeout', '$location', '$anchorScroll', function(roomData, nlp, $timeout, $location, $anchorScroll){
	return {
		restrict: 'EA',
		templateUrl: 'partials/dir.chat-room.html',
		scope: { 
			'roomId': '=ngModel'
		},
		require: 'ngModel',
		link: function($scope, iElm, iAttrs, controller) {
			// hack: using ngmodel on plain object doesn't work, hence the array
			$scope.msgInput = [];
			$scope.roomData = roomData.get({roomId: $scope.roomId});

			$scope.send = function() {
				var messageId = "r0" + $scope.roomId + "m00" + $scope.roomData.messages.length;
				var message = $scope.msgInput[$scope.roomId];

				var newMessage = {
					"id": messageId,
					"at": "now",
					"type": "text",
					"fromId": "p02",
					"displayName": "gianni",
					"imageUrl": "assets/avatars/user.jpg",
					"role": "owner",
					"body": message,
					"tags": nlp.createTags(message)
				}
				$scope.roomData.messages.push(newMessage);
				$scope.msgInput[$scope.roomId] = '';

				// send fake response
				$timeout(function() {
					var messageId = "r0" + $scope.roomId + "m00" + $scope.roomData.messages.length;
					var newMessage = {
						"id": messageId,
						"at": "now",
						"type": "text",
						"fromId": "p00",
						"displayName": "bot",
						"imageUrl": "assets/avatars/avatar2.png",
						"role": "bot",
						"body": "I see what you mean, I promise I'll get smarter and get back to you",
						"tags": []
					}
					$scope.roomData.messages.push(newMessage);
					$scope.msgInput[$scope.roomId] = '';

					// nasty fix, needs rewriting
					jQuery('#' + $scope.roomData.id).scrollTop(10000);

				}, 400);
			}
		}
	};
}]);