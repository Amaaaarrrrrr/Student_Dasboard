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
        }
    };

    const fetchRooms = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/api/rooms');
            setRooms(res.data);
        } catch (err) {
            console.error('Failed to fetch rooms', err);
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
        try {
            await axios.post('http://127.0.0.1:5000/api/bookings', formData);
            setMessage('Room booking successful!');
            setFormData({ student_id: '', room_id: '', booking_date: '' });
        } catch (err) {
            console.error('Booking failed', err);
            setMessage('Failed to book room. Please try again.');
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Room Booking Form</h2>
            {message && <p className="mb-4">{message}</p>}

            <form onSubmit={handleSubmit} className="border p-4 rounded">
                <div className="mb-2">
                    <label className="block mb-1">Student</label>
                    <select
                        name="student_id"
                        value={formData.student_id}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    >
                        <option value="">Select student</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label className="block mb-1">Room</label>
                    <select
                        name="room_id"
                        value={formData.room_id}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    >
                        <option value="">Select room</option>
                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                {room.room_number}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label className="block mb-1">Booking Date</label>
                    <input
                        type="date"
                        name="booking_date"
                        value={formData.booking_date}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    />
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Book Room
                </button>
            </form>
        </div>
    );
};

export default RoomBookingForm;
