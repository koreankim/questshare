import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    ENV = "production"
    MONGO_URI=os.environ['MONGO_URI']