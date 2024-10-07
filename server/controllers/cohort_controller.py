from flask import jsonify
from models.cohort import Cohort

def get_cohorts():
    try:
        cohorts = Cohort.query.all() 
        cohort_list = [
            {
                'id': cohort.id,
                'name': cohort.name,
                'startDate': cohort.startDate,
                'endDate': cohort.endDate,
                'timestamp': cohort.timestamp
            } for cohort in cohorts
        ]
        return jsonify({'data': cohort_list}), 200  
    except Exception as e:
        return jsonify({'message': str(e)}), 500
