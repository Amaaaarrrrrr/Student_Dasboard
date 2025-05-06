import React from 'react';

const AnnouncementBanner = ({ message }) => {
  return (
    <div className="announcement-banner">
      <p>{message}</p>
    </div>
  );
};

export default AnnouncementBanner;
