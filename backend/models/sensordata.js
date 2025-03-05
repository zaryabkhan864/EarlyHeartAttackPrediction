import mongoose from 'mongoose';

const SensorDataSchema = new mongoose.Schema({
    ir: { type: Number, required: true },
    red: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("SensorData", SensorDataSchema);


