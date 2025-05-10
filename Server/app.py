import os
from sqlalchemy.exc import SQLAlchemyError
from flask import Flask, request, jsonify,send_from_directory
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)

from flask import Blueprint, jsonify, request

from datetime import datetime
from flask_cors import CORS, cross_origin
from datetime import timedelta
from functools import wraps
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from models import db, User, StudentProfile, LecturerProfile, Course, Semester, UnitRegistration,Grade, Announcement, AuditLog, DocumentRequest, Hostel, Room, StudentRoomBooking, FeeStructure, Payment, FeeClearance, Assignment
from dotenv import load_dotenv
from werkzeug.utils import secure_filename


# Flask App Config
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'DATABASE_URL',
    "postgresql://dashboard:y2025@localhost:5432/student_portal"    
)


# Enable CORS for all routes with proper configuration

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your_updated_secret_key_here')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'super-secret-jwt-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
basedir = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(basedir, 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create the folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize Extensions
load_dotenv()
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
api = Api(app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)


# -------------------- Role-Based Access Decorator --------------------
def role_required(role):
    def wrapper(fn):
        @wraps(fn)
        @jwt_required()
        def decorator(*args, **kwargs):
            # Comment out security checks
            user_id = user_id()
            user = User.query.get(user_id)

            if not user:
                return jsonify({"error": "User not found"}), 404
            if user.role != role:
                return jsonify({"error": f"Permission denied. Requires {role} role"}), 403
            
            # Allow the function to proceed without checking permissions
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
            db.session.flush()  # to get user.id

            profile_data = data.get(f"{role}_profile", {})

            if role == 'student':
                if StudentProfile.query.filter_by(reg_no=profile_data.get('reg_no')).first():
                    return {"error": f"Student with reg_no {profile_data.get('reg_no')} already exists"}, 409

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
                if LecturerProfile.query.filter_by(staff_no=profile_data.get('staff_no')).first():
                    return {"error": f"Lecturer with staff_no {profile_data.get('staff_no')} already exists"}, 409

                lecturer_profile = LecturerProfile(
                    user_id=user.id,
                    staff_no=profile_data.get('staff_no'),
                    department=profile_data.get('department'),
                    phone=profile_data.get('phone')
                )
                db.session.add(lecturer_profile)
                db.session.commit()
                print(f"Lecturer profile created with ID: {lecturer_profile.id}")

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

        return {
            "access_token": "dummy_access_token",  # Hardcoded token since security is commented out
            "user": {
                "id": user.id if user else 1,  # Fallback ID if user not found
                "name": user.name if user else "Unknown",
                "email": user.email if user else email,
                "role": user.role if user else "student"
            },            
        }, 200

class Profile(Resource):
    
    # @jwt_required()
    def get(self):
        # Comment out JWT check and just return a sample profile
        user = User.query.get(get_jwt_identity())
        if not user:
            return {"error": "User not found"}, 404
        
        # Get first user as example or return dummy data
        user = User.query.first()
        if user:
            return user.to_dict(rules=('-password_hash', 'student_profile', 'lecturer_profile')), 200
        else:
            return {"id": 1, "name": "Example User", "email": "example@example.com", "role": "student"}, 200

# -------------------- Admin Resource --------------------
class AdminDashboard(Resource):
    # @role_required('admin')
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

 

@app.route('/api/lecturers', methods=['GET'])
# @jwt_required()
def get_all_lecturers():
    # Comment out security checks
    # current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Only allow access if current user is an admin
    if not current_user or current_user.role != 'admin':
        return jsonify({"message": "Access denied"}), 403

    # Fetch all lecturer profiles
    lecturer_profiles = LecturerProfile.query.all()
    lecturers_data = []
    
    for lecturer in lecturer_profiles:
        lecturer_info = lecturer.to_dict()
        # Include linked user info (like name, email)
        lecturer_info['user'] = lecturer.user.to_dict(rules=('id', 'name', 'email', 'role'))
        lecturers_data.append(lecturer_info)

    return jsonify({"lecturers": lecturers_data}), 200

@app.route('/api/courses', methods=['GET'])
def get_courses():
    try:
        semester_id = request.args.get('semester_id', type=int)
        program = request.args.get('program', type=str)

        print(f"Received parameters: semester_id={semester_id}, program={program}")

        query = Course.query
        if semester_id:
            query = query.filter_by(semester_id=semester_id)
        if program:
            query = query.filter_by(program=program)

        courses = query.all()
        print(f"Fetched {len(courses)} courses from the database")

        return jsonify([{
            'id': c.id,
            'code': c.code,
            'title': c.title,
            'description': c.description,
            'semester_id': c.semester_id,
            'program': c.program
        } for c in courses])

    except Exception as e:
        print(f"Error occurred: {str(e)}")  # Prints more detailed error information
        return jsonify({"error": str(e)}), 500  # Sends the error message in the response


@app.route('/api/courses/<int:course_id>', methods=['PUT'])
# @role_required('admin') 
def update_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing JSON body'}), 400

    course.code = data.get('code', course.code)
    course.title = data.get('title', course.title)
    course.description = data.get('description', course.description)
    course.semester_id = data.get('semester_id', course.semester_id)
    course.program = data.get('program', course.program)

    try:
        db.session.commit()
        return jsonify(course.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update course', 'details': str(e)}), 500


@app.route('/api/courses/<int:course_id>', methods=['DELETE'])
# @role_required('admin') 
def delete_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({'error': 'Course not found'}), 404

    try:
        db.session.delete(course)
        db.session.commit()
        return jsonify({'message': f'Course {course_id} deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete course', 'details': str(e)}), 500

@app.route('/api/courses', methods=['POST'])
# @role_required('admin')  # Your decorator to ensure only admins can access      
def create_course():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing JSON body'}), 400

    code = data.get('code')
    title = data.get('title')
    description = data.get('description')
    semester_id = data.get('semester_id')
    program = data.get('program')

    if not all([code, title, semester_id, program]):
        return jsonify({'error': 'Missing required fields'}), 400

    course = Course(
        code=code,
        title=title,
        description=description,
        semester_id=semester_id,
        program=program
    )

    try:
        db.session.add(course)
        db.session.commit()
        return jsonify(course.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create course', 'details': str(e)}), 500
# CREATE assignment (POST)
@app.route('/api/assignments', methods=['POST'])
def create_assignment():
    try:
        data = request.get_json()

        title = data.get('title')
        description = data.get('description')
        due_date = data.get('due_date')
        lecturer_id = data.get('lecturer_id')

        if not title or not due_date or not lecturer_id:
            return jsonify({'error': 'Title , Due Date and lecturer id are required'}), 400

        try:
            due_date_parsed = datetime.strptime(due_date, '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': 'Invalid due_date format. Use YYYY-MM-DD'}), 400

        # 🟢 Get submitted_by_id or default to lecturer_id
        submitted_by_id = data.get('submitted_by_id')
        if not submitted_by_id:
            submitted_by_id = lecturer_id

        submitted_by_id = data.get('submitted_by_id')
        if not submitted_by_id:
            submitted_by_id = lecturer_id
        lecturer = User.query.get(lecturer_id)
        if lecturer is None:
            return jsonify({'error': 'Lecturer ID is invalid'}), 400  

        submitted_by = User.query.get(submitted_by_id)
        if submitted_by is None:
            return jsonify({'error':'Submitted By ID is invalid'})   

        # 🟢 Pass submitted_by_id into Assignment constructor
        new_assignment = Assignment(
            title=title,
            description=description,
            due_date=due_date_parsed,
            lecturer_id=lecturer_id,
            submitted_by_id=submitted_by_id
        )

        db.session.add(new_assignment)
        db.session.commit()

        return jsonify({
            'message': 'Assignment created successfully',
            'assignment': new_assignment.to_dict()
        }), 201

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# GET all assignments
@app.route('/api/assignments', methods=['GET'])
def get_assignments():
    try:
        assignments = Assignment.query.all()
        assignments_list = [assignment.to_dict() for assignment in assignments]
        return jsonify({"assignments": assignments_list}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# Create a new assignment
@app.route('/api/semesters', methods=['GET'])
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

@app.route('/api/semesters', methods=['POST'])
# @jwt_required()
def create_semester():
    # Comment out security checks
    current_user_id = User
    current_user = User.query.get(User)

    # Only allow access if current user is an admin
    # if not current_user or current_user.role != 'admin':
    #     return jsonify({"message": "Access denied"}), 403

    data = request.get_json()

    # Validate input data
    try:
        name = data['name']
        start_date = datetime.strptime(data['start_date'], "%Y-%m-%dT%H:%M:%S")
        end_date = datetime.strptime(data['end_date'], "%Y-%m-%dT%H:%M:%S")
        active = data['active']
    except KeyError as e:
        return jsonify({"message": f"Missing key: {str(e)}"}), 400
    except ValueError:
        return jsonify({"message": "Invalid date format, use 'YYYY-MM-DDTHH:MM:SS'"}), 400

    new_semester = Semester(
        name=name,
        start_date=start_date,
        end_date=end_date,
        active=active
    )

    db.session.add(new_semester)
    db.session.commit()

    return jsonify({"message": "Semester created successfully", "semester": new_semester.to_dict()}), 201

@app.route('/api/semesters/<int:id>', methods=['PUT'])
# @jwt_required()
def update_semester(id):
    # Comment out security checks
    # current_user_id = get_jwt_identity()
    current_user = User.query.get(User)

    # Only allow access if current user is an admin
    if not current_user or current_user.role != 'admin':
        return jsonify({"message": "Access denied"}), 403

    semester = Semester.query.get(id)
    if not semester:
        return jsonify({"message": "Semester not found"}), 404

    data = request.get_json()

    # Update semester attributes
    semester.name = data.get('name', semester.name)
    semester.start_date = datetime.strptime(data.get('start_date', semester.start_date.isoformat()), "%Y-%m-%dT%H:%M:%S")
    semester.end_date = datetime.strptime(data.get('end_date', semester.end_date.isoformat()), "%Y-%m-%dT%H:%M:%S")
    semester.active = data.get('active', semester.active)

    db.session.commit()

    return jsonify({"message": "Semester updated successfully", "semester": semester.to_dict()}), 200

@app.route('/api/semesters/<int:id>', methods=['DELETE'])
# @jwt_required()
def delete_semester(id):
    # Comment out security checks
    # current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Only allow access if current user is an admin
    if not current_user or current_user.role != 'admin':
        return jsonify({"message": "Access denied"}), 403

    semester = Semester.query.get(id)
    if not semester:
        return jsonify({"message": "Semester not found"}), 404

    # Deleting the semester
    db.session.delete(semester)
    db.session.commit()

    return jsonify({"message": "Semester deleted successfully"}), 200

#unit registraions
@app.route('/api/registration', methods=['GET', 'POST', 'DELETE'])
def registration():
    student_profile = StudentProfile.query.first()
    if not student_profile:
        return jsonify({'error': 'No student profiles in database'}), 404

    if request.method == 'POST':
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        course_code = data.get('course_code')
        semester_id = data.get('semester_id')

        if not course_code or not semester_id:
            return jsonify({'error': 'course_code and semester_id are required'}), 400

        course = Course.query.filter_by(code=course_code).first()
        if not course:
            return jsonify({'error': 'Course not found'}), 404

        existing_registration = UnitRegistration.query.filter_by(
            student_id=student_profile.id,
            course_id=course.id,
            semester_id=semester_id
        ).first()

        if existing_registration:
            return jsonify({'error': 'Already registered for this course in the semester'}), 400

        new_registration = UnitRegistration(
            student_id=student_profile.id,
            course_id=course.id,
            semester_id=semester_id
        )
        db.session.add(new_registration)
        db.session.commit()

        return jsonify({'message': 'Registration successful', 'registration_id': new_registration.id}), 201

    elif request.method == 'GET':
        registrations = UnitRegistration.query.filter_by(student_id=student_profile.id).all()
        results = []
        for reg in registrations:
            results.append({
                'id': reg.id,
                'course_code': reg.course.code,
                'course_title': reg.course.title,
                'semester_id': reg.semester_id,
                'registered_on': reg.registered_on.isoformat() if reg.registered_on else None
            })
        return jsonify(results), 200

    elif request.method == 'DELETE':
        # support either JSON body or query param
        data = request.get_json()
        registration_id = data.get('registration_id') if data else request.args.get('registration_id')

        if not registration_id:
            return jsonify({'error': 'registration_id is required'}), 400

        registration = UnitRegistration.query.filter_by(
            id=registration_id,
            student_id=student_profile.id
        ).first()

        if not registration:
            return jsonify({'error': 'Registration not found'}), 404

        db.session.delete(registration)
        db.session.commit()
        return jsonify({'message': 'Registration deleted successfully'}), 200


# -------------------- Announcements Resource --------------------

@app.route('/api/announcements', methods=['GET', 'POST'])
# @jwt_required(optional=True)
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
        # Comment out auth checks
        # current_user_id = current_user_id()
        # if not current_user_id:
        #     return jsonify({'error': 'Authentication required'}), 401

        # user = User.query.get(current_user_id)
        # if user.role not in ['admin', 'lecturer']:
        #     return jsonify({'error': 'Only admins and lecturers can post announcements'}), 403
        
        # Use first user for testing
        current_user = User.query.first()
        if not current_user:
            return jsonify({'error': 'No users in database'}), 404
            
        current_user_id = current_user.id

        data = request.get_json()
        title = data.get('title')
        content = data.get('content')

        if not all([title, content]):
            return jsonify({'error': 'Title and content are required'}), 400

        announcement = Announcement(
            title=title,
            content=content,
            posted_by_id=current_user_id
        )
        db.session.add(announcement)
        db.session.commit()
        return jsonify({'message': 'Announcement posted successfully'}), 201

@app.route('/api/announcements/<int:id>', methods=['DELETE'])
# @jwt_required()
def delete_announcement(id):
    # Comment out auth checks
    # current_user_id = current_user_id()
    # user = User.query.get(current_user_id)

    # if user.role not in ['admin', 'lecturer']:
    #     return jsonify({'error': 'Only admins and lecturers can delete announcements'}), 403

    announcement = Announcement.query.get_or_404(id)
    db.session.delete(announcement)
    db.session.commit()
    return jsonify({'message': 'Announcement deleted'}), 200

# -------------------- Audit Logs Resource --------------------
@app.route('/api/audit_logs', methods=['GET'])
# @role_required('admin')
def audit_logs():
    audit_logs = AuditLog.query.all()
    return jsonify([{
        'action': log.action,
        'timestamp': log.timestamp.isoformat(),
        'user_id': log.user_id,
        'details': log.details
    } for log in audit_logs])

# -------------------- Document Requests Resource --------------------
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/document_requests', methods=['GET', 'POST', 'DELETE'])
# @jwt_required()
def handle_document_requests():
    # Comment out auth checks
    # current_user_id = current_user_id()
    # user = User.query.get(current_user_id)
    
    # Use first user for testing
    current_user = User.query.first()
    if not current_user:
        return jsonify({'error': 'No users in database'}), 404
        
    current_user_id = current_user.id

    if request.method == 'GET':
        # Comment out role check
        # if not user or user.role != 'admin':
        #     return jsonify({'error': 'Access denied'}), 403

        requests = DocumentRequest.query.all()
        return jsonify([req.to_dict() for req in requests]), 200
    elif request.method == 'POST':
        data = request.get_json()
        document_type = data.get('document_type')

        if not document_type:
            return jsonify({'error': 'Document type is required'}), 400

        new_request = DocumentRequest(
            student_id=current_user_id,
            document_type=document_type
        )
        db.session.add(new_request)
        db.session.commit()
        return jsonify({'message': 'Document request submitted successfully'}), 201 
    # -------------------- Hostel and Room Management --------------------

@app.route('/api/hostels', methods=['GET'])
def get_hostels():
    hostels = Hostel.query.all()
    return jsonify({'hostels': [hostel.to_dict() for hostel in hostels]}), 200
        
@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    rooms = Room.query.all()
    return jsonify({'rooms': [room.to_dict() for room in rooms]}), 200

@app.route('/api/bookings', methods=['POST', 'OPTIONS'])
@cross_origin(origin='http://localhost:5173')
def create_booking():
    if request.method == 'OPTIONS':
        return jsonify({}), 200  #  respond to preflight request

    # Your POST logic here
    data = request.get_json()
    return jsonify({'message': 'Booking created successfully'}), 201

    # 🟠 This code is unreachable because of the return above
    hostel = Hostel.query.get(hostel_id)
    if not hostel:
        return jsonify({'error': 'Hostel not found'}), 404

    room = Room(
        hostel_id=hostel_id,
        room_number=room_number,
        capacity=capacity
    )
    db.session.add(room)
    db.session.commit()
    return jsonify({'message': 'Room created successfully'}), 201


#POST /api/payments - create a new payment
@app.route('/api/payments', methods=['GET'])
def fetch_payments():
    Payments = Payment.query.all()

    if not Payments:
        return jsonify({'error': 'No payments found'}), 404

    result = []
    for p in Payments:
        result.append({
            'id': p.id,
            'student_id': p.student_id,
            'amount': float(p.amount),
            'date': p.date.strftime('%Y-%m-%d'),
            'status': p.status
        })

    return jsonify({'payments': result}), 200
@app.route('/api/payments', methods=['POST'])


grades_bp = Blueprint('grades', __name__, url_prefix='/api/grades')

# Helper function to validate grades
def is_valid_grade(grade):
    valid_grades = ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E']
    return grade.upper() in valid_grades

@grades_bp.route('/', methods=['GET'])
def get_grades():
    try:
        grades = Grade.query.all()
        return jsonify([{
            'id': grade.id,
            'student_id': grade.student_id,
            'course_id': grade.course_id,
            'semester_id': grade.semester_id,
            'grade': grade.grade,
            'date_posted': grade.date_posted.isoformat(),
            'student_name': grade.student.name,
            'course_name': grade.course.title,
            'semester_name': grade.semester.name
        } for grade in grades]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@grades_bp.route('/', methods=['POST'])
def create_grade():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['student_id', 'course_id', 'semester_id', 'grade']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Validate grade format
    if not is_valid_grade(data['grade']):
        return jsonify({
            'error': 'Invalid grade. Valid grades are: A, B+, B, C+, C, D+, D, E'
        }), 400
    
    try:
        # Check if student exists
        student = User.query.get(data['student_id'])
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        # Check if course exists
        course = Course.query.get(data['course_id'])
        if not course:
            return jsonify({'error': 'Course not found'}), 404
        
        # Check if semester exists
        semester = Semester.query.get(data['semester_id'])
        if not semester:
            return jsonify({'error': 'Semester not found'}), 404
        
        # Check for duplicate grade entry
        existing_grade = Grade.query.filter_by(
            student_id=data['student_id'],
            course_id=data['course_id'],
            semester_id=data['semester_id']
        ).first()
        
        if existing_grade:
            return jsonify({
                'error': 'Grade already exists for this student, course, and semester'
            }), 409
        
        # Create new grade
        new_grade = Grade(
            student_id=data['student_id'],
            course_id=data['course_id'],
            semester_id=data['semester_id'],
            grade=data['grade'].upper()
        )
        
        db.session.add(new_grade)
        db.session.commit()
        
        return jsonify({
            'message': 'Grade submitted successfully',
            'grade': {
                'id': new_grade.id,
                'student_id': new_grade.student_id,
                'course_id': new_grade.course_id,
                'semester_id': new_grade.semester_id,
                'grade': new_grade.grade,
                'date_posted': new_grade.date_posted.isoformat()
            }
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Additional routes needed for the frontend
@grades_bp.route('/students', methods=['GET'])
def get_students():
    try:
        students = User.query.filter_by(role='student').all()
        return jsonify([{
            'id': student.id,
            'name': student.name,
            'email': student.email,
            'reg_no': student.reg_no
        } for student in students]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@grades_bp.route('/courses', methods=['GET'])
def get_courses():
    try:
        courses = Course.query.all()
        return jsonify([{
            'id': course.id,
            'code': course.code,
            'title': course.title,
            'credits': course.credits
        } for course in courses]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@grades_bp.route('/semesters/active', methods=['GET'])
def get_active_semesters():
    try:
        active_semesters = Semester.query.filter_by(active=True).all()
        return jsonify([{
            'id': semester.id,
            'name': semester.name,
            'year': semester.year,
            'term': semester.term,
            'start_date': semester.start_date.isoformat(),
            'end_date': semester.end_date.isoformat(),
            'active': semester.active
        } for semester in active_semesters]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#......................................
if __name__ == '__main__':
    app.run(debug=True)