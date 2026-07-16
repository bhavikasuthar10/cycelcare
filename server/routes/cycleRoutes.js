const express = require('express');
const cycleController = require('../controllers/cycleController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply protection to ALL routes in this file
router.use(protect);

router.route('/')
  .get(cycleController.getUserCycles)
  .post(cycleController.logCycle);

router.route('/:id')
  .patch(cycleController.updateCycle)
  .delete(cycleController.deleteCycle);

module.exports = router;