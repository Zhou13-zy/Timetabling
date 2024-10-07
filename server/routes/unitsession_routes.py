from flask import Blueprint
from controllers import get_unit_sessions, update_unit_session, create_unit_session
from flask import jsonify
bp = Blueprint('unit_session', __name__, url_prefix='/v1/api')
@bp.route('/unit_sessions', methods=['GET'])
def unit_sessions():
    return get_unit_sessions()


@bp.route('/unit_session/<string:unit_id>', methods=['PUT'])
def update_unit_session_route(unit_id):
    return update_unit_session(unit_id)

@bp.route('/create_unit_session', methods=['POST'])
def unit_session_create():
    return create_unit_session()
