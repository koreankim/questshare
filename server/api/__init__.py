from flask import Flask
from flask_cors import CORS

from .extensions import mongo
from .main import main

def create_app(config_object='api.settings'):
    app = Flask(__name__)
    
    app.config.from_object(config_object)
    CORS(app)

    mongo.init_app(app)

    app.register_blueprint(main)

    return app




