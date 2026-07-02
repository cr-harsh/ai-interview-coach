import FeedbackBox from "./FeedbackBox";

function InterviewScreen({
  selectedDomain,
  selectedDifficulty,
  currentQuestion,
  currentQuestionNumber,
  totalQuestions,
  answer,
  setAnswer,
  feedback,
  onSubmitAnswer,
  onNextQuestion,
  onCompleteInterview,
  onRestart,
}) {
  return (
    <div className="interview-container">
      <div className="session-header">
        <span className="session-info-badge">{selectedDomain.name}</span>
        <span className="session-info-badge">{selectedDifficulty}</span>
      </div>

      <div className="progress-section">
        <div className="progress-labels">
          <span>Interview Progress</span>
          <span>
            Question {currentQuestionNumber} of {totalQuestions}
          </span>
        </div>

        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{
              width: `${(currentQuestionNumber / totalQuestions) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="question-card">
        <div className="question-label">Question {currentQuestionNumber}</div>
        <h3 className="question-text">{currentQuestion}</h3>
      </div>

      <div className="answer-form">
        <div className="textarea-wrapper">
          <textarea
            className="answer-textarea"
            placeholder="Type your detailed explanation here. Give specific examples and mention relevant tools/trade-offs to demonstrate mastery..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={feedback !== null}
          ></textarea>

          <span className="char-counter">{answer.length} characters</span>
        </div>

        <FeedbackBox feedback={feedback} />

        <div className="navigation-row">
          <button type="button" className="btn-secondary" onClick={onRestart}>
            Abort Session
          </button>

          {feedback === null ? (
            <button
              type="button"
              className="btn-accent"
              onClick={onSubmitAnswer}
              disabled={!answer.trim()}
            >
              Submit Answer
            </button>
          ) : currentQuestionNumber < totalQuestions ? (
            <button
              type="button"
              className="btn-accent"
              onClick={onNextQuestion}
            >
              Next Question
            </button>
          ) : (
            <button
              type="button"
              className="btn-accent"
              onClick={onCompleteInterview}
            >
              Complete Interview
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewScreen;
