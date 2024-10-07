from flask import request, jsonify
from models import db
from models.venue import Venue


def get_venues():
    venues = Venue.query.all()
    venue_list = []
    for venue in venues:
        venue_list.append({
            'id': venue.id,
            'location': venue.location,
            'name': venue.name,
            'active': venue.active,
            'equipment_type': venue.equipment_type,
            'blocked_timeslots': venue.blocked_timeslots,
            'capacity': venue.capacity,
            'equipment': venue.equipment_type})

    message = "Data retrieved successfully"
    response = {
        'message': message,
        'data': venue_list
    }
    return jsonify(response), 200


def update_venue(venue_id):
    venue = Venue.query.get(venue_id)
    
    if not venue:
        return jsonify({'message': 'Venue not found'}), 404

    data = request.get_json()
    print("Request data:", data)
    if 'name' in data:
        venue.name = data['name']
    if 'location' in data:
        venue.location = data['location']
    if 'active' in data:
        venue.active = data['active']
    if 'capacity' in data:
        venue.capacity = data['capacity']
    if 'blocked_timeslots' in data:
        venue.blocked_timeslots = data['blocked_timeslots']
    if 'equipment_type' in data:  
        venue.equipment_type = data['equipment_type'] if data['equipment_type'] else None

    try:
        db.session.commit()  
        return jsonify({'message': 'Venue updated successfully'}), 200
    except Exception as e:
        print("Error:", str(e))
        db.session.rollback()
        return jsonify({'message': str(e)}), 500


def add_venue():
    try:
        data = request.get_json()

        if 'name' not in data or 'location' not in data:
            return jsonify({'message': 'Missing required fields'}), 400

        new_venue = Venue(
            name=data.get('name'),
            location=data.get('location'),
            capacity=data.get('capacity', 1000), 
            equipment_type=data.get('equipment_type', None),  
            active=data.get('active', True), 
            blocked_timeslots=data.get('blocked_timeslots', "")  
        )

        db.session.add(new_venue)
        db.session.commit()

        return jsonify({'message': 'Venue added successfully', 'venue': {
            'id': new_venue.id,
            'name': new_venue.name,
            'location': new_venue.location,
            'capacity': new_venue.capacity,
            'equipment_type': new_venue.equipment_type,
            'active': new_venue.active,
            'blocked_timeslots': new_venue.blocked_timeslots,
            'timestamp': new_venue.timestamp
        }}), 201

    except Exception as e:
        print("Error occurred:", str(e))
        db.session.rollback()
        return jsonify({'message': 'Failed to add venue', 'error': str(e)}), 500