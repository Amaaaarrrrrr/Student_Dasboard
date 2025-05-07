import React from 'react';
import { Bell } from 'lucide-react'; // Make sure to import Bell from lucide-react

const AnnouncementBanner = ({ announcements }) => {
  if (!announcements || announcements.length === 0) return null;

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          className="bg-blue-600 text-white p-4 rounded-md shadow-md flex items-center space-x-4"
        >
          <Bell size={24} />
          <div>
            <h3 className="text-lg font-bold">{announcement.title}</h3>
            <p>{announcement.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementBanner;
