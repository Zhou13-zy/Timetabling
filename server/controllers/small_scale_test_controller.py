import random
import uuid
from datetime import datetime, timedelta
from flask import jsonify
from models import db
from models.venue import Venue
from models.cohort import Cohort
from models.clash_free_set import Clash_Free_Set
from models.unitSession import UnitSession
from models.staff import Staff
from models.unit import Unit
from models.discipline import Discipline
from models.faculty import Faculty
from sqlalchemy import text, func

def generate_venues():
    venues = []
    equipment_types = ['computer', 'projector', 'workstation']
    venue_names = ["Main Hall", "Room A", "Room B", "Room C", "Auditorium"]
    
    for i, name in enumerate(venue_names):
        venues.append(Venue(
            id=str(uuid.uuid4()),
            name=name,
            location=f"Building {i+1}",
            capacity=random.randint(50, 200),
            equipment_type=random.choice(equipment_types),
            active=True,
            blocked_timeslots="",  # No blocked timeslots for now
            timestamp=datetime.utcnow(),
        ))
    
    return venues

def generate_staff(valid_discipline_ids):
    staff_members = []
    first_names = ["John", "Jane", "Alice", "Bob", "Charlie"]
    last_names = ["Doe", "Smith", "Brown", "Johnson", "Williams"]
    
    for i in range(5):  # Generate 5 staff members
        staff_members.append(Staff(
            id=str(uuid.uuid4()),
            firstname=first_names[i],
            lastname=last_names[i],
            email=f"{first_names[i].lower()}.{last_names[i].lower()}@example.com",
            disciplineId=random.choice(valid_discipline_ids),  # Use a valid disciplineId
            timestamp=datetime.utcnow(),
        ))
    
    return staff_members

def generate_cohorts():
    cohorts = []
    current_year = datetime.now().year

    # Generate four cohorts for the current year
    for cohort_index in range(4):  # Four cohorts per year
        # Define start and end dates for each cohort
        if cohort_index == 0:
            start_date = datetime(current_year, 1, 1)  # January 1
        elif cohort_index == 1:
            start_date = datetime(current_year, 4, 1)  # April 1
        elif cohort_index == 2:
            start_date = datetime(current_year, 7, 1)  # July 1
        else:  # cohort_index == 3
            start_date = datetime(current_year, 10, 1)  # October 1

        end_date = start_date + timedelta(days=182)  # 6 months later

        cohorts.append(Cohort(
                    id=str(uuid.uuid4()),  # Cohort IDs: cohort-2024-01, cohort-2024-02, ...
                    name=f"Cohort {current_year} - {cohort_index + 1}",
                    startDate=start_date.date(),  # Convert to date
                    endDate=end_date.date(),  # Convert to date
                    timestamp=datetime.utcnow(),
                ))

    return cohorts


def generate_clash_free_sets(valid_cohort_ids, valid_staff_ids, valid_unit_codes):
    clash_free_sets = []

    # Generate a few example clash-free sets
    for _ in range(5):  # Generate 5 clash-free sets
        ref_type = random.choice(['cohort', 'staff'])  # Randomly choose 'cohort' or 'staff'
        
        if ref_type == 'cohort':
            cohort_id = random.choice(valid_cohort_ids)
            staff_id = None  # staffId must be NULL for cohort
        else:
            staff_id = random.choice(valid_staff_ids)
            cohort_id = None  # cohortId must be NULL for staff
        
        # Create a clash-free set string
        set_value = ', '.join(random.sample(valid_unit_codes, k=random.randint(1, 4)))  # Choose between 1 to 4 unit codes
        set_value = f"'{set_value}'"  

        clash_free_sets.append(Clash_Free_Set(
            set=set_value,
            ref_type=ref_type,
            cohortId=cohort_id,
            staffId=staff_id,
            timestamp=datetime.utcnow(),
        ))

    return clash_free_sets

def generate_faculties():
    faculties = []
    faculty_names = ["Engineering", "Arts", "Science", "Business", "Education"]
    
    for name in faculty_names:  # Generate 5 faculties
        faculties.append(Faculty(
            id=str(uuid.uuid4()),
            name=name,
            timestamp=datetime.utcnow(),
        ))
    
    return faculties


def generate_disciplines(faculty_ids):
    disciplines = []
    discipline_names = ["Computer Science", "Graphic Design", "Physics", "Marketing", "Mathematics"]
    
    for i in range(len(discipline_names)):  # Generate 5 disciplines
        disciplines.append(Discipline(
            id=str(uuid.uuid4()),
            name=discipline_names[i],
            facultyId=random.choice(faculty_ids),  # Use a random facultyId from the generated faculties
            timestamp=datetime.utcnow(),
        ))
    
    return disciplines

def get_valid_unit_codes():
    units = db.session.query(Unit).all()  # Fetch all units (change 'Unit' to your actual model name)
    if units:
        return [unit.unitCode for unit in units]  # Collect valid unit codes
    return []

def get_valid_cohort_ids():
    # Fetching all valid cohort IDs from the database
    cohorts = db.session.query(Cohort).all()  # Get all cohorts
    if cohorts:
        valid_cohort_ids = [cohort.id for cohort in cohorts]  # Collect valid cohort IDs
        return valid_cohort_ids
    return []

def get_valid_faculty_ids():
    # Fetching all valid facultyId from the database
    faculties = db.session.query(Faculty).all()  # Get all faculties
    if faculties:
        valid_faculty_ids = [faculty.id for faculty in faculties]  # Collect valid faculty IDs
        return valid_faculty_ids
    return []

def get_valid_discipline_ids():
    # Fetching one valid disciplineId from the database
    disciplines = db.session.query(Discipline).all()  # Get all disciplines
    if disciplines:
        valid_discipline_ids = [discipline.id for discipline in disciplines]  # Collect valid discipline IDs
        return valid_discipline_ids
    return []

def get_valid_staff_ids():
    # Fetching all valid staff IDs from the database
    staff_members = db.session.query(Staff).all()  # Get all staff members
    if staff_members:
        valid_staff_ids = [staff.id for staff in staff_members]  # Collect valid staff IDs
        return valid_staff_ids
    return []

def get_valid_ids():
    # Fetching one valid disciplineId and staffId from the database
    discipline = db.session.query(Discipline).order_by(func.random()).first() 
    staff = db.session.query(Staff).order_by(func.random()).first()
    
    if discipline and staff:
        return discipline.id, staff.id
    return None, None

def generate_units():

    units = []
    unit_names = ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"]
    unit_codes = [f"Unit{i + 1}" for i in range(len(unit_names))]

    discipline_id, staff_id = get_valid_ids()

    if not discipline_id or not staff_id:
        print("Valid disciplineId or staffId not found. Please check your records.")
        return []  # Return if IDs are not valid


    for name, unit_code in zip(unit_names, unit_codes):
        units.append(Unit(
            id=str(uuid.uuid4()),  # Ensure a unique UUID for the id
            unitCode=unit_code,
            name=name,
            disciplineId=discipline_id,  # Use valid disciplineId
            staffId=staff_id,  # Use valid staffId
            timestamp=datetime.utcnow(),
        ))

    try:
        db.session.bulk_save_objects(units)  # Efficient bulk insert
        db.session.commit()
        print(f"{len(units)} units added successfully.")
    except Exception as e:
        db.session.rollback()  # Roll back in case of an error
        print(f"Error occurred while inserting units: {e}")

    return units  # Return the list of created units

def insert_small_data():
    db.session.execute(text("DELETE FROM Sessions WHERE id IS NOT NULL"))
    print("Existing Sessions cleared successfully.")
    db.session.execute(text("DELETE FROM Sessions WHERE id IS NOT NULL"))
    print("Existing Sessions cleared successfully.")
    db.session.execute(text("DELETE FROM Cohorts WHERE id IS NOT NULL"))
    print("Existing cohorts cleared successfully.")
    db.session.execute(text("DELETE FROM Unit_Sessions WHERE id IS NOT NULL"))
    print("Existing unit sessions cleared successfully.")
    db.session.execute(text("DELETE FROM Units WHERE id IS NOT NULL"))
    print("Existing units cleared successfully.")
    db.session.execute(text("DELETE FROM Staff WHERE id IS NOT NULL"))  
    print("Existing staff cleared successfully.")
    db.session.execute(text("DELETE FROM Disciplines WHERE id IS NOT NULL"))
    print("Existing Disciplines cleared successfully.")
    db.session.execute(text("DELETE FROM Faculties WHERE id IS NOT NULL"))
    print("Existing Faculties cleared successfully.")
    db.session.commit()  # Commit deletion of Faculties

    cohorts = generate_cohorts()
    db.session.bulk_save_objects(cohorts)
    db.session.commit()
    print(f"Inserted {len(cohorts)} cohorts.")

    faculties = generate_faculties()
    db.session.bulk_save_objects(faculties)
    db.session.commit()
    print(f"Inserted {len(faculties)} faculties.")

    disciplines = generate_disciplines(get_valid_faculty_ids())
    db.session.bulk_save_objects(disciplines)
    db.session.commit()
    print(f"Inserted {len(disciplines)} disciplines.")
    # Ensure valid discipline IDs are fetched before generating staff
    valid_discipline_ids = get_valid_discipline_ids()
    if not valid_discipline_ids:  # Check if there are valid discipline IDs
        print("No valid discipline IDs found. Cannot generate staff members.")
        return jsonify({'error': 'No valid discipline IDs. Cannot proceed.'}), 400
        
    staff_members = generate_staff(valid_discipline_ids)
    db.session.bulk_save_objects(staff_members)
    db.session.commit()
    print(f"Inserted {len(staff_members)} staff members.")
    
    db.session.execute(text("DELETE FROM Venues WHERE id IS NOT NULL"))
    db.session.commit()  # Commit deletion of venues
    print("Existing venues cleared successfully.")

    venues = generate_venues()
    db.session.bulk_save_objects(venues)
    db.session.commit()
    print(f"Inserted {len(venues)} venues.")

    try:
        # Insert units first
        units = generate_units()
        
        if not units:  # Check if units are generated
            print("No units were generated.")
            return jsonify({'error': 'No units created. Cannot proceed.'}), 400
        
        unit_ids = [unit.id for unit in units]  # Collect the unit IDs
        
        if not unit_ids:  # Check if unit_ids is empty
            print("No valid unit IDs found. Cannot generate unit sessions.")
            return jsonify({'error': 'No valid unit IDs. Cannot proceed.'}), 400
        
        unit_sessions = generate_unit_sessions(unit_ids)
        
        db.session.bulk_save_objects(unit_sessions)  # Efficient bulk insert
        db.session.commit()
        print(f"Inserted {len(unit_sessions)} unit sessions.")

        db.session.execute(text("DELETE FROM Clash_Free_Sets WHERE id IS NOT NULL"))
        db.session.commit()  # Commit deletion of venues
        print("Existing Clash_Free_Sets cleared successfully.")
        valid_cohort_ids = get_valid_cohort_ids()  # Implement a similar method to get valid cohort IDs
        valid_staff_ids = get_valid_staff_ids()  # Implement a similar method to get valid staff IDs
        valid_unit_codes= get_valid_unit_codes()
        clash_free_sets = generate_clash_free_sets(valid_cohort_ids, valid_staff_ids, valid_unit_codes)    
        db.session.bulk_save_objects(clash_free_sets)
        db.session.commit()
        print(f"Inserted {len(clash_free_sets)} clash_free_sets.")
        
        return jsonify({'message': 'All okay'}), 200
            
    except Exception as e:
        db.session.rollback()  # Rollback on error
        print(f"Error occurred: {e}")
        return jsonify({'error': str(e)}), 500


def generate_unit_sessions(unit_ids):
    session_types = ["lecture", "tutorial", "lab", "workshop"]
    equipment_types = ['computer', 'projector', 'workstation']  # Use a set for equipment types
    unit_sessions = []

    for _ in range(10):  # Generate 10 unit sessions
            unit_sessions.append(UnitSession(
                id=str(uuid.uuid4()),  # Generate a unique ID
                unit_id=random.choice(unit_ids),  # Choose a random unit_id from the provided list
                session_type=random.choice(session_types),  # Randomly select a session type
                duration_hours=random.randint(1, 3),  # Random duration between 1 to 3 hours
                capacity=random.randint(20, 100),  # Random capacity between 20 to 100
                equipment_type=random.choice(equipment_types),  # Convert set to list for random choice
                timestamp=datetime.utcnow()  # Use the current UTC time
            ))

    return unit_sessions  # Return the list of created unit sessions
