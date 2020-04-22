from flask import Blueprint, jsonify, request
from bson.json_util import dumps

from uuid import uuid4, UUID
from .extensions import mongo
from datetime import datetime

main = Blueprint('main', __name__)

UUID_LENGTH = 36

@main.route('/createquestion', methods=['POST'])
def create_question():
    question_collection = mongo.db.questions

    data = request.get_json()

    uuidGen = uuid4()

    question_collection.insert_one({
        '_question' : data['question'],
        '_options' : data['options'],
        '_uuid': uuidGen,
        '_createdAt': datetime.utcnow(),
    })

    return jsonify(uuidGen)

@main.route('/questions', methods=['GET'])
def get_questions():
    question_collection = mongo.db.questions

    data = dumps(question_collection.find({}))

    return data

@main.route('/questions/<uuid>', methods=['GET'])
def get_question(uuid):
    question_collection = mongo.db.questions

    new_uuid = None

    if (len(uuid) >= UUID_LENGTH):
        new_uuid = UUID(uuid)
        
    data = dumps(question_collection.find_one({"_uuid": new_uuid}))

    return jsonify(data)

@main.before_request
def ttl_collection():
    index_name = "_createdAt"
    question_collection = mongo.db.questions
    if index_name not in question_collection.index_information():
        seven_days_in_seconds = 604800
        question_collection.create_index( "_createdAt" , expireAfterSeconds = seven_days_in_seconds)
