import random
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from app import db, app
from models import User, StudentProfile, LecturerProfile, Course, Semester, UnitRegistration, Grade, Hostel, Room, FeeStructure, Payment, FeeClearance, Announcement, DocumentRequest


# Helper function to create random dates
def random_date(start, end):
    return start + (end - start) * random.random()

# Seed Users
def seed_users():
    roles = ['student', 'lecturer', 'admin']
    for i in range(1, 101):
        role = random.choice(roles)
        user = User(
            name=f'User {i}',
            email=f'user{i}@example.com',
            role=role
        )
        user.set_password('password')  
    try:
        db.session.add(user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        print(f"User with email {user.email} already exists.")

# Seed Semesters
def seed_semesters():
    semesters = [
        ('Spring 2025', datetime(2025, 1, 1), datetime(2025, 5, 31)),
        ('Fall 2025', datetime(2025, 8, 1), datetime(2025, 12, 31)),
        ('Summer 2025', datetime(2025, 6, 1), datetime(2025, 8, 31))
    ]
    for name, start, end in semesters:
        semester = Semester(name=name, start_date=start, end_date=end, active=False)
        db.session.add(semester)
    db.session.commit()

# Seed Courses
def seed_courses():
    for i in range(1, 16):
        course = Course(
            code=f'CS{i:03}',
            title=f'Course {i}',
            description=f'This is course {i} description.',
            semester_id=random.randint(1, 3),  # Randomly assign a semester
            program='Computer Science'
        )
        db.session.add(course)
    db.session.commit()

# Seed Lecturers
def seed_lecturers():
    for i in range(1, 11):
        lecturer = LecturerProfile(
            user_id=i,  # Assuming lecturer users are the first 10
            staff_no=f'ST{1000 + i}',
            department=f'Department {i}',
            phone=f'0712{random.randint(100000, 999999)}'
        )
        db.session.add(lecturer)
    db.session.commit()

# Seed Student Profiles
def seed_student_profiles():
    for i in range(1, 101):  # Assuming first 100 users are students
        student_profile = StudentProfile(
            user_id=i,
            reg_no=f'ST{10000 + i}',
            program='Computer Science',
            year_of_study=random.randint(1, 4),
            phone=f'0712{random.randint(100000, 999999)}'
        )
        db.session.add(student_profile)
    db.session.commit()

# Seed Unit Registrations
def seed_unit_registrations():
    for student in StudentProfile.query.all():
        courses = random.sample(Course.query.all(), 5)  # Assign 5 random courses
        for course in courses:
            semester = random.choice(Semester.query.all())
            if not UnitRegistration.is_already_registered(student.id, course.id, semester.id) and UnitRegistration.check_prerequisites_met(student.id, course):
                unit_registration = UnitRegistration(
                    student_id=student.id,
                    course_id=course.id,
                    semester_id=semester.id
                )
                db.session.add(unit_registration)
    db.session.commit()

# Seed Grades
def seed_grades():
    for student in StudentProfile.query.all():
        for course in Course.query.all():
            if random.choice([True, False]):
                grade = Grade(
                    student_id=student.user_id,
                    course_id=course.id,
                    grade=random.choice(['A', 'B', 'C', 'D', 'F']),
                    semester_id=random.choice([1, 2, 3])
                )
                db.session.add(grade)
    db.session.commit()

# Seed Announcements
def seed_announcements():
    for i in range(1, 21):
        announcement = Announcement(
            title=f'Announcement {i}',
            content=f'Content for announcement {i}.',
            posted_by_id=random.randint(1, 10)
        )
        db.session.add(announcement)
    db.session.commit()

# Seed Hostels
def seed_hostels():
    for i in range(1, 6):
        hostel = Hostel(
            name=f'Hostel {i}',
            location=f'Location {i}',
            capacity=random.randint(50, 200)
        )
        db.session.add(hostel)
    db.session.commit()

# Seed Rooms
def seed_rooms():
    for hostel in Hostel.query.all():
        for i in range(1, 6):  # Each hostel has 5 rooms
            room = Room(
                hostel_id=hostel.id,
                room_number=f'{hostel.name[:3]}-{i}',
                bed_count=random.randint(1, 4),
                price_per_bed=random.randint(3000, 5000)
            )
            db.session.add(room)
    db.session.commit()

# Seed Fee Structures
def seed_fee_structures():
    for course in Course.query.all():
        for hostel in Hostel.query.all():
            for semester in Semester.query.all():
                fee_structure = FeeStructure(
                    course_id=course.id,
                    hostel_id=hostel.id,
                    semester_id=semester.id,
                    amount=random.randint(15000, 50000)
                )
                db.session.add(fee_structure)
    db.session.commit()

# Seed Payments
def seed_payments():
    for student in StudentProfile.query.all():
        for fee_structure in FeeStructure.query.all():
            if random.choice([True, False]):
                payment = Payment(
                    student_id=student.id,
                    fee_structure_id=fee_structure.id,
                    amount_paid=random.randint(5000, 20000),
                    payment_method=random.choice(['Credit', 'Debit', 'Cash']),
                    payment_date=random_date(datetime(2025, 1, 1), datetime(2025, 12, 31))
                )
                db.session.add(payment)
    db.session.commit()

# Seed Fee Clearance
def seed_fee_clearance():
    for student in StudentProfile.query.all():
        fee_clearance = FeeClearance(
            student_id=student.id,
            cleared_on=random_date(datetime(2025, 1, 1), datetime(2025, 12, 31)),
            status=random.choice(['Cleared', 'Pending'])
        )
        db.session.add(fee_clearance)
    db.session.commit()

# Seed Document Requests
def seed_document_requests():
    for student in StudentProfile.query.all():
        if random.choice([True, False]):
            document_request = DocumentRequest(
                student_id=student.user_id,
                document_type=random.choice(['Transcript', 'Certificate', 'Letter']),
                file_name=f'{student.reg_no}_document.pdf',
                file_path=f'/documents/{student.reg_no}_document.pdf'
            )
            db.session.add(document_request)
    db.session.commit()

def seed_data():
    with app.app_context():
        try:
            print("Starting to seed data...")
            db.create_all()  # Create tables
            print("Tables created.")
            
            seed_users()
            print("Users seeded.")
            
            seed_semesters()
            print("Semesters seeded.")
            
            seed_courses()
            print("Courses seeded.")
            
            seed_lecturers()
            print("Lecturers seeded.")
            
            seed_student_profiles()
            print("Student profiles seeded.")
            
            seed_unit_registrations()
            print("Unit registrations seeded.")
            
            seed_grades()
            print("Grades seeded.")
            
            seed_announcements()
            print("Announcements seeded.")
            
            seed_hostels()
            print("Hostels seeded.")
            
            seed_rooms()
            print("Rooms seeded.")
            
            seed_fee_structures()
            print("Fee structures seeded.")
            
            seed_payments()
            print("Payments seeded.")
            
            seed_fee_clearance()
            print("Fee clearance seeded.")
            
            seed_document_requests()
            print("Document requests seeded.")
            
            print("Database seeded successfully!")
        except IntegrityError as e:
            db.session.rollback()
            print(f"Integrity Error: {e}")
        except Exception as e:
            db.session.rollback()
            print(f"Error: {e}")