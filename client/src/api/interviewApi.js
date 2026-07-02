import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/interviews';

export const startInterviewApi = (domain, difficulty) => {
  return axios.post(`${API_BASE}/start`, {
    domain,
    difficulty
  }, { timeout: 120000 });
};

export const submitAnswerApi = ({ sessionId, question, userAnswer, questionNumber }) => {
  return axios.post(`${API_BASE}/answer`, {
    sessionId,
    question,
    userAnswer,
    questionNumber
  }, { timeout: 120000 });
};

export const generateQuestionApi = ({ sessionId, domain, difficulty, questionNumber, previousQuestions }) => {
  return axios.post(`${API_BASE}/question`, {
    sessionId,
    domain,
    difficulty,
    questionNumber,
    previousQuestions
  }, { timeout: 120000 });
};

export const completeInterviewApi = (sessionId) => {
  return axios.post(`${API_BASE}/complete`, {
    sessionId
  }, { timeout: 120000 });
};