const axios = require("axios");
const City = require("../models/City");

// Fetch weather data for a specific city
exports.getCityWeather = async (req, res) => {
  try {
    const { city } = req.params;

    // Get weather data for the specified city directly
    const weatherResponse = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    if (!weatherResponse.data) {
      return res.status(404).json({ error: "City not found" });
    }

    // Extract the necessary weather information
    const weatherData = weatherResponse.data;
    const data = {
      name: city,
      weatherData: {
        temperature: weatherData.main.temp,
        condition: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        sunrise: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString(),
      },
    };

    res.json(data);
  } catch (error) {
    console.error("Error fetching city weather:", error);
    res.status(500).json({ error: "Error fetching city weather" });
  }
};

// Add a new city with initial weather data
exports.addCity = async (req, res) => {
  try {
    const { name } = req.body;

    // Fetch initial weather data for the city
    const weatherResponse = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    if (!weatherResponse.data) {
      return res.status(404).json({ error: "City not found" });
    }

    const weatherData = weatherResponse.data;

    // Create city document with basic weather data
    const city = new City({
      name,
      weatherData: {
        temperature: weatherData.main.temp,
        condition: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        sunrise: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString(),
      },
    });

    await city.save();
    res.json(city);
  } catch (error) {
    console.error("Error adding city:", error);
    res.status(500).json({ error: "Error adding city" });
  }
};

// Retrieve list of tracked cities
exports.getCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ error: "Error fetching cities" });
  }
};

// Remove a city from tracking
exports.removeCity = async (req, res) => {
  try {
    const { id } = req.params;
    await City.findByIdAndDelete(id);
    res.json({ message: "City removed" });
  } catch (error) {
    console.error("Error removing city:", error);
    res.status(500).json({ error: "Error removing city" });
  }
};

// Add this new function to get a 5-day forecast for a city
exports.getCityForecast = async (req, res) => {
  try {
    const { city } = req.params;
    const forecastResponse = await axios.get(
      `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    if (!forecastResponse.data) {
      return res.status(404).json({ error: "City not found" });
    }

    // Extract and structure the 5-day forecast data
    const forecastData = forecastResponse.data.list.map((entry) => ({
      date: entry.dt_txt,
      temperature: entry.main.temp,
      condition: entry.weather[0].description,
      icon: entry.weather[0].icon,
    }));

    res.json({ city: city, forecast: forecastData });
  } catch (error) {
    console.error("Error fetching 5-day forecast:", error);
    res.status(500).json({ error: "Error fetching 5-day forecast" });
  }
};

