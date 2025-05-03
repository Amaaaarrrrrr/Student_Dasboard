import os
from flask import Flask, request, jsonify, request
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)
from flask_cors import CORS
from datetime import timedelta
from functools import wraps
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from models import db, User, StudentProfile, LecturerProfile, Course, Semester, UnitRegistration,Grade, Announcement, AuditLog, DocumentRequest, Hostel, Room, StudentRoomBooking, FeeStructure, Payment, FeeClearance
from dotenv import load_dotenv

# Flask App Config
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'DATABASE_URL',
    "postgresql://dashboard:Student@localhost:5432/student_portal"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your_updated_secret_key_here')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'super-secret-jwt-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

# Initialize Extensions
load_dotenv()
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
api = Api(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})



# -------------------- Role-Based Access Decorator --------------------
def role_required(role):
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)

            if not user:
                return jsonify({"error": "User not found"}), 404
            if user.role != role:
                return jsonify({"error": f"Permission denied. Requires {role} role"}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

# -------------------- Auth Resources --------------------
class Register(Resource):
    def post(self):
        try:
            data = request.get_json()
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')
            role = data.get('role')

            if not all([name, email, password, role]):
                return {"error": "Missing required fields"}, 400

            if User.query.filter_by(email=email).first():
                return {"error": "Email already registered"}, 409

            user = User(name=name, email=email, role=role)
            user.set_password(password)
            db.session.add(user)
            db.session.flush()

            profile_data = data.get(f"{role}_profile", {})
            if role == 'student':
                student_profile = StudentProfile(
                    user_id=user.id,
                    reg_no=profile_data.get('reg_no'),
                    program=profile_data.get('program'),
                    year_of_study=profile_data.get('year_of_study'),
                    phone=profile_data.get('phone')
                )
                db.session.add(student_profile)
                db.session.commit()  
                print(f"Student profile created with ID: {student_profile.id}")
            elif role == 'lecturer':
                lecturer_profile = LecturerProfile(
                    user_id=user.id,
                    staff_no=profile_data.get('staff_no'),
                    department=profile_data.get('department'),
                    phone=profile_data.get('phone')
                )
                db.session.add(lecturer_profile)

            db.session.commit()
            return {"message": "User registered successfully"}, 201
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {str(e)}")
            return {"error": "Internal server error"}, 500
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return {"error": "Internal server error"}, 500
class Login(Resource):
   
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return {"error": "Invalid credentials"}, 401

        access_token = create_access_token(identity=user.id)
        redirect_url = f'/{user.role}_dashboard' if user.role in ['student', 'lecturer', 'admin'] else '/'

        return {
            "access_token": access_token,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            },
            "redirect_url": redirect_url
        }, 200

class Profile(Resource):
    
    @jwt_required()
    def get(self):
        user = User.query.get(get_jwt_identity())
        if not user:
            return {"error": "User not found"}, 404
        return user.to_dict(rules=('-password_hash', 'student_profile', 'lecturer_profile')), 200

# -------------------- Admin Resource --------------------
class AdminDashboard(Resource):
    @role_required('admin')
    def get(self):
        return {"message": "Welcome to the Admin Dashboard!"}, 200

# -------------------- Resource Routes --------------------
api.add_resource(Register, '/api/register')
api.add_resource(Login, '/api/login')
api.add_resource(Profile, '/api/profile')
api.add_resource(AdminDashboard, '/api/admin_dashboard')
# -------------------- API Endpoints --------------------
@app.route('/')
def home():
    return "Welcome to the Student Portal!"

@app.route('/api/courses', methods=['GET'])
def get_courses():
    semester_id = request.args.get('semester_id', type=int)
    program = request.args.get('program', type=str)

    query = Course.query
    if semester_id:
        query = query.filter_by(semester_id=semester_id)
    if program:
        query = query.filter_by(program=program)

    courses = query.all()
    return jsonify([{
        'id': c.id,
        'code': c.code,
        'title': c.title,
        'description': c.description,
        'semester_id': c.semester_id,
        'program': c.program
    } for c in courses])

@app.route('/api/semesters/active', methods=['GET'])
def get_active_semester():
    active_semester = Semester.query.filter_by(active=True).first()
    if not active_semester:
        return jsonify({'error': 'No active semester found'}), 404

    return jsonify({
        'id': active_semester.id,
        'name': active_semester.name,
        'start_date': active_semester.start_date.isoformat(),
        'end_date': active_semester.end_date.isoformat(),
        'active': active_semester.active
    })

@app.route('/api/registration', methods=['GET', 'POST', 'DELETE'])
@jwt_required()
def registration():
    # Get the current user's ID from the JWT token
    current_user_id = get_jwt_identity()

    # Ensure the current user has a student profile
    student_profile = StudentProfile.query.filter_by(user_id=current_user_id).first()
    if not student_profile:
        return jsonify({'error': 'Student profile not found'}), 404

    if request.method == 'POST':
        data = request.get_json()
        course_code = data.get('course_code')  # Expecting course_code instead of course_id
        semester_id = data.get('semester_id')

        if not all([course_code, semester_id]):
            return jsonify({'error': 'course_code and semester_id are required'}), 400

        # Resolve course_id from course_code
        course = Course.query.filter_by(code=course_code).first()
        if not course:
            return jsonify({'error': 'Course not found'}), 404

        course_id = course.id

        # Check if already registered
        if UnitRegistration.query.filter_by(student_id=student_profile.id, course_id=course_id, semester_id=semester_id).first():
            return jsonify({'error': 'Already registered for this course in the semester'}), 400

        # Check prerequisites
        if not UnitRegistration.check_prerequisites_met(student_profile.id, course):
            return jsonify({'error': 'Prerequisites not met'}), 400

        # Create the registration
        registration = UnitRegistration(
            student_id=student_profile.id,  # Use the student_profile.id here
            course_id=course_id,
            semester_id=semester_id
        )
        db.session.add(registration)
        db.session.commit()

        return jsonify({'message': 'Registration successful', 'registration_id': registration.id}), 201

    elif request.method == 'GET':
        # Fetch all registrations for the current student
        registrations = UnitRegistration.query.filter_by(student_id=student_profile.id).all()
        return jsonify([{
            'id': reg.id,
            'course_code': reg.course.code,
            'course_title': reg.course.title,
            'semester_id': reg.semester_id,
            'registered_on': reg.registered_on.isoformat()
        } for reg in registrations]), 200

    elif request.method == 'DELETE':
        data = request.get_json()
        registration_id = data.get('registration_id')

        if not registration_id:
            return jsonify({'error': 'Registration ID is required'}), 400

        registration = UnitRegistration.query.filter_by(id=registration_id, student_id=student_profile.id).first()
        if not registration:
            return jsonify({'error': 'Registration not found'}), 404

        db.session.delete(registration)
        db.session.commit()
        return jsonify({'message': 'Registration deleted successfully'}), 200
# -------------------- Grades Resource --------------------
@app.route('/api/grades', methods=['GET', 'POST'])
@jwt_required()
def grades():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if request.method == 'GET':
        # Only allow students to view their grades
        if current_user.role != 'student':
            return jsonify({'error': 'Permission denied'}), 403

        grades = Grade.query.filter_by(student_id=current_user_id).all()
        return jsonify([{
            'course_code': g.course.code,
            'course_title': g.course.title,
            'grade': g.grade,
            'semester': g.semester.name,
            'date_posted': g.date_posted.isoformat()
        } for g in grades])

    elif request.method == 'POST':
        # Only allow lecturers to post grades
        if current_user.role != 'lecturer':
            return jsonify({'error': 'Permission denied'}), 403

        data = request.get_json()
        student_id = data.get('student_id')
        course_id = data.get('course_id')
        grade = data.get('grade')
        semester_id = data.get('semester_id')

        # Validate required fields
        if not all([student_id, course_id, grade, semester_id]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Check if the course and semester exist
        course = Course.query.get(course_id)
        semester = Semester.query.get(semester_id)

        if not course or not semester:
            return jsonify({'error': 'Invalid course or semester'}), 404

        # Create and save the grade entry
        grade_entry = Grade(student_id=student_id, course_id=course_id, grade=grade, semester_id=semester_id)
        db.session.add(grade_entry)
        db.session.commit()

        return jsonify({'message': 'Grade added successfully'}), 201
    elif request.method == 'DELETE':    
        # Only allow lecturers to delete grades
        if current_user.role != 'lecturer':
            return jsonify({'error': 'Permission denied'}), 403

        data = request.get_json()
        grade_id = data.get('grade_id')

        if not grade_id:
            return jsonify({'error': 'Grade ID is required'}), 400

        grade_entry = Grade.query.filter_by(id=grade_id).first()
        if not grade_entry:
            return jsonify({'error': 'Grade not found'}), 404

        db.session.delete(grade_entry)
        db.session.commit()
        return jsonify({'message': 'Grade deleted successfully'})

# -------------------- Announcements Resource --------------------
@app.route('/api/announcements', methods=['GET', 'POST'])
@role_required('admin')
def announcements():
    if request.method == 'GET':
        announcements = Announcement.query.all()
        return jsonify([{
            'title': a.title,
            'content': a.content,
            'date_posted': a.date_posted.isoformat(),
            'posted_by': a.posted_by.name
        } for a in announcements])

    elif request.method == 'POST':
        data = request.get_json()
        title = data.get('title')
        content = data.get('content')
        posted_by_id = get_jwt_identity()

        if not all([title, content]):
            return jsonify({'error': 'Title and content are required'}), 400

        announcement = Announcement(
            title=title,
            content=content,
            posted_by_id=posted_by_id
        )
        db.session.add(announcement)
        db.session.commit()
        return jsonify({'message': 'Announcement posted successfully'}), 201
# -------------------- Audit Logs Resource --------------------
@app.route('/api/audit_logs', methods=['GET'])
@role_required('admin')
def audit_logs():
    audit_logs = AuditLog.query.all()
    return jsonify([{
        'action': log.action,
        'timestamp': log.timestamp.isoformat(),
        'user_id': log.user_id,
        'details': log.details
    } for log in audit_logs])

# -------------------- Document Requests Resource --------------------
@app.route('/api/document_requests', methods=['GET', 'POST'])
@jwt_required()
def document_requests():
    if request.method == 'GET':
        student_id = get_jwt_identity()
        requests = DocumentRequest.query.filter_by(student_id=student_id).all()
        return jsonify([{
            'document_type': req.document_type,
            'status': req.status,
            'requested_on': req.requested_on.isoformat(),
            'processed_on': req.processed_on.isoformat() if req.processed_on else None
        } for req in requests])

    elif request.method == 'POST':
        data = request.get_json()
        student_id = get_jwt_identity()
        document_type = data.get('document_type')

        if not document_type:
            return jsonify({'error': 'Document type is required'}), 400

        document_request = DocumentRequest(student_id=student_id, document_type=document_type)
        db.session.add(document_request)
        db.session.commit()
        return jsonify({'message': 'Document request submitted successfully'}), 201
    elif request.method == 'DELETE':
        data = request.get_json()
        request_id = data.get('request_id')

        if not request_id:
            return jsonify({'error': 'Request ID is required'}), 400

        document_request = DocumentRequest.query.filter_by(id=request_id, student_id=student_id).first()
        if not document_request:
            return jsonify({'error': 'Document request not found'}), 404

        db.session.delete(document_request)
        db.session.commit()
        return jsonify({'message': 'Document request deleted successfully'})
    


# -------------------- Helper Functions --------------------
def handle_db_commit(data_obj):
    try:
        db.session.add(data_obj)
        db.session.commit()
        return jsonify({'success': True, 'data': data_obj.to_dict()}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Database error: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
    except Exception as e:
        db.session.rollback()
        print(f"Unexpected error: {str(e)}")
        return jsonify({'success': False, 'message': 'Internal server error'}), 500
    
# -------------------- Hostel and Room Management --------------------
@app.route('/api/hostels', methods=['GET'])
def get_hostels():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    hostels = Hostel.query.paginate(page, per_page, False)
    return jsonify({
        'hostels': [hostel.to_dict() for hostel in hostels.items],
        'total': hostels.total,
        'pages': hostels.pages,
        'current_page': hostels.page
    }), 200

@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    rooms = Room.query.all()
    return jsonify({'rooms': [room.to_dict() for room in rooms]}), 200

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    bookings = StudentRoomBooking.query.all()
    return jsonify({'bookings': [booking.to_dict() for booking in bookings]}), 200

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()
    room = Room.query.get(data['room_id'])
    if not room or not room.is_available(data['start_date'], data['end_date']):
        return jsonify({'error': 'Room not available for the selected dates'}), 400

    booking = StudentRoomBooking(
        student_id=data['student_id'],
        room_id=data['room_id'],
        start_date=data['start_date'],
        end_date=data['end_date']
    )
    room.current_occupancy += 1
    return handle_db_commit(booking)

@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
def cancel_booking(booking_id):
    booking = StudentRoomBooking.query.get_or_404(booking_id)
    room = Room.query.get(booking.room_id)
    if room and room.current_occupancy > 0:
        room.current_occupancy -= 1

    db.session.delete(booking)
    db.session.commit()
    return jsonify({'message': 'Booking cancelled successfully'}), 200

# -------------------- Fee Structure Management --------------------
@app.route('/api/fee-structure', methods=['GET'])
def get_fee_structure():
    program_id = request.args.get('program_id')
    semester_id = request.args.get('semester_id')
    if not program_id or not semester_id:
        return jsonify({'success': False, 'message': 'Missing required parameters'}), 400

    fee_structure = FeeStructure.query.filter_by(program_id=program_id, semester_id=semester_id).first()
    if fee_structure:
        return jsonify({'success': True, 'data': fee_structure.to_dict()}), 200
    else:
        return jsonify({'success': False, 'message': 'Fee structure not found'}), 404

@app.route('/api/fee-structure', methods=['POST'])
def create_fee_structure():
    data = request.get_json()
    program_id = data.get('program_id')
    semester_id = data.get('semester_id')
    amount = data.get('amount')
    due_date = data.get('due_date')

    if not all([program_id, semester_id, amount, due_date]):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    new_fee_structure = FeeStructure(
        program_id=program_id,
        semester_id=semester_id,
        amount=amount,
        due_date=due_date
    )
    return handle_db_commit(new_fee_structure)

@app.route('/api/fee-structures/all', methods=['GET'])
def get_all_fee_structures():
    fee_structures = FeeStructure.query.all()
    return jsonify({'fee_structures': [fs.to_dict() for fs in fee_structures]}), 200

# -------------------- Payment Handling --------------------
@app.route('/api/payments', methods=['POST'])
def create_payment():
    data = request.get_json()

    student_id = data.get('student_id')
    fee_structure_id = data.get('fee_structure_id')
    amount_paid = data.get('amount_paid')
    payment_method = data.get('payment_method')
    receipt_number = data.get('receipt_number')
    payment_status = data.get('payment_status')
    remarks = data.get('remarks')

    if not all([student_id, fee_structure_id, amount_paid, payment_method, receipt_number]):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400

    new_payment = Payment(
        student_id=student_id,
        fee_structure_id=fee_structure_id,
        amount_paid=amount_paid,
        payment_method=payment_method,
        receipt_number=receipt_number,
        payment_status=payment_status,
        remarks=remarks
    )
    return handle_db_commit(new_payment)

@app.route('/api/payments', methods=['GET'])
def get_payments():
    payments = Payment.query.all()
    return jsonify({'payments': [payment.to_dict() for payment in payments]}), 200

# -------------------- Clearance Status --------------------
@app.route('/api/clearance/<int:student_id>', methods=['GET'])
def get_clearance_status(student_id):
    clearance_status = FeeClearance.query.filter_by(student_id=student_id).first()
    if clearance_status:
        return jsonify({'success': True, 'data': clearance_status.to_dict()}), 200
    else:
        return jsonify({'success': False, 'message': 'Clearance status not found'}), 404

@app.route('/admin/clearance/<int:student_id>', methods=['PUT'])
def update_clearance_status(student_id):
    clearance_status = FeeClearance.query.filter_by(student_id=student_id).first()
    if not clearance_status:
        return jsonify({'success': False, 'message': 'Clearance status not found'}), 404

    data = request.get_json()
    
    # Only update what's in the model
    if 'status' in data:
        clearance_status.status = data['status']
    
    if 'cleared_on' in data:
        try:
            clearance_status.cleared_on = datetime.fromisoformat(data['cleared_on'])
        except ValueError:
            return jsonify({'success': False, 'message': 'Invalid date format'}), 400

    db.session.commit()
    return jsonify({'success': True, 'data': clearance_status.to_dict()}), 200


if __name__ == "__main__":
    app.run(debug=True)
