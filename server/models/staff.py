# models/staff.py
from . import db
from datetime import datetime, timezone
import uuid

class Staff(db.Model):
    __tablename__ = 'Staff'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    firstname = db.Column(db.String(255), nullable=False)
    lastname = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    disciplineId = db.Column(db.String(36), db.ForeignKey('Disciplines.id'), nullable=False)  
    timestamp = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)

    discipline = db.relationship('Discipline', backref=db.backref('staff', lazy=True))

    def __repr__(self):
        return f"<Staff {self.id}>"