#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import json
import urllib
import jinja2
import webapp2
import logging

from google.appengine.ext import blobstore
from google.appengine.api import images
from google.appengine.ext.webapp import blobstore_handlers

jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader('templates'))

class MainHandler(webapp2.RequestHandler):
	def get(self):
		base_url = self.request.path_url

		target_page = 'index.html'
		template_values = {
			'base_url': base_url
		}
		jinja_template = jinja_environment.get_template('index.html')
		self.response.out.write(jinja_template.render(template_values))

class UploadUrlHandler(webapp2.RequestHandler):
	def get(self):
		upload_url = blobstore.create_upload_url('/upload')
		self.response.headers["Content-Type"] = "application/json"
		self.response.out.write(json.dumps({'upload_url': upload_url}))

class UploadHandler(blobstore_handlers.BlobstoreUploadHandler):
	def post(self):
		upload_files = self.get_uploads('file')  # 'file' is file upload field in the form
		blob_info = upload_files[0]
		blob_key = blob_info.key()
		blob_url = images.get_serving_url(blob_key)
		self.response.headers["Content-Type"] = "application/json"
		self.response.out.write(json.dumps({'blob_url': blob_url}))

app = webapp2.WSGIApplication([
	('/', MainHandler),
	('/upload', UploadHandler),
	('/api/upload_url', UploadUrlHandler),
], debug=True)
