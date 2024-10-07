from flask import Blueprint
from controllers import get_units, update_unit,  add_unit
from flask import jsonify

bp = Blueprint('unit', __name__, url_prefix='/v1/api')

@bp.route('/units', methods=['GET'])
def units_info_route():
    return get_units()

@bp.route('/unit/<string:unit_id>', methods=['PUT'])
def update_unit_route(unit_id):
    return update_unit(unit_id)
 
@bp.route('/add_unit', methods=['POST'])
def create_unit():
    return add_unit()