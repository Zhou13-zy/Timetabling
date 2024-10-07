from flask import jsonify
from models.faculty import Faculty
from models import db
from flask import request
def get_faculties():
    faculties = Faculty.query.all()
    if not faculties:
        return jsonify({'message': 'No faculty found'}), 404
    faculties_list = []
    for faculty in faculties:
        faculties_list.append(
            {'id': faculty.id, 'name': faculty.name})
    message = "Data retrieved successfully"
    response = {
        'message': message,
        'data': faculties_list
    }
    return jsonify(response), 200