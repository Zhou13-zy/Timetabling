from flask import jsonify
from models.staff import Staff
from models.discipline import Discipline
from models import db
from flask import request
import logging
import re


def get_staff():
    staff_with_discipline = db.session.query(Staff).join(Discipline).all()
    
    if not staff_with_discipline:
        return jsonify({'message': 'No staff found'}), 404

    staff_list = []
    for staff in staff_with_discipline:
        staff_list.append({
            'id': staff.id,
            'firstname': staff.firstname,
            'lastname': staff.lastname,
            'email': staff.email,
            'discipline': staff.discipline.name 
        })

    message = "Data retrieved successfully"
    response = {
        'message': message,
        'data': staff_list
    }
    return jsonify(response), 200

def add_staff():
    try:
        data = request.get_json()

        firstname = data.get('firstname')
        lastname = data.get('lastname')
        email = data.get('email')
        disciplineId = data.get('disciplineId')

        if not firstname or not lastname or not email or not disciplineId:
            return jsonify({
                "statusCode": 400,
                "message": "Please provide all required fields (firstname, lastname, email, discipline)."
            }), 400

        discipline = Discipline.query.filter_by(id=disciplineId).first()
        if not discipline:
            return jsonify({
                "statusCode": 404,
                "message": "Discipline not found."
            }), 404

        # if this is already existed
        existing_staff = Staff.query.filter_by(email=email).first()
        if existing_staff:
            return jsonify({
                "statusCode": 409,
                "message": "Staff with this email already exists."
            }), 409

        new_staff = Staff(firstname=firstname, lastname=lastname, email=email, disciplineId=discipline.id)

        db.session.add(new_staff)
        db.session.commit()

        return jsonify({
            "statusCode": 201,
            "message": "Staff successfully added.",
            "data": {
                "id": new_staff.id,
                "firstname": new_staff.firstname,
                "lastname": new_staff.lastname,
                "email": new_staff.email,
                "discipline": discipline.name
            }
        }), 201

    except Exception as e:
        db.session.rollback() 
        return jsonify({
            "statusCode": 500,
            "message": "An error occurred while adding the staff.",
            "error": str(e)
        }), 500
        
        
def update_staff(staff_id):
    try:
        data = request.get_json()

        firstname = data.get('firstname')
        lastname = data.get('lastname')
        email = data.get('email')
        discipline_id = data.get('disciplineId')

        if not firstname or not lastname or not email or not discipline_id:
            return jsonify({
                "statusCode": 400,
                "message": "Please provide all required fields (firstname, lastname, email, discipline)."
            }), 400

        # email
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(email_regex, email):
            return jsonify({
                "statusCode": 400,
                "message": "Invalid email format."
            }), 400

        staff = Staff.query.get(staff_id)
        if not staff:
            return jsonify({"statusCode": 404, "message": "Staff not found"}), 404

        discipline = Discipline.query.get(discipline_id)
        if not discipline:
            return jsonify({"statusCode": 404, "message": "Discipline not found"}), 404

        staff.firstname = firstname
        staff.lastname = lastname
        staff.email = email
        staff.discipline_id = discipline_id

        db.session.commit()

        return jsonify({
            "statusCode": 200,
            "message": "Staff updated successfully",
            "data": {
                "id": staff.id,
                "firstname": staff.firstname,
                "lastname": staff.lastname,
                "email": staff.email,
                "discipline": discipline.name,
            }
        }), 200

    except Exception as e:
        db.session.rollback()
        
        return jsonify({"statusCode": 500, "message": "An internal server error occurred"}), 500