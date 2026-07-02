import { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import SetupPanel from "./components/SetupPanel";
import InterviewScreen from "./components/InterviewScreen";
import ReportScreen from "./components/ReportScreen";
import LoadingBox from "./components/LoadingBox";
import ErrorBanner from "./components/ErrorBanner";
import ReportErrorBoundary from "./ReportErrorBoundary.jsx";

import {
  startInterviewApi,
  submitAnswerApi,
  generateQuestionApi,
  completeInterviewApi,
} from "./api/interviewApi";

import { normalizeFinalReport } from "./utils/formatReportField";

function App() {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [finalReport, setFinalReport] = useState(null);
  const [previousQuestions, setPreviousQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(null);
  const [error, setError] = useState(null);

  const startInterview = async () => {
    if (!selectedDomain || !selectedDifficulty) return;

    setLoading(true);
    setLoadingPhase("start");
    setError(null);
    setFinalReport(null);
    setUserAnswers([]);
    setPreviousQuestions([]);
    setCurrentQuestionNumber(1);

    try {
      const response = await startInterviewApi(
        selectedDomain.name,
        selectedDifficulty,
      );

      setSessionId(String(response.data.sessionId));
      setCurrentQuestion(response.data.question);
      setPreviousQuestions([response.data.question]);
      setCurrentQuestionNumber(response.data.currentQuestionNumber || 1);
      setTotalQuestions(response.data.totalQuestions || 5);
    } catch (err) {
      setError(
        `Failed to start interview: ${err.response?.data?.details || err.message}`,
      );
    } finally {
      setLoading(false);
      setLoadingPhase(null);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;

    setLoading(true);
    setLoadingPhase("answer");
    setError(null);

    try {
      const response = await submitAnswerApi({
        sessionId,
        question: currentQuestion,
        userAnswer: answer,
        questionNumber: currentQuestionNumber,
      });

      const scoreText =
        response.data.score !== undefined
          ? `Score: ${response.data.score}/100\n\n`
          : "";

      setFeedback(`${scoreText}${response.data.feedback}`);

      setUserAnswers((prev) => [
        ...prev,
        {
          question: currentQuestion,
          answer,
          score: response.data.score,
        },
      ]);
    } catch (err) {
      setError(
        `Failed to submit answer: ${err.response?.data?.details || err.message}`,
      );
    } finally {
      setLoading(false);
      setLoadingPhase(null);
    }
  };

  const handleNextQuestion = async () => {
    setLoading(true);
    setLoadingPhase("start");
    setError(null);

    try {
      const newQuestionNumber = currentQuestionNumber + 1;

      const response = await generateQuestionApi({
        sessionId,
        domain: selectedDomain.name,
        difficulty: selectedDifficulty,
        questionNumber: newQuestionNumber,
        previousQuestions,
      });

      setCurrentQuestion(response.data.question);
      setPreviousQuestions((prev) => [...prev, response.data.question]);
      setCurrentQuestionNumber(newQuestionNumber);
      setAnswer("");
      setFeedback(null);
    } catch (err) {
      setError(
        `Failed to generate next question: ${err.response?.data?.details || err.message}`,
      );
    } finally {
      setLoading(false);
      setLoadingPhase(null);
    }
  };

  const completeInterview = async () => {
    setLoading(true);
    setLoadingPhase("complete");
    setError(null);

    try {
      const response = await completeInterviewApi(sessionId);

      if (!response.data?.finalReport) {
        throw new Error("Final report not found in response");
      }

      setFinalReport(normalizeFinalReport(response.data.finalReport));
    } catch (err) {
      setError(
        `Failed to complete interview: ${err.response?.data?.details || err.message}`,
      );
    } finally {
      setLoading(false);
      setLoadingPhase(null);
    }
  };

  const handleRestart = () => {
    setSelectedDomain(null);
    setSelectedDifficulty(null);
    setSessionId(null);
    setCurrentQuestion(null);
    setCurrentQuestionNumber(1);
    setTotalQuestions(5);
    setAnswer("");
    setFeedback(null);
    setFinalReport(null);
    setPreviousQuestions([]);
    setUserAnswers([]);
    setError(null);
  };

  return (
    <div className="app-container">
      <Header />

      {error && <ErrorBanner error={error} onClose={() => setError(null)} />}

      {loading ? (
        <LoadingBox loadingPhase={loadingPhase} />
      ) : !sessionId ? (
        <SetupPanel
          selectedDomain={selectedDomain}
          setSelectedDomain={setSelectedDomain}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
          onStart={startInterview}
        />
      ) : !finalReport ? (
        <InterviewScreen
          selectedDomain={selectedDomain}
          selectedDifficulty={selectedDifficulty}
          currentQuestion={currentQuestion}
          currentQuestionNumber={currentQuestionNumber}
          totalQuestions={totalQuestions}
          answer={answer}
          setAnswer={setAnswer}
          feedback={feedback}
          onSubmitAnswer={submitAnswer}
          onNextQuestion={handleNextQuestion}
          onCompleteInterview={completeInterview}
          onRestart={handleRestart}
        />
      ) : (
        <ReportErrorBoundary onRestart={handleRestart}>
          <ReportScreen
            finalReport={finalReport}
            selectedDomain={selectedDomain}
            selectedDifficulty={selectedDifficulty}
            totalQuestions={totalQuestions}
            onRestart={handleRestart}
          />
        </ReportErrorBoundary>
      )}
    </div>
  );
}

export default App;
