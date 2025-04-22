const SensorData = require('../models/sensordata');

// Save sensor data
exports.saveSensorData = async (req, res, next) => {
    try {
        const { ir, red } = req.body;

        if (typeof ir !== 'number' || typeof red !== 'number') {
            return res.status(400).json({
                error: 'Invalid input: ir and red must be numbers'
            });
        }

        if (ir < 0 || red < 0) {
            return res.status(400).json({
                error: 'Invalid input: ir and red must be non-negative'
            });
        }

        const newData = new SensorData({ ir, red });
        const savedData = await newData.save();

        res.status(201).json({
            message: 'Data saved successfully!',
            data: savedData
        });
    } catch (error) {
        next(error);
    }
};

// Get latest sensor data with optional limit
exports.getSensorData = async (req, res, next) => {
    try {
        const { limit = 10 } = req.query;
        const data = await SensorData.find()
            .sort({ timestamp: -1 })
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });
    } catch (error) {
        next(error);
    }
};

// Get sensor data by date range
exports.getSensorDataByRange = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const query = { timestamp: {} };

        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);

        const data = await SensorData.find(query).sort({ timestamp: -1 });

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });
    } catch (error) {
        next(error);
    }
};
