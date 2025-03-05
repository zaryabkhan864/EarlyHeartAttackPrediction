import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/connection.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from 'cors';

// Convert __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "config", "config.env") });

// Validate required environment variables
const requiredEnvVars = ['PORT', 'MONGODB_URI'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`❌ Error: ${envVar} is not defined in environment variables`);
        process.exit(1);
    }
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Connect to Database
connectDB();

// connect to routes
import sensorRoutes from './routes/sensorRoutes.js';
app.use('/api/v1', sensorRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Something went wrong!',
            status: err.status || 500
        }
    });
});

// Define PORT
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    process.exit(1);
});
