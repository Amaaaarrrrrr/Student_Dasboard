from app import app, db
from models import (Hostel, Room, StudentRoomBooking, StudentProfile, LecturerProfile,
                    UnitRegistration, Course, Semester, User, AuditLog, Grade,
                    DocumentRequest, FeeStructure, Payment, Announcement, FeeClearance)

from datetime import datetime, timedelta
import random
import uuid
from werkzeug.security import generate_password_hash

def seed():
   
    with app.app_context():
        # Clear existing data (in correct dependency order)
        db.drop_all()  # Drop all tabl
        db.create_all()  # Ensure all tables are created
        StudentRoomBooking.query.delete()
        FeeClearance.query.delete()
        Payment.query.delete()
        FeeStructure.query.delete()
        StudentProfile.query.delete()
        User.query.delete()
        Room.query.delete()
        Hostel.query.delete()
        db.session.commit()

        # Seed Hostels
        hostel_names = [
            ('Nyayo 4 Hostel', 'North Wing', 100),
            ('Beta Hostel', 'South Wing', 80),
            ('Gamma Hostel', 'East Wing', 120),
            ('Delta Hostel', 'West Wing', 90),
            ('Kilimanjaro Hostel', 'Central Block', 110),
            ('Zeta Hostel', 'Annex Block', 70),
            ('Eta Hostel', 'Garden Block', 60),
            ('Nyayo 3 Hostel', 'Roof Block', 50),
            ('Nyayo 2', 'Basement Block', 40),
            ('Nyayo 12', 'Main Block', 130),
            ('Nyayo 5', 'Upper Block', 150),
            ('Nyandarua Hostel', 'Lower Block', 160),
            ('Ruenzori Hostel', 'Side Block', 170),
            ('Abadare Hostel', 'Back Block', 180),
            ('Aberdare Hostel', 'Front Block', 190),
        ]

        hostels = []
        for name, location, capacity in hostel_names:
            hostel = Hostel(name=name, location=location, capacity=capacity)
            db.session.add(hostel)
            hostels.append(hostel)
        db.session.commit()
        print(f'Created {len(hostels)} hostels.')

        # Seed Rooms
        rooms = []
        for hostel in hostels:
            for i in range(1, 21):  # 20 rooms per hostel
                room = Room(
                    hostel_id=hostel.id,
                    room_number=f'{hostel.name[0]}-{i}',
                    bed_count=random.randint(1, 4),
                    room_type=random.choice(['single', 'double', 'triple']),
                    capacity=random.randint(2, 4),
                    current_occupancy=0,
                    price_per_bed=random.randint(1000, 5000)
                )
                db.session.add(room)
                rooms.append(room)
        db.session.commit()
        print(f'And added {len(rooms)} rooms.')

        # Seed Users and Students
        users = []
        admins = []
        lecturers = []
        students = []
        roles = ['admin', 'lecturer', 'student']

        for i in range(50):
            user_role = random.choice(roles)
            user = User(
                name=f'User {i}', 
                email=f'user{i}@example.com', 
                password_hash =generate_password_hash('password'), 
                role=user_role,
            )
            db.session.add(user)
            db.session.flush()  # Ensure user ID is available for foreign key
            users.append(user)
            if user.role == 'student':
                student = StudentProfile(
                   user_id=user.id,
                   program =f'Program {random.randint(1, 5)}',
                   reg_no=f'REG{random.randint(1000, 9999)}',
                   phone_number=f'071234567{i}',
                   year_of_study=random.randint(1, 4),
                   gender=random.choice(['male', 'female']),
                )
                db.session.add(student)
                students.append(student)
            elif user.role == 'lecturer':
                lecturer = LecturerProfile(
                    user_id=user.id,
                    staff_no=f'STAFF{random.randint(1000, 9999)}',
                    department=f'Department {random.randint(1, 5)}',
                    phone=f'071234567{i}',

                )
                db.session.add(lecturer)
                lecturers.append(lecturer)        
                    # Seed Admin
            elif user.role == 'admin':
                admins.append(user) #we need user record for admin
        print(f'Created {len(users)} users, {len(students)} students, {len(lecturers)} lecturers, and {len(admins)} admins.')
        db.session.commit()       
        
        student_ids = [student.id for student in StudentProfile.query.all()]
        room_objects = Room.query.all()

        # Seed Bookings
        bookings = []
        for i in range(20):  # 20 random bookings
            room = random.choice(room_objects)
            if room.current_occupancy < room.capacity:
                booking = StudentRoomBooking(
                    student_id=random.choice(student_ids),
                    room_id=room.id,
                    start_date=datetime.utcnow(),
                    end_date=datetime.utcnow() + timedelta(days=90),
                    status=random.choice(['pending', 'approved', 'rejected'])
                )
                db.session.add(booking)
                room.current_occupancy += 1
                bookings.append(booking)
        db.session.commit()
        print(f'Added {len(bookings)} bookings.')

        # Seed Fee Structures
        fee_structures = []
        for program_id in range(1, 12):
            fee_structure = FeeStructure(
                program=f'Program {program_id}',
                amount=random.randint(20000, 100000),
            )
            db.session.add(fee_structure)
            db.session.flush() #get fee_structursemesters = Semester.query.all() 
            fee_structures.append(fee_structure)           
        print(f'Added {len(fee_structures)} fee structures.')
        # Seed Semesters
        for fee_structure in fee_structures:
            for semester_num in range(1, 12):
                start_date = datetime.utcnow() + timedelta(days=semester_num * 30)
                end_date = start_date + timedelta(days=90) #assume semester is 3 months

                semester = Semester(
                    name=f'Semester {semester_num}',
                    start_date=start_date,
                    end_date=end_date,
                    fee_structure_id=fee_structure.id
                )
                db.session.add(semester)
                fee_structure.semesters.append(semester)
        db.session.commit()
        print(f'Seeded sucessfully {len(fee_structures)} semesters.')
        
        # Seed Payments
        payments = []
        for i in range(50):  # 50 random payments
            fee_structure = random.choice(fee_structures)
            payment = Payment(
                student_id=random.choice(student_ids),
                fee_structure_id=fee_structure.id,
                amount_paid=random.randint(1000, fee_structure.amount),
                payment_date=datetime.utcnow(),
                payment_method=random.choice(['credit_card', 'debit_card', 'Mpesa']),
                receipt_number=f'TXN{random.randint(100000, 999999)}',
                payment_status=random.choice(['success', 'pending'])
            )
            try:
                db.session.add(payment)
                payments.append(payment)
            except Exception as e:
                db.session.rollback()
                print(f"Error adding payment: {e}")
        db.session.commit()
        print(f'Payment seeded successfully {len(payments)} payments.')

        # Seed Clearance Statuses
        clearance_statuses = []
        for student_id in student_ids:
            clearance_status = FeeClearance(
                student_id=student_id,
                hostel_clearance=random.choice([True, False]),
                fee_clearance=random.choice([True, False]),        
                status=random.choice(['pending', 'approved', 'rejected'])
            )
            db.session.add(clearance_status)
            clearance_statuses.append(clearance_status)
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print(f"Error committing clearance statuses: {e}")

        print(f'Seeding completed successfully {len(clearance_statuses)} clearance statuses.')

        # Seed Audit Logs
        #predefined actions
        actions = ['created', 'updated permissions', 'deleted','login','logout','viewed','password changed']
        users = User.query.all()
        if not users:
            print("No users found to create audit logs.")
            exit()
        for i in range(100):
            user = random.choice(users)
            action = random.choice(actions)
            timestamp = datetime.utcnow() - timedelta(days=random.randint(1, 30))
            audit_log = AuditLog(
                user_id=user.id,
                action=action,
                timestamp=timestamp,
                details=f'User {user.name} {action} at {timestamp}'              
            )
            db.session.add(audit_log)
        db.session.commit()
        print(f'Generated {len(users)} audit logs for the last 30 days.')

    print("Seeding completed successfully!")

if __name__ == '__main__':
    seed()
