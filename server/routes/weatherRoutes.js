const express = require('express');
const router = express.Router();
const { getWeather, geocode } = require('../controllers/weatherController');

router.get('/', getWeather);
router.get('/geocode', geocode);

module.exports = router;
