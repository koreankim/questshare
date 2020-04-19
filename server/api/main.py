from flask import Blueprint, jsonify, request

from .extensions import mongo

main = Blueprint('main', __name__)

@main.route('/createquestion', methods=['POST'])
def create_question():
    question_collection = mongo.db.questions

    data = request.get_json()

    question_collection.insert({
        'question' : data['title'],
        'options' : data['options']
    })

    return 'Done', 201