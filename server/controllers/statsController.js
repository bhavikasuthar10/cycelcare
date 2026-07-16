const Cycle = require('../models/Cycle');
const Symptom = require('../models/Symptom');
const { addDays, differenceInDays } = require('date-fns'); // You may need to run: npm install date-fns

exports.getCycleInsights = async (req, res) => {
  try {
    // 1. Fetch user cycles sorted by date (newest first)
    const cycles = await Cycle.find({ userId: req.user.id }).sort('-startDate');

    let averageLength = req.user.averageCycleLength || 28;
    let predictedNextPeriod = null;
    let daysUntilNextPeriod = null;
    let status = 'Not enough data';

    if (req.user.useManualCycleLength) {
      status = 'Manual override';
      // averageLength already set from req.user.averageCycleLength above — skip calculation
    } else if (cycles.length >= 2) {
      let totalGaps = 0;
      for (let i = 0; i < cycles.length - 1; i++) {
        totalGaps += differenceInDays(
          new Date(cycles[i].startDate),
          new Date(cycles[i + 1].startDate)
        );
      }
      averageLength = Math.round(totalGaps / (cycles.length - 1));
      status = 'Data-driven prediction';
    } else if (cycles.length === 1) {
      status = 'Using default average';
    }
    // 4. Calculate prediction based on the most recent start date
    if (cycles.length > 0) {
      const lastStartDate = new Date(cycles[0].startDate);
      predictedNextPeriod = addDays(lastStartDate, averageLength);
      daysUntilNextPeriod = differenceInDays(predictedNextPeriod, new Date());
    }

    // 5. Bonus: Get most frequent symptoms from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSymptoms = await Symptom.find({
      userId: req.user.id,
      date: { $gte: thirtyDaysAgo }
    });

    // Flatten all symptoms into one array and count occurrences
    const symptomCounts = {};
    recentSymptoms.forEach(log => {
      log.symptoms.forEach(s => {
        symptomCounts[s] = (symptomCounts[s] || 0) + 1;
      });
    });

    // Sort to find the "Top" symptom
    const topSymptom = Object.keys(symptomCounts).sort((a, b) => symptomCounts[b] - symptomCounts[a])[0] || "None logged";

    res.status(200).json({
      status: 'success',
      data: {
        averageCycleLength: averageLength,
        predictedNextPeriod,
        daysUntilNextPeriod,
        predictionStatus: status,
        topRecentSymptom: topSymptom,
        totalCyclesLogged: cycles.length
      }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};