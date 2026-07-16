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
    
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });

    // Remove password from output
    newUser.password = undefined;

    res.status(201).json({ status: 'success', data: { user: newUser } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password'); // We need to explicitly select password because it's hidden by default usually

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
    }

    // 3) If everything ok, send token to client
    const token = signToken(user._id);

    res.cookie('jwt', token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax'
    });

    user.password = undefined; // Remove from response

    res.status(200).json({ status: 'success', data: { user } });
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
    expires: new Date(0),
  });
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

