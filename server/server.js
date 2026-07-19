const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRouter = require('./routes/authRoutes');
const cycleRouter = require('./routes/cycleRoutes');
const symptomRouter = require('./routes/symptomRoutes');
const statsRouter = require('./routes/statsRoutes');
const { protect } = require('./middleware/authMiddleware');
const notifyRouter = require('./routes/notifyRoutes');


const app = express();
app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://cycelcare-gqphc8xy2-bhavika-suthar.vercel.app',
    'https://cycelcare-git-main-bhavika-suthar.vercel.app'
  ],
  credentials: true
}));
// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Safely'))
  .catch(err => console.error('❌ Connection Error:', err));

// Basic Route for testing
app.get('/', (req, res) => res.send('CycleCare API Running...'));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/cycles', cycleRouter);
app.use('/api/symptoms', symptomRouter);
app.use('/api/stats', statsRouter);
app.use('/api/notify', notifyRouter);

// Test Protected Route
app.get('/api/test-auth', protect, (req, res) => {
  res.json({ message: `Success! You are logged in as ${req.user.name}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server glowing on port ${PORT}`));

const app = express();
app.set('trust proxy', 1);