const Cycle = require('../models/Cycle');

exports.logCycle = async (req, res) => {
  try {
    // Privacy First: Force the userId to be the logged-in user
    const newCycle = await Cycle.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json({ status: 'success', data: { cycle: newCycle } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.getUserCycles = async (req, res) => {
  try {
    // Only fetch cycles belonging to THIS user
    const cycles = await Cycle.find({ userId: req.user.id }).sort('-startDate');
    
    res.status(200).json({ status: 'success', results: cycles.length, data: { cycles } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.updateCycle = async (req, res) => {
  try {
    // Find cycle AND ensure it belongs to the user
    const cycle = await Cycle.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!cycle) {
      return res.status(404).json({ status: 'fail', message: 'No cycle found with that ID for this user' });
    }

    res.status(200).json({ status: 'success', data: { cycle } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.deleteCycle = async (req, res) => {
  try {
    const cycle = await Cycle.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!cycle) {
      return res.status(404).json({ status: 'fail', message: 'No cycle found with that ID' });
    }

    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
