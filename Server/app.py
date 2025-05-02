import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity, get_jwt
)
from flask_cors import CORS
from datetime import timedelta
from functools import wraps

from models import db, User, StudentProfile, LecturerProfile, Course, Semester, UnitRegistration,Grade, Announcement, AuditLog, DocumentRequest

# Flask App Config
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'DATABASE_URL',
    "postgresql://dashboard:dashboardpass@localhost:5432/student_portal"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your_updated_secret_key_here')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'super-secret-jwt-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

# Initialize Extensions
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
api = Api(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# -------------------- JWT Error Handlers --------------------
@jwt.unauthorized_loader
def unauthorized_callback(callback):
    return jsonify({"error": "Missing Authorization Header"}), 401
@jwt.expired_token_loader
def expired_token_callback(callback):
    return jsonify({"error": "Token has expired"}), 401
@jwt.invalid_token_loader
def invalid_token_callback(callback):
    return jsonify({"error": "Invalid token"}), 401
@jwt.needs_fresh_token_loader
def fresh_token_callback(callback):
    return jsonify({"error": "Fresh token required"}), 401
@jwt.revoked_token_loader
def revoked_token_callback(callback):
    return jsonify({"error": "Token has been revoked"}), 401
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id
@jwt.user_claims_loader
def add_claims_to_access_token(user):
    return {
        'role': user.role,
        'name': user.name,
        'email': user.email
    }
@jwt.user_loader_callback_loader
def user_loader_callback(identity):
    user = User.query.get(identity)
    if not user:
        return None
    return user
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    token = TokenBlacklist.query.filter_by(jti=jti).first()
    if token:
        return True
    return False
# -------------------- Token Blacklist Model --------------------
class TokenBlacklist(db.Model):
    __tablename__ = 'token_blacklist'
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __repr__(self):
        return f"<TokenBlacklist {self.jti}>"
# -------------------- Token Blacklist Resource --------------------
class TokenBlacklistResource(Resource):
    @jwt_required()
    def post(self):
        jti = get_jwt()['jti']
        token = TokenBlacklist(jti=jti)
        db.session.add(token)
        db.session.commit()
        return jsonify({"message": "Token blacklisted"}), 200

    @jwt_required()
    def delete(self):
        jti = get_jwt()['jti']
        token = TokenBlacklist.query.filter_by(jti=jti).first()
        if not token:
            return jsonify({"error": "Token not found"}), 404
        db.session.delete(token)
        db.session.commit()
        return jsonify({"message": "Token removed from blacklist"}), 200
# Register TokenBlacklistResource
api.add_resource(TokenBlacklistResource, '/api/token_blacklist')


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
    student_id = request.args.get('student_id') or request.get_json(silent=True, force=True).get('student_id')
    if not student_id:
        return jsonify({'error': 'student_id is required'}), 400

    if request.method == 'GET':
        registrations = UnitRegistration.query.filter_by(student_id=student_id).all()
        return jsonify([{
            'id': reg.id,
            'student_id': reg.student_id,
            'course_id': reg.course_id,
            'course_code': reg.course.code,
            'course_title': reg.course.title,
            'semester_id': reg.semester_id,
            'registered_on': reg.registered_on.isoformat()
        } for reg in registrations])

    elif request.method == 'POST':
        data = request.get_json()
        course_id = data.get('course_id')
        semester_id = data.get('semester_id')

        if not all([student_id, course_id, semester_id]):
            return jsonify({'error': 'student_id, course_id, and semester_id are required'}), 400

        if UnitRegistration.is_already_registered(student_id, course_id, semester_id):
            return jsonify({'error': 'Already registered for this course in the semester'}), 400

        course = Course.query.get(course_id)
        if not course:
            return jsonify({'error': 'Course not found'}), 404
        if not UnitRegistration.check_prerequisites_met(student_id, course):
            return jsonify({'error': 'Prerequisites not met'}), 400

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

        if not registration_id:
            return jsonify({'error': 'registration_id is required'}), 400

        registration = UnitRegistration.query.filter_by(id=registration_id, student_id=student_id).first()
        if not registration:
            return jsonify({'error': 'Registration not found'}), 404

        db.session.delete(registration)
        db.session.commit()
        return jsonify({'message': 'Deregistration successful'})

# -------------------- Resource Routes --------------------
api.add_resource(Register, '/api/register')
api.add_resource(Login, '/api/login')
api.add_resource(Profile, '/api/profile')
api.add_resource(AdminDashboard, '/api/admin_dashboard')

# -------------------- Grades Resource --------------------
@app.route('/api/grades', methods=['GET', 'POST'])
@jwt_required()
def grades():
    if request.method == 'GET':
        student_id = get_jwt_identity()
        grades = Grade.query.filter_by(student_id=student_id).all()
        return jsonify([{
            'course_code': g.course.code,
            'course_title': g.course.title,
            'grade': g.grade,
            'semester': g.semester.name,
            'date_posted': g.date_posted.isoformat()
        } for g in grades])

    elif request.method == 'POST':
        data = request.get_json()
        student_id = data.get('student_id')
        course_id = data.get('course_id')
        grade = data.get('grade')
        semester_id = data.get('semester_id')

        if not all([student_id, course_id, grade, semester_id]):
            return jsonify({'error': 'Missing required fields'}), 400

        grade_entry = Grade(student_id=student_id, course_id=course_id, grade=grade, semester_id=semester_id)
        db.session.add(grade_entry)
        db.session.commit()
        return jsonify({'message': 'Grade added successfully'}), 201

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
    
# -------------------- Run --------------------
if __name__ == "__main__":
    app.run(debug=True)
