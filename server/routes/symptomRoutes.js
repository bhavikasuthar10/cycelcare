const express = require('express');
const symptomController = require('../controllers/symptomController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(symptomController.getSymptomHistory)
  .post(symptomController.logDailyCheckIn);

router.get('/today', symptomController.getTodayCheckIn);

module.exports = router;