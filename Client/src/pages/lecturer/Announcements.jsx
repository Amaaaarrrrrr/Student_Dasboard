import React, { useState, useEffect } from 'react';
import { Bell, PlusCircle, Clock } from 'lucide-react';
import AnnouncementBanner from '../../components/Shared/AnnouncementBanner';

const Announcements = () => {
  // Section 1: State Variables
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Section 2: Fetch Announcements (useEffect)
  useEffect(() => {
    // Display a message before fetching data
    console.log('Fetching announcements...');
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = () => {
    fetch('http://127.0.0.1:5000/api/announcements')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch announcements, Add Some Announcements');
        }
        return response.json();
      })
      .then((data) => {
        setAnnouncements(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  // Section 3: Handle Add Announcement
  const handleAddAnnouncement = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      return;
    }
    
    const newAnnouncement = {
      id: announcements.length + 1,  
      title: newTitle,
      content: newContent,
      created_at: new Date().toISOString(),
    };

    setAnnouncements([...announcements, newAnnouncement]);
    setNewTitle('');
    setNewContent('');
    setIsFormVisible(false);

    fetch('http://127.0.0.1:5000/api/announcements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAnnouncement),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to post announcement');
        }
        return response.json();
      })
      .then((savedAnnouncement) => {
        setAnnouncements([...announcements, savedAnnouncement]);
        setNewTitle('');
        setNewContent('');
        setIsFormVisible(false);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  // Section 4: Helper Function - Format Date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Section 5: Loading and Error Handling
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-blue-500 ml-4">Fetching Announcements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-red-50 rounded-xl shadow-md">
        <div className="flex items-center justify-center text-red-600">
          <p className="font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  // Section 6: UI - Announcements and Form
  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      {/* Announcement Banner */}
      <AnnouncementBanner message="Important Announcements for all Lecturers!" />

      <section className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="text-white" size={24} />
              <h2 className="text-2xl font-bold text-white">Lecturer Announcements</h2>
            </div>
            <button 
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="flex items-center space-x-1 bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-50 transition duration-150"
            >
              <PlusCircle size={16} />
              <span>{isFormVisible ? 'Cancel' : 'New Announcement'}</span>
            </button>
          </div>
        </div>

        {/* Section 6.1: Add New Announcement Form */}
        {isFormVisible && (
          <section className="p-4 bg-blue-50 border-b border-blue-100">
            <div className="space-y-3">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter announcement title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  id="content"
                  placeholder="Enter announcement details"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleAddAnnouncement}
                  disabled={!newTitle.trim() || !newContent.trim()}
                  className={`px-4 py-2 rounded-md text-white font-medium flex items-center space-x-1
                    ${!newTitle.trim() || !newContent.trim() 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  <PlusCircle size={16} />
                  <span>Post Announcement</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Section 6.2: Display Announcements */}
        <section className="p-6">
          {announcements.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bell size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No announcements available for lecturers</p>
              <p className="text-gray-400 text-sm mt-1">Create a new announcement to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <section key={announcement.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-150">
                  <h2 className="text-xl font-semibold text-gray-800">{announcement.title}</h2>
                  <p className="mt-2 text-gray-600">{announcement.content}</p>
                  <div className="mt-4 pt-2 border-t border-gray-100 flex items-center text-xs text-gray-500">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span>{formatDate(announcement.created_at)}</span>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  );
};

export default Announcements;
