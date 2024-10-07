from flask import Blueprint
from controllers import get_cfs, update_cfs, add_cfs
from flask import jsonify

bp = Blueprint('clash_free_set', __name__, url_prefix='/v1/api')

@bp.route('/clash-free-sets', methods=['GET'])
def cfs_info_route():
    return get_cfs()

@bp.route('/cfs/<int:cfs_id>', methods=['PUT'])
def update_cfs_route(cfs_id):
    return update_cfs(cfs_id)

@bp.route('/add_cfs', methods=['POST'])
def add_cfs_route():
    return add_cfs()