import React from 'react';

const RoomCard = ({ roomNumber, building, capacity }) => {
  return (
    <div className="room-card">
      <h3>Room: {roomNumber}</h3>
      <p>Building: {building}</p>
      <p>Capacity: {capacity}</p>
    </div>
  );
};

export default RoomCard;
