#!/usr/bin/env python

from google.appengine.ext import ndb

class DeconstructedEmail(ndb.Model):
	"""what received from email fetcher, deconstructed and stored"""
	sender = ndb.StringProperty()
	subject = ndb.StringProperty()
	body_text = ndb.TextProperty()
	body_html = ndb.TextProperty()
	date = ndb.DateTimeProperty()
	links = ndb.StringProperty(repeated=True)

class IngredientLink(ndb.Model):
	"""a single link in the dough"""
	url = ndb.StringProperty()
	who = ndb.StringProperty()
	date = ndb.DateTimeProperty()
	votes = ndb.IntegerProperty()
	flags = ndb.IntegerProperty()
	tags = ndb.StringProperty(repeated=True)

