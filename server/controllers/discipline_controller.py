from flask import jsonify
from models.discipline import Discipline
from models import db
from flask import request
from models.staff import Staff


def get_disciplines():
    disciplines = Discipline.query.all()
    if not disciplines:
        return jsonify({'message': 'No disciplines found'}), 404

    disciplines_list = []
    for discipline in disciplines:
        disciplines_list.append(
            {'id': discipline.id, 'name': discipline.name,'facultyId': discipline.facultyId})

    message = "Data retrieved successfully"
    response = {
        'message': message,
        'data': disciplines_list
    }
    return jsonify(response), 200


def add_discipline():
    data = request.get_json()
    if not data or 'name' not in data or 'facultyId' not in data:
        return jsonify({'message': 'Name and facultyId are required.'}), 400
    discipline_name = data['name']
    faculty_id = data['facultyId']
    
    new_discipline = Discipline(
        name=discipline_name,
        facultyId=faculty_id
    )
    try:
        db.session.add(new_discipline)
        db.session.commit()
        return jsonify({'message': 'Discipline added successfully', 'data': {
            'id': new_discipline.id,
            'name': new_discipline.name,
            'facultyId': new_discipline.facultyId
        }}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error adding discipline', 'error': str(e)}), 500
    
    
def update_discipline_data(discipline_id):
    data = request.get_json()
    if not data or 'name' not in data or 'facultyId' not in data:
        return jsonify({'message': 'Name and facultyId are required.'}), 400
    discipline = Discipline.query.get(discipline_id)
    if not discipline:
        return jsonify({'message': 'Discipline not found'}), 404
    discipline.name = data['name']
    discipline.facultyId = data['facultyId']
    try:
        db.session.commit()
        return jsonify({
            'message': 'Discipline updated successfully',
            'data': {
                'id': discipline.id,
                'name': discipline.name,
                'facultyId': discipline.facultyId
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Error updating discipline', 'error': str(e)}), 500
