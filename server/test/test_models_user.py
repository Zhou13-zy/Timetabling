import pytest
from models.user import User
from datetime import datetime, timezone
import uuid


test_user_data = {
    
    'firstname': 'Jane',
    'lastname': 'Doe',
    'email': 'jane.doe@example.com',
    'password': 'securepassword',
    'admin': False,   
    'description': 'A regular user'
}

@pytest.fixture
def new_user():
    user = User(
        email=test_user_data['email'],
        firstname=test_user_data['firstname'],
        lastname=test_user_data['lastname'],
        password=test_user_data['password'],
        admin=test_user_data['admin'],
        description=test_user_data['description']
    )
    return user

def test_user_creation(session, new_user):
    session.add(new_user)
    session.commit()
    
    assert new_user.firstname == test_user_data['firstname']
    assert new_user.lastname == test_user_data['lastname']
    assert new_user.email == test_user_data['email']
    assert new_user.admin == test_user_data['admin']
    assert new_user.description == test_user_data['description']
    

def test_password_encryption(new_user):
    
    assert new_user.password != test_user_data['password']
    assert new_user.check_password(test_user_data['password'])

def test_user_repr(new_user):
    expected_repr = f"<User {new_user.id}>"
    assert repr(new_user) == expected_repr
