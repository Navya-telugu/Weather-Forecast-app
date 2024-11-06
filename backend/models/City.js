const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: { type: String, required: true },
    weatherData: {
        temperature: Number,
        condition: String,
        icon: String,
        humidity: Number,
        windSpeed: Number,
        sunrise: String,
        sunset: String
    },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('City', citySchema);
