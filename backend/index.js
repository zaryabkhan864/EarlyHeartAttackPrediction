const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
if (process.env.NODE_ENV !== 'PRODUCTION') {
    dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });
}

// Validate required environment variables
const requiredEnvVars = ['PORT', 'MONGODB_URI'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`❌ Error: ${envVar} is not defined in environment variables`);
        process.exit(1);
    }
}

// Connect to DB
const connectDB = require('./config/connection');
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Routes
const sensorRoutes = require('./routes/sensorRoutes');
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

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
