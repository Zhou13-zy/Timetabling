from flask import Blueprint
from flask import jsonify

from controllers import delete_session_data, get_imported_info, import_single_session
bp = Blueprint('import', __name__, url_prefix='/v1/api')

@bp.route('session_clear', methods =['DELETE'])
def clear_sessions():
    return delete_session_data()

@bp.route('session_import', methods=['POST'])
def import_sessions():
    return get_imported_info()

@bp.route('single_session_import', methods=['POST'])
def import_session_single():
    return import_single_session()