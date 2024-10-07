from . import db
from datetime import datetime

class OTPAttempt(db.Model):
    __tablename__ = 'otp_attempts'

    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(255), nullable=False)  # Assuming user email is a string
    send_otp = db.Column(db.String(255), nullable=True)  
    given_otp = db.Column(db.String(255), nullable=True)  
    success = db.Column(db.Integer, nullable=True) 
    status = db.Column(db.String(255), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    ip_address = db.Column(db.String(45))  # Assuming IPv4 or IPv6 address

    def __init__(self, user_email=None, send_otp=None, status=None, success=None, given_otp=None, ip_address=None):
        self.user_email = user_email
        self.send_otp = send_otp
        self.given_otp = given_otp
        self.status = status
        self.success = success
        self.ip_address = ip_address

    def __repr__(self):
        return f'<OTPAttempt {self.id} - User Email: {self.user_email}, Success: {self.success}, Timestamp: {self.timestamp}>'
