import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const StudentHostel = () => {
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    fetchHostels();
    fetchRooms();
    fetchBookings();
  }, []);

  const fetchHostels = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/hostels');
      setHostels(res.data.hostels);
    } catch (err) {
      toast.error('Failed to load hostels. Showing demo data.');
      setHostels([
        { id: 1, name: 'Hall A', location: 'Zone 1' },
        { id: 2, name: 'Hall B', location: 'Zone 2' },
      ]);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/rooms');
      setRooms(res.data.rooms);
    } catch (err) {
      toast.error('Failed to load rooms. Showing demo data.');
      setRooms([
        { id: 1, hostel_id: 1, room_number: 'A101', capacity: 2, current_occupancy: 1 },
        { id: 2, hostel_id: 2, room_number: 'B202', capacity: 1, current_occupancy: 0 },
      ]);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.bookings);
    } catch (err) {
      toast.error('Failed to load bookings. Showing demo data.');
      setBookings([
        {
          id: 1,
          room_id: 1,
          start_date: '2025-06-01',
          end_date: '2025-08-31',
        },
      ]);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedRoom || !startDate || !endDate) {
      toast.error('Please select a room and dates');
      return;
    }

    try {
      await axios.post(
        'http://127.0.0.1:5000/api/bookings',
        {
          student_id: 1, // Replace with actual current user ID if available
          room_id: selectedRoom.id,
          start_date: startDate,
          end_date: endDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Room booked successfully!');
      setSelectedRoom(null);
      setStartDate('');
      setEndDate('');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed');
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Booking cancelled.');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to cancel booking.');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Hostel & Room Booking</h1>

      {/* Hostel List */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Available Hostels</h2>
        {hostels.map((hostel) => (
          <div key={hostel.id} className="mb-2">
            <p className="font-bold">{hostel.name}</p>
            <p className="text-gray-600">Location: {hostel.location}</p>
          </div>
        ))}
      </div>

      {/* Rooms */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Available Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="border p-4 rounded shadow-sm flex flex-col justify-between"
            >
              <p>Room: {room.room_number}</p>
              <p>Hostel ID: {room.hostel_id}</p>
              <p>
                Capacity: {room.capacity} | Occupied: {room.current_occupancy}
              </p>
              <button
                className="mt-2 bg-blue-600 text-white py-1 px-3 rounded"
                onClick={() => setSelectedRoom(room)}
              >
                Book Room
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Form */}
      {selectedRoom && (
        <form onSubmit={handleBooking} className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Book Room {selectedRoom.room_number}</h2>
          <div className="flex flex-col gap-3">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded"
            />
            <div className="flex gap-3">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                Confirm Booking
              </button>
              <button
                type="button"
                onClick={() => setSelectedRoom(null)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Bookings */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Your Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <ul className="space-y-3">
            {bookings.map((b) => (
              <li key={b.id} className="border-b pb-2">
                Room ID: {b.room_id} | From: {b.start_date} To: {b.end_date}
                <button
                  className="ml-4 text-red-600"
                  onClick={() => handleCancel(b.id)}
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudentHostel;
