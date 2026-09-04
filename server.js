const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Key Schema
const keySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  duration: { type: Number, required: true }, // in days
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

const Key = mongoose.model('Key', keySchema);

// API: Generate Key
app.post('/api/generate', async (req, res) => {
  try {
    const { duration } = req.body;
    const randomString = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const uniqueKey = `KEY-${randomString.toUpperCase()}`;
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + Number(duration));

    const newKey = new Key({ key: uniqueKey, duration, expiresAt });
    await newKey.save();

    res.json({ success: true, key: uniqueKey, expiresAt });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: Verify Key
app.post('/api/verify', async (req, res) => {
  try {
    const { key } = req.body;
    const foundKey = await Key.findOne({ key });

    if (!foundKey) {
      return res.status(404).json({ success: false, message: 'Invalid Key!' });
    }

    if (new Date() > foundKey.expiresAt) {
      return res.status(400).json({ success: false, message: 'Key has expired!' });
    }

    res.json({ success: true, message: 'Key is valid!', expiresAt: foundKey.expiresAt });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
