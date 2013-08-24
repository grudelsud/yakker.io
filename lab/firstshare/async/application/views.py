#!/usr/bin/env python
#

import os
import json
import jinja2
import webapp2
import logging
import threading

from models_chat import *

from google.appengine.api import channel
from google.appengine.api import users

jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader('templates'))
LOCK = threading.RLock()

class MainHandler(webapp2.RequestHandler):

	def get(self):
		user = users.get_current_user()

		if not user:
			self.redirect(users.create_login_url(self.request.path_url))
			return

		base_url = self.request.path_url

		target_page = 'index.html'
		template_values = {
			'base_url': base_url,
			'api_url': base_url + 'api/'
		}
		template = jinja_environment.get_template(target_page)
		self.response.out.write(template.render(template_values))

class ChannelHandler(webapp2.RequestHandler):

	def create_channel(self, room_key):
		user = users.get_current_user()
		if not (user and room_key):
			# TODO: should discriminate HTTP status codes
			CreateResponse.error(self.response, 'please authenticate first')
		else:

			with LOCK:
				room = Room.get_by_key_name(room_key)
				user_id = user.user_id()

				if not room:
					# New room.
					room = Room(key_name = room_key)
					room.add_user(user_id)

				elif room and room.get_occupancy() == 1:
					# 1 occupant.
					room.add_user(user_id)

				else:
					# 2 occupants (full).
					logging.info('Room ' + room_key + ' is full')
					CreateResponse.error(self.response, 'Room ' + room_key + ' is full, try another hash')
					return

			token = channel.create_channel(room_key + '=' + user_id)
			CreateResponse.success(self.response, token)

	def connect(self):
		token = self.request.get('from')
		room_key, user_id = token.split('=')

		with LOCK:
			room = Room.get_by_key_name(room_key)
			if room and room.has_user(user_id):
				room.set_connected(user_id)

		logging.info(user_id + ' connected to room ' + room_key + ' now with status ' + str(room))

	def disconnect(self):
		token = self.request.get('from')
		room_key, user_id = token.split('=')

		with LOCK:
			room = Room.get_by_key_name(room_key)
			if room and room.has_user(user_id):
				other_user = room.get_other_user(user_id)
				room.remove_user(user_id)
				if other_user and other_user != user:
					channel.send_message(room_key + '=' + other_user, '{"type":"bye"}')

		logging.info(user_id + ' disconnected from room ' + room_key + ' now with status ' + str(room))

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