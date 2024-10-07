from datetime import datetime, timezone
from . import db
import bcrypt
import uuid
from sqlalchemy.types import TIMESTAMP

class User(db.Model):
    __tablename__ = 'Users'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    firstname = db.Column(db.String(255), nullable=False)
    lastname = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    admin = db.Column(db.Boolean, default=False)
    accessToken = db.Column(db.String(1024), nullable=True)
    tokenCreatedAt = db.Column(TIMESTAMP(timezone=True), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    description = db.Column(db.String(255))
    avatar_path = db.Column(db.String(255))  

    def __repr__(self):
        return f"<User {self.id}>"

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    def __init__(self, email, firstname, lastname, password, admin, tokenCreatedAt=None, accessToken=None, description=None, avatar_path=None):
        if email is not None:
            self.email = email
        if firstname is not None:
            self.firstname = firstname
        if lastname is not None:
            self.lastname = lastname
        if password is not None:
            self.set_password(password)
        if admin is not None:
            self.admin = admin
        if accessToken is not None:
            self.accessToken = accessToken
        if tokenCreatedAt is not None:
            self.tokenCreatedAt = tokenCreatedAt
        if description is not None:
            self.description = description
        if avatar_path is not None:  
            self.avatar_path = avatar_path

    def set_password(self, password):
        self.password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
