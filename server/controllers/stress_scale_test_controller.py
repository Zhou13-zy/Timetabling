import random
import uuid
from datetime import datetime, timedelta
from flask import jsonify, request
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

def generate_venues(number_of_venues=5):
    venues = []
    equipment_types = ['computer', 'projector', 'workstation']
 
    venue_names = [
    "Main Hall", "Room A", "Room B", "Room C", "Auditorium",
    "Conference Room 1", "Conference Room 2", "Lecture Hall", "Training Room",
    "Workshop Room", "Event Space", "Exhibition Hall", "Boardroom",
    "Theater", "Seminar Room", "Multipurpose Room", "Studio",
    "Cafeteria", "Open Space", "Garden Room", "Innovation Hub",
    "Main Stage", "Small Hall", "Room D", "Room E",
    "Room F", "Room G", "Room H", "Room I",
    "Room J", "Room K", "Room L", "Room M",
    "Room N", "Room O", "Room P", "Room Q",
    "Room R", "Room S", "Room T", "Room U",
    "Room V", "Room W", "Room X", "Room Y",
    "Room Z", "Sky Lounge", "Rooftop Terrace", "Classroom 1",
    "Classroom 2", "Classroom 3", "Library", "Breakout Room 1",
    "Breakout Room 2", "Media Room", "VIP Lounge", "Game Room",
    "Recreation Hall", "Fitness Center", "Spa Room", "Art Gallery",
    "Music Room", "Dance Studio", "Sports Hall", "Yoga Studio",
    "Tech Lab", "Science Lab", "Computer Lab", "Photo Studio",
    "The Glass Room", "Zen Room", "Chill Zone", "Outdoor Patio",
    "Sun Room", "Fireplace Lounge", "Green Room", "Classroom A",
    "Classroom B", "Classroom C", "Creative Space", "Collaboration Room",
    "Discovery Room", "Innovation Space", "Strategy Room", "Brainstorming Room",
    "Sound Studio", "Video Production Room", "Broadcast Studio", "Resource Room",
    "Presentation Room", "Exhibition Space", "Meeting Point", "Networking Lounge",
    "Social Hub", "Workshop Area", "Showroom", "Training Zone",
    "Learning Center", "Discussion Room", "Alumni Hall", "Career Center",
    "Interim Room", "Protocol Room", "Examination Room", "Main Lobby",
    "First Floor Lounge", "Second Floor Lounge", "Third Floor Lounge", "Pavilion",
    "Atrium", "Veranda", "Terrace", "Civic Hall", "Community Room",
]
    
    for i in range(number_of_venues):
        venues.append(Venue(
            id=str(uuid.uuid4()),
            name=random.choice(venue_names),
            location=f"Building {i + 1}",  # Using i + 1 to start numbering from 1
            capacity=random.randint(50, 200),  # Random capacity between 50 and 200
            equipment_type=random.choice(equipment_types),
            active=True,
            blocked_timeslots="",  # No blocked timeslots for now
            timestamp=datetime.utcnow(),
        ))
    
    return venues

def generate_staff(valid_discipline_ids, number_of_staffs=5):
    staff_members = []

    first_names = [
        "John", "Jane", "Alice", "Bob", "Charlie",
        "David", "Emily", "Frank", "Grace", "Hannah",
        "Ian", "Jack", "Katherine", "Leo", "Mia",
        "Noah", "Olivia", "Paul", "Quinn", "Rachel",
        "Sam", "Tina", "Ursula", "Victor", "Wendy",
        "Xander", "Yara", "Zach", "Ava", "Bella",
        "Cameron", "Diana", "Ethan", "Fiona", "George",
        "Holly", "Isaac", "Julia", "Kyle", "Liam",
        "Megan", "Nathan", "Olive", "Peter", "Quincy",
        "Riley", "Sophie", "Thomas", "Uma", "Violet",
        "William", "Xena", "Yvonne", "Zane", "Adeline",
        "Brianna", "Colin", "Derek", "Elena", "Felix",
        "Gina", "Harper", "Ivy", "Jasper", "Kylie",
        "Mason", "Nora", "Oscar", "Paige", "Quinn",
        "Ryder", "Samantha", "Troy", "Uma", "Vera",
        "Wyatt", "Zane", "Diana", "Lucy", "Adam",
        "Brian", "Catherine", "Daniel", "Eva", "Felicia",
        "Gabriel", "Holly", "Irene", "Joseph", "Kate",
        "Lila", "Max", "Nina", "Owen", "Penelope",
        "Quincy", "Ruby", "Steve", "Tessa", "Ulysses",
        "Vanessa", "Winston", "Xena", "Yvette", "Zoe",
        "Ali", "Becky", "Carl", "Dawn", "Edgar",
        "Faith", "Gina", "Hugo", "Iris", "Jake",
        "Liam", "Margo", "Nash", "Opal", "Peter",
    ]

    last_names = [
        "Doe", "Smith", "Brown", "Johnson", "Williams",
        "Jones", "Garcia", "Martinez", "Davis", "Rodriguez",
        "Wilson", "Anderson", "Taylor", "Thomas", "Hernandez",
        "Moore", "Martin", "Lee", "Jackson", "Perez",
        "Thompson", "White", "Lopez", "Gonzalez", "Harris",
        "Clark", "Lewis", "Robinson", "Walker", "Young",
        "Hall", "Allen", "Sanchez", "Wright", "King",
        "Scott", "Green", "Baker", "Adams", "Nelson",
        "Carter", "Mitchell", "Roberts", "Stewart", "Harrison",
        "Ross", "Cook", "Morgan", "Bell", "Murphy",
        "Cooper", "Reed", "Bailey", "Rivera", "Gomez",
        "Sullivan", "Bryant", "Alexander", "Diaz", "Woods",
        "James", "Watson", "Brooks", "Kelly", "Sanders",
        "Price", "Bennett", "Wood", "Barnes", "Ross",
        "Hughes", "Chavez", "Ramos", "Fisher", "Palmer",
        "Morris", "Powell", "Long", "Perry", "Hawkins",
        "Mason", "Tucker", "Ferguson", "Ray", "James",
        "Horton", "Moreno", "Riley", "Adams", "Curtis",
        "Caldwell", "Santiago", "Mejia", "Duncan", "Cameron",
    ]
    
    # Adjust the number of staff to generate
    for i in range(number_of_staffs):
        # Ensure the index does not exceed the available names
        selected_firstname=random.choice(first_names),
        selected_lastname=random.choice(last_names)
        staff_members.append(Staff(
            id=str(uuid.uuid4()),
            firstname=selected_firstname,
            lastname=selected_lastname,
            email = f"{selected_lastname.lower()}.{selected_lastname.lower()}@example.com",
            disciplineId=random.choice(valid_discipline_ids),  # Use a valid disciplineId
            timestamp=datetime.utcnow(),
        ))
    
    return staff_members

def generate_cohorts(number_of_cohorts=4):
    cohorts = []
    current_year = datetime.now().year

    for cohort_index in range(number_of_cohorts):  # Generates the specified number of cohorts
        # Calculate start month and adjust year if necessary
        start_month = (cohort_index % 12) + 1
        start_year = current_year + (cohort_index // 12)  # Increment year for every 12 cohorts

        start_date = datetime(start_year, start_month, 1)
        end_date = start_date + timedelta(days=182)

        cohorts.append(Cohort(
            id=str(uuid.uuid4()),
            name=f"Cohort {start_year} - {cohort_index + 1}",
            startDate=start_date.date(),
            endDate=end_date.date(),
            timestamp=datetime.utcnow(),
        ))

    return cohorts


def generate_clash_free_sets(valid_cohort_ids, valid_staff_ids, valid_unit_codes, number_of_sets=5):
    clash_free_sets = []

    for _ in range(number_of_sets):
        ref_type = random.choice(['cohort', 'staff'])
        
        if ref_type == 'cohort':
            cohort_id = random.choice(valid_cohort_ids)
            staff_id = None
        else:
            staff_id = random.choice(valid_staff_ids)
            cohort_id = None
        
        set_value = ', '.join(random.sample(valid_unit_codes, k=random.randint(1, 5)))  # Choose between 1 to 6 unit codes
        set_value = f"'{set_value}'"  

        clash_free_sets.append(Clash_Free_Set(
            set=set_value,
            ref_type=ref_type,
            cohortId=cohort_id,
            staffId=staff_id,
            timestamp=datetime.utcnow(),
        ))

    return clash_free_sets

def generate_faculties(number_of_faculties=5):
    faculties = []
    faculty_names = [
        "Engineering", "Arts", "Science", "Business", "Education",
        "Law", "Medicine", "Nursing", "Architecture", "Pharmacy",
        "Health Sciences", "Social Work", "Computer Science", "Mathematics",
        "Psychology", "Economics", "Statistics", "Human Resources",
        "Marketing", "Performing Arts", "Visual Arts",
    ]    

    for _ in range(number_of_faculties):  # Generate 5 faculties
        faculties.append(Faculty(
            id=str(uuid.uuid4()),
            name=random.choice(faculty_names),
            timestamp=datetime.utcnow(),
        ))
    
    return faculties


def generate_disciplines(faculty_ids, number_of_disciplines=5):
    disciplines = []
    discipline_names = [
        "Computer Science", "Graphic Design", "Physics", "Marketing", "Mathematics",
        "Biology", "Chemistry", "Environmental Science", "History", "Literature",
        "Economics", "Psychology", "Sociology", "Engineering", "Nursing",
        "Philosophy", "Statistics", "Information Technology", "Human Resources",
        "Art History", "Music",
    ]    

    for i in range(min(number_of_disciplines, len(discipline_names))):  # Limit to available names
        disciplines.append(Discipline(
            id=str(uuid.uuid4()),
            name=discipline_names[i],
            facultyId=random.choice(faculty_ids),
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

def generate_units(number_of_units=1000):

    units = []
    unit_names = []

    for i in range(number_of_units):
        unit_names.append(f"Unit {i+1}")
    unit_codes = [f"Unit{i + 1}" for i in range(len(unit_names))]

    for name, unit_code in zip(unit_names, unit_codes):
        discipline_id = random.choice(get_valid_discipline_ids())
        staff_id = random.choice(get_valid_staff_ids())

        if not discipline_id or not staff_id:
            print("Valid disciplineId or staffId not found. Please check your records.")
            return []  # Return if IDs are not valid

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

def insert_stress_data(number_of_cohorts, number_of_faculties, number_of_disciplines, number_of_staffs, number_of_venues, number_of_units, number_of_unit_sessions, number_of_sets):
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

    cohorts = generate_cohorts(number_of_cohorts)
    db.session.bulk_save_objects(cohorts)
    db.session.commit()
    print(f"Inserted {len(cohorts)} cohorts.")

    faculties = generate_faculties(number_of_faculties)
    db.session.bulk_save_objects(faculties)
    db.session.commit()
    print(f"Inserted {len(faculties)} faculties.")

    valid_faculty_ids = get_valid_faculty_ids()
    disciplines = generate_disciplines(valid_faculty_ids, number_of_disciplines)
    db.session.bulk_save_objects(disciplines)
    db.session.commit()
    print(f"Inserted {len(disciplines)} disciplines.")
    # Ensure valid discipline IDs are fetched before generating staff
    valid_discipline_ids = get_valid_discipline_ids()
    if not valid_discipline_ids:  # Check if there are valid discipline IDs
        print("No valid discipline IDs found. Cannot generate staff members.")
        return jsonify({'error': 'No valid discipline IDs. Cannot proceed.'}), 400
        
    staff_members = generate_staff(valid_discipline_ids, number_of_staffs)
    db.session.bulk_save_objects(staff_members)
    db.session.commit()
    print(f"Inserted {len(staff_members)} staff members.")
    
    db.session.execute(text("DELETE FROM Venues WHERE id IS NOT NULL"))
    db.session.commit()  # Commit deletion of venues
    print("Existing venues cleared successfully.")

    venues = generate_venues(number_of_venues)
    db.session.bulk_save_objects(venues)
    db.session.commit()
    print(f"Inserted {len(venues)} venues.")

    try:
        # Insert units first
        units = generate_units(number_of_units)
        
        if not units:  # Check if units are generated
            print("No units were generated.")
            return jsonify({'error': 'No units created. Cannot proceed.'}), 400
        
        unit_ids = [unit.id for unit in units]  # Collect the unit IDs
        
        if not unit_ids:  # Check if unit_ids is empty
            print("No valid unit IDs found. Cannot generate unit sessions.")
            return jsonify({'error': 'No valid unit IDs. Cannot proceed.'}), 400
        
        unit_sessions = generate_unit_sessions(unit_ids, number_of_unit_sessions)
        
        db.session.bulk_save_objects(unit_sessions)  # Efficient bulk insert
        db.session.commit()
        print(f"Inserted {len(unit_sessions)} unit sessions.")

        db.session.execute(text("DELETE FROM Clash_Free_Sets WHERE id IS NOT NULL"))
        db.session.commit()  # Commit deletion of venues
        print("Existing Clash_Free_Sets cleared successfully.")
        valid_cohort_ids = get_valid_cohort_ids()  # Implement a similar method to get valid cohort IDs
        valid_staff_ids = get_valid_staff_ids()  # Implement a similar method to get valid staff IDs
        valid_unit_codes= get_valid_unit_codes()
        clash_free_sets = generate_clash_free_sets(valid_cohort_ids, valid_staff_ids, valid_unit_codes, number_of_sets)    
        db.session.bulk_save_objects(clash_free_sets)
        db.session.commit()
        print(f"Inserted {len(clash_free_sets)} clash_free_sets.")
        
        print("Inserted All")
            
    except Exception as e:
        db.session.rollback()  # Rollback on error
        print(f"Error occurred: {e}")
   
def generate_unit_sessions(unit_ids, number_of_unit_sessions=1000):
    session_types = ["lecture", "tutorial", "lab", "workshop"]
    equipment_types = ['computer', 'projector', 'workstation']  # Use a set for equipment types
    unit_sessions = []
    assigned_session_types = {unit_id: set() for unit_id in unit_ids}  # Track assigned session types for each unit

    # Ensure one lecture per unit
    for unit_id in unit_ids:
        unit_sessions.append(UnitSession(
            id=str(uuid.uuid4()),  # Generate a unique ID
            unit_id=unit_id,
            session_type="lecture",  # Add a lecture for each unit
            duration_hours=random.randint(1, 3),  # Random duration between 1 to 3 hours
            capacity=random.randint(20, 100),  # Random capacity between 20 to 100
            timestamp=datetime.utcnow()  # Use the current UTC time
        ))
        assigned_session_types[unit_id].add("lecture")  # Mark lecture as assigned

    # Generate additional sessions
    for _ in range(number_of_unit_sessions - len(unit_ids)):  # Adjust the count to prevent exceeding the total
        unit_id = random.choice(unit_ids)  # Choose a random unit_id from the provided list
        
        # Get available session types for the selected unit (excluding lecture)
        available_session_types = list(set(session_types) - assigned_session_types[unit_id] - {"lecture"})
        
        if available_session_types:  # Check if there are available session types
            session_type = random.choice(available_session_types)  # Randomly select an available session type
            
            # Create a new UnitSession and add it to the list
            unit_sessions.append(UnitSession(
                id=str(uuid.uuid4()),  # Generate a unique ID
                unit_id=unit_id,
                session_type=session_type,
                duration_hours=random.randint(1, 3),  # Random duration between 1 to 3 hours
                capacity=random.randint(20, 100),  # Random capacity between 20 to 100
                equipment_type=random.choice(equipment_types),  # Convert set to list for random choice
                timestamp=datetime.utcnow()  # Use the current UTC time
            ))

            # Mark this session type as assigned for the unit
            assigned_session_types[unit_id].add(session_type)

    return unit_sessions


def insert_input_from_user():
    try:
        # Get JSON data from the request
        data = request.get_json()
        
        # Required parameters
        required_fields = [
            'number_of_cohorts', 
            'number_of_faculties', 
            'number_of_disciplines', 
            'number_of_staffs', 
            'number_of_venues', 
            'number_of_units', 
            'number_of_unit_sessions', 
            'number_of_sets'
        ]

        # Define input restrictions
        restrictions = {
            'number_of_cohorts': (1, 20),            # 1 to 20 cohorts
            'number_of_faculties': (1, 20),         # 1 to 20 faculties
            'number_of_disciplines': (1, 20),       # 1 to 20 disciplines
            'number_of_staffs': (1, 100),           # 1 to 100 staff members
            'number_of_venues': (1, 100),           # 1 to 100 venues
            'number_of_units': (1, 100),             # 1 to 100 units
            'number_of_unit_sessions': (1, 1000),    # 1 to 1000 unit sessions
            'number_of_sets': (1, 100)                # 1 to 10 sets
        }

        # Check if all required fields are present
        for field in required_fields:
            if field not in data:
                return jsonify({'status': 'error', 'message': f'Missing required field: {field}'}), 400
            
            value = data[field]
            min_value, max_value = restrictions[field]

            # Validate the value for each field
            if not (min_value <= value <= max_value):
                return jsonify({'status': 'error', 'message': f'Value for {field} must be between {min_value} and {max_value}'}), 400

        # Extract parameters
        number_of_cohorts = data['number_of_cohorts']
        number_of_faculties = data['number_of_faculties']
        number_of_disciplines = data['number_of_disciplines']
        number_of_staffs = data['number_of_staffs']
        number_of_venues = data['number_of_venues']
        number_of_units = data['number_of_units']
        number_of_unit_sessions = data['number_of_unit_sessions']
        number_of_sets = data['number_of_sets']

        # Call the function with extracted parameters
        result = insert_stress_data(
            number_of_cohorts,
            number_of_faculties,
            number_of_disciplines,
            number_of_staffs,
            number_of_venues,
            number_of_units,
            number_of_unit_sessions,
            number_of_sets
        )

        return jsonify({'status': 'success'}), 200
    
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400