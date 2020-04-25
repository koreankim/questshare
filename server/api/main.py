from flask import Blueprint, jsonify, request
from bson.json_util import dumps

from uuid import uuid4, UUID
from .extensions import mongo
from datetime import datetime, timedelta

main = Blueprint('main', __name__)

UUID_LENGTH = 36
THREE_DAYS_IN_SECONDS = 259200


@main.route('/createquestion', methods=['POST'])
def create_question():
    question_collection = mongo.db.questions

    data = request.get_json()

    options = format_options(data)

    uuidGen = uuid4()

    disableTime = datetime.utcnow() + timedelta(0, 60 *
                                                int(data['disableTime'][0]))

    question_collection.insert_one({
        '_question': data['question'],
        '_options': options,
        '_uuid': uuidGen,
        '_totalVotes': int('0'),
        '_disableTime': disableTime,
        '_securityType': data['securityType'],
        '_voters': [],
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

    new_uuid = uuid_check(uuid)

    data = dumps(question_collection.find_one({"_uuid": new_uuid}))

    return jsonify(data)


@main.route('/questions/submit', methods=['POST'])
def inc_question_option():
    question_collection = mongo.db.questions

    data = request.get_json()

    uuid = data["uuid"]
    choice = data["choice"]
    ip = data["ip"]

    new_uuid = uuid_check(uuid)

    question_collection.update({
        "_uuid": new_uuid, "_options.choice": int(choice)
    }, {
        "$inc": {
            '_options.$.votes': 1,
            '_totalVotes': 1
        },
        "$addToSet": {
            "_voters": ip
        }
    })

    return jsonify("201, done")


@main.before_request
def ttl_collection():
    index_name = "_createdAt"
    question_collection = mongo.db.questions
    if index_name not in question_collection.index_information():
        question_collection.create_index(
            "_createdAt", expireAfterSeconds=THREE_DAYS_IN_SECONDS)


def uuid_check(uuid):
    new_uuid = None

    if (len(uuid) >= UUID_LENGTH):
        new_uuid = UUID(uuid)

    return new_uuid


def format_options(data):
    upd_data = []
    index = 0
    for d in data['options']:
        obj = {"choice": index, "text": d, "votes": 0}
        index += 1
        upd_data.append(obj)
    return upd_data
