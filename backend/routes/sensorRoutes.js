import express from 'express';
import SensorData from '../models/sensordata.js';

const router = express.Router();

// Validation middleware
const validateSensorData = (req, res, next) => {
    const { ir, red } = req.body;
    
    if (typeof ir !== 'number' || typeof red !== 'number') {
        return res.status(400).json({
            error: 'Invalid input: ir and red must be numbers'
        });
    }
    
    if (ir < 0 || red < 0) {
        return res.status(400).json({
            error: 'Invalid input: ir and red values must be non-negative'
        });
    }
    
    next();
};

// POST Route - Save Sensor Data
router.post("/data", validateSensorData, async (req, res, next) => {
    try {
        const { ir, red } = req.body;
        const newData = new SensorData({ ir, red });
        const savedData = await newData.save();
        res.status(201).json({ 
            message: "Data saved successfully!",
            data: savedData
        });
    } catch (error) {
        next(error);
    }
});

// GET Route - Retrieve Sensor Data
router.get("/data", async (req, res, next) => {
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
});

// GET Route - Get data by date range
router.get("/data/range", async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        
        const query = {
            timestamp: {}
        };
        
        if (startDate) {
            query.timestamp.$gte = new Date(startDate);
        }
        if (endDate) {
            query.timestamp.$lte = new Date(endDate);
        }
        
        const data = await SensorData.find(query).sort({ timestamp: -1 });
        
        res.status(200).json({
            success: true,
            count: data.length,
            data
        });
    } catch (error) {
        next(error);
    }
});

export default router;
