const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true,
    // Set to start of day to make querying by date easier
    default: () => new Date().setHours(0, 0, 0, 0)
  },
  mood: { 
    type: String, 
    enum: ['happy', 'normal', 'low energy', 'irritable', 'anxious', 'sad'],
    default: 'normal'
  },
  symptoms: [{ 
    type: String, 
    enum: ['cramps', 'bloating', 'fatigue', 'headache', 'acne', 'backache', 'nausea']
  }],
  energyLevel: { 
    type: Number, 
    min: 1, 
    max: 5, 
    default: 3 
  },
  notes: { 
    type: String, 
    maxLength: 300 
  }
}, { timestamps: true });

// Ensure a user can only have ONE check-in per date
symptomSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Symptom', symptomSchema);