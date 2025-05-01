from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Hostel(db.Model):
    __tablename__ = 'hostels'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    rooms = db.relationship('Room', backref='hostel', lazy=True)

    def to_dict(self, include_rooms=False):
        data = {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'capacity': self.capacity,
        }
        if include_rooms:
            data['rooms'] = [room.to_dict() for room in self.rooms]
        else:
            data['room_count'] = len(self.rooms)
        return data

class Room(db.Model):
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    room_number = db.Column(db.String(50), nullable=False)
    hostel_id = db.Column(db.Integer, db.ForeignKey('hostels.id'), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    current_occupancy = db.Column(db.Integer, default=0)
    bookings = db.relationship('StudentRoomBooking', backref='room', lazy=True)

    def is_available(self):
        return self.current_occupancy < self.capacity

    def to_dict(self, include_bookings=False):
        data = {
            'id': self.id,
            'room_number': self.room_number,
            'hostel_id': self.hostel_id,
            'capacity': self.capacity,
            'current_occupancy': self.current_occupancy,
            'available': self.is_available(),
        }
        if include_bookings:
            data['bookings'] = [booking.to_dict() for booking in self.bookings]
        else:
            data['booking_count'] = len(self.bookings)
        return data

class StudentRoomBooking(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False)
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), default='pending')

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'room_id': self.room_id,
            'room_number': self.room.room_number if self.room else None,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'status': self.status,
        }
    
