from flask import jsonify
from models.unitSession import UnitSession
from models import db
from flask import request
def get_unit_sessions():
    try:
        unit_sessions = UnitSession.query.all()
        if not unit_sessions:
            return jsonify({"message": "No unit sessions found"}), 404
        unit_sessions_list = []
        for unit_session in unit_sessions:
            unit_sessions_list.append({
                'id': unit_session.id,
                'unit_id': unit_session.unit_id,
                'unit_code': unit_session.unit.unitCode,
                'session_type': unit_session.session_type,
                'duration_hours': unit_session.duration_hours,
                'capacity': unit_session.capacity,
                'equipment_type': unit_session.get_equipment_types(),
                'timestamp': unit_session.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            })
        return jsonify({
            'message': 'Unit sessions retrieved successfully',
            'data': unit_sessions_list
        }), 200
    except Exception as e:
        return jsonify({
            'message': 'Error retrieving unit sessions',
            'error': str(e)
        }), 500
        
def update_unit_session(unit_session_id):
    try:
        # Retrieve the existing UnitSession by ID
        unit_session = UnitSession.query.get(unit_session_id)
        if not unit_session:
            return jsonify({"message": "Unit session not found"}), 404

        # Get the data from the request body
        data = request.get_json()

        # Update the UnitSession fields (only if provided in the request)
        unit_session.unit_id = data.get('unit_id', unit_session.unit_id)
        unit_session.session_type = data.get('session_type', unit_session.session_type)
        unit_session.duration_hours = data.get('duration_hours', unit_session.duration_hours)
        unit_session.capacity = data.get('capacity', unit_session.capacity)
        unit_session.equipment_type = data.get('equipment_type', unit_session.equipment_type)

        # Commit the changes to the database
        db.session.commit()

        return jsonify({
            "message": "Unit session updated successfully",
            "data": {
                'id': unit_session.id,
                'unit_id': unit_session.unit_id,
                'session_type': unit_session.session_type,
                'duration_hours': unit_session.duration_hours,
                'capacity': unit_session.capacity,
                'equipment_type': unit_session.equipment_type,
                'timestamp': unit_session.timestamp.strftime('%Y-%m-%d %H:%M:%S')
            }
        }), 200

    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        return jsonify({
            "message": "Error updating unit session",
            "error": str(e)
        }), 500
        
def create_unit_session():
    try:
        data = request.json
        new_session = UnitSession(
            duration_hours=data['duration_hours'],
            capacity=data['capacity'],
            equipment_type=data['equipment_type'],
            unit_id=data['unit_id'],
            session_type=data['session_type'] 
        )
        db.session.add(new_session)
        db.session.commit()
        return jsonify({
            "message": "Unit session created successfully",
            "data": {
                "id": new_session.id,
                "duration_hours": new_session.duration_hours,
                "capacity": new_session.capacity,
                "equipment_type": new_session.equipment_type,
                "unit_id": new_session.unit_id,
                "session_type": new_session.session_type,
            }
        }), 201
    except Exception as e:
        return jsonify({"message": "Failed to create unit session", "error": str(e)}), 400
