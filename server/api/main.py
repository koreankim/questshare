from flask import Blueprint, jsonify

from .extensions import mongo

main = Blueprint('main', __name__)

@main.route('/')
def index():
    # Remove this test sample later
    test_collection = mongo.db.test
    test_collection.insert({'name' : 'test-user'})
    return jsonify(name='test-user')