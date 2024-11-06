import React, { useState, useEffect } from "react";
import axios from "axios";
import CityCard from "./components/CityCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("/api/cities");
        setCities(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast.error("Failed to load cities. Please try again.", {
          autoClose: 3000, // 3 seconds
        });
      }
    };

    fetchCities();
  }, []);

  const addCity = async () => {
    if (!search) return;
    try {
      const response = await axios.post("/api/cities", { name: search });
      setCities([...cities, response.data]);
      setSearch("");
      toast.success("City added successfully!", {
        autoClose: 2000, // 2 seconds
      });
    } catch (error) {
      console.error("Error adding city:", error);
      toast.error("Failed to add city. Please try again.", {
        autoClose: 3000, // 3 seconds
      });
    }
  };

  const deleteCity = async (id) => {
    try {
      await axios.delete(`/api/cities/${id}`);
      setCities(cities.filter((city) => city._id !== id));
      toast.success("City deleted successfully!", {
        autoClose: 2000, // 2 seconds
      });
    } catch (error) {
      console.error("Error deleting city:", error);
      toast.error("Failed to delete city. Please try again.", {
        autoClose: 3000, // 3 seconds
      });
    }
  };

  return (
    <div className="app">
      <ToastContainer />
      <h1>Weather Tracker</h1>
      <div className="search-bar">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for a city"
        />
        <button onClick={addCity} className="add-button">
          +
        </button>
      </div>
      <div className="city-list">
        {Array.isArray(cities) && cities.length > 0 ? (
          cities.map((city) => (
            <CityCard key={city._id} city={city} onDelete={deleteCity} />
          ))
        ) : (
          <p style={{ color: "darkviolet" }}>
            No cities to display. Add a city to get started!
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
