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

@app.route('/')
def home():
    return "Welcome to the Student Portal!"

api.add_resource(Register, '/api/register')
api.add_resource(Login, '/api/login')
api.add_resource(Profile, '/api/profile')
api.add_resource(AdminDashboard, '/api/admin_dashboard')

# -------------------- Run App --------------------

if __name__ == "__main__":
    app.run(debug=True)
