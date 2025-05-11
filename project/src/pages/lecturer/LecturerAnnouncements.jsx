// src/pages/lecturer/LecturerAnnouncements.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LecturerAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/announcements');
        console.log('Fetched announcements:', response.data);
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Failed to load announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div>
      <h2>Announcements</h2>
      {loading ? (
        <p>Loading announcements...</p>
      ) : (
        <ul>
          {announcements.map((announcement) => (
            <li key={announcement.id}>{announcement.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LecturerAnnouncements;
