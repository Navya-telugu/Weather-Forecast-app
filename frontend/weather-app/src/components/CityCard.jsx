import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faWind } from "@fortawesome/free-solid-svg-icons";
import { faCloud, faSun, faCloudShowersHeavy } from "@fortawesome/free-solid-svg-icons";
import Modal from "./Modal"; // Make sure the import path is correct
import "./CityCard.css";

function CityCard({ city, onDelete }) {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const getWeatherIcon = (condition) => {
    if (condition.includes("cloud")) {
      return { icon: faCloud};
    } else if (condition.includes("sun") || condition.includes("clear")) {
      return { icon: faSun}; // orange-yellow for sun
    } else if (condition.includes("rain") || condition.includes("shower")) {
      return { icon: faCloudShowersHeavy}; // sky blue for rain
    } else {
      return { icon: faWind }; // default icon for unknown conditions
    }
  };

  const weather = getWeatherIcon(city.weatherData.condition.toLowerCase());

  return (
    <div className="city-card">
      <div className="city-card-header">
        <h2>{city.name}</h2>
        <button onClick={() => onDelete(city._id)} className="delete-icon">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <p>Temperature: {city.weatherData.temperature}°C</p>
      <div className="condition">
        <FontAwesomeIcon icon={weather.icon} style={{ color: weather.color }} />
        <span>{city.weatherData.condition}</span>
      </div>
      <button onClick={openModal} className="details-button">More Details</button>
      <Modal isOpen={showModal} onClose={closeModal} city={city} />
    </div>
  );
}

export default CityCard;
