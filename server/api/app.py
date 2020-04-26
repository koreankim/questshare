import os
from flask import jsonify, request, Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson.json_util import dumps
from api.config import Config
from uuid import uuid4, UUID
from datetime import datetime, timedelta

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

mongo = PyMongo()
mongo.init_app(app)

UUID_LENGTH = 36
ONE_DAY_IN_SECONDS = 86400


@app.route('/createquestion', methods=['POST'])
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
        '_recaptcha': data['recaptcha'],
        '_voters': [],
        '_createdAt': datetime.utcnow(),
    })

    return jsonify(uuidGen)


@app.route('/questions', methods=['GET'])
def get_questions():
    question_collection = mongo.db.questions

    data = dumps(question_collection.find({}))

    return data


@app.route('/questions/<uuid>', methods=['GET'])
def get_question(uuid):
    question_collection = mongo.db.questions

    new_uuid = uuid_check(uuid)

    data = dumps(question_collection.find_one({"_uuid": new_uuid}))

    return jsonify(data)


@app.route('/questions/submit', methods=['POST'])
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


@app.before_request
def ttl_collection():
    index_name = "_createdAt"
    question_collection = mongo.db.questions
    if index_name not in question_collection.index_information():
        question_collection.create_index(
            "_createdAt", expireAfterSeconds=ONE_DAY_IN_SECONDS)


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
