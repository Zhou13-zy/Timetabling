from . import db
from datetime import datetime
import uuid
from sqlalchemy import Enum
from sqlalchemy.orm import relationship


class Session(db.Model):
    __tablename__ = "Sessions"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    unitId = db.Column(db.String(36), db.ForeignKey("Units.id"), nullable=False)
    staffId = db.Column(db.String(36), db.ForeignKey("Staff.id"), nullable=True)
    venueId = db.Column(db.String(36), db.ForeignKey("Venues.id"), nullable=False)
    unitsessionId = db.Column(db.String(36), db.ForeignKey('Unit_Sessions.id'), nullable=False)
    type = db.Column(Enum("lecture", "tutorial", "lab", "workshop"), nullable=False)
    capacity = db.Column(db.Integer, nullable=False, default=50)
    enrolledCount = db.Column(db.Integer, nullable=False, default=0)
    dayOfTheWeek = db.Column(
        Enum("monday", "tuesday", "wednesday", "thursday", "friday"), nullable=False
    )
    startTime = db.Column(db.Time, nullable=False)
    endTime = db.Column(db.Time, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    venue = relationship("Venue", foreign_keys=[venueId])
    unit = relationship("Unit", foreign_keys=[unitId])
    staff = relationship("Staff", foreign_keys=[staffId])
    unitSession = relationship("UnitSession", foreign_keys=[unitsessionId])

    def get_venue_info(self):
        venue_name = self.venue.name
        venue_capacity = self.venue.capacity
        return venue_name, venue_capacity

    @classmethod
    def get_all_session_venues_capacity(cls):
        session_venues = []
        sessions = cls.query.all()
        for session in sessions:
            venue_name = session.venue.name
            venue_capacity = session.venue.capacity
            session_capacity = session.capacity
            session_venues.append(
                {
                    "id": session.id,
                    "venue name": venue_name,
                    "venue capacity": venue_capacity,
                    "session capacity": session_capacity,
                    "score": round((session_capacity / venue_capacity * 100), 2),
                }
            )
        return session_venues

    def __repr__(self):
        return f"<Session {self.id}>"
