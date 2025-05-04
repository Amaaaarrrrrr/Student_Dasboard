import React, { useState } from 'react';
import axios from 'axios';

const DocumentRequestComponent = () => {
  const [formData, setFormData] = useState({
    student_id: '',
    document_type: '',
    reason: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/document-requests', formData);
      alert('Request submitted successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to submit request.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="student_id" value={formData.student_id} onChange={handleChange} placeholder="Student ID" />
      <input name="document_type" value={formData.document_type} onChange={handleChange} placeholder="Document Type" />
      <input name="reason" value={formData.reason} onChange={handleChange} placeholder="Reason" />
      <button type="submit">Submit Request</button>
    </form>
  );
};

export default DocumentRequestComponent;
