from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy_serializer import SerializerMixin

db = SQLAlchemy()

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'student', 'lecturer', 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    student_profile = db.relationship(
        'StudentProfile',
        uselist=False,
        backref='user',
        cascade='all, delete-orphan'
    )
    lecturer_profile = db.relationship(
        'LecturerProfile',
        uselist=False,
        backref='user',
        cascade='all, delete-orphan'
    )
    admin_profile = db.relationship(
        'AdminProfile',
        uselist=False,
        backref='user',
        cascade='all, delete-orphan'
    )

    # Exclude password_hash and profile backrefs from serialization
    serialize_rules = (
        '-password_hash',
        '-student_profile.user',
        '-lecturer_profile.user',
        '-admin_profile.user'
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at,
            'student_profile': self.student_profile.to_dict() if self.student_profile else None,
            'lecturer_profile': self.lecturer_profile.to_dict() if self.lecturer_profile else None,
            'admin_profile': self.admin_profile.to_dict() if self.admin_profile else None
        }


class StudentProfile(db.Model, SerializerMixin):
    __tablename__ = 'student_profiles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    reg_no = db.Column(db.String(50), nullable=False)
    program = db.Column(db.String(100), nullable=False)
    year_of_study = db.Column(db.Integer, nullable=False)
    phone = db.Column(db.String(20))
    cleared_status = db.Column(db.Boolean, default=False)

    serialize_rules = ('-user.student_profile',)

    def to_dict(self):
        return {
            'reg_no': self.reg_no,
            'program': self.program,
            'year_of_study': self.year_of_study,
            'phone': self.phone,
            'cleared_status': self.cleared_status
        }


class LecturerProfile(db.Model, SerializerMixin):
    __tablename__ = 'lecturer_profiles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    staff_no = db.Column(db.String(50), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))

    serialize_rules = ('-user.lecturer_profile',)

    def to_dict(self):
        return {
            'staff_no': self.staff_no,
            'department': self.department,
            'phone': self.phone
        }


class AdminProfile(db.Model, SerializerMixin):
    __tablename__ = 'admin_profiles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    staff_id = db.Column(db.String(50), nullable=False)
    office = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(20))

    serialize_rules = ('-user.admin_profile',)

    def to_dict(self):
        return {
            'staff_id': self.staff_id,
            'office': self.office,
            'phone': self.phone
        }
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
