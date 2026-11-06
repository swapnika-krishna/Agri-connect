const express = require('express');
const router = express.Router();
const { getPrices, getFilters } = require('../controllers/marketController');

router.get('/', getPrices);
router.get('/filters', getFilters);

module.exports = router;
