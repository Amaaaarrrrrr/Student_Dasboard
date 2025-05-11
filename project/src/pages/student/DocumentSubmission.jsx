import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { Loader } from 'lucide-react';

const DocumentSubmission = () => {
  const [documentType, setDocumentType] = useState('');
  const [file, setFile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await API.get('/api/document_requests', { withCredentials: true });
        if (response.status !== 200) {
          throw new Error('Failed to fetch document requests');
        }
        setRequests(response.data);
      } catch (err) {
        setError('Failed to load document requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!documentType) {
      toast.error('Please select a document type.');
      return;
    }

    try {
      setLoading(true);
      const response = await API.post('/api/document_requests', {
        document_type: documentType,
      });
      toast.success(response.data.message);
      setDocumentType('');
      // Refresh list
      const updated = await API.get('/api/document_requests');
      setRequests(updated.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file || !selectedRequestId) {
      toast.error('Select a file and document request.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await API.post(
        `/api/document_requests/${selectedRequestId}/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      toast.success(response.data.message);
      setFile(null);
      setSelectedRequestId(null);
      // Refresh list
      const updated = await API.get('/api/document_requests');
      setRequests(updated.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'File upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      setLoading(true);
      await API.delete('/api/document_requests', {
        data: { request_id: requestId },
      });
      toast.success('Request deleted');
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-100 to-indigo-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">
          Document Request & Upload
        </h1>

        {loading && <Loader className="animate-spin w-6 h-6 mx-auto text-indigo-600 mb-4" />}

        {/* Submit Document Request */}
        <form onSubmit={handleSubmitRequest} className="bg-white p-4 rounded shadow mb-6">
          <label className="block mb-2 text-gray-700">Select Document Type</label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="">-- Select --</option>
            <option value="Transcript">Transcript</option>
            <option value="Letter of Completion">Letter of Completion</option>
            <option value="Enrollment Verification">Enrollment Verification</option>
          </select>
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
            disabled={loading}
          >
            Submit Request
          </button>
        </form>

        {/* Upload File to a Request */}
        <form onSubmit={handleFileUpload} className="bg-white p-4 rounded shadow mb-6">
          <label className="block mb-2 text-gray-700">Select Request to Upload To</label>
          <select
            value={selectedRequestId || ''}
            onChange={(e) => setSelectedRequestId(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          >
            <option value="">-- Select --</option>
            {requests.map((req) => (
              <option key={req.id} value={req.id}>
                {req.document_type} (Status: {req.status})
              </option>
            ))}
          </select>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4 block w-full text-sm text-gray-600"
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            disabled={loading}
          >
            Upload File
          </button>
        </form>

        {/* List of Submitted Requests */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Your Document Requests</h2>
          {requests.length === 0 ? (
            <p className="text-gray-500">No document requests submitted yet.</p>
          ) : (
            <ul>
              {requests.map((req) => (
                <li key={req.id} className="border-b py-2 flex justify-between items-center">
                  <div>
                    <p className="text-gray-800 font-medium">{req.document_type}</p>
                    <p className="text-sm text-gray-500">
                      Status: {req.status} 
                    </p>
                    {req.file_name && (
                      <p className="text-sm text-green-700">File: {req.file_name}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteRequest(req.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default DocumentSubmission;
