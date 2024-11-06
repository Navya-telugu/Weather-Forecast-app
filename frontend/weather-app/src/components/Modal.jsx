// Modal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloud,
  faSun,
  faCloudShowersHeavy,
  faWind,
  faTint, // for humidity
  faThermometerHalf // for temperature
} from "@fortawesome/free-solid-svg-icons";
import ForecastChart from "./ForecastChart";
import "./Modal.css";

const Modal = ({ isOpen, onClose, city }) => {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await axios.get(`/api/forecast/${city.name}`);
        const forecastData = response.data.forecast;
        const dailySummary = summarizeForecast(forecastData);
        setForecast(dailySummary);
      } catch (error) {
        console.error("Error fetching forecast:", error);
      }
    };

    if (isOpen) {
      fetchForecast();
    }
  }, [city.name, isOpen]);

  const summarizeForecast = (data) => {
    const dailyData = {};

    data.forEach(entry => {
      const date = entry.date.split(" ")[0];
      if (!dailyData[date]) {
        dailyData[date] = { temperatureSum: 0, count: 0, condition: entry.condition };
      }
      dailyData[date].temperatureSum += entry.temperature;
      dailyData[date].count += 1;
    });

    return Object.keys(dailyData).map(date => ({
      date,
      temperature: (dailyData[date].temperatureSum / dailyData[date].count).toFixed(2),
      condition: dailyData[date].condition,
    })).slice(0, 5); // Limit to 5 days
  };

  if (!isOpen) return null;

  const getWeatherIcon = (condition) => {
    if (condition.includes("cloud")) {
      return faCloud;
    } else if (condition.includes("sun") || condition.includes("clear")) {
      return faSun;
    } else if (condition.includes("rain") || condition.includes("shower")) {
      return faCloudShowersHeavy;
    } else {
      return faWind; // default icon for unknown conditions
    }
  };

  const weatherIcon = getWeatherIcon(city.weatherData.condition.toLowerCase());

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{city.name} - 5-Day Weather Forecast</h2>

        {/* Current Weather Details with Icons */}
        <div className="weather-details">
          <div className="weather-detail">
            <FontAwesomeIcon icon={faThermometerHalf} /> Temperature: {city.weatherData.temperature}°C
          </div>
          <div className="weather-detail">
            <FontAwesomeIcon icon={weatherIcon} /> Condition: {city.weatherData.condition}
          </div>
          <div className="weather-detail">
            <FontAwesomeIcon icon={faTint} /> Humidity: {city.weatherData.humidity}%
          </div>
          <div className="weather-detail">
            <FontAwesomeIcon icon={faWind} /> Wind Speed: {city.weatherData.windSpeed} m/s
          </div>
        </div>

        {/* 5-Day Forecast Chart */}
        {forecast.length > 0 && <ForecastChart forecast={forecast} />}

        <button onClick={onClose} className="close-button">Hide Details</button>
      </div>
    </div>
  );
};

export default Modal;
