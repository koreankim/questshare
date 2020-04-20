from flask import Blueprint, jsonify, request

from .extensions import mongo
from datetime import datetime

main = Blueprint('main', __name__)

@main.route('/createquestion', methods=['POST'])
def create_question():
    question_collection = mongo.db.questions

    data = request.get_json()

    question_collection.insert_one({
        'question' : data['question'],
        'options' : data['options'],
        'date_created': datetime.now()
    })

    return 'Done', 201

