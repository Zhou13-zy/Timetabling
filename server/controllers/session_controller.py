from flask import jsonify
from models.session import Session
from models import db
from flask import request
def get_session():
    sessions = Session.query.all()
    sessions_list = []
    for session in sessions:
        staff_name = None
        if session.staff:
            staff_name = f"{session.staff.firstname} {session.staff.lastname}"  
        sessions_list.append({
            'id': session.id,
            'unitId': session.unitId,
            'staffId': session.staffId,
            'venuId':session.venueId,
            'capacity': session.capacity,
            'unitsessionId': session.unitsessionId,
            'type': session.type,    
            'dayOfTheWeek': session.dayOfTheWeek,    
            'startTime': session.startTime.strftime('%H:%M:%S'), 
            'endTime': session.endTime.strftime('%H:%M:%S'),
            'unitName': session.unit.name,
            'venueName':session.venue.name,
            'equipment': session.unitSession.equipment_type if session.unitSession else None,
            'staffName': staff_name 
            
            })
    message = "Data retrieved successfully"
    response = {
        'message': message,
        'data': sessions_list
    }
    return jsonify(response), 200
def delete_session(session_id):
    try:
        session = Session.query.get(session_id)
        
        if not session:
            return jsonify({"statusCode": 404, "message": "Session not found"}), 404
        db.session.delete(session)
        db.session.commit()
        return jsonify({"statusCode": 200, "message": "Session deleted successfully", "sessionId": session_id}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": str(e)}), 500
    
def edit_session(session_id):
    try:
    
        data = request.json
        
      
        session = Session.query.get(session_id)
        
        if not session:
            return jsonify({"statusCode": 404, "message": "Session not found"}), 404
        
        session.unitId = data.get('unitId', session.unitId)
        session.staffId = data.get('staffId', session.staffId)
        session.venueId = data.get('venueId', session.venueId)
        session.capacity = data.get('capacity', session.capacity)
        session.unitsessionId = data.get('unitsessionId', session.unitsessionId)
        session.type = data.get('type', session.type)
        session.dayOfTheWeek = data.get('dayOfTheWeek', session.dayOfTheWeek)
        session.startTime = data.get('startTime', session.startTime)
        session.endTime = data.get('endTime', session.endTime)
        
        
        db.session.commit()
      
        updated_session = {
            'id': session.id,
            'unitId': session.unitId,
            'staffId': session.staffId,
            'venueId': session.venueId,
            'capacity': session.capacity,
            'unitsessionId': session.unitsessionId,
            'type': session.type,
            'dayOfTheWeek': session.dayOfTheWeek,
            'startTime': session.startTime.strftime('%H:%M:%S'),
            'endTime': session.endTime.strftime('%H:%M:%S'),
            'unitName': session.unit.name,
            'venueName': session.venue.name,
            'equipment': session.unitSession.equipment_type if session.unitSession else None,
            'staffName': f"{session.staff.firstname} {session.staff.lastname}" if session.staff else None
        }
        
      
        return jsonify({
            "statusCode": 200,
            "message": "Session updated successfully",
            "data": updated_session
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"statusCode": 500, "message": str(e)}), 500