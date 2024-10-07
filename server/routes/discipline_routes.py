from flask import Blueprint
from controllers import get_disciplines, add_discipline, update_discipline_data
from flask import jsonify

bp = Blueprint('disciplines', __name__, url_prefix='/v1/api')

@bp.route('/disciplines', methods=['GET'])
def disciplines_info_route():
    return get_disciplines()


@bp.route('/add_discipline', methods=['POST'])
def add_discipline_table():
    return add_discipline()
@bp.route('/edit_discipline/<discipline_id>', methods=['PUT'])
def edit_discipline(discipline_id):
    return update_discipline_data(discipline_id);