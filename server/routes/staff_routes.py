from flask import Blueprint
from controllers import get_staff,add_staff,update_staff
from flask import jsonify

bp = Blueprint('staff', __name__, url_prefix='/v1/api')

@bp.route('/staff', methods=['GET'])
def staff_info_route():
    return get_staff()

@bp.route('/add_staff', methods=['POST'])
def add_new_staff():
    return add_staff()

@bp.route('/update_staff/<staff_id>', methods=['PUT'])
def update_staff_info(staff_id):
    return update_staff(staff_id)