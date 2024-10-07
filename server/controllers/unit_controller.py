from flask import jsonify
from models.unit import Unit
from models import db
from flask import request
import uuid

def get_units():
    units = Unit.query.all()  # Fetch all units
    if not units:
        return jsonify({'message': 'No units found'}), 404

    unit_list = []
    for unit in units:
        sessions = []
        for session in unit.unit_sessions:
            sessions.append({
                'type': session.session_type,
                'duration_hours': session.duration_hours,
                'capacity': session.capacity,
            })

        unit_list.append({
            'id': unit.id,
            'code': unit.unitCode,
            'title': unit.name,
            'credit': unit.credit,
            'quota': unit.quota,
            'sessions': sessions  
        })

    message = "Data retrieved successfully"
    response = {
        'message': message,
        'data': unit_list
    }
    return jsonify(response), 200

def update_unit(unit_id):
    unit = Unit.query.get(unit_id)
    if not unit:
        return jsonify({'message': 'Unit not found'}), 404

    data = request.get_json()

    if 'name' in data:
        unit.name = data['name']
    if 'quota' in data:
        unit.quota = data['quota']
    if 'credit' in data:
        unit.credit = data['credit']
    if 'code' in data:
        unit.unitCode = data['code']

    try:
        db.session.commit()
        return jsonify({'message': 'Unit updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error updating unit: {str(e)}'}), 500

def add_unit():
    data = request.get_json()
    required_fields = ['unitCode', 'name', 'credit', 'quota', 'disciplineId', 'staffId']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'{field} is required'}), 400
    try:
        new_unit = Unit(
            id=str(uuid.uuid4()),
            unitCode=data['unitCode'],
            name=data['name'],
            credit=data['credit'],
            quota=data['quota'],
            disciplineId=data['disciplineId'],
            staffId=data['staffId']
        )
        db.session.add(new_unit)
        db.session.commit()
        return jsonify({'message': 'Unit added successfully', 'unit': {
            'id': new_unit.id,
            'unitCode': new_unit.unitCode,
            'name': new_unit.name,
            'credit': new_unit.credit,
            'quota': new_unit.quota,
            'disciplineId': new_unit.disciplineId,
            'staffId': new_unit.staffId,
        }}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error adding unit: {str(e)}'}), 500