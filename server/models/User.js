const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  averageCycleLength: { type: Number, default: 28  },
  partnerEmail: { 
  type: String, 
  default: null,
  trim: true,
  lowercase: true 
},
partnerNotificationsEnabled: { 
  type: Boolean, 
  default: false 
},
  useManualCycleLength: { type: Boolean, default: false }

}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Helper method to check password
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


module.exports = mongoose.model('User', userSchema);