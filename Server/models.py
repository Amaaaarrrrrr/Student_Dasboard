
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy_serializer import SerializerMixin
import sqlalchemy as sa
db = SQLAlchemy()

# -------------------- User Model --------------------

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(50), nullable=False)

    student_profile = db.relationship('StudentProfile', back_populates='user', uselist=False)
    lecturer_profile = db.relationship('LecturerProfile', back_populates='user', uselist=False)
    announcements = db.relationship('Announcement', back_populates='posted_by')
    audit_logs = db.relationship('AuditLog', back_populates='user')
    document_requests = db.relationship('DocumentRequest', back_populates='student')

    serialize_rules = ('id', 'name', 'email', 'role')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self, rules=()):
        rules = rules or self.serialize_rules
        user_dict = {field: getattr(self, field) for field in rules}
        return user_dict


# -------------------- StudentProfile Model --------------------

class StudentProfile(db.Model):
    __tablename__ = 'student_profiles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    reg_no = db.Column(db.String(50), nullable=False, unique=True)
    program = db.Column(db.String(100), nullable=False)
    year_of_study = db.Column(db.Integer, nullable=False)
    phone = db.Column(db.String(20))

    user = db.relationship('User', back_populates='student_profile')
    unit_registrations = db.relationship('UnitRegistration', back_populates='student')
    room_bookings = db.relationship('StudentRoomBooking', back_populates='student')
    payments = db.relationship('Payment', back_populates='student')
    fee_clearance = db.relationship('FeeClearance', back_populates='student')


    serialize_rules = ('id', 'reg_no', 'program', 'year_of_study', 'phone')

    def to_dict(self, rules=()):
        rules = rules or self.serialize_rules
        return {field: getattr(self, field) for field in rules}


# -------------------- LecturerProfile Model --------------------

class LecturerProfile(db.Model):
    __tablename__ = 'lecturer_profiles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    staff_no = db.Column(db.String(50), nullable=False, unique=True)
    department = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))

    user = db.relationship('User', back_populates='lecturer_profile')

    serialize_rules = ('id', 'staff_no', 'department', 'phone')

    def to_dict(self, rules=()):
        rules = rules or self.serialize_rules
        return {field: getattr(self, field) for field in rules}


# -------------------- Course Model --------------------

class Course(db.Model):
    __tablename__ = 'courses'

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(10), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    semester_id = db.Column(db.Integer, db.ForeignKey('semesters.id'), nullable=False)
    program = db.Column(db.String(50), nullable=False)

    semester = db.relationship('Semester', back_populates='courses')
    unit_registrations = db.relationship('UnitRegistration', back_populates='course')
    prerequisites = db.relationship(
        'Course',
        secondary='course_prerequisites',
        primaryjoin='Course.id==course_prerequisites.c.course_id',
        secondaryjoin='Course.id==course_prerequisites.c.prerequisite_id',
        back_populates='dependent_courses'
    )
    dependent_courses = db.relationship(
        'Course',
        secondary='course_prerequisites',
        primaryjoin='Course.id==course_prerequisites.c.prerequisite_id',
        secondaryjoin='Course.id==course_prerequisites.c.course_id',
        back_populates='prerequisites'
    )

    serialize_rules = ('id', 'code', 'title', 'description', 'semester_id', 'program')

    def to_dict(self, rules=()):
        rules = rules or self.serialize_rules
        return {field: getattr(self, field) for field in rules}


# -------------------- Semester Model --------------------

class Semester(db.Model):
    __tablename__ = 'semesters'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    active = db.Column(db.Boolean, default=False)

    courses = db.relationship('Course', back_populates='semester')
    unit_registrations = db.relationship('UnitRegistration', back_populates='semester')

    serialize_rules = ('id', 'name', 'start_date', 'end_date', 'active')

    def to_dict(self, rules=()):
        rules = rules or self.serialize_rules
        return {
            'id': self.id,
            'name': self.name,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'active': self.active
        }


# -------------------- UnitRegistration Model --------------------

class UnitRegistration(db.Model):
    __tablename__ = 'unit_registrations'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    semester_id = db.Column(db.Integer, db.ForeignKey('semesters.id'), nullable=False)
    registered_on = db.Column(db.DateTime, default=datetime.utcnow)

    student = db.relationship('StudentProfile', back_populates='unit_registrations')
    course = db.relationship('Course', back_populates='unit_registrations')
    semester = db.relationship('Semester', back_populates='unit_registrations')

    serialize_rules = ('id', 'student_id', 'course_id', 'course_code', 'course_title', 'semester_id', 'registered_on')

    @staticmethod
    def is_already_registered(student_id, course_id, semester_id):
        return db.session.query(UnitRegistration).filter_by(
            student_id=student_id,
            course_id=course_id,
            semester_id=semester_id
        ).first() is not None

    @staticmethod
    def check_prerequisites_met(student_id, course):
        """
        This method assumes the Course model has a relationship or field for prerequisites,
        and we have a way to know completed courses for the student.
        """
        if not course.prerequisites:
            return True  # No prerequisites required

        completed_course_ids = {
            reg.course_id for reg in UnitRegistration.query.filter_by(student_id=student_id)
        }

        required_prereq_ids = {prereq.id for prereq in course.prerequisites}
        return required_prereq_ids.issubset(completed_course_ids)

    def to_dict(self, rules=()):
        rules = rules or self.serialize_rules
        return {
            'id': self.id,
            'student_id': self.student_id,
            'course_id': self.course_id,
            'course_code': self.course.code,
            'course_title': self.course.title,
            'semester_id': self.semester_id,
            'registered_on': self.registered_on.isoformat()
        }


# -------------------- Course Prerequisite Table --------------------

course_prerequisites = db.Table(
    'course_prerequisites',
    db.Column('course_id', db.Integer, db.ForeignKey('courses.id')),
    db.Column('prerequisite_id', db.Integer, db.ForeignKey('courses.id'))
)


class Grade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    grade = db.Column(db.String(2), nullable=False)
    semester_id = db.Column(db.Integer, db.ForeignKey('semester.id'), nullable=False)
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)

    student = db.relationship('User', back_populates='grades')
    course = db.relationship('Course', back_populates='grades')
    semester = db.relationship('Semester', back_populates='grades')

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'course_code': self.course.code,
            'course_title': self.course.title,
            'grade': self.grade,
            'semester': self.semester.name,
            'date_posted': self.date_posted.isoformat() if self.date_posted else None
        }

    
class Announcement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)
    posted_by_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    posted_by = db.relationship('User', back_populates='announcements')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'date_posted': self.date_posted.isoformat() if self.date_posted else None,
            'posted_by': self.posted_by.name
        }


class AuditLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    details = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    user = db.relationship('User', back_populates='audit_logs')

    def to_dict(self):
        return {
            'id': self.id,
            'action': self.action,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'details': self.details,
            'user': self.user.name
        }


class DocumentRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    document_type = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), default='Pending')
    requested_on = db.Column(db.DateTime, default=datetime.utcnow)
    processed_on = db.Column(db.DateTime)

    student = db.relationship('User', back_populates='document_requests')

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'document_type': self.document_type,
            'status': self.status,
            'requested_on': self.requested_on.isoformat() if self.requested_on else None,
            'processed_on': self.processed_on.isoformat() if self.processed_on else None
        }



# -------------------- Hostel and Accommodation Models --------------------

class Hostel(db.Model):
    __tablename__ = 'hostels'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    rooms = db.relationship('Room', back_populates='hostel')

    serialize_rules = ('id', 'name', 'location', 'capacity')

    def to_dict(self, rules=()):
        rules = rules or self.serialize_rules
        return {field: getattr(self, field) for field in rules}


class Room(db.Model):
    __tablename__ = 'rooms'

    id = db.Column(db.Integer, primary_key=True)
    hostel_id = db.Column(db.Integer, db.ForeignKey('hostels.id'), nullable=False)
    room_number = db.Column(db.String(20), nullable=False)
    bed_count = db.Column(db.Integer, nullable=False)
    price_per_bed = db.Column(db.Float, nullable=False)

    hostel = db.relationship('Hostel', back_populates='rooms')
    student_bookings = db.relationship('StudentRoomBooking', back_populates='room')

    serialize_rules = ('id', 'hostel_id', 'room_number', 'bed_count', 'price_per_bed')

    def to_dict(self, rules=()):
        rules = rules or self.serialize_rules
        return {field: getattr(self, field) for field in rules}


class StudentRoomBooking(db.Model):
    __tablename__ = 'student_room_bookings'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False)
    booked_on = db.Column(db.DateTime, default=datetime.utcnow)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)

    student = db.relationship('StudentProfile', back_populates='room_bookings')
    room = db.relationship('Room', back_populates='student_bookings')

    serialize_rules = ('id', 'student_id', 'room_id', 'start_date', 'end_date', 'booked_on')

    def to_dict(self, rules=()):
        rules = rules or self.serialize_rules
        return {
            'id': self.id,
            'student_id': self.student_id,
            'room_number': self.room.room_number,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'booked_on': self.booked_on.isoformat()
        }


# -------------------- Fee Structure Models --------------------

class FeeStructure(db.Model):
    __tablename__ = 'fee_structures'

    id = db.Column(db.Integer, primary_key=True)
    program = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payments = db.relationship('Payment', back_populates='fee_structure')

    serialize_rules = ('id', 'program', 'amount', 'payments')

    def to_dict(self, rules=()):
        rules = rules or self.serialize_rules
        return {field: getattr(self, field) for field in rules}


class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id'), nullable=False)
    fee_structure_id = db.Column(db.Integer, db.ForeignKey('fee_structures.id'), nullable=False)
    amount_paid = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    payment_method = db.Column(db.String(50), nullable=False)

    student = db.relationship('StudentProfile', back_populates='payments')
    fee_structure = db.relationship('FeeStructure', back_populates='payments')
    

    serialize_rules = ('id', 'student_id', 'amount_paid', 'payment_date', 'payment_method')

    def to_dict(self, rules=()):
        rules = rules or self.serialize_rules
        return {
            'id': self.id,
            'student_id': self.student_id,
            'fee_structure_id': self.fee_structure_id,
            'amount_paid': self.amount_paid,
            'payment_date': self.payment_date.isoformat(),
            'payment_method': self.payment_method
        }


class FeeClearance(db.Model):
    __tablename__ = 'fee_clearances'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profiles.id'), nullable=False)
    cleared_on = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default='Pending')

    student = db.relationship('StudentProfile', back_populates='fee_clearance')

    serialize_rules = ('id', 'student_id', 'cleared_on', 'status')

    def to_dict(self, rules=()):
        rules = rules or self.serialize_rules
        return {
            'id': self.id,
            'student_id': self.student_id,
            'cleared_on': self.cleared_on.isoformat() if self.cleared_on else None,
            'status': self.status
        }