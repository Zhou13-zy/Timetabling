from flask import request, jsonify
import pandas as pd
from models import db
from models.unit import Unit
from models.venue import Venue
from models.staff import Staff
from models.faculty import Faculty
from models.discipline import Discipline
from models.cohort import Cohort
from models.session import Session
from models.clash_free_set import Clash_Free_Set
from models.unitSession import UnitSession
from sqlalchemy import func
from datetime import datetime, time
import math

def upload_discipline_csv_file():
    # Check if the request contains a file
    if 'discipline_csv' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    csv_file = request.files['discipline_csv']
    expected_columns = ["Name", "Faculty"]

    # Check if the file is a CSV file
    if csv_file and csv_file.filename.endswith('.csv'):
        try:
            # Read the CSV data using pandas
            df = pd.read_csv(csv_file)

            # Check for missing columns in the DataFrame
            missing_columns = [column for column in expected_columns if column not in df.columns]
            if missing_columns:
                return jsonify({'error': f"Missing columns: {', '.join(missing_columns)}"}), 400
            
            # Handling NaN values 
            df.fillna('', inplace=True) 
             
            if df.duplicated(subset=['Name', 'Faculty']).any():
                return jsonify({'error': 'CSV file contains duplicated rows'}), 400

            # Process each row in the DataFrame
            for _, row in df.iterrows():

                faculty = Faculty.query.filter_by(
                    name=row['Faculty']).first()
                if not faculty:
                    # Handle the case where discipline is not found
                    print(f"Faculty {row['Faculty']} not found.")
                    continue  # Skip this record

                discipline = Discipline.query.filter_by(name=row['Name']).first()
                if discipline:
                    discipline.facultyId = faculty.id
                else:
                    discipline = Discipline(
                        name = row['Name'],
                        facultyId = faculty.id
                    )
                    db.session.add(discipline)

            db.session.commit()
            return jsonify({'success': True, 'message': 'Data inserted successfully'}), 200

        except Exception as e:
            return jsonify({'error': 'Failed to process CSV file', 'details': str(e)}), 500
    else:
        return jsonify({'error': 'File is not a CSV'}), 400

def upload_staff_csv_file():
    # Check if the request contains a file
    if 'staff_csv' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    csv_file = request.files['staff_csv']
    expected_columns = ["FirstName", "LastName", "email", "Discipline"]

    # Check if the file is a CSV file
    if csv_file and csv_file.filename.endswith('.csv'):
        try:
            # Read the CSV data using pandas
            df = pd.read_csv(csv_file)

            # Check for missing columns in the DataFrame
            missing_columns = [column for column in expected_columns if column not in df.columns]
            if missing_columns:
                return jsonify({'error': f"Missing columns: {', '.join(missing_columns)}"}), 400
            
            # Handling NaN values 
            df.fillna('', inplace=True) 
             
            if df.duplicated(subset=['FirstName', 'LastName', 'email', "Discipline"]).any():
                return jsonify({'error': 'CSV file contains duplicated rows'}), 400

            # Process each row in the DataFrame
            for _, row in df.iterrows():

                discipline = Discipline.query.filter_by(
                    name=row['Discipline']).first()
                if not discipline:
                    # Handle the case where discipline is not found
                    print(f"Discipline {row['Discipline']} not found.")
                    continue  # Skip this record

                staff = Staff.query.filter_by(email=row['email']).first()
                if staff:
                    staff.firstname = row['FirstName']
                    staff.lastname = row['LastName']
                    staff.email = row['email']
                    staff.disciplineId = discipline.id
                else:
                    staff = Staff(
                        firstname = row['FirstName'],
                        lastname = row['LastName'],
                        email = row['email'],
                        disciplineId = discipline.id
                    )
                    db.session.add(staff)

            db.session.commit()
            return jsonify({'success': True, 'message': 'Data inserted successfully'}), 200

        except Exception as e:
            return jsonify({'error': 'Failed to process CSV file', 'details': str(e)}), 500
    else:
        return jsonify({'error': 'File is not a CSV'}), 400

def upload_cohort_csv_file():
    # Check if the request contains a file
    if 'cohort_csv' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    csv_file = request.files['cohort_csv']
    expected_columns = ["Name", "startDate", "endDate"]

    # Check if the file is a CSV file
    if csv_file and csv_file.filename.endswith('.csv'):
        try:
            # Read the CSV data using pandas
            df = pd.read_csv(csv_file)

            # Check for missing columns in the DataFrame
            missing_columns = [column for column in expected_columns if column not in df.columns]
            if missing_columns:
                return jsonify({'error': f"Missing columns: {', '.join(missing_columns)}"}), 400
            
            # Handling NaN values 
            df.fillna('', inplace=True) 
             
            if df.duplicated(subset=['Name', 'startDate', 'endDate']).any():
                return jsonify({'error': 'CSV file contains duplicated rows'}), 400

            # Process each row in the DataFrame
            for _, row in df.iterrows():
                cohort = Cohort.query.filter_by(name=row['Name']).first()
                if cohort:
                    cohort.startDate = row['startDate']
                    cohort.endDate = row['endDate']
                else:
                    cohort = Cohort(
                        name=row['Name'],
                        startDate = row['startDate'],
                        endDate = row['endDate'],
                    )
                    db.session.add(cohort)

            db.session.commit()
            return jsonify({'success': True, 'message': 'Data inserted successfully'}), 200

        except Exception as e:
            return jsonify({'error': 'Failed to process CSV file', 'details': str(e)}), 500
    else:
        return jsonify({'error': 'File is not a CSV'}), 400

def upload_faculty_csv_file():
    # Check if the request contains a file
    if 'faculty_csv' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    csv_file = request.files['faculty_csv']
    expected_columns = ["Name"]

    # Check if the file is a CSV file
    if csv_file and csv_file.filename.endswith('.csv'):
        try:
            # Read the CSV data using pandas
            df = pd.read_csv(csv_file)

            # Check for missing columns in the DataFrame
            missing_columns = [column for column in expected_columns if column not in df.columns]
            if missing_columns:
                return jsonify({'error': f"Missing columns: {', '.join(missing_columns)}"}), 400
            
            # Handling NaN values 
            df.fillna('', inplace=True) 
             
            if df.duplicated(subset=['Name']).any():
                return jsonify({'error': 'CSV file contains duplicated rows'}), 400

            # Process each row in the DataFrame
            for _, row in df.iterrows():
                faculty = Faculty.query.filter_by(name=row['Name']).first()
                if not faculty:
                    faculty = Faculty(name=row['Name'])
                    db.session.add(faculty)

            db.session.commit()
            return jsonify({'success': True, 'message': 'Data inserted successfully'}), 200

        except Exception as e:
            return jsonify({'error': 'Failed to process CSV file', 'details': str(e)}), 500
    else:
        return jsonify({'error': 'File is not a CSV'}), 400

def upload_venue_csv_file():
    # Check if the request contains a file
    if 'venue_csv' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    csv_file = request.files['venue_csv']
    expected_columns = ["Location", "Name"]

    # Check if the file is a CSV file
    if csv_file and csv_file.filename.endswith('.csv'):
        try:
            # Read the CSV data using pandas
            df = pd.read_csv(csv_file, index_col=None)

            # Check for missing columns in the DataFrame
            missing_columns = [
                column for column in expected_columns if column not in df.columns]
            if missing_columns:
                return jsonify({'error': f"Missing columns: {', '.join(missing_columns)}"}), 400
            
            # Handling NaN values 
            df.fillna('', inplace=True) 
             
            if df.duplicated(subset=['Name', 'Location']).any():
                return jsonify({'error': 'CSV file contains duplicated rows'}), 400

            # Process each row in the DataFrame
            for _, row in df.iterrows():
                venue = Venue.query.filter_by(location=row['Location']).first()
                if venue:
                    venue.name = row['Name']
                else:
                    venue = Venue(name=row['Name'], location=row['Location'])
                    db.session.add(venue)

            db.session.commit()
            return jsonify({'success': True, 'message': 'Data inserted successfully'}), 200

        except Exception as e:
            return jsonify({'error': 'Failed to process CSV file', 'details': str(e)}), 500
    else:
        return jsonify({'error': 'File is not a CSV'}), 400


def upload_unit_csv_file():
    if 'unit_csv' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    csv_file = request.files['unit_csv']
    expected_columns = ["UnitCode", "Name", "Credit", "UC", "Discipline", "Unit_Quota"]

    if csv_file.filename.endswith('.csv'):
        try:
            # Read the CSV data into a pandas DataFrame without using the first column as the index
            df = pd.read_csv(csv_file, index_col=False)

            # Check for missing columns in the DataFrame
            missing_columns = [
                column for column in expected_columns if column not in df.columns]
            if missing_columns:
                return jsonify({'error': f"Missing columns: {', '.join(missing_columns)}"}), 400
            
            # Handling NaN values 
            df.fillna('', inplace=True) 

            # Check for duplicated rows in the DataFrame
            if df.duplicated(subset=['UnitCode']).any():
                return jsonify({'error': 'CSV file contains duplicated UnitCode'}), 400

            # Process each row in the DataFrame
            for _, row in df.iterrows():

                staff = Staff.query.filter(func.lower(func.concat(
                    Staff.firstname, ' ', Staff.lastname)) == row['UC'].lower()).first()
                if not staff:
                    # Handle the case where staff is not found
                    print(f"Staff {row['UC']} not found.")
                    continue  # Skip this record

                discipline = Discipline.query.filter_by(
                    name=row['Discipline']).first()
                if not discipline:
                    # Handle the case where discipline is not found
                    print(f"Discipline {row['Discipline']} not found.")
                    continue  # Skip this record

                # Check if a Unit with the given UnitCode exists
                unit = Unit.query.filter_by(unitCode=row['UnitCode']).first()
                if unit:
                    unit.name = row['Name']
                    unit.credit = row['Credit']
                    unit.quota = row['Unit_Quota']
                    unit.staffId = staff.id
                    unit.disciplineId = discipline.id
                else:
                    unit = Unit(
                        unitCode=row['UnitCode'],
                        name=row['Name'],
                        quota=row['Unit_Quota'],
                        credit=row['Credit'],
                        staffId=staff.id,
                        disciplineId=discipline.id,
                    )
                    db.session.add(unit)

            db.session.commit()
            return jsonify({'success': True, 'message': 'Data inserted successfully'}), 200

        except Exception as e:
            return jsonify({'error': 'Failed to process CSV file', 'details': str(e)}), 500
    else:
        return jsonify({'error': 'File is not a CSV'}), 400


def upload_cfs_csv_file():
    if 'cfs_csv' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    csv_file = request.files['cfs_csv']
    expected_columns = ["set", "ref_type", "cohortName", "staffName"]

    if csv_file and csv_file.filename.endswith('.csv'):
        try:
            df = pd.read_csv(csv_file)

            missing_columns = [
                column for column in expected_columns if column not in df.columns]
            if missing_columns:
                return jsonify({'error': f"Missing columns: {', '.join(missing_columns)}"}), 400

            # Handling NaN values 
            df.fillna('', inplace=True) 
        
            # Check for duplicates
            if df.duplicated(subset=["set", "ref_type", "cohortName", "staffName"]).any():
                return jsonify({'error': 'CSV file contains duplicated entries'}), 400

            if df.duplicated(subset=["set"]).any():
                return jsonify({'error': 'CSV file contains duplicated Sets'}), 400

            for index, row in df.iterrows():
                if row['ref_type'].lower() not in ['cohort', 'staff']:
                    return jsonify({'error': f"Invalid ref_type at row {index + 1}. Must be 'cohort' or 'staff'."}), 400

                cohort_id = None
                staff_id = None

                if row['ref_type'].lower() == 'cohort':
                    cohort = Cohort.query.filter_by(
                        name=row['cohortName']).first()
                    if not cohort:
                        return jsonify({'error': f"Cohort named '{row['cohortName']}' not found at row {index + 1}."}), 400
                    cohort_id = cohort.id

                elif row['ref_type'].lower() == 'staff':
                    staff = Staff.query.filter(func.lower(func.concat(
                        Staff.firstname, ' ', Staff.lastname)) == func.lower(row['staffName'])).first()
                    if not staff:
                        return jsonify({'error': f"Staff named '{row['staffName']}' not found at row {index + 1}."}), 400
                    staff_id = staff.id

                try:
                    new_cfs = Clash_Free_Set(
                        set=row['set'], ref_type=row['ref_type'], cohortId=cohort_id, staffId=staff_id)
                    db.session.add(new_cfs)
                except AssertionError as e:
                    db.session.rollback()
                    return jsonify({'error': str(e)}), 400

            db.session.commit()
            return jsonify({'success': True, 'message': 'Data inserted successfully'}), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Failed to process CSV file', 'details': str(e)}), 500
    else:
        return jsonify({'error': 'File is not a CSV'}), 400



def upload_unit_session_csv_file():
    if 'unit_session_csv' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    unit_session_csv = request.files['unit_session_csv']
    expected_columns = ["UnitCode", "Session_Type", "Duration(hours)", "Capacity"]

    if unit_session_csv and unit_session_csv.filename.endswith('.csv'):
        try:
            df = pd.read_csv(unit_session_csv)

            missing_columns = [
                column for column in expected_columns if column not in df.columns]
            if missing_columns:
                return jsonify({'error': f"Missing columns: {', '.join(missing_columns)}"}), 400

            # Handling NaN values 
            df.fillna('', inplace=True) 
        
            # Check for duplicates
            if df.duplicated(subset=["UnitCode", "Session_Type", "Duration(hours)", "Capacity"]).any():
                return jsonify({'error': 'CSV file contains duplicated entries'}), 400

            for index, row in df.iterrows():
                if row['Session_Type'].lower() not in ['lecture', 'tutorial', 'lab', 'workshop']:
                    return jsonify({'error': f"Invalid Session_Type at row {index + 1}. Must be 'lecture', 'tutorial', 'lab' or 'workshop'."}), 400

                if row['UnitCode']:
                    unit_code = row['UnitCode'].upper()
                    unit = Unit.query.filter_by(
                        unitCode=unit_code).first()
                    if not unit:
                        return jsonify({'error': f"Unit Code '{row['UnitCode']}' not found at row {index + 1}."}), 400
                    unitId = unit.id

                try:
                    unit_session = UnitSession(
                        unit_id=unitId,
                        session_type=row['Session_Type'],
                        duration_hours=row['Duration(hours)'],
                        capacity=row['Capacity']
                    )
                    db.session.add(unit_session)
                except AssertionError as e:
                    db.session.rollback()
                    return jsonify({'error': str(e)}), 400

            db.session.commit()
            return jsonify({'success': True, 'message': 'Data inserted successfully'}), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Failed to process CSV file', 'details': str(e)}), 500
    else:
        return jsonify({'error': 'File is not a CSV'}), 400