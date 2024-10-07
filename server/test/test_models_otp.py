import pytest
from models.otp_attempt import OTPAttempt
from datetime import datetime

test_otp_attempt_data = {
    'user_email': 'test.user@example.com',
    'send_otp': '123456',
    'given_otp': '654321',
    'success': 1,
    'status': 'Success',
    'ip_address': '192.168.1.1'
}

@pytest.fixture
def new_otp_attempt():
    return OTPAttempt(
        user_email=test_otp_attempt_data['user_email'],
        send_otp=test_otp_attempt_data['send_otp'],
        given_otp=test_otp_attempt_data['given_otp'],
        success=test_otp_attempt_data['success'],
        status=test_otp_attempt_data['status'],
        ip_address=test_otp_attempt_data['ip_address']
    )

def test_otp_attempt_creation(session, new_otp_attempt):
    session.add(new_otp_attempt)
    session.commit()
    
    assert new_otp_attempt.id is not None
    assert new_otp_attempt.user_email == test_otp_attempt_data['user_email']
    assert new_otp_attempt.send_otp == test_otp_attempt_data['send_otp']
    assert new_otp_attempt.given_otp == test_otp_attempt_data['given_otp']
    assert new_otp_attempt.success == test_otp_attempt_data['success']
    assert new_otp_attempt.status == test_otp_attempt_data['status']
    assert new_otp_attempt.ip_address == test_otp_attempt_data['ip_address']

def test_otp_attempt_repr(new_otp_attempt):
    expected_repr = f'<OTPAttempt {new_otp_attempt.id} - User Email: {new_otp_attempt.user_email}, Success: {new_otp_attempt.success}, Timestamp: {new_otp_attempt.timestamp}>'
    assert repr(new_otp_attempt) == expected_repr
