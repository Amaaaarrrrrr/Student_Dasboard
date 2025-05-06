import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RoomBookingForm = () => {
    const [students, setStudents] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [formData, setFormData] = useState({
        student_id: '',
        room_id: '',
        booking_date: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStudents();
        fetchRooms();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/api/students');
            setStudents(res.data);
        } catch (err) {
            console.error('Failed to fetch students', err);
            setError('Failed to load students.');
        }
    };

    const fetchRooms = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/api/rooms');
            setRooms(res.data);
        } catch (err) {
            console.error('Failed to fetch rooms', err);
            setError('Failed to load rooms.');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await axios.post('http://127.0.0.1:5000/api/bookings', formData);
            setMessage('✅ Room booking successful!');
            setFormData({ student_id: '', room_id: '', booking_date: '' });
        } catch (err) {
            console.error('Booking failed', err);
            setError('❌ Failed to book room. Please try again.');
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow rounded mt-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Room Booking Form</h2>

            {message && <p className="mb-4 text-green-600">{message}</p>}
            {error && <p className="mb-4 text-red-600">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Student</label>
                    <select
                        name="student_id"
                        value={formData.student_id}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                        required
                    >
                        <option value="">Select student</option>
                        {students.length > 0 ? (
                            students.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.name || 'Unnamed'}
                                </option>
                            ))
                        ) : (
                            <option disabled>No students available</option>
                        )}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Room</label>
                    <select
                        name="room_id"
                        value={formData.room_id}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                        required
                    >
                        <option value="">Select room</option>
                        {rooms.length > 0 ? (
                            rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    {room.room_number || 'Unnamed Room'}
                                </option>
                            ))
                        ) : (
                            <option disabled>No rooms available</option>
                        )}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Booking Date</label>
                    <input
                        type="date"
                        name="booking_date"
                        value={formData.booking_date}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                    Book Room
                </button>
            </form>
        </div>
    );
};

export default RoomBookingForm;
