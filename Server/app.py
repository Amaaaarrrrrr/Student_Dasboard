import os
from flask import Flask, request, jsonify
from flask_migrate import Migrate
from models import db, Hostel, Room, StudentRoomBooking

def create_app():
    app = Flask(__name__)

    # Configurations
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
        'DATABASE_URL',
        "postgresql://dashboard:y2025@localhost:5432/student_portal"
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your_updated_secret_key_here')

    db.init_app(app)
    migrate = Migrate(app, db)

    # Routes
    @app.route('/')
    def home():
        return "Welcome to the Student Portal!"

    @app.route('/api/hostels', methods=['GET'])
    def get_hostels():
        hostels = Hostel.query.all()
        return jsonify({'hostels': [hostel.to_dict() for hostel in hostels]})

    @app.route('/api/rooms', methods=['GET'])
    def get_rooms():
        rooms = Room.query.all()
        return jsonify({'rooms': [room.to_dict() for room in rooms]})

    @app.route('/api/bookings', methods=['GET'])
    def get_bookings():
        bookings = StudentRoomBooking.query.all()
        return jsonify({'bookings': [booking.to_dict() for booking in bookings]})

    @app.route('/api/bookings', methods=['POST'])
    def create_booking():
        data = request.get_json()
        room = Room.query.get(data['room_id'])
        if not room or not room.is_available():
            return jsonify({'error': 'Room not available'}), 400

        booking = StudentRoomBooking(
            student_id=data['student_id'],
            room_id=data['room_id'],
            start_date=data['start_date'],
            end_date=data['end_date']
        )
        room.current_occupancy += 1
        db.session.add(booking)
        db.session.commit()
        return jsonify({'message': 'Booking created successfully', 'booking': booking.to_dict()}), 201

    @app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
    def cancel_booking(booking_id):
        booking = StudentRoomBooking.query.get_or_404(booking_id)
        room = Room.query.get(booking.room_id)
        if room and room.current_occupancy > 0:
            room.current_occupancy -= 1

        db.session.delete(booking)
        db.session.commit()
        return jsonify({'message': 'Booking cancelled successfully'}), 200

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
