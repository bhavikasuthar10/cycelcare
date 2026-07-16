const Symptom = require('../models/Symptom');

exports.logDailyCheckIn = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);

    // Find by userId and Today's date, update if exists, create if not
    const dailyLog = await Symptom.findOneAndUpdate(
      { userId: req.user.id, date: today },
      { ...req.body, userId: req.user.id, date: today },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ status: 'success', data: { log: dailyLog } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getSymptomHistory = async (req, res) => {
  try {
    const logs = await Symptom.find({ userId: req.user.id }).sort('-date');
    res.status(200).json({ status: 'success', results: logs.length, data: { logs } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getTodayCheckIn = async (req, res) => {
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    const log = await Symptom.findOne({ userId: req.user.id, date: today });
    
    res.status(200).json({ status: 'success', data: { log: log || null } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};