from flask import jsonify, request
from models.session import Session
from models.unit import Unit
from models.venue import Venue
from models.unitSession import UnitSession
from models import db
from datetime import datetime
import uuid  

def get_imported_info():
    data = request.json
    invalid_sessions = []

    try:
        # delete_session_data call and getting results
        delete_response, delete_status_code = delete_session_data()
        # When delete fails
        if delete_status_code != 200:
            return delete_response, delete_status_code

        for day_sessions in data:
            if not isinstance(day_sessions, list): 
                continue

            for session_data in day_sessions:  
                if not session_data:  # Dealing with None type
                    continue

                # Check for required fields
                unit_id = session_data.get('unitId')
                venue_id = session_data.get('venueId')
                unit_session_id = session_data.get('unitsessionId')
                session_type = session_data.get('sessionType')
                day_of_week = session_data.get('dayOfWeek')
                start_time = session_data.get('startTime')
                end_time = session_data.get('endTime')

                if not all([unit_id, venue_id, unit_session_id, session_type, day_of_week, start_time, end_time]):
                    invalid_sessions.append({
                        "reason": "Missing required fields",
                        "session": session_data
                    })
                    continue

                unit = Unit.query.filter_by(id=unit_id).first()
                venue = Venue.query.filter_by(id=venue_id).first()
                unitSession = UnitSession.query.filter_by(id=unit_session_id).first()

                if not unit:
                    invalid_sessions.append({
                        "id": str(uuid.uuid4()),
                        "reason": f"Unit ID {unit_id} not found",
                        "session": session_data
                    })
                    continue

                if not venue:
                    invalid_sessions.append({
                        "id": str(uuid.uuid4()),
                        "reason": f"Venue ID {venue_id} not found",
                        "session": session_data
                    })
                    continue

                if not unitSession:
                    invalid_sessions.append({
                        "id": str(uuid.uuid4()),
                        "reason": f"Unit Session ID {unit_session_id} not found",
                        "session": session_data
                    })
                    continue

                try:
                    new_session = Session(
                        unitId=unit.id,
                        venueId=venue.id,
                        unitsessionId=unitSession.id,
                        type=session_type,
                        staffId=session_data.get('staffId', ''),  # staffId is allowed to be empty
                        capacity=session_data.get('capacity', 50),  
                        dayOfTheWeek=day_of_week,
                        startTime=datetime.strptime(start_time, '%H:%M').time(),
                        endTime=datetime.strptime(end_time, '%H:%M').time(),
                    )
                    db.session.add(new_session)
                except Exception as e:
                    invalid_sessions.append({
                        "reason": f"Error creating session: {str(e)}",
                        "session": session_data
                    })
                    continue

        db.session.commit()

        if invalid_sessions:
            return jsonify({
                "message": "Sessions imported with some errors",
                "invalid_sessions": invalid_sessions
            }), 207

        return jsonify({"message": "Sessions imported successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

def delete_session_data():
    try:
        Session.query.delete()
        db.session.commit()
        return jsonify({"message": "Sessions deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
def import_single_session():
    data = request.json
    invalid_session = None
    try:
        # Check for required fields
        unit_id = data.get('unitId')
        venue_id = data.get('venueId')
        unit_session_id = data.get('unitsessionId')
        session_type = data.get('type')
        day_of_week = data.get('dayOfTheWeek')
        start_time = data.get('startTime')
        end_time = data.get('endTime')
        staff_id = data.get('staffId')
        if not all([unit_id, venue_id, unit_session_id, session_type, day_of_week, start_time, end_time]):
            invalid_session = {
                "reason": "Missing required fields",
                "session": data
            }
            return jsonify({"error": "Invalid session data", "details": invalid_session}), 400
        # Check if the related Unit, Venue, and UnitSession exist
        unit = Unit.query.filter_by(id=unit_id).first() 
        venue = Venue.query.filter_by(id=venue_id).first()
        unitSession = UnitSession.query.filter_by(id=unit_session_id).first()
        if not unit:
            invalid_session = {
                "reason": f"Unit ID {unit_id} not found",
                "session": data
            }
            return jsonify({"error": "Invalid session data", "details": invalid_session}), 404
        if not venue:
            invalid_session = {
                "reason": f"Venue ID {venue_id} not found",
                "session": data
            }
            return jsonify({"error": "Invalid session data", "details": invalid_session}), 404
        if not unitSession:
            invalid_session = {
                "reason": f"Unit Session ID {unit_session_id} not found",
                "session": data
            }
            return jsonify({"error": "Invalid session data", "details": invalid_session}), 404
        try:
            # Create new Session object
            new_session = Session(
                unitId=unit.id,
                venueId=venue.id,
                unitsessionId=unitSession.id,
                type=session_type,
                staffId=data.get('staffId', ''),  # staffId can be optional
                capacity=data.get('capacity', 50),  # Default capacity is 50
                dayOfTheWeek=day_of_week,
                startTime=datetime.strptime(start_time, '%H:%M').time(),
                endTime=datetime.strptime(end_time, '%H:%M').time(),
            )
            db.session.add(new_session)
            db.session.commit()
            if new_session.staff:
                staff_name = f"{new_session.staff.firstname} {new_session.staff.lastname}"  
            return jsonify({
            "statusCode": 200,
            "message": "Session successfully added.",
            "data": {
                'id': new_session.id,
                'unitId': new_session.unitId,
                'staffId': new_session.staffId,
                'venuId':new_session.venueId,
                'capacity': new_session.capacity,
                'unitsessionId': new_session.unitsessionId,
                'type': new_session.type,    
                'dayOfTheWeek': new_session.dayOfTheWeek,    
                'startTime': new_session.startTime.strftime('%H:%M:%S'), 
                'endTime': new_session.endTime.strftime('%H:%M:%S'),
                'unitName': new_session.unit.name,
                'venueName':new_session.venue.name,
                'equipment': new_session.unitSession.equipment_type if new_session.unitSession else None,
                'staffName': staff_name 
            }
        }), 200
        except Exception as e:
            db.session.rollback()
            invalid_session = {
                "reason": f"Error creating session: {str(e)}",
                "session": data
            }
            return jsonify({"error": "Error creating session", "details": invalid_session}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500