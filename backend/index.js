const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


// Schema & Model
const SensorData = mongoose.model("SensorData", new mongoose.Schema({
    ir: Number,
    red: Number,
    timestamp: { type: Date, default: Date.now }
}));

// ✅ API Endpoint to Receive Data from Arduino
app.post("/data", async (req, res) => {
    try {
        const { ir, red } = req.body;
        const newData = new SensorData({ ir, red });
        await newData.save();
        res.status(201).json({ message: "Data saved successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ API Endpoint to Retrieve Data
app.get("/data", async (req, res) => {
    try {
        const data = await SensorData.find().sort({ timestamp: -1 }).limit(10);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
