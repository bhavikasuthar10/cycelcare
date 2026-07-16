const mongoose = require('mongoose');

const cycleSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'A cycle must belong to a user'] 
  },
  startDate: { 
    type: Date, 
    required: [true, 'Please provide a start date'] 
  },
  endDate: { 
    type: Date 
  },
  intensity: { 
    type: String, 
    enum: ['light', 'medium', 'heavy'], 
    default: 'medium' 
  },
  notes: { 
    type: String, 
    trim: true,
    maxLength: [500, 'Notes cannot exceed 500 characters'] 
  }
}, { timestamps: true });

module.exports = mongoose.model('Cycle', cycleSchema);