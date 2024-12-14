import React from "react";
import "../App.css"; // Assuming you're using a separate CSS file

const Card = ({ name, date, location }) => {
  return (
    <div className="card">
      <h2 className="card-title">{name}</h2>
      <p className="card-details">{date}</p>
      <p className="card-details">{location}</p>
    </div>
  );
};

export default Card;
