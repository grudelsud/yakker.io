#!/usr/bin/env python
#

from application.views import *

routes = [
	webapp2.Route(r'/', handler=MainHandler),
	webapp2.Route(r'/api/channel/<room_key:\w+>', handler=ChannelHandler, handler_method='create_channel'),
	webapp2.Route(r'/_ah/channel/connected/', handler=ChannelHandler, handler_method='connect'),
	webapp2.Route(r'/_ah/channel/disconnected/', handler=ChannelHandler, handler_method='disconnect')
]

app = webapp2.WSGIApplication(routes=routes, debug=True)
