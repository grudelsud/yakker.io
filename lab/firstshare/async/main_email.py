#!/usr/bin/env python
#

import re
from datetime import datetime

import logging
import webapp2

from google.appengine.ext.webapp.mail_handlers import InboundMailHandler

from application.models_share import *

class EmailHandler(InboundMailHandler):

	def receive(self, mail_message):

		logging.info("message from: " + mail_message.sender)

		content_type, text = mail_message.bodies('text/plain').next()
		content_type, html = mail_message.bodies('text/html').next()

		text = text.decode()
		html = html.decode()

		# date format from email is: Thu, 30 May 2013 16:02:30 -0000
		# TODO dropping email date for the time being because datetime has issues %z
		date_obj = datetime.now()

		urls = re.findall('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', text)

		mail = DeconstructedEmail(sender=mail_message.sender, subject=mail_message.subject, body_text=text, body_html=html, date=date_obj, links=urls)
		mail.put()

		for url in urls:
			query = IngredientLink.query( IngredientLink.url == url ).fetch(1)

			if query:
				link = query[0]
				if link.who != mail_message.sender:
					link.votes += 1
					link.put()
			else:
				# create new link and store
				link = IngredientLink(url=url, who=mail_message.sender, date=date_obj, votes=1, flags=0)
				link.put()

app = webapp2.WSGIApplication([EmailHandler.mapping()], debug=True)