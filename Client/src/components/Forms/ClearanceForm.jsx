import React, { useState } from 'react';
import axios from 'axios';

const DocumentRequestForm = () => {
    const [formData, setFormData] = useState({
        student_id: '',
        document_type: '',
        reason: ''
    });
    const [message, setMessage] = useState('');

    const documentTypes = [
        'Transcript',
        'Certificate',
        'Clearance Letter',
        'Admission Letter',
        'Other'
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/document-requests', formData);
            setMessage('Document request submitted successfully!');
            setFormData({ student_id: '', document_type: '', reason: '' });
        } catch (err) {
            console.error('Request failed', err);
            setMessage('Failed to submit request. Please try again.');
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Document Request Form</h2>
            {message && <p className="mb-4">{message}</p>}

            <form onSubmit={handleSubmit} className="border p-4 rounded">
                <div className="mb-2">
                    <label className="block mb-1">Student ID</label>
                    <input
                        type="text"
                        name="student_id"
                        value={formData.student_id}
                        onChange={handleChange}
                        placeholder="Enter your student ID"
                        className="border p-2 w-full"
                        required
                    />
                </div>

                <div className="mb-2">
                    <label className="block mb-1">Document Type</label>
                    <select
                        name="document_type"
                        value={formData.document_type}
                        onChange={handleChange}
                        className="border p-2 w-full"
                        required
                    >
                        <option value="">Select document</option>
                        {documentTypes.map((doc) => (
                            <option key={doc} value={doc}>
                                {doc}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label className="block mb-1">Reason</label>
                    <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        placeholder="Provide a brief reason"
                        className="border p-2 w-full"
                        required
                    />
                </div>

                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    Submit Request
                </button>
            </form>
        </div>
    );
};

export default DocumentRequestForm;
