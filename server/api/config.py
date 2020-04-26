import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    ENV = "production"
    MONGO_URI='mongodb+srv://admin:questshare1111@questshare-prod-ry5hm.mongodb.net/test?retryWrites=true&w=majority'