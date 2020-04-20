from flask import Blueprint, jsonify, request
from bson.json_util import dumps

from uuid import uuid4
from .extensions import mongo
from datetime import datetime

main = Blueprint('main', __name__)

@main.route('/createquestion', methods=['POST'])
def create_question():
    question_collection = mongo.db.questions

    data = request.get_json()

    uuidGen = uuid4()

    question_collection.insert_one({
        '_question' : data['question'],
        '_options' : data['options'],
        '_date_created': datetime.utcnow(),
        '_uuid': uuidGen
    })

    return jsonify(uuidGen)

@main.route('/questions', methods=['GET'])
def get_questions():
    question_collection = mongo.db.questions

    data = dumps(question_collection.find({}))

    return data