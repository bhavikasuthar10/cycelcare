const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    const token = signToken(newUser._id);
    newUser.password = undefined;

    res.status(201).json({ status: 'success', token, data: { user: newUser } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
    }

    const token = signToken(user._id);
    user.password = undefined;

    res.status(200).json({ status: 'success', token, data: { user } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

   
exports.getMe = async (req, res) => {
  try {
    res.status(200).json({ status: 'success', data: { user: req.user } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
exports.updateMe = async (req, res) => {
  try {
    const {
      name,
      email,
      averageCycleLength,
      useManualCycleLength,
      partnerEmail,
      partnerNotificationsEnabled
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, averageCycleLength, useManualCycleLength, partnerEmail, partnerNotificationsEnabled },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: { user: updatedUser }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    expires: new Date(0),
  });
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

