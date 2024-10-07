from flask import Blueprint
from controllers import insert_small_data, insert_input_from_user, generate_backtrack_with_brute_force, fetch_timetable, fetch_timetable_ga, calculate_goodness_score, generate_ga

bp = Blueprint('main', __name__, url_prefix='/v1/api')

@bp.route('/generate-brute-force', methods=['POST'])
def generate_route():
    return generate_backtrack_with_brute_force()

@bp.route('/fetch-timetable', methods=['GET'])
def fetch_timetable_route():
    return fetch_timetable()

@bp.route('/calculate-goodness-score', methods=['POST'])
def calculate_goodness_score_route():
    return calculate_goodness_score()

@bp.route('/generate-with-ga', methods=['POST'])
def generate_ga_route():
    return generate_ga()

@bp.route('/fetch-timetable-ga', methods=['GET'])
def fetch_timetable_ga_route():
    return fetch_timetable_ga()

@bp.route('/insert-small-data', methods=['POST'])
def insert_small_data_route():
    return insert_small_data()    

@bp.route('/insert-stress-data', methods=['POST'])
def insert_stress_data_route():
    return insert_input_from_user() 