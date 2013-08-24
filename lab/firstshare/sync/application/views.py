#!/usr/bin/env python
#

import os
import re
import json
import jinja2
import webapp2
import logging
import threading

from models.collab import *

from google.appengine.api import channel
from google.appengine.api import users

jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader('templates'))
LOCK = threading.RLock()

def sanitize(key):
	return re.sub('[^a-zA-Z0-9\-]', '-', key)

class MainHandler(webapp2.RequestHandler):

	def get(self):
		user = users.get_current_user()
		room_key = sanitize(self.request.get('r'))

		if not user:
			self.redirect(users.create_login_url(self.request.path_url))
			return

		if room_key:
			with LOCK:
				logging.info('[create_channel] handling request for room ' + room_key)
				avail = True
				room = Room.get_by_key_name(room_key)
				user_id = user.user_id()

				if not room:
					# New room.
					logging.info('[create_channel] creating new room ' + room_key)
					room = Room(key_name = room_key)
					room.add_user(user_id)

				elif room and room.get_occupancy() == 1:
					# 1 occupant.
					logging.info('[create_channel] adding user to existing room ' + room_key)
					room.add_user(user_id)

				else:
					# 2 occupants (full).
					logging.info('[create_channel] room ' + room_key + ' is full')
					avail = False
					token = ''

				if avail:
					channel_id = room_key + '=' + user_id
					token_duration = 30
					token = channel.create_channel(channel_id, token_duration)

		else:
			token = '';

		base_url = self.request.path_url

		target_page = 'index.html'
		template_values = {
			'base_url': base_url,
			'api_url': base_url + 'api/',
			'room_key': room_key,
			'token': token
		}

		template = jinja_environment.get_template(target_page)
		self.response.out.write(template.render(template_values))

class ChannelConnect(webapp2.RequestHandler):

	def post(self):
		token = self.request.get('from')
		room_key, user_id = token.split('=')

		logging.info('[connect] user ' + user_id + ' requests connection to room ' + room_key)

		with LOCK:
			room = Room.get_by_key_name(room_key)
			if room and room.has_user(user_id):
				room.set_connected(user_id)
				logging.info('[connect] ' + user_id + ' connected to room ' + room_key + ' now with status: ' + str(room))

class ChannelDisconnect(webapp2.RequestHandler):

	def post(self):
		token = self.request.get('from')
		room_key, user_id = token.split('=')

		logging.info('[disconnect] ' + user_id + ' disconnected from room ' + room_key)

		with LOCK:
			room = Room.get_by_key_name(room_key)
			if room and room.has_user(user_id):

				other_user = room.get_other_user(user_id)
				room.remove_user(user_id)

				if other_user is not None:
					logging.info('[disconnect] other user ' + other_user + ' will be notified')
				else:
					logging.info('[disconnect] room is empty and will be deleted')

				if other_user and other_user != user:
					logging.info('[disconnect] sending disconnect message, room status: ' + str(room))
					channel.send_message(room_key + '=' + other_user, '{"type":"bye"}')


class CreateResponse(object):

	@staticmethod
	def success(response, message):
		output = json.dumps({'success': {'message': message}})

		response.headers['Content-Type'] = 'application/json'
		response.write(output)

	@staticmethod
	def error(response, message):
		output = json.dumps({'error': {'message': message}})

		response.headers['Content-Type'] = 'application/json'
		response.write(output)