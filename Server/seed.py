from datetime import datetime, timedelta
from models import db, User, StudentProfile, LecturerProfile, Course, Semester, UnitRegistration, Grade, Announcement, AuditLog, DocumentRequest, Hostel, Room, StudentRoomBooking, FeeStructure, Payment, FeeClearance
from app import app

# Seed data
def seed_data():
    with app.app_context():
        # Drop and recreate all tables
        db.drop_all()
        db.create_all()

        # Create Semesters
        semester1 = Semester(name="Semester 1", start_date=datetime(2025, 1, 1), end_date=datetime(2025, 5, 31), active=True)
        semester2 = Semester(name="Semester 2", start_date=datetime(2025, 6, 1), end_date=datetime(2025, 12, 31), active=False)
        db.session.add_all([semester1, semester2])
        
        # Create Users
        try:
            admin = User(name="Admin User", email="admin@example.com", role="admin")
            admin.set_password("admin123")
            db.session.add(admin)
            db.session.commit()
        except Exception as e:
            print(f"Error inserting admin user: {e}")
            db.session.rollback()

        existing_user = User.query.filter_by(email="student@example.com").first()
        if existing_user:
            print("User with this email already exists.")
        else:
            student = User(name="Student User", email="student@example.com", role="student")
            student.set_password("student123")
            db.session.add(student)
            db.session.commit()
            

        lecturer = User(name="Lecturer User", email="lecturer@example.com", role="lecturer")
        lecturer.set_password("lecturer123")
        db.session.add(lecturer)
        db.session.commit()

        # Create Profiles
        student_profile = StudentProfile(
            user_id=student.id,
            reg_no="STU001",
            program="Computer Science",
            year_of_study=2,
            phone="1234567890"
        )
        lecturer_profile = LecturerProfile(
            user_id=lecturer.id,
            staff_no="LEC001",
            department="Computer Science",
            phone="0987654321"
        )
        db.session.add_all([student_profile, lecturer_profile])

        # Create Courses
        course1 = Course(code="CS101", title="Introduction to Programming", description="Learn the basics of programming.", semester_id=semester1.id, program="Computer Science")
        course2 = Course(code="CS102", title="Data Structures", description="Learn about data structures.", semester_id=semester1.id, program="Computer Science")
        db.session.add_all([course1, course2])
        db.session.commit()

        # Create Unit Registrations
        registration = UnitRegistration(student_id=student_profile.id, course_id=course1.id, semester_id=semester1.id)
        db.session.add(registration)
        db.session.commit()

        # Create Grades
        grade = Grade(student_id=student.id, course_id=course1.id, grade="A", semester_id=semester1.id)
        db.session.add(grade)
        db.session.commit()

        # Create Announcements
        announcement = Announcement(title="Welcome", content="Welcome to the new semester!", posted_by_id=admin.id)
        db.session.add(announcement)
        db.session.commit()

        # Create Audit Logs
        audit_log = AuditLog(action="User Login", timestamp=datetime.utcnow(), details="Admin logged in", user_id=admin.id)
        db.session.add(audit_log)
        db.session.commit()

        # Create Document Requests
        document_request = DocumentRequest(student_id=student.id, document_type="Transcript", status="Pending")
        db.session.add(document_request)
        db.session.commit()  

        # Create Hostels and Rooms
        hostel = Hostel(name="Main Hostel", location="Campus", capacity=100)
        db.session.add(hostel)
        db.session.flush()

        room = Room(hostel_id=hostel.id, room_number="101", bed_count=2, price_per_bed=5000.0)
        db.session.add(room)
        db.session.commit()

        # Create Room Bookings
        booking = StudentRoomBooking(student_id=student_profile.id, room_id=room.id, start_date=datetime(2025, 1, 1), end_date=datetime(2025, 5, 31))
        db.session.add(booking)
        db.session.commit()

        # Create Fee Structures
        fee_structure = FeeStructure(program="Computer Science", amount=50000.0)
        db.session.add(fee_structure)
        db.session.flush()

        # Create Payments
        payment = Payment(student_id=student_profile.id, fee_structure_id=fee_structure.id, amount_paid=50000.0, payment_method="Credit Card")
        db.session.add(payment)
        db.session.commit()

        # Create Fee Clearance
        fee_clearance = FeeClearance(student_id=student_profile.id, status="Cleared")
        db.session.add(fee_clearance)
        db.session.commit()

        # Commit all changes
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()