const express = require('express');

const {
  startInterview,
  submitAnswer,
  generateQuestion,
  completeInterview
} = require('../controllers/interview.controller');

const router = express.Router();

router.post('/start', startInterview);
router.post('/answer', submitAnswer);
router.post('/question', generateQuestion);
router.post('/complete', completeInterview);

module.exports = router;