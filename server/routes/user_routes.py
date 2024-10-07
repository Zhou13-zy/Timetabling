from flask import Blueprint
from flask_jwt_extended import jwt_required 

from controllers import register_user, check_authentication, protected, logout, validate_token, forget_pwd, verifying_otp, change_pwd, check_user, user_info, update_profile, reset_password, reset_password_request ,update_description , upload_avatar 

bp = Blueprint('user', __name__, url_prefix='/v1/api')

@bp.route('/user', methods=['POST'])
def user_registration_route():
    return register_user()

@bp.route('/authentication', methods=['POST'])
def authentication_route():
    return check_authentication()

@bp.route('/protected', methods=['GET'])
@jwt_required()
def protected_route():
    return protected()

@bp.route('/logout', methods=['POST'])
@jwt_required()
def logout_route():
    return logout()

@bp.route('/validate-token', methods=['POST'])
def validate_token_route():
    return validate_token()

@bp.route('/forget-pwd', methods=['POST'])
def forget_pwd_route():
    return forget_pwd()

@bp.route('/verifying-otp', methods=['POST'])
def verifying_otp_route():
    return verifying_otp()

@bp.route('/change-pwd', methods=['POST'])
@jwt_required()
def change_pwd_route():
    return change_pwd()
    
@bp.route('/user-info', methods=['GET'])
@jwt_required()
def user_info_route():
    return user_info()

@bp.route('/update-profile', methods=['PUT'])
@jwt_required()
def update_profile_route():
    return update_profile()

@bp.route('/reset_password/<token>', methods=['GET', 'POST'])
def reset_password_route_route(token):
    return reset_password(token)


@bp.route('/update-description', methods=['PUT'])
@jwt_required()
def update_profile_description():
    return update_description()

@bp.route('/check/user/<email>', methods=['GET'])
def check_user_route(email):
    return check_user(email)


@bp.route('/upload-avatar', methods=['POST'])
@jwt_required()
def upload_avatar_route():
    return upload_avatar()
