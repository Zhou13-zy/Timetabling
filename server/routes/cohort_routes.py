from flask import Blueprint
from controllers.cohort_controller import get_cohorts

bp = Blueprint('cohort', __name__, url_prefix='/v1/api')

@bp.route('/cohorts', methods=['GET'])
def cohorts_info_route():
    return get_cohorts()
