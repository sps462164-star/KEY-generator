const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// आपके डेटाबेस कनेक्शन का कोड (यहाँ आपका MONGO_URI काम करेगा)
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => console.log('Database Connection Error:', err));

// मुख्य पेज का रूट - अब यहाँ 'Cannot GET /' की जगह यह मैसेज दिखेगा
app.get('/', (req, res) => {
  res.send('Key Generator Server is Live!');
});

// पोर्ट सेट करना ताकि रेंडर पर सर्वर चल सके
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Your service is live 🚀');
});
