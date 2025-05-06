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

    useEffect(() => {
        fetchStudents();
        fetchUnits();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/api/students');
            setStudents(res.data);
        } catch (err) {
            console.error('Failed to fetch students', err);
        }
    };

    const fetchUnits = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/api/units_registrations');
            setUnits(res.data);
        } catch (err) {
            console.error('Failed to fetch units', err);
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
            await axios.post('http://127.0.0.1:5000/api/unit-registrations', formData);
            setMessage('Unit registration successful!');
            setFormData({ student_id: '', unit_id: '', semester: '' });
        } catch (err) {
            console.error('Registration failed', err);
            setMessage('Failed to register unit. Please try again.');
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Unit Registration Form</h2>
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
