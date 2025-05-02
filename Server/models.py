from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy as sa

db = SQLAlchemy()

class SerializableMixin:
    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Hostel(db.Model, SerializableMixin):
    __tablename__ = 'hostels'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)

    rooms = db.relationship('Room', back_populates='hostel', lazy=True)

class Room(db.Model, SerializableMixin):
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    room_number = db.Column(db.String(50), nullable=False)
    hostel_id = db.Column(db.Integer, db.ForeignKey('hostels.id'), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    current_occupancy = db.Column(db.Integer, default=0)

    hostel = db.relationship('Hostel', back_populates='rooms', lazy=True)
    bookings = db.relationship('StudentRoomBooking', back_populates='room', lazy=True)

class Student(db.Model, SerializableMixin):
    __tablename__ = 'students'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)

    bookings = db.relationship('StudentRoomBooking', back_populates='student', lazy=True)
    payments = db.relationship('Payment', back_populates='student', lazy=True)
    clearance_status = db.relationship('ClearanceStatus', back_populates='student', uselist=False, lazy=True)

class StudentRoomBooking(db.Model, SerializableMixin):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False)
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), default='pending')

    student = db.relationship('Student', back_populates='bookings', lazy=True)
    room = db.relationship('Room', back_populates='bookings', lazy=True)

class FeeStructure(db.Model, SerializableMixin):
    __tablename__ = 'fee_structures'
    id = db.Column(db.Integer, primary_key=True)
    program_id = db.Column(db.Integer, nullable=False)
    semester_id = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    due_date = db.Column(db.DateTime, nullable=False)

    payments = db.relationship('Payment', back_populates='fee_structure', lazy=True)

class Payment(db.Model, SerializableMixin):
    __tablename__ = 'payments'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    fee_structure_id = db.Column(db.Integer, db.ForeignKey('fee_structures.id'), nullable=False)
    amount_paid = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    payment_method = db.Column(sa.Enum('credit_card', 'debit_card', 'Mpesa', 'net_banking', name='payment_method_enum'), nullable=False)
    receipt_number = db.Column(db.String(100), unique=True, nullable=False)
    payment_status = db.Column(db.String(50), default='success')
    remarks = db.Column(db.String(255), nullable=True)

    fee_structure = db.relationship('FeeStructure', back_populates='payments', lazy=True)
    student = db.relationship('Student', back_populates='payments', lazy=True)

class ClearanceStatus(db.Model, SerializableMixin):
    __tablename__ = 'clearance_status'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    hostel_clearance = db.Column(db.Boolean, default=False)
    fee_clearance = db.Column(db.Boolean, default=False)
    library_clearance = db.Column(db.Boolean, default=False)
    lab_clearance = db.Column(db.Boolean, default=False)
    clearance_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default='pending')
    remarks = db.Column(db.String(255), nullable=True)

    student = db.relationship('Student', back_populates='clearance_status', lazy=True)
