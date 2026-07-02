const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

const generateQuestionFromAI = async ({ domain, difficulty, questionNumber, previousQuestions = [] }) => {
  const response = await axios.post(`${AI_SERVICE_URL}/generate-question`, {
    domain,
    difficulty,
    questionNumber,
    previousQuestions
  });

  return response.data.question;
};

const evaluateAnswerWithAI = async ({ domain, difficulty, question, userAnswer }) => {
  const response = await axios.post(`${AI_SERVICE_URL}/evaluate-answer`, {
    domain,
    difficulty,
    question,
    userAnswer
  });

  return response.data;
};

const generateFinalReportFromAI = async (responses) => {
  const response = await axios.post(`${AI_SERVICE_URL}/final-report`, {
    responses
  });

  return response.data;
};

module.exports = {
  generateQuestionFromAI,
  evaluateAnswerWithAI,
  generateFinalReportFromAI
};