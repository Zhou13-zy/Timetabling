import uuid
from . import db
from datetime import datetime

class Discipline(db.Model):
    __tablename__ = 'Disciplines'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255), nullable=False)
    facultyId = db.Column(db.String(36), db.ForeignKey('Faculties.id'), nullable=False)  
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<Discipline {self.id}>"
