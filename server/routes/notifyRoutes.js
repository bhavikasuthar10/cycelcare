// server/routes/notifyRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cycle = require('../models/Cycle');
const { differenceInDays, addDays } = require('date-fns');

router.get('/check-partners', async (req, res) => {
  try {
    const users = await User.find({ partnerNotificationsEnabled: true, partnerEmail: { $ne: null } });
    const notificationsSent = [];

    for (const user of users) {
      const cycles = await Cycle.find({ userId: user._id }).sort('-startDate');
      if (cycles.length === 0) continue;

      let averageLength = user.averageCycleLength || 28;

      if (!user.useManualCycleLength && cycles.length >= 2) {
        let totalGaps = 0;
        for (let i = 0; i < cycles.length - 1; i++) {
          totalGaps += differenceInDays(new Date(cycles[i].startDate), new Date(cycles[i + 1].startDate));
        }
        averageLength = Math.round(totalGaps / (cycles.length - 1));
      }

      const lastStart = new Date(cycles[0].startDate);
      const predictedNext = addDays(lastStart, averageLength);
      const daysUntil = differenceInDays(predictedNext, new Date());

      if (daysUntil === 1 || daysUntil === 2) {
        notificationsSent.push({ to: user.partnerEmail, msg: "Supportive nudge triggered!" });
        // Real email sending (Nodemailer) would go here later
      }
    }

    res.json({ status: 'success', sent: notificationsSent });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
});

module.exports = router;