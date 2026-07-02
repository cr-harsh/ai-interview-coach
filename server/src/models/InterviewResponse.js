const mongoose = require('mongoose');

const interviewResponseSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewSession',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  userAnswer: {
    type: String,
    required: true
  },
  feedback: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  questionNumber: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('InterviewResponse', interviewResponseSchema);
