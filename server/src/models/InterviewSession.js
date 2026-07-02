const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  totalQuestions: {
    type: Number,
    default: 5
  },
  currentQuestionNumber: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress'
  },
  overallScore: {
    type: Number
  },
  finalReport: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
