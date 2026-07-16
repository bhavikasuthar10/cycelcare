const express = require('express');
const statsController = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/insights', protect, statsController.getCycleInsights);

module.exports = router;