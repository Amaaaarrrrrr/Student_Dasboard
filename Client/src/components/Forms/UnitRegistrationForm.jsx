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
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!token) {
            setMessage('You must be logged in to register units');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [studentRes, unitRes] = await Promise.all([
                    axios.get('http://127.0.0.1:5000/api/students', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('http://127.0.0.1:5000/api/registration', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setStudents(studentRes.data.students || []);
                setUnits(unitRes.data.units || []);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setMessage('Failed to fetch data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.student_id || !formData.unit_id || !formData.semester) {
            setMessage('Please fill in all fields.');
            return;
        }

        try {
            await axios.post('http://127.0.0.1:5000/api/registration', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage('✅ Unit registration successful!');
            setFormData({ student_id: '', unit_id: '', semester: '' });
        } catch (error) {
            console.error('Registration failed:', error);
            setMessage('❌ Failed to register unit. Please try again.');
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Unit Registration Form</h2>
            {message && <p className="mb-4 text-center text-red-500">{message}</p>}

            <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Student</label>
                    <select
                        name="student_id"
                        value={formData.student_id}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                        required
                    >
                        <option value="">Select student</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.user ? student.user.name : student.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-medium">Unit</label>
                    <select
                        name="unit_id"
                        value={formData.unit_id}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
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

                <div className="mb-4">
                    <label className="block mb-1 font-medium">Semester</label>
                    <input
                        type="text"
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        placeholder="e.g., 2025 Spring"
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
                >
                    Register Unit
                </button>
            </form>
        </div>
    );
};

export default UnitRegistrationForm;
