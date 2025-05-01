from app import app, db
from models import Hostel, Room, StudentRoomBooking
from datetime import datetime, timedelta
import random

def seed():
    with app.app_context():
        # Clear existing data
        StudentRoomBooking.query.delete()
        Room.query.delete()
        Hostel.query.delete()

        # Seed Hostels
        hostel_names = [
            ('Nyayo 4 Hostel', 'North Wing', 100),
            ('Beta Hostel', 'South Wing', 80),
            ('Gamma Hostel', 'East Wing', 120),
            ('Delta Hostel', 'West Wing', 90),
            ('Kilimanjaro Hostel', 'Central Block', 110),
            ('Zeta Hostel', 'Annex Block', 70),
            ('Eta Hostel', 'Garden Block', 60),
            ('Nyayo 3 Hostel', 'Roof Block', 50),
            ('Nyayo 2', 'Basement Block', 40),
            ('Nyayo 12', 'Main Block', 130) ,
            ('Nyayo 5', 'Upper Block', 150),
            ('Nyandarua Hostel', 'Lower Block', 160),
            ('Ruenzori Hostel', 'Side Block', 170),
            ('Abadare Hostel', 'Back Block', 180),
            ('Aberdare Hostel', 'Front Block', 190),            
        
        ]

        hostels = []
        for name, location, capacity in hostel_names:
            hostel = Hostel(name=name, location=location, capacity=capacity)
            db.session.add(hostel)
            hostels.append(hostel)

        db.session.commit()
        print(f'Seeded {len(hostels)} hostels.')

        # Seed Rooms
        rooms = []
        room_id = 1
        for hostel in hostels:
            for i in range(1, 21):  # 20 rooms per hostel
                room = Room(
                    room_number=f'{hostel.name[0]}-{i}',
                    hostel_id=hostel.id,
                    capacity=random.randint(2, 4),
                    current_occupancy=0
                )
                db.session.add(room)
                rooms.append(room)
                room_id += 1

        db.session.commit()
        print(f'Seeded {len(rooms)} rooms.')

        # Seed Bookings
        bookings = []
        for i in range(20):  # 20 random bookings
            room = random.choice(rooms)
            # Check if the room has available capacity before creating a booking
            if room.current_occupancy < room.capacity:
                booking = StudentRoomBooking(
                    student_id=random.randint(1, 50),
                    room_id=room.id,
                    start_date=datetime.utcnow(),
                    end_date=datetime.utcnow() + timedelta(days=90),
                    status=random.choice(['pending', 'approved', 'rejected'])
                )
                db.session.add(booking)
                room.current_occupancy += 1
                bookings.append(booking)
            else:
                print(f"Room {room.room_number} in {room.hostel.name} is already at full capacity.")

        db.session.commit()
        print(f'Seeded {len(bookings)} bookings.')

if __name__ == '__main__':
    seed()
    print("Seeding completed successfully...!.")