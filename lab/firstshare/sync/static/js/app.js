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
			$('input[name=input_roomnumber]').val(global.vars.room_key);

			global.rtcCommunicator = new RTCCommunicator();
			global.rtcCommunicator.initialize();

			if (global.vars.token.length != 0)
			{
				global.rtcCommunicator.createGoogleChannel(global.vars.token);				
			}
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
				location.href = global.vars.base_url + '?r=' + roomNumber;
			}
			else if (roomNumber != global.vars.room_key)
			{
				location.href = global.vars.base_url + '?r=' + roomNumber;
			}
		},

		log: function(msg)
		{
			console.log(msg);
		}
	});

	Backbone.emulateHTTP = true;
	var App = new AppView;
});