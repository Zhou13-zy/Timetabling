from flask_jwt_extended import create_access_token
from models.user import User
from models.otp_attempt import OTPAttempt
import pytest
from app import db

def user_exists(client, email):
    response = client.get(f'/v1/api/check/user/{email}')
    if response.status_code == 200:
        return response.get_json().get('message')
    return None

def test_register_user(client):
    email = 'john@example.com'
    if not user_exists(client, email):
        response = client.post('/v1/api/user', json={
            'admin': True,
            'firstname': 'John',
            'lastname': 'Doe',
            'email': email,
            'password': 'password123'
        })
        assert response.status_code == 201
        assert response.get_json()['message'] == 'User created successfully'

def test_check_authentication(client):
    email = 'john@example.com'
    if not user_exists(client, email):
        client.post('/v1/api/user', json={
            'admin': True,
            'firstname': 'John',
            'lastname': 'Doe',
            'email': email,
            'password': 'password123'
        })

        response = client.post('/v1/api/authentication', json={
            'email': email,
            'password': 'password123'
        })
        assert response.status_code == 200
        assert 'access_token' in response.get_json()

def test_protected_route(client):
    email = 'john@example.com'
    if not user_exists(client, email):
        client.post('/v1/api/user', json={
            'admin': True,
            'firstname': 'John',
            'lastname': 'Doe',
            'email': email,
            'password': 'password123'
        })

        auth_response = client.post('/v1/api/authentication', json={
            'email': email,
            'password': 'password123'
        })
        assert auth_response.status_code == 200
        data = auth_response.get_json()
        assert 'access_token' in data
        token = data['access_token']
        
        response = client.get('/v1/api/protected', headers={'Authorization': f'Bearer {token}'})
        assert response.status_code == 200
        assert response.get_json()['logged_in_as'] == email

def test_logout_route(client):
    email = 'john@example.com'
    if not user_exists(client, email):
        client.post('/v1/api/user', json={
            'admin': True,
            'firstname': 'John',
            'lastname': 'Doe',
            'email': email,
            'password': 'password123'
        })

        auth_response = client.post('/v1/api/authentication', json={
            'email': email,
            'password': 'password123'
        })
        assert auth_response.status_code == 200
        data = auth_response.get_json()
        assert 'access_token' in data
        token = data['access_token']
        
        response = client.post('/v1/api/logout', headers={'Authorization': f'Bearer {token}'})
        assert response.status_code == 201
        assert response.get_json()['message'] == 'User logged out successfully'

def test_validate_token(client):
    email = 'john@example.com'
    if not user_exists(client, email):
        client.post('/v1/api/user', json={
            'admin': True,
            'firstname': 'John',
            'lastname': 'Doe',
            'email': email,
            'password': 'password123'
        })

        auth_response = client.post('/v1/api/authentication', json={
            'email': email,
            'password': 'password123'
        })
        assert auth_response.status_code == 200
        data = auth_response.get_json()
        assert 'access_token' in data
        token = data['access_token']
        
        response = client.post('/v1/api/validate-token', json={
            'email': email,
            'token': token
        })
        assert response.status_code == 200
        assert response.get_json()['message'] == 'Token is valid'

def test_forget_pwd(client):
    email = 'john@example.com'
    if not user_exists(client, email):
        client.post('/v1/api/user', json={
            'admin': True,
            'firstname': 'John',
            'lastname': 'Doe',
            'email': email,
            'password': 'password123'
        })

        response = client.post('/v1/api/forget-pwd', json={
            'firstname': 'John',
            'lastname': 'Doe',
            'email': email
        })
        assert response.status_code == 201
        assert response.get_json()['message'] == 'OTP sent successfully'

def test_verifying_otp(client):
    email = 'john@example.com'
    if not user_exists(client, email):
        client.post('/v1/api/user', json={
            'admin': True,
            'firstname': 'John',
            'lastname': 'Doe',
            'email': email,
            'password': 'password123'
        })

        response = client.post('/v1/api/verifying-otp', json={
            'email': email,
            'otp': '123456'  
        })
        if response.status_code == 200:
            assert 'token' in response.get_json()
        else:
            assert response.status_code in [404, 400]

def test_change_pwd(client):
    email = 'john@example.com'
    if not user_exists(client, email):
        client.post('/v1/api/user', json={
            'admin': True,
            'firstname': 'John',
            'lastname': 'Doe',
            'email': email,
            'password': 'password123'
        })

        auth_response = client.post('/v1/api/authentication', json={
            'email': email,
            'password': 'password123'
        })
        assert auth_response.status_code == 200
        data = auth_response.get_json()
        assert 'access_token' in data
        token = data['access_token']
        
        response = client.post('/v1/api/change-pwd', json={
            'old_password': 'password123',
            'new_password': 'newpassword456'
        }, headers={'Authorization': f'Bearer {token}'})
        assert response.status_code == 201
        assert response.get_json()['message'] == 'Password updated successfully'

def test_user_info(client):
    email = 'john1@example.com'
    if not user_exists(client, email):
        client.post('/v1/api/user', json={
            'admin': True,
            'firstname': 'John1',
            'lastname': 'Doe1',
            'email': email,
            'password': 'password123'
        })

        auth_response = client.post('/v1/api/authentication', json={
            'email': email,
            'password': 'password123'
        })
        assert auth_response.status_code == 200
        data = auth_response.get_json()
        assert 'access_token' in data
        token = data['access_token']
        
        response = client.get('/v1/api/user-info', headers={'Authorization': f'Bearer {token}'})
        assert response.status_code == 200
        assert response.get_json()['data']['email'] == email

def test_update_profile(client):
    email = 'john2@example.com'
    if not user_exists(client, email):
        client.post('/v1/api/user', json={
            'admin': True,
            'firstname': 'John2',
            'lastname': 'Doe2',
            'email': email,
            'password': 'password123'
        })

        auth_response = client.post('/v1/api/authentication', json={
            'email': email,
            'password': 'password123'
        })
        assert auth_response.status_code == 200
        data = auth_response.get_json()
        assert 'access_token' in data
        token = data['access_token']
        
        response = client.put('/v1/api/update-profile', json={
            'firstname': 'John2 Updated',
            'lastname': 'Doe2 Updated'
        }, headers={'Authorization': f'Bearer {token}'})
        assert response.status_code == 200
    
