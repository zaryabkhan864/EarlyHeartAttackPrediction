const express = require('express');
const router = express.Router();

// Import controller functions
const {
    saveSensorData,
    getSensorData,
    getSensorDataByRange
} = require('../controllers/sensorController');

// Routes
router.post('/data', saveSensorData);
router.get('/data', getSensorData);
router.get('/data/range', getSensorDataByRange);

module.exports = router;
