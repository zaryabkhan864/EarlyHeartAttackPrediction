
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