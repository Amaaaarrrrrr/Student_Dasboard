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

    # Exclude password_hash from serialization
    serialize_rules = ('-password_hash', '-student_profile.user', '-lecturer_profile.user')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """
        Convert the User object to a dictionary.
        Used for serializing the User object to JSON format.
        """
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at,
            'student_profile': self.student_profile.to_dict() if self.student_profile else None,
            'lecturer_profile': self.lecturer_profile.to_dict() if self.lecturer_profile else None
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
