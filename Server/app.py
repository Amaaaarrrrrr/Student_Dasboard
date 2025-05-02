import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from flask import request, jsonify
from models import db, Course, Semester, UnitRegistration

app = Flask(__name__)

# Load configuration from environment variables
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
    'DATABASE_URL',
    "postgresql://dashboard:dashboardpass@localhost:5432/student_portal")

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your_updated_secret_key_here')

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

if __name__ == "__main__":
    app.run(debug=True)
