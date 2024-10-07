from flask import Blueprint
from flask_jwt_extended import jwt_required 

from controllers import upload_venue_csv_file, upload_unit_csv_file, upload_cfs_csv_file, upload_faculty_csv_file, upload_cohort_csv_file, upload_unit_session_csv_file, upload_staff_csv_file, upload_discipline_csv_file

bp = Blueprint('csv', __name__, url_prefix='/v1/api')


@bp.route('/upload-unit-csv', methods=['POST'])
def upload_unit_csv_file_route():
    return upload_unit_csv_file()

@bp.route('/upload-venue-csv', methods=['POST'])
def upload_venue_csv_file_route():
    return upload_venue_csv_file()

@bp.route('/upload-cfs-csv', methods=['POST'])
def upload_cfs_csv_file_route():
    return upload_cfs_csv_file()

@bp.route('/upload-faculty-csv', methods=['POST'])
def upload_faculty_csv_file_route():
    return upload_faculty_csv_file()

@bp.route('/upload-cohort-csv', methods=['POST'])
def upload_cohort_csv_file_route():
    return upload_cohort_csv_file()

@bp.route('/upload-staff-csv', methods=['POST'])
def upload_staff_csv_file_route():
    return upload_staff_csv_file()

@bp.route('/upload-discipline-csv', methods=['POST'])
def upload_discipline_csv_file_route():
    return upload_discipline_csv_file()

@bp.route('/upload-unit-session-csv', methods=['POST'])
def upload_unit_session_csv_file_route():
    return upload_unit_session_csv_file()