from datetime import datetime
from . import db
from sqlalchemy import Enum
import uuid



class Venue(db.Model):
    __tablename__ = "Venues"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    capacity = db.Column(db.Integer, nullable=False, default=1000)
    equipment_type = db.Column(db.String(255), nullable=True)
    active = db.Column(db.Boolean, default=True)
    blocked_timeslots = db.Column(db.String(255), default="")
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<Venue {self.id}>"

    def get_equipment_types(self):
        return self.equipment_type.split(",") if self.equipment_type else []

    def set_equipment_types(self, equipment_list):
        self.equipment_type = ",".join(equipment_list)
