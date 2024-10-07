from . import db
from datetime import datetime
from sqlalchemy import Enum
from sqlalchemy.orm import validates

class Clash_Free_Set(db.Model):
    __tablename__ = 'Clash_Free_Sets'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    set = db.Column(db.String(255), nullable=False)
    ref_type = db.Column(Enum('cohort', 'staff'), nullable=False)
    cohortId = db.Column(db.String(36), db.ForeignKey('Cohorts.id'), nullable=True)  
    staffId = db.Column(db.String(36), db.ForeignKey('Staff.id'), nullable=True)  
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    @validates('ref_type', 'cohortId', 'staffId')
    def validate_ref_type(self, key, value):
        if key == 'ref_type':
            if value == 'cohort' and self.staffId is not None:
                raise AssertionError('staffId must be NULL when ref_type is "cohort"')
            if value == 'staff' and self.cohortId is not None:
                raise AssertionError('cohortId must be NULL when ref_type is "staff"')
        if key == 'cohortId' and value is not None and self.ref_type != 'cohort':
            raise AssertionError('ref_type must be "cohort" when cohortId is set')
        if key == 'staffId' and value is not None and self.ref_type != 'staff':
            raise AssertionError('ref_type must be "staff" when staffId is set')
        return value

    def __repr__(self):
        return f"<Clash_Free_Set {self.id}>"