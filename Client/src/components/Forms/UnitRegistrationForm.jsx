import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UnitRegistrationForm = () => {
    const [students, setStudents] = useState([]);
    const [units, setUnits] = useState([]);
    const [formData, setFormData] = useState({
        student_id: '',
        unit_id: '',
        semester: '',
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true); // Loading state for data fetching

    // Retrieve token from localStorage (or wherever you store it after login)
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!token) {
            setMessage('You must be logged in to register units');
            setLoading(false);
            return;
        }

        // Fetch students and units concurrently
        const fetchData = async () => {
            try {
                await Promise.all([fetchStudents(), fetchUnits()]);
            } catch (err) {
                setMessage('Failed to fetch data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const fetchStudents = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/api/students', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStudents(res.data.students); // assuming backend returns { students: [...] }
        } catch (err) {
            console.error('Failed to fetch students', err);
            setMessage('Failed to fetch students. Please try again.');
        }
    };

    const fetchUnits = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/api/registration', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUnits(res.data.units); // assuming backend returns { units: [...] }
        } catch (err) {
            console.error('Failed to fetch units', err);
            setMessage('Failed to fetch units. Please try again.');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.student_id || !formData.unit_id || !formData.semester) {
            setMessage('Please fill all fields.');
            return;
        }

        try {
            await axios.post('http://127.0.0.1:5000/api/registration', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage('Unit registration successful!');
            setFormData({ student_id: '', unit_id: '', semester: '' });
        } catch (err) {
            console.error('Registration failed', err);
            setMessage('Failed to register unit. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Display a loading message while fetching data
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Unit Registration Form</h2>
            {message && <p className="mb-4 text-red-500">{message}</p>} {/* Red color for error messages */}

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
                                {student.user ? student.user.name : student.name} {/* Adjusted to show student name */}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label className="block mb-1">Unit</label>
                    <select
                        name="unit_id"
                        value={formData.unit_id}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    >
                        <option value="">Select unit</option>
                        {units.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                                {unit.unit_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label className="block mb-1">Semester</label>
                    <input
                        type="text"
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        placeholder="e.g., 2025 Spring"
                        className="border p-2 w-full"
                        required
                    />
                </div>

                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    Register Unit
                </button>
            </form>
        </div>
    );
};

export default UnitRegistrationForm;
