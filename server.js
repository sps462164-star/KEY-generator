const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.express = express.json();
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully'))
    .catch(err => console.log('MongoDB Connection Error:', err));
}

// Simple Key Model
const KeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'active' }
});
const Key = mongoose.model('Key', KeySchema);

// Home route
app.get('/', (req, res) => {
  res.send('Key Generator Backend is Running!');
});

// Generate Endpoint
app.get('/api/generate', async (req, res) => {
  try {
    const randomKey = 'KEY-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const newKey = new Key({ key: randomKey });
    await newKey.save();
    res.json({ success: true, key: randomKey });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Verify Endpoint
app.get('/api/verify', async (req, res) => {
  const userKey = req.query.key;
  try {
    const found = await Key.findOne({ key: userKey, status: 'active' });
    if (found) {
      res.json({ success: true, message: 'Key is valid!' });
    } else {
      res.json({ success: false, message: 'Invalid or expired key!' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
