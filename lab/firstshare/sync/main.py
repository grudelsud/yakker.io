#!/usr/bin/env python
#

from application.views import *

routes = [
	webapp2.Route(r'/', handler=MainHandler),
	webapp2.Route(r'/_ah/channel/connected/', handler=ChannelConnect),
	webapp2.Route(r'/_ah/channel/disconnected/', handler=ChannelDisconnect)
]

app = webapp2.WSGIApplication(routes=routes, debug=True)
