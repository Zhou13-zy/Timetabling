from flask import jsonify
from models.clash_free_set import Clash_Free_Set
from models import db
from flask import request


def get_cfs():
    sets = Clash_Free_Set.query.all()
    if not sets:
        return jsonify({'message': 'No clash free sets found'}), 404

    cfs_list = []
    for cfs in sets:
        cfs_list.append(
            {'set': cfs.set, 'ref_type': cfs.ref_type, 'id': cfs.id})

    message = "Data retrieved successfully"
    response = {
        'message': message,
        'data': cfs_list
    }
    return jsonify(response), 200

def update_cfs(cfs_id):
    cfs = db.session.get(Clash_Free_Set, cfs_id)
    if not cfs:
        return jsonify({'message': 'cfs not found'}), 404

    data = request.get_json()

    if 'set' in data:
        cfs.set = data['set']

    db.session.commit()
    return jsonify({'message': 'Clash Free Set updated successfully'}), 200

def add_cfs():
    data = request.get_json()

    if 'set' not in data or 'ref_type' not in data:
        return jsonify({'message': 'Missing required fields'}), 400

    try:
        new_cfs = Clash_Free_Set(
            set=data['set'],
            ref_type=data['ref_type'],
            cohortId=data.get('cohortId'),  
            staffId=data.get('staffId')  
        )

        db.session.add(new_cfs)
        db.session.commit()

        return jsonify({'message': 'Clash Free Set added successfully', 'cfs': {
            'id': new_cfs.id,
            'set': new_cfs.set,
            'ref_type': new_cfs.ref_type,
            'cohortId': new_cfs.cohortId,
            'staffId': new_cfs.staffId,
            'timestamp': new_cfs.timestamp
        }}), 201

    except AssertionError as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 400

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500