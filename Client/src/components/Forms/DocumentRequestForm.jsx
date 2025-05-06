import React, { useState } from 'react';

const DocumentRequestForm = () => {
    const [formData, setFormData] = useState({
        student_id: '',
        document_type: '',
        reason: ''
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        setMessage('');
        
        try {
        const response = await fetch('http://127.0.0.1:5000/api/documet-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setMessage('Document request submitted successfully!');
            setFormData({ student_id: '', document_type: '', reason: '' });
        } catch (err) {
            console.error('Request failed', err);
            setMessage('Failed to submit request. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded">
            <h2 className="text-xl font-bold mb-4 text-center">Document Request Form</h2>
            
            {message && (
                <div className={`mb-4 p-2 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}            
            <form onSubmit={handleSubmit} className="border p-4 rounded">
                <div className="mb-3">
                    <label className="block mb-1 font-medium">Student ID</label> <input
                        type="text" name="student_id" value={formData.student_id}
                        onChange={handleChange} placeholder="Enter your student ID"
                        className="border p-2 w-full rounded" required
                    />
                </div>
                
                <div className="mb-3"> <label className="block mb-1 font-medium">Document Type</label>
                    <select name="document_type"value={formData.document_type}
                        onChange={handleChange} className="border p-2 w-full rounded"
                        required > <option value="">Select document</option>
                        {documentTypes.map((doc) => ( <option key={doc} value={doc}>
                                {doc} </option>
                        ))} </select>
                </div>
                
                <div className="mb-4"><label className="block mb-1 font-medium">Reason</label>
                    <textarea name="reason" value={formData.reason} onChange={handleChange}
                        placeholder="Provide a brief reason" className="border p-2 w-full rounded h-24"
                        required />
                </div>
                
                <button type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
                    disabled={isLoading}> {isLoading ? 'Submitting...' : 'Submit Request'}
                </button>
            </form>
        </div>
    );
};

export default DocumentRequestForm;