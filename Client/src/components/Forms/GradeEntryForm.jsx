import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GradeEntryForm = () => {
    const [students, setStudents] = useState([]);
    const [units, setUnits] = useState([]);
    const [formData, setFormData] = useState({
        student_id: '',
        unit_id: '',
        grade: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchStudents();
        fetchUnits();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await axios.get('/api/students');
            setStudents(res.data);
        } catch (err) {
            console.error('Failed to fetch students', err);
        }
    };

    const fetchUnits = async () => {
        try {
            const res = await axios.get('/api/units');
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
            await axios.post('/api/grades', formData);
            setMessage('Grade entry successful!');
            setFormData({ student_id: '', unit_id: '', grade: '' });
        } catch (err) {
            console.error('Grade entry failed', err);
            setMessage('Failed to submit grade. Please try again.');
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Grade Entry Form</h2>
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
                    <label className="block mb-1">Grade</label>
                    <input
                        type="text"
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        placeholder="e.g., A, B+, C"
                        className="border p-2 w-full"
                        required
                    />
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Submit Grade
                </button>
            </form>
        </div>
    );
};

export default GradeEntryForm;
