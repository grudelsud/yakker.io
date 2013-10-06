'use strict';

angular.module('protoApp.directives', []).

directive('chatRoom', ['roomData', 'nlp', '$timeout', '$location', '$anchorScroll', function(roomData, nlp, $timeout, $location, $anchorScroll){
	return {
		restrict: 'EA',
		templateUrl: 'partials/tpl.chat-room.html',
		// templateUrl: 'partials/tpl.chat-room-tabbed.html',
		scope: { 
			'roomId': '=ngModel'
		},
		require: 'ngModel',
		link: function($scope, iElm, iAttrs, controller) {
			$scope.roomData = roomData.get({roomId: $scope.roomId});

			$scope.send = function() {
				var messageId = "r0" + $scope.roomId + "m00" + $scope.roomData.messages.length;
				console.log('message', $scope.message);
				var newMessage = {
					"id": messageId,
					"at": "now",
					"type": "text",
					"fromId": "p02",
					"displayName": "gianni",
					"imageUrl": "assets/avatars/user.jpg",
					"role": "owner",
					"body": $scope.message,
					"tags": nlp.createTags($scope.message)
				}
				$scope.roomData.messages.push(newMessage);
				$scope.message = '';

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
					$scope.message = '';

					// nasty fix, needs rewriting
					jQuery('#' + $scope.roomData.id).scrollTop(10000);

				}, 400);
			}
		}
	};
}]).

directive('roomList', [function(){
	// Runs during compile
	return {
		restrict: 'EA',
		templateUrl: 'partials/tpl.room-list.html'
	};
}]);
