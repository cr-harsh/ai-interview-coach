const InterviewSession = require('../models/InterviewSession');
const InterviewResponse = require('../models/InterviewResponse');

const {
  generateQuestionFromAI,
  evaluateAnswerWithAI,
  generateFinalReportFromAI
} = require('../services/ai.service');

const { normalizeReportField } = require('../utils/formatReport');

const startInterview = async (req, res) => {
  const { domain, difficulty } = req.body;

  if (!domain || !difficulty) {
    return res.status(400).json({ error: 'Domain and difficulty are required' });
  }

  try {
    const session = new InterviewSession({
      domain,
      difficulty,
      totalQuestions: 5,
      currentQuestionNumber: 1,
      status: 'in-progress'
    });

    await session.save();

    const question = await generateQuestionFromAI({
      domain,
      difficulty,
      questionNumber: 1,
      previousQuestions: []
    });

    return res.status(200).json({
      sessionId: session._id.toString(),
      question,
      currentQuestionNumber: 1,
      totalQuestions: 5
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to start interview session',
      details: error.response?.data?.detail || error.message
    });
  }
};

const submitAnswer = async (req, res) => {
  const { sessionId, question, userAnswer, questionNumber } = req.body;

  if (!sessionId || !question || userAnswer === undefined || !questionNumber) {
    return res.status(400).json({
      error: 'sessionId, question, userAnswer, and questionNumber are required'
    });
  }

  try {
    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    const { domain, difficulty } = session;

    const evaluation = await evaluateAnswerWithAI({
      domain,
      difficulty,
      question,
      userAnswer
    });

    const feedbackText = typeof evaluation?.feedback === 'string' && evaluation.feedback.trim()
      ? evaluation.feedback
      : (normalizeReportField(evaluation?.strengths) || 'Answer evaluated.');

    const scoreNum = typeof evaluation?.score === 'number' && !isNaN(evaluation.score)
      ? Math.max(0, Math.min(100, evaluation.score))
      : (parseInt(evaluation?.score, 10) || 70);

    const responseDoc = new InterviewResponse({
      sessionId,
      question,
      userAnswer,
      feedback: feedbackText,
      score: scoreNum,
      questionNumber
    });

    await responseDoc.save();

    return res.status(200).json({
      feedback: feedbackText,
      score: scoreNum,
      isCompleted: questionNumber >= 5
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to process answer',
      details: error.response?.data?.detail || error.message
    });
  }
};

const generateQuestion = async (req, res) => {
  const { sessionId, domain, difficulty, questionNumber, previousQuestions } = req.body;

  if (!sessionId || !domain || !difficulty || !questionNumber) {
    return res.status(400).json({
      error: 'sessionId, domain, difficulty, and questionNumber are required'
    });
  }

  try {
    const question = await generateQuestionFromAI({
      domain,
      difficulty,
      questionNumber,
      previousQuestions: previousQuestions || []
    });

    const session = await InterviewSession.findById(sessionId);

    if (session) {
      session.currentQuestionNumber = questionNumber;
      await session.save();
    }

    return res.status(200).json({ question: question || 'Please describe your experience in this area.' });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to generate question',
      details: error.response?.data?.detail || error.message
    });
  }
};

const completeInterview = async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId is required' });
  }

  try {
    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    const responses = await InterviewResponse.find({ sessionId }).sort({ questionNumber: 1 });

    if (responses.length === 0) {
      return res.status(400).json({ error: 'No answers submitted for this session' });
    }

    const validScores = responses.map(r => (typeof r.score === 'number' && !isNaN(r.score) ? r.score : 70));
    const totalScore = validScores.reduce((sum, s) => sum + s, 0);
    const averageScore = Math.round(totalScore / validScores.length) || 70;

    const reportResponse = await generateFinalReportFromAI(
      responses.map((r) => ({
        question: r.question || '',
        userAnswer: r.userAnswer || '',
        feedback: r.feedback || '',
        score: typeof r.score === 'number' ? r.score : 70,
        questionNumber: r.questionNumber || 1
      }))
    );

    const finalReportText = normalizeReportField(reportResponse.finalReport);
    const overallStrengths = normalizeReportField(reportResponse.overallStrengths);
    const weakAreas = normalizeReportField(reportResponse.weakAreas);
    const recommendation = normalizeReportField(reportResponse.recommendation);

    session.status = 'completed';
    session.overallScore = averageScore;
    session.finalReport = finalReportText;
    await session.save();

    const detailedSummary = responses.map((r, idx) =>
      `Question ${idx + 1}: ${r.question}\nYour Answer: ${r.userAnswer}\nFeedback: ${r.feedback}\nScore: ${r.score}/100`
    ).join('\n\n');

    return res.status(200).json({
      finalReport: {
        score: averageScore,
        overallFeedback: finalReportText,
        detailedSummary,
        overallStrengths,
        weakAreas,
        recommendation
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to complete interview session',
      details: error.response?.data?.detail || error.message
    });
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  generateQuestion,
  completeInterview
};