import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
from functools import wraps

# Flask App & Config
from flask import request, jsonify
from models import db, Course, Semester, UnitRegistration

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'DATABASE_URL',
    "postgresql://dashboard:dashboardpass@localhost:5432/student_portal"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your_updated_secret_key_here')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'super-secret-jwt-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

# Extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
api = Api(app)

# Import models (defined in separate file)
from models import User, StudentProfile, LecturerProfile

# -------------------- Role-Based Access Decorators --------------------

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
                return jsonify({"error": f"Permission denied. You need to be a {role} to access this."}), 403

            return fn(*args, **kwargs)
        return decorator
    return wrapper


# -------------------- Resources --------------------

class Register(Resource):
    def post(self):
        data = request.get_json()

        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')

        if not all([name, email, password, role]):
            return {"error": "Missing required fields"}, 400

        if role not in ['student', 'lecturer', 'admin']:
            return {"error": "Invalid role"}, 400

        if User.query.filter_by(email=email).first():
            return {"error": "Email already registered"}, 409

        user = User(name=name, email=email, role=role)
        user.set_password(password)
        db.session.add(user)
        db.session.flush()  # Get user.id before commit

        if role == 'student':
            profile_data = data.get('student_profile', {})
            student_profile = StudentProfile(
                user_id=user.id,
                reg_no=profile_data.get('reg_no'),
                program=profile_data.get('program'),
                year_of_study=profile_data.get('year_of_study'),
                phone=profile_data.get('phone')
            )
            db.session.add(student_profile)

        elif role == 'lecturer':
            profile_data = data.get('lecturer_profile', {})
            lecturer_profile = LecturerProfile(
                user_id=user.id,
                staff_no=profile_data.get('staff_no'),
                department=profile_data.get('department'),
                phone=profile_data.get('phone')
            )
            db.session.add(lecturer_profile)

        db.session.commit()
        return {"message": "User registered successfully"}, 201


class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            return {"error": "Invalid credentials"}, 401

        access_token = create_access_token(identity=user.id)

        # Redirect based on user role
        if user.role == 'student':
            redirect_url = '/student_dashboard'
        elif user.role == 'lecturer':
            redirect_url = '/lecturer_dashboard'
        elif user.role == 'admin':
            redirect_url = '/admin_dashboard'
        else:
            redirect_url = '/'

        return {
            "access_token": access_token,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "redirect_url": redirect_url  # Send role-based redirect URL
            }
        }, 200


class Profile(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return {"error": "User not found"}, 404

        return user.to_dict(rules=('-password_hash', 'student_profile', 'lecturer_profile')), 200


# -------------------- Admin Resources --------------------

class AdminDashboard(Resource):
    @role_required('admin')
    def get(self):
        # Only admins can access this route
        return {"message": "Welcome to the Admin Dashboard!"}, 200


# -------------------- Routes --------------------
# Initialize the database
db.init_app(app)

# Initialize Flask-Migrate
migrate = Migrate(app, db)

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
    courses_data = [{
        'id': c.id,
        'code': c.code,
        'title': c.title,
        'description': c.description,
        'semester_id': c.semester_id,
        'program': c.program
    } for c in courses]

    return jsonify(courses_data)

@app.route('/api/semesters/active', methods=['GET'])
def get_active_semester():
    active_semester = Semester.query.filter_by(active=True).first()
    if not active_semester:
        return jsonify({'error': 'No active semester found'}), 404

    semester_data = {
        'id': active_semester.id,
        'name': active_semester.name,
        'start_date': active_semester.start_date.isoformat(),
        'end_date': active_semester.end_date.isoformat(),
        'active': active_semester.active
    }
    return jsonify(semester_data)

@app.route('/api/registration', methods=['GET', 'POST', 'DELETE'])
def registration():
    if request.method == 'GET':
        student_id = request.args.get('student_id', type=int)
        if not student_id:
            return jsonify({'error': 'student_id is required'}), 400

        registrations = UnitRegistration.query.filter_by(student_id=student_id).all()
        data = []
        for reg in registrations:
            data.append({
                'id': reg.id,
                'student_id': reg.student_id,
                'course_id': reg.course_id,
                'course_code': reg.course.code,
                'course_title': reg.course.title,
                'semester_id': reg.semester_id,
                'registered_on': reg.registered_on.isoformat()
            })
        return jsonify(data)

    elif request.method == 'POST':
        data = request.get_json()
        student_id = data.get('student_id')
        course_id = data.get('course_id')
        semester_id = data.get('semester_id')

        if not all([student_id, course_id, semester_id]):
            return jsonify({'error': 'student_id, course_id, and semester_id are required'}), 400

        # Check if already registered
        if UnitRegistration.is_already_registered(student_id, course_id, semester_id):
            return jsonify({'error': 'Already registered for this course in the semester'}), 400

        course = Course.query.get(course_id)
        if not course:
            return jsonify({'error': 'Course not found'}), 404

        # Check prerequisites
        if not UnitRegistration.check_prerequisites_met(student_id, course):
            return jsonify({'error': 'Prerequisites not met for this course'}), 400

        registration = UnitRegistration(
            student_id=student_id,
            course_id=course_id,
            semester_id=semester_id
        )
        db.session.add(registration)
        db.session.commit()

        return jsonify({'message': 'Registration successful', 'registration_id': registration.id}), 201

    elif request.method == 'DELETE':
        data = request.get_json()
        registration_id = data.get('registration_id')
        student_id = data.get('student_id')

        if not registration_id or not student_id:
            return jsonify({'error': 'registration_id and student_id are required'}), 400

        registration = UnitRegistration.query.filter_by(id=registration_id, student_id=student_id).first()
        if not registration:
            return jsonify({'error': 'Registration not found'}), 404

        db.session.delete(registration)
        db.session.commit()

        return jsonify({'message': 'Deregistration successful'})
api.add_resource(Register, '/api/register')
api.add_resource(Login, '/api/login')
api.add_resource(Profile, '/api/profile')
api.add_resource(AdminDashboard, '/api/admin_dashboard')

# -------------------- Run App --------------------

if __name__ == "__main__":
    app.run(debug=True)
