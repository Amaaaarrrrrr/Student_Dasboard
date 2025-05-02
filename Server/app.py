import os
from flask import Flask, request, jsonify
from flask_migrate import Migrate
from sqlalchemy.exc import SQLAlchemyError
from models import db, Hostel, Room, StudentRoomBooking, FeeStructure, Payment, ClearanceStatus

def create_app():
    app = Flask(__name__)

    # Configurations
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get(
        'DATABASE_URL',
        "postgresql://dashboard:dashboardpass@localhost:5432/student_portal"
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your_updated_secret_key_here')

    db.init_app(app)
    migrate = Migrate(app, db)

    # Routes
    @app.route('/')
    def home():
        return """🎓✨ Welcome to the Student Portal! ✨🎓

I’ve been working on building a Student Portal system that manages:
✅ Fee structures
✅ Student payments
✅ Digital receipts
✅ Hostel booking
✅ Listing of vacant rooms/houses

All powered by Python, Flask, and SQLAlchemy — designed to make student life smoother, more organized, and accessible online."""

    @app.route('/api/hostels', methods=['GET'])
    def get_hostels():
        hostels = Hostel.query.all()
        return jsonify({'hostels': [hostel.to_dict() for hostel in hostels]}), 200

    @app.route('/api/rooms', methods=['GET'])
    def get_rooms():
        rooms = Room.query.all()
        return jsonify({'rooms': [room.to_dict() for room in rooms]}), 200

    @app.route('/api/bookings', methods=['GET'])
    def get_bookings():
        bookings = StudentRoomBooking.query.all()
        return jsonify({'bookings': [booking.to_dict() for booking in bookings]}), 200

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

    @app.route('/api/fee-structure/<int:program_id>/<int:semester_id>', methods=['GET'])
    def get_fee_structure(program_id, semester_id):
        try:
            fee_structure = FeeStructure.query.filter_by(program_id=program_id, semester_id=semester_id).first()
            if fee_structure:
                return jsonify({'success': True, 'data': fee_structure.to_dict()}), 200
            else:
                return jsonify({'success': False, 'message': 'Fee structure not found'}), 404
        except SQLAlchemyError as e:
            print(f"Database error: {str(e)}")
            return jsonify({'success': False, 'message': 'Internal server error'}), 500

    @app.route('/api/fee-structure', methods=['POST'])
    def create_fee_structure():
        try:
            data = request.get_json()

            # Extract values from request data
            program_id = data.get('program_id')
            semester_id = data.get('semester_id')
            amount = data.get('amount')
            due_date = data.get('due_date')

            # Validate inputs
            if not all([program_id, semester_id, amount, due_date]):
                return jsonify({'success': False, 'message': 'Missing required fields'}), 400

            # Create a new FeeStructure object
            new_fee_structure = FeeStructure(
                program_id=program_id,
                semester_id=semester_id,
                amount=amount,
                due_date=due_date
            )

            # Add to session and commit to the database
            db.session.add(new_fee_structure)
            db.session.commit()

            return jsonify({'success': True, 'data': new_fee_structure.to_dict()}), 201

        except SQLAlchemyError as e:
            # Rollback in case of error
            db.session.rollback()
            print(f"Database error: {str(e)}")
            return jsonify({'success': False, 'message': 'Internal server error'}), 500
        except Exception as e:
            db.session.rollback()
            print(f"Unexpected error: {str(e)}")
            return jsonify({'success': False, 'message': 'Internal server error'}), 500

    @app.route('/api/fee-structures/all', methods=['GET'])
    def get_all_fee_structures():
        fee_structures = FeeStructure.query.all()
        fee_structure_list = [fs.to_dict() for fs in fee_structures]
        return jsonify({'fee_structures': fee_structure_list}), 200

    @app.route('/api/payments', methods=['POST'])
    def create_payment():
        try:
            data = request.get_json()

            # Extract values from request data
            student_id = data.get('student_id')
            fee_structure_id = data.get('fee_structure_id')
            amount_paid = data.get('amount_paid')
            payment_method = data.get('payment_method')
            receipt_number = data.get('receipt_number')
            payment_status = data.get('payment_status')
            remarks = data.get('remarks')

            # Validate inputs
            if not all([student_id, fee_structure_id, amount_paid, payment_method, receipt_number]):
                return jsonify({'success': False, 'message': 'Missing required fields'}), 400

            # Create a new Payment object
            new_payment = Payment(
                student_id=student_id,
                fee_structure_id=fee_structure_id,
                amount_paid=amount_paid,
                payment_method=payment_method,
                receipt_number=receipt_number,
                payment_status=payment_status,
                remarks=remarks
            )

            # Add to session and commit to the database
            db.session.add(new_payment)
            db.session.commit()

            return jsonify({'success': True, 'data': new_payment.to_dict()}), 201

        except SQLAlchemyError as e:
            # Rollback in case of error
            db.session.rollback()
            print(f"Database error: {str(e)}")
            return jsonify({'success': False, 'message': 'Internal server error'}), 500
        except Exception as e:
            db.session.rollback()
            print(f"Unexpected error: {str(e)}")
            return jsonify({'success': False, 'message': 'Internal server error'}), 500

    @app.route('/api/payments', methods=['GET'])
    def get_payments():
        payments = Payment.query.all()
        payment_list = [payment.to_dict() for payment in payments]
        return jsonify({'payments': payment_list}), 200

    @app.route('/api/clearance/<int:student_id>', methods=['GET'])
    def get_clearance_status(student_id):
        try:
            clearance_status = ClearanceStatus.query.filter_by(student_id=student_id).first()
            if clearance_status:
                return jsonify({'success': True, 'data': clearance_status.to_dict()}), 200
            else:
                return jsonify({'success': False, 'message': 'Clearance status not found'}), 404
        except SQLAlchemyError as e:
            print(f"Database error: {str(e)}")
            return jsonify({'success': False, 'message': 'Internal server error'}), 500
  
    @app.route('/admin/clearance/<int:student_id>', methods=['PUT'])
    def update_clearance_status(student_id):
        try:
            clearance_status = ClearanceStatus.query.filter_by(student_id=student_id).first()
            if not clearance_status:
                return jsonify({'success': False, 'message': 'Clearance status not found'}), 404

            data = request.get_json()

            # Update clearance fields
            clearance_status.hostel_clearance = data.get('hostel_clearance', clearance_status.hostel_clearance)
            clearance_status.fee_clearance = data.get('fee_clearance', clearance_status.fee_clearance)
            clearance_status.library_clearance = data.get('library_clearance', clearance_status.library_clearance)
            clearance_status.sports_clearance = data.get('sports_clearance', clearance_status.sports_clearance)
            clearance_status.lab_clearance = data.get('lab_clearance', clearance_status.lab_clearance)
            clearance_status.status = data.get('status', clearance_status.status)
            clearance_status.remarks = data.get('remarks', clearance_status.remarks)

            db.session.commit()

            return jsonify({'success': True, 'data': clearance_status.to_dict()}), 200

        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Database error: {str(e)}")
            return jsonify({'success': False, 'message': 'Internal server error'}), 500
        except Exception as e:
            db.session.rollback()
            print(f"Unexpected error: {str(e)}")
            return jsonify({'success': False, 'message': 'Internal server error'}), 500
        
        

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
