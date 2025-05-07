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
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchUnits();
    }, []);

    const fetchUnits = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://127.0.0.1:5000/api/courses?audience=lecturer', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUnits(res.data);
        } catch (err) {
            console.error('Failed to fetch units', err);
            if (err.response && err.response.status === 401) {
                setMessage('Session expired. Please log in again.');
            } else {
                setMessage('Failed to fetch units.');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async (course_id) => {
        setLoading(true);
        try {
            const res = await axios.get(`http://127.0.0.1:5000/api/students?course_id=${course_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(res.data);
            if (res.data.length === 0) {
                setMessage('No students available for this course.');
            } else {
                setMessage('');
            }
        } catch (err) {
            console.error('Failed to fetch students', err);
            if (err.response && err.response.status === 401) {
                setMessage('Session expired. Please log in again.');
            } else {
                setMessage('Failed to fetch students.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCourseSelect = (unit) => {
        setSelectedCourse(unit);
        setFormData({ ...formData, unit_id: unit.id });
        fetchStudents(unit.id);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate grade format (allow letters, +, -)
        const gradeRegex = /^[A-F][+-]?$/;
        if (!formData.student_id || !formData.unit_id || !formData.grade) {
            setMessage('Please fill in all fields.');
            return;
        } else if (!gradeRegex.test(formData.grade.trim().toUpperCase())) {
            setMessage('Invalid grade format. Use A, B+, C-, etc.');
            return;
        }

        try {
            await axios.post('http://127.0.0.1:5000/api/grades', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Grade entry successful!');
            setFormData({ student_id: '', unit_id: formData.unit_id, grade: '' });
        } catch (err) {
            console.error('Grade entry failed', err);
            if (err.response && err.response.status === 401) {
                setMessage('Session expired. Please log in again.');
            } else {
                setMessage('Failed to submit grade. Please try again.');
            }
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Grade Entry Form</h2>
            {message && <p className="mb-4 text-red-600">{message}</p>}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="mb-4">
                        <label className="block mb-1">Select a Course</label>
                        <select
                            name="unit_id"
                            onChange={(e) => handleCourseSelect(units.find(unit => unit.id.toString() === e.target.value))}
                            className="border p-2 w-full"
                            value={selectedCourse ? selectedCourse.id : ''}
                        >
                            <option value="">Select course</option>
                            {units.map((unit) => (
                                <option key={unit.id} value={unit.id}>
                                    {unit.unit_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedCourse && (
                        <form onSubmit={handleSubmit} className="border p-4 rounded">
                            <h3 className="text-lg mb-4">Post Grades for {selectedCourse.unit_name}</h3>

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
                                <label className="block mb-1">Grade</label>
                                <input
                                    type="text"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleChange}
                                    placeholder="e.g., A, B+, C-"
                                    className="border p-2 w-full"
                                    required
                                />
                            </div>

                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Submit Grade
                            </button>
                        </form>
                    )}
                </>
            )}
        </div>
    );
};

export default GradeEntryForm;
