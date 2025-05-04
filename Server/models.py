from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy_serializer import SerializerMixin

db = SQLAlchemy()

# Base model with common functionality
class BaseModel(db.Model, SerializerMixin):
    __abstract__ = True
    
    def to_dict(self, rules=None):
        """Convert model to dictionary based on serialize_rules"""
        rules = rules or getattr(self, 'serialize_rules', None)
        if not rules:
            return super().to_dict()
        
        result = {}
        for field in rules:
            value = getattr(self, field)
            if isinstance(value, datetime):
                result[field] = value.isoformat()
            else:
                result[field] = value
        return result

# -------------------- User Model --------------------
class User(BaseModel):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(50), nullable=False)


    serialize_rules = ('id', 'name', 'email', 'role')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# -------------------- studentProfile Model --------------------
class studentProfile(BaseModel):
    __tablename__ = 'user_profiles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    reg_no = db.Column(db.String(50), nullable=False, unique=True)
    program = db.Column(db.String(100), nullable=False)
    year_of_study = db.Column(db.Integer, nullable=False)
    phone = db.Column(db.String(20))

    serialize_rules = ('id', 'reg_no', 'program', 'year_of_study', 'phone')

# -------------------- LecturerProfile Model --------------------
class LecturerProfile(BaseModel):
    __tablename__ = 'lecturer_profiles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    staff_no = db.Column(db.String(50), nullable=False, unique=True)
    department = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))

    courses = db.relationship('Course', back_populates='lecturer', foreign_keys='Course.lecturer_id')

    serialize_rules = ('id', 'staff_no', 'department', 'phone')

# -------------------- Semester Model --------------------
class Semester(BaseModel):
    __tablename__ = 'semesters'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    active = db.Column(db.Boolean, default=False)

    serialize_rules = ('id', 'name', 'start_date', 'end_date', 'active')

# -------------------- Course Model --------------------
class Course(BaseModel):
    __tablename__ = 'courses'

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(10), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    semester_id = db.Column(db.Integer, db.ForeignKey('semesters.id'), nullable=False)
    program = db.Column(db.String(50), nullable=False)
    
    lecturer = db.relationship('LecturerProfile', back_populates ='courses', foreign_keys='Course.lecturer_id')
    lecturer_id = db.Column(db.Integer, db.ForeignKey('lecturer_profiles.id'), nullable=True)
   


    serialize_rules = ('id', 'code', 'title', 'description', 'semester_id', 'program')

# -------------------- Course Prerequisite Table --------------------
course_prerequisites = db.Table(
    'course_prerequisites',
    db.Column('course_id', db.Integer, db.ForeignKey('courses.id')),
    db.Column('prerequisite_id', db.Integer, db.ForeignKey('courses.id'))
)

# -------------------- UnitRegistration Model --------------------
class UnitRegistration(BaseModel):
    __tablename__ = 'unit_registrations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_profiles.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    semester_id = db.Column(db.Integer, db.ForeignKey('semesters.id'), nullable=False)
    registered_on = db.Column(db.DateTime, default=datetime.utcnow)

    serialize_rules = ('id', 'user_id', 'course_id', 'semester_id', 'registered_on')

    @staticmethod
    def is_already_registered(user_id, course_id, semester_id):
        return db.session.query(UnitRegistration).filter_by(
            user_id=user_id,
            course_id=course_id,
            semester_id=semester_id
        ).first() is not None

    @staticmethod
    def check_prerequisites_met(user_id, course):
        if not course.prerequisites:
            return True

        completed_course_ids = {
            reg.course_id for reg in UnitRegistration.query.filter_by(user_id=user_id)
        }

        required_prereq_ids = {prereq.id for prereq in course.prerequisites}
        return required_prereq_ids.issubset(completed_course_ids)

# -------------------- Grade Model --------------------
class Grade(BaseModel):
    __tablename__ = 'grades'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    semester_id = db.Column(db.Integer, db.ForeignKey('semesters.id'), nullable=False)
    grade = db.Column(db.String(2), nullable=False)
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)

    serialize_rules = ('id', 'user_id', 'course_id', 'semester_id', 'grade', 'date_posted')

# -------------------- DocumentRequest Model --------------------
class DocumentRequest(BaseModel):
    __tablename__ = 'document_requests'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    document_type = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), nullable=True)
    requested_on = db.Column(db.DateTime, default=datetime.utcnow)
    processed_on = db.Column(db.DateTime)

    serialize_rules = ('id', 'user_id', 'document_type', 'status', 'requested_on', 'processed_on')

# -------------------- AuditLog Model --------------------
class AuditLog(BaseModel):
    __tablename__ = 'audit_logs'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    serialize_rules = ('id', 'user_id', 'action', 'timestamp')

# -------------------- Announcement Model --------------------
class Announcement(BaseModel):
    __tablename__ = 'announcements'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    posted_by_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)

    serialize_rules = ('id', 'title', 'content', 'posted_by_id', 'date_posted')

# -------------------- Hostel Model --------------------
class Hostel(BaseModel):
    __tablename__ = 'hostels'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)

    serialize_rules = ('id', 'name', 'location', 'capacity')

# -------------------- Room Model --------------------
class Room(BaseModel):
    __tablename__ = 'rooms'
    
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String(50), nullable=False)
    hostel_id = db.Column(db.Integer, db.ForeignKey('hostels.id'), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    current_occupancy = db.Column(db.Integer, default=0)

    serialize_rules = ('id', 'number', 'hostel_id', 'capacity', 'current_occupancy')

    def is_available(self):
        return self.current_occupancy < self.capacity

    def book_room(self):
        if self.is_available():
            self.current_occupancy += 1
            db.session.commit()
            return True
        return False

    def cancel_booking(self):
        if self.current_occupancy > 0:
            self.current_occupancy -= 1
            db.session.commit()
            return True
        return False

# -------------------- studentRoomBooking Model --------------------
class studentRoomBooking(BaseModel):
    __tablename__ = 'user_room_bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_profiles.id'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False)
    booking_date = db.Column(db.DateTime, default=datetime.utcnow)

    serialize_rules = ('id', 'user_id', 'room_id', 'booking_date')

# -------------------- FeeStructure Model --------------------
class FeeStructure(BaseModel):
    __tablename__ = 'fee_structures'
    
    id = db.Column(db.Integer, primary_key=True)
    program = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)

    serialize_rules = ('id', 'program', 'amount')

# -------------------- Payment Model --------------------
class Payment(BaseModel):
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_profiles.id'), nullable=False)
    amount_paid = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)

    serialize_rules = ('id', 'user_id', 'amount_paid', 'payment_date')

# -------------------- ClearanceStatus Model --------------------
class ClearanceStatus(BaseModel):
    __tablename__ = 'clearance_statuses'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_profiles.id'), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    date_checked = db.Column(db.DateTime, default=datetime.utcnow)

    serialize_rules = ('id', 'user_id', 'status', 'date_checked')

# ----------------- Define relationships after all models are defined -----------------
def setup_relationships():
    # User relationships
    User.user_profile = db.relationship('studentProfile', back_populates ='user', uselist=False)
    User.lecturer_profile = db.relationship('LecturerProfile', back_populates='user', uselist=False)
    User.announcements = db.relationship('Announcement', back_populates='posted_by', foreign_keys='Announcement.posted_by_id')
    User.audit_logs = db.relationship('AuditLog', back_populates ='user')
    User.document_requests = db.relationship('DocumentRequest', back_populates='user')
    User.grades = db.relationship('Grade', back_populates='user')

    # studentProfile relationships
    studentProfile.unit_registrations = db.relationship('UnitRegistration', back_populates='user')
    studentProfile.room_bookings = db.relationship('studentRoomBooking', back_populates='user')
    studentProfile.payments = db.relationship('Payment', back_populates='user')
    studentProfile.clearance_status = db.relationship('ClearanceStatus', back_populates='user')

    # LecturerProfile relationships
    LecturerProfile.courses = db.relationship('Course', back_populates='lecturer')

    # Course relationships  
    Course.semester = db.relationship('Semester', back_populates ='courses')
    Course.unit_registrations = db.relationship('UnitRegistration', back_populates='course')
    Course.grades = db.relationship('Grade', back_populates='course')
    Course.prerequisites = db.relationship(
        'Course',
        secondary=course_prerequisites,
        primaryjoin=Course.id==course_prerequisites.c.course_id,
        secondaryjoin=Course.id==course_prerequisites.c.prerequisite_id,
        back_populates=db.back_populates ('dependent_courses')
    )

    # Semester relationships
    Semester.unit_registrations = db.relationship('UnitRegistration', back_populates ='semester')
    Semester.grades = db.relationship('Grade', back_populates='semester')

    # Hostel relationships
    Hostel.rooms = db.relationship('Room', back_populates='hostel')

    # Room relationships
    Room.user_room_bookings = db.relationship('studentRoomBooking', back_populates='room')

