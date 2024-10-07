from . import db
from datetime import datetime
import uuid
class Unit(db.Model):
    __tablename__ = 'Units'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    unitCode = db.Column(db.String(50), nullable=False, unique=True)
    name = db.Column(db.String(255), nullable=False)
    credit = db.Column(db.Integer, nullable=False, default=25)
    quota = db.Column(db.Integer, nullable=False, default=100)
    disciplineId = db.Column(db.String(36), db.ForeignKey('Disciplines.id'), nullable=False)  
    staffId = db.Column(db.String(36), db.ForeignKey('Staff.id'), nullable=False)  
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=True)

    # Relationship to UnitSessions
    unit_sessions = db.relationship('UnitSession', backref='unit', lazy=True)

    def __repr__(self):
        return f"<Unit {self.id}>"
