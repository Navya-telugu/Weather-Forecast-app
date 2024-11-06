const express = require('express');
const router = express.Router();
const { addCity, getCities, removeCity,getCityForecast } = require('../controllers/weatherController');

// POST route to add a new city
router.post('/cities', addCity);

// GET route to retrieve all cities
router.get('/cities', getCities);

// DELETE route to remove a city
router.delete('/cities/:id', removeCity);
// Add a new route for fetching the forecast data for a city
router.get('/forecast/:city', getCityForecast);


module.exports = router;
