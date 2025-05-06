import React, { useState } from 'react';
import axios from 'axios';

const ClearanceForm = () => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [clearanceStatus, setClearanceStatus] = useState('');
  const [department, setDepartment] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setUploadedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!uploadedFile) {
      alert('Please upload a required document.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('studentId', studentId);
    formData.append('clearanceStatus', clearanceStatus);
    formData.append('department', department);
    formData.append('uploadedFile', uploadedFile);
    if (clearanceStatus === 'not-cleared') {
      formData.append('remarks', remarks);
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/clearance', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setIsSubmitted(true);
      console.log('Form submitted:', response.data);
    } catch (err) {
      setError('There was an error submitting the form.');
      console.error('Error submitting form:', err);
    }
  };

  return (
    <div className="clearance-form-container">
      <h2>Clearance Form - Student Campus Portal</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="studentId">Student ID:</label>
          <input
            type="text"
            id="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <input
            type="text"
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="clearanceStatus">Clearance Status:</label>
          <select
            id="clearanceStatus"
            value={clearanceStatus}
            onChange={(e) => setClearanceStatus(e.target.value)}
            required
          >
            <option value="">Select Status</option>
            <option value="cleared">Cleared</option>
            <option value="pending">Pending</option>
            <option value="not-cleared">Not Cleared</option>
          </select>
        </div>

        {clearanceStatus === 'not-cleared' && (
          <div className="form-group">
            <label htmlFor="remarks">Remarks:</label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Provide remarks for not cleared status"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="uploadedFile">Upload Clearance Document:</label>
          <input
            type="file"
            id="uploadedFile"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.png"
            required
          />
        </div>

        <div className="form-group">
          <button type="submit">Submit</button>
        </div>
      </form>

      {isSubmitted && (
        <div className="submission-success">
          <h3>Form Submitted Successfully</h3>
          <p>Name: {name}</p>
          <p>Student ID: {studentId}</p>
          <p>Department: {department}</p>
          <p>Clearance Status: {clearanceStatus}</p>
          {clearanceStatus === 'not-cleared' && <p>Remarks: {remarks}</p>}
          <p>Uploaded File: {uploadedFile ? uploadedFile.name : 'No file uploaded'}</p>
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ClearanceForm;
