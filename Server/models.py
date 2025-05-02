from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Semester(db.Model):
    __tablename__ = 'semesters'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    active = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f"<Semester {self.name}>"

class Course(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(20), nullable=False, unique=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    semester_id = db.Column(db.Integer, db.ForeignKey('semesters.id'), nullable=False)
    program = db.Column(db.String(50), nullable=False)
    prerequisites = db.relationship('Course',
                                    secondary='course_prerequisites',
                                    primaryjoin='Course.id==CoursePrerequisite.course_id',
                                    secondaryjoin='Course.id==CoursePrerequisite.prerequisite_id')

    semester = db.relationship('Semester')

    def __repr__(self):
        return f"<Course {self.code} - {self.title}>"

class CoursePrerequisite(db.Model):
    __tablename__ = 'course_prerequisites'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    prerequisite_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)

class UnitRegistration(db.Model):
    __tablename__ = 'unit_registrations'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, nullable=False)  # Assuming student_id is an integer
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    semester_id = db.Column(db.Integer, db.ForeignKey('semesters.id'), nullable=False)
    registered_on = db.Column(db.DateTime, default=datetime.utcnow)

    course = db.relationship('Course')
    semester = db.relationship('Semester')

    def __repr__(self):
        return f"<UnitRegistration student:{self.student_id} course:{self.course_id} semester:{self.semester_id}>"

    @staticmethod
    def is_already_registered(student_id, course_id, semester_id):
        return UnitRegistration.query.filter_by(
            student_id=student_id,
            course_id=course_id,
            semester_id=semester_id
        ).first() is not None

    @staticmethod
    def check_prerequisites_met(student_id, course):
        # Check if student has registered all prerequisites for the course
        prereqs = course.prerequisites
        for prereq in prereqs:
            registered = UnitRegistration.query.filter_by(
                student_id=student_id,
                course_id=prereq.id
            ).first()
            if not registered:
                return False
        return True
