from flask import jsonify
from models.user import User
from models.otp_attempt import OTPAttempt
from datetime import datetime, timezone, timedelta
from models import db
import random
import string
from flask import request
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    unset_jwt_cookies,
)
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from itsdangerous import URLSafeTimedSerializer
from sqlalchemy import func
from sqlalchemy.orm.exc import NoResultFound
from werkzeug.utils import secure_filename
import os


def register_user():
    data = request.json
    if not all(
        key in data for key in ("admin", "firstname", "lastname", "email", "password")
    ):
        return jsonify({"message": "Missing required fields"}), 400

    # Check if the email is already registered
    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return jsonify({"message": "Email already exists!"}), 409

    new_user = User(
        admin=data["admin"],
        firstname=data["firstname"],
        lastname=data["lastname"],
        email=data["email"],
        password=data["password"],
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201


def check_authentication():
    data = request.json
    if not all(key in data for key in ("email", "password")):
        return jsonify({"message": "Missing email or password"}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if user and user.check_password(data["password"]):
        # token expires in 1h
        access_token = create_access_token(
            identity=data["email"], expires_delta=timedelta(hours=1)
        )
        user.accessToken = access_token
        user.tokenCreatedAt = datetime.now(timezone.utc)
        db.session.add(user)
        db.session.commit()
        return jsonify({"access_token": access_token, "user_identity": user.email}), 200
    else:
        # Either user not found or incorrect password
        return jsonify({"message": "Invalid email or password"}), 401


def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


def logout():
    current_user = get_jwt_identity()
    response = jsonify({"message": "User logged out successfully"})
    unset_jwt_cookies(response)

    user = User.query.filter_by(email=current_user).first()
    # Check if the token has expired
    if user.accessToken:
        user.accessToken = None
        user.tokenCreatedAt = None
        db.session.commit()

    return response, 201


def validate_token():

    data = request.json
    if not all(key in data for key in ("email", "token")):
        return jsonify({"message": "Missing email or token"}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Check if the token exists in the database
    if not user.accessToken:
        return jsonify({"message": "No token present for user"}), 401

    # Check if the token matches
    if user.accessToken != data["token"]:
        return jsonify({"message": "Invalid token"}), 401

    # Ensure timezone information is included
    if user.tokenCreatedAt and user.tokenCreatedAt.tzinfo is None:
        user.tokenCreatedAt = user.tokenCreatedAt.replace(tzinfo=timezone.utc)

    # Check if the token has expired
    if user.tokenCreatedAt:
        time_elapsed = datetime.now(timezone.utc) - user.tokenCreatedAt
        if time_elapsed > timedelta(hours=1):
            user.accessToken = None
            user.tokenCreatedAt = None
            db.session.commit()
            return jsonify({"message": "Token has expired"}), 401

    # If token is valid and not expired
    return jsonify({"message": "Token is valid"}), 200


def forget_pwd():
    data = request.json
    firstname = data.get("firstname")
    lastname = data.get("lastname")
    user_email = data.get("email")

    # Define the time window for the last 12 hours
    current_time = datetime.utcnow()
    one_hour_ago = current_time - timedelta(hours=12)

    # Query the database to count the number of failed attempts in the last hour
    failed_attempts_count = OTPAttempt.query.filter(
        OTPAttempt.user_email == user_email,
        OTPAttempt.success == 0,
        OTPAttempt.status == "Invalid Request",
        OTPAttempt.timestamp >= one_hour_ago,
    ).count()

    if failed_attempts_count >= 5:
        send_invalid_attempt_email(user_email)
        return (
            jsonify(
                {
                    "error": "You are not allowed to proceed as you failed multiple times. Please wait sometime to proceed."
                }
            ),
            500,
        )

    try:
        # Query the database to find a user with matching first name, last name, and email
        matching_user = User.query.filter(
            func.lower(User.firstname) == func.lower(firstname),
            func.lower(User.lastname) == func.lower(lastname),
            func.lower(User.email) == func.lower(user_email),
        ).one()

        # Email is correct
        otp = generate_otp()
        otp_response = send_otp_email(user_email, otp)

        if otp_response:
            ip_address = request.remote_addr
            create_otp_attempt(user_email, otp, "Not Applicable", "Send", 0, ip_address)
            return jsonify({"message": "OTP sent successfully"}), 201
        else:
            return jsonify({"error": "Failed to send OTP"}), 500

    except NoResultFound:
        # Handle the case where no user with the provided email, first name, and last name exists in the database
        new_attempt = OTPAttempt(
            user_email=user_email,
            success=0,
            status="Invalid Request",
            ip_address=request.remote_addr,
        )
        db.session.add(new_attempt)
        db.session.commit()

        return jsonify({"error": "The email and user name do not match"}), 401


# Function to generate OTP


def generate_otp():
    return "".join(random.choices(string.digits, k=6))


# Function to send OTP via email using SendGrid


def send_otp_email(email, otp):
    message = Mail(
        from_email="classclock24@gmail.com",  # Sender's email address
        to_emails=email,  # Recipient's email address
        subject="Your OTP for Class Clock Password Recovery",  # Email subject
        html_content=f"Your OTP is: {otp}",  # Email body with OTP
    )

    try:
        # Initialize SendGrid client with API key
        sg = SendGridAPIClient(
            "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"
        )
        response = sg.send(message)  # Send the email

        if response.status_code == 202:
            print("OTP sent successfully")
            return True
        else:
            print("Failed to send OTP. Status code:", response.status_code)
            return False
    except Exception as e:
        print("Error sending OTP:", str(e))
        return False


def send_invalid_attempt_email(email):
    message = Mail(
        from_email="classclock24@gmail.com",  # Sender's email address
        to_emails=email,  # Recipient's email address
        subject="Security Alert! Notification of Failed OTP Attempts!",  # Email subject
        html_content=f"""<html>
                            <head></head>
                            <body>
                            <p>Dear User,</p>
                            <p>We would like to inform you that there have been unsuccessful attempts to send One-Time Passwords (OTPs) to the email address associated with your account. If you were the one attempting to send the OTPs, please be advised that access to your account will be temporarily restricted for a duration of twelve hours, commencing from the current time.</p>
                            <p>However, if these attempts were not initiated by you, we kindly request you to reach out to our administrator immediately for further assistance and investigation.</p>
                            <p>Your cooperation in this matter is greatly appreciated.</p>
                            <p>Best regards,<br>Class Clock Team</p>
                            </body>
                            </html>""",
    )

    try:
        # Initialize SendGrid client with API key
        sg = SendGridAPIClient(
            "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"
        )
        response = sg.send(message)  # Send the email

        if response.status_code == 202:
            print("Email sent successfully")
            return True
        else:
            print("Failed to send email. Status code:", response.status_code)
            return False
    except Exception as e:
        print("Error sending OTP:", str(e))
        return False


# Create an entry for OTP attempt


def create_otp_attempt(user_email, send_otp, given_otp, status, success, ip_address):
    otp_attempt = OTPAttempt(
        user_email=user_email,
        send_otp=send_otp,
        given_otp=given_otp,
        success=success,
        status=status,
        ip_address=ip_address,
    )
    db.session.add(otp_attempt)
    db.session.commit()


def verifying_otp():
    data = request.json  # Get JSON data from the request body

    # Get the value of 'email' from the JSON data
    user_email = data.get("email")
    given_otp = data.get("otp")  # Get the value of 'otp' from the JSON data
    ip_address = request.remote_addr

    # Query the database to find the OTPAttempt record for the given email
    otp_attempt = (
        OTPAttempt.query.filter_by(user_email=user_email)
        .filter_by(success=0)
        .filter_by(status="Send")
        .order_by(OTPAttempt.id.desc())
        .first()
    )

    if otp_attempt:
        # If OTPAttempt record is found, compare the given OTP with the stored OTP
        if given_otp == otp_attempt.send_otp:
            create_otp_attempt(user_email, "N/A", given_otp, "Attempted", 1, ip_address)

            token = reset_password_request(user_email)

            return jsonify({"token": token}), 200

        else:
            create_otp_attempt(
                user_email, "N/A", given_otp, "Attempted", -1, ip_address
            )

            # If given OTP does not match the stored OTP, return error message
            return jsonify({"error": "Invalid OTP"}), 400
    else:
        # If no OTPAttempt record is found for the given email, return error message
        return jsonify({"error": "No record found for the given email"}), 404


def change_pwd():
    data = request.get_json()
    current_user = get_jwt_identity()
    old_password = data.get("old_password")
    new_password = data.get("new_password")

    current_user = get_jwt_identity()

    if not current_user or not old_password or not new_password:
        return (
            jsonify(
                {"error": "Missing email, old_password, or new_password parameter"}
            ),
            400,
        )

    user = User.query.filter_by(email=current_user).first()

    if not user:
        return jsonify({"error": "The email does not exist!"}), 401

    if not user.check_password(old_password):
        return jsonify({"error": "The old password does not match our record"}), 401

    user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Password updated successfully"}), 201


def user_info():
    current_user = get_jwt_identity()

    if current_user:
        # User found
        user = User.query.filter_by(email=current_user).first()

        if user:
            # Construct the full avatar URL
            avatar_url = None
            if user.avatar_path:
                avatar_url = f"http://localhost:5005/{user.avatar_path}"  # Modify based on your backend port

            # Return user information as a JSON response
            return (
                jsonify(
                    {
                        "data": {
                            "id": user.id,
                            "email": user.email,
                            "admin": user.admin,
                            "firstname": user.firstname,
                            "lastname": user.lastname,
                            "description": user.description,
                            "avatar_url": avatar_url,  # Return the full URL
                        }
                    }
                ),
                200,
            )
        else:
            # User not found
            return jsonify({"message": "User not found"}), 404
    else:
        # No current user
        return jsonify({"message": "No current user"}), 400


def update_profile():
    current_user = get_jwt_identity()
    if current_user:
        # Retrieve user from the database
        user = User.query.filter_by(email=current_user).first()
        if user:
            # Update user information based on request data
            data = request.json

            if "firstname" in data:
                user.firstname = data["firstname"]
            if "lastname" in data:
                user.lastname = data["lastname"]

            # Commit changes to the database
            db.session.commit()

            # Return updated user information as JSON response
            return (
                jsonify(
                    {
                        "user": {
                            "firstname": user.firstname,
                            "lastname": user.lastname,
                            "email": user.email,
                        }
                    }
                ),
                200,
            )
        else:
            # User not found
            return jsonify({"message": "User not found"}), 404
    else:
        # No current user
        return jsonify({"message": "No current user"}), 400


def reset_password_request(user_email):
    if request.method == "POST":
        email = user_email
        # Generate and send password reset token
        token = URLSafeTimedSerializer("secret-key-token").dumps(
            email, salt="password-reset-salt"
        )

    return token


def reset_password(token):
    try:

        user_email = URLSafeTimedSerializer("secret-key-token").loads(
            token, salt="password-reset-salt", max_age=3600
        )

    except:
        # Invalid or expired token
        return jsonify({"error": "Invalid or expired token"}), 404

    if request.method == "POST":
        data = request.json  # Get JSON data from the request body
        password = data.get("password")

        if not password:
            return jsonify({"error": "You have not provided the password"}), 404

        # Update password in the database
        user = User.query.filter_by(email=user_email).first()

        if not user:
            return jsonify({"error": "The email does not exist!"}), 401

        user.set_password(password)
        db.session.commit()

        return jsonify({"message": "Password updated successfully"}), 201


def update_description():
    current_user = get_jwt_identity()
    if current_user:
        # Retrieve user from the database
        user = User.query.filter_by(email=current_user).first()
        if user:
            data = request.json
            user.description = data.get("description", user.description)
            db.session.commit()

            return (
                jsonify(
                    {
                        "message": "Description updated successfully",
                        "description": user.description,
                    }
                ),
                200,
            )
        else:
            return jsonify({"message": "User not found"}), 404
    else:
        return jsonify({"message": "Authorization required"}), 401


def check_user(email_id):
    user = User.query.filter_by(email=email_id).first()
    if user:
        return jsonify({"message": True}), 200
    else:
        return jsonify({"message": False}), 200


# Define allowed file extensions
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
UPLOAD_FOLDER = "static/avatars/"  # Path to store avatars locally


# Ensure that the uploaded file is of an allowed type
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_avatar():
    current_user_email = get_jwt_identity()

    # Check if the user exists
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Check if a file is included in the request
    if "avatar" not in request.files:
        return jsonify({"message": "No file part"}), 400
    file = request.files["avatar"]

    # If the user hasn't selected a file
    if file.filename == "":
        return jsonify({"message": "No selected file"}), 400

    # Check the file type
    if file and allowed_file(file.filename):
        # Securely process the filename
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        # Ensure the upload directory exists
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)

        file.save(filepath)

        # Update the user's avatar path
        user.avatar_path = filepath
        db.session.commit()

        return (
            jsonify(
                {"message": "Avatar uploaded successfully", "avatar_path": filepath}
            ),
            200,
        )
    else:
        return jsonify({"message": "File type not allowed"}), 400
