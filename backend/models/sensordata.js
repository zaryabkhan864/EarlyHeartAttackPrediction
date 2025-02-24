const mongoose = require("mongoose");

const SensorDataSchema = new mongoose.Schema({
    ir: { type: Number, required: true },
    red: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SensorData", SensorDataSchema);
