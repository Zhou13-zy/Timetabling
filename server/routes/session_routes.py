from flask import Blueprint
from controllers import get_session, delete_session, edit_session
from flask import jsonify
bp = Blueprint('session', __name__, url_prefix='/v1/api')
@bp.route('/session', methods=['GET'])
def session_info_route():
    return get_session()
@bp.route('/delete_session/<session_id>', methods=['DELETE'])
def delete_session_info(session_id):
    return delete_session(session_id)
@bp.route('/edit_session/<session_id>', methods=['PUT'])
def edit_single_session(session_id):
    return edit_session(session_id)
