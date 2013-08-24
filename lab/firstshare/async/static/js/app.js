$(function() {

	/**
	 * APP
	 */
	var AppView = Backbone.View.extend({

		el: $("#controller"),

		events: {
			"submit #command_form" : "connect"
		},

		initialize: function() 
		{
			this.log('app init');

			this.$el.find('form').on('submit', function(e) { e.preventDefault(); });

			global.rtcCommunicator = new RTCCommunicator();
			global.rtcCommunicator.initialize();
		},

		render: function(e) 
		{
			this.log('app render on ' + e);
		},

		connect: function()
		{
			var roomNumber = $('input[name=input_roomnumber]').val();
			if (roomNumber.length == 0) 
			{
				roomNumber = global.rtcCommunicator.roomRoulette();
				$('input[name=input_roomnumber]').val(roomNumber);
			}

			var url = api_url + 'channel/' + roomNumber;
			$.get(url, function(result) 
			{
				var token = typeof result.success != 'undefined' ? result.success.message : null;
				if (token)
				{
					global.rtcCommunicator.createGoogleChannel(token);
				}
			});
		},

		log: function(msg)
		{
			console.log(msg);
		}
	});

	Backbone.emulateHTTP = true;
	var App = new AppView;
});