from flask import Blueprint
from controllers import get_faculties
from flask import jsonify
bp = Blueprint('faculties', __name__, url_prefix='/v1/api')
@bp.route('/faculties', methods=['GET'])
def faculties_info_route():
    return get_faculties()