(function() {

	var global = this;

	var RTCCommunicator = function() 
	{
		this.localVideo = document.getElementById("localVideo");
		this.localStream = null;
		this.googleSocket = null;
	}

	RTCCommunicator.prototype = 
	{
		initialize: function() 
		{
			try 
			{
				getUserMedia({'audio':true, 'video':true}, this.onUserMediaSuccess, this.onUserMediaError);
			} 
			catch (e) 
			{
				console.log("getUserMedia failed with exception: " + e.message);
			}
		},

		onUserMediaSuccess: function(stream) 
		{
			console.log("User has granted access to local media.");

			// Call the polyfill wrapper to attach the media stream to this element.
			attachMediaStream(this.localVideo, stream);
			this.localVideo.style.opacity = 1;
			this.localStream = stream;

			// Caller creates PeerConnection.
			// if (initiator) maybeStart();
		},

		onUserMediaError: function(error) 
		{
			console.log("Failed to get access to local media. Error code was " + error.code);
		},

		createGoogleChannel: function(token)
		{
			var channel = new goog.appengine.Channel(token);
			var handler = {
				'onopen': this.onGoogleChannelOpened,
				'onmessage': this.onGoogleChannelMessage,
				'onerror': this.onGoogleChannelError,
				'onclose': this.onGoogleChannelClosed
			};
			this.googleSocket = channel.open(handler);
		},

		onGoogleChannelOpened: function() 
		{
			console.log('Channel opened.');
			channelReady = true;
			if (initiator) 
			{
				maybeStart();
			}
		},

		onGoogleChannelMessage: function(message) 
		{
			console.log('S->C: ' + message.data);
			var msg = JSON.parse(message.data);

			if (msg.type === 'offer') 
			{
				// Callee creates PeerConnection
				if (!initiator && !started)
				{
					maybeStart();
				}

				pc.setRemoteDescription(new RTCSessionDescription(msg));
				pc.createAnswer(setLocalAndSendMessage, null, sdpConstraints);
			} 
			else if (msg.type === 'answer' && started) 
			{
				pc.setRemoteDescription(new RTCSessionDescription(msg));
			} 
			else if (msg.type === 'candidate' && started) 
			{
				var candidate = new RTCIceCandidate({sdpMLineIndex:msg.label, candidate:msg.candidate});
				pc.addIceCandidate(candidate);
			} 
			else if (msg.type === 'bye' && started) 
			{
				onRemoteHangup();
			}
		},

		onGoogleChannelError: function() 
		{
			console.log('Channel error.');
		},

		onGoogleChannelClosed: function() 
		{
			console.log('Channel closed.');
		},

		roomRoulette: function()
		{
			// 36 | 5 with repetions == 658008 rooms
			var roomLength = 5;
			var roomNumber = '';
			var randomSource = 'qwertyuiopasdfghjklzxcvbnm0123456789';
			for (var i = 0; i < roomLength; i++)
			{
				var index = Math.floor(Math.random() * randomSource.length);
				roomNumber += randomSource[index];
			}
			return roomNumber;
		}
	}

	//exports to multiple environments
	if (typeof define === 'function' && define.amd)
	{
		//AMD
		define('rtcCommunicator', function() {
			return RTCCommunicator;
		});
	} 
	else if (typeof module !== 'undefined' && module.exports)
	{
		//node
		module.exports = RTCCommunicator;
	} 
	else 
	{ 
		//browser
		global['RTCCommunicator'] = RTCCommunicator;
	}

}).call(this);