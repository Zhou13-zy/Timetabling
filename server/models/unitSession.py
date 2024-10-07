from . import db
from datetime import datetime
from sqlalchemy import Enum
import uuid

class UnitSession(db.Model):
    __tablename__ = "Unit_Sessions"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    unit_id = db.Column(db.String(36), db.ForeignKey("Units.id"), nullable=False)
    session_type = db.Column(
        Enum("lecture", "tutorial", "lab", "workshop"), nullable=False
    )
    duration_hours = db.Column(db.Integer, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    equipment_type = db.Column(db.String(255), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<UnitSession {self.id}>"
        
    def get_equipment_types(self):
        # Safely return a list, handling None or empty strings
        return self.equipment_type.split(",") if isinstance(self.equipment_type, str) and self.equipment_type else []

    def set_equipment_types(self, equipment_list):
        # Safely handle if equipment_list is None or not a list, and ensure it's a list of strings
        if equipment_list and isinstance(equipment_list, (list, tuple)):
            self.equipment_type = ",".join(map(str, equipment_list))
        else:
            self.equipment_type = ""

