import { formatReportField } from '../utils/formatReportField';

function ReportScreen({
  finalReport,
  selectedDomain,
  selectedDifficulty,
  totalQuestions,
  onRestart
}) {
  return (
    <div className="report-container">
      <span className="report-badge">Analysis Complete</span>
      <h2 className="success-title">Interview Summary</h2>

      <div className="report-score-box">
        <div className="score-circle">
          <span className="score-value">{finalReport.score ?? 0}%</span>
        </div>
        <span className="score-label">Overall Readiness Score</span>
      </div>

      <div className="summary-card">
        <div className="summary-row">
          <span className="summary-label">Discipline</span>
          <span className="summary-value">{selectedDomain?.name ?? 'N/A'}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Selected Difficulty</span>
          <span className={`summary-value difficulty-tag ${(selectedDifficulty || 'medium').toLowerCase()}`}>
            {selectedDifficulty ?? 'N/A'}
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Questions Evaluated</span>
          <span className="summary-value">{totalQuestions}</span>
        </div>
      </div>

      <div className="overall-feedback-section">
        <h3>Coach Performance Summary</h3>
        <p className="overall-feedback-text">
          {formatReportField(finalReport.overallFeedback)}
        </p>
      </div>

      {finalReport.overallStrengths && (
        <div className="overall-feedback-section">
          <h3>Key Strengths</h3>
          <p className="overall-feedback-text">
            {formatReportField(finalReport.overallStrengths)}
          </p>
        </div>
      )}

      {finalReport.weakAreas && (
        <div className="overall-feedback-section">
          <h3>Areas to Improve</h3>
          <p className="overall-feedback-text">
            {formatReportField(finalReport.weakAreas)}
          </p>
        </div>
      )}

      {finalReport.recommendation && (
        <div className="overall-feedback-section">
          <h3>Recommendations</h3>
          <p className="overall-feedback-text">
            {formatReportField(finalReport.recommendation)}
          </p>
        </div>
      )}

      <div className="overall-feedback-section">
        <h3>Detailed Question Log</h3>
        <pre
          className="overall-feedback-text"
          style={{ fontFamily: 'var(--font-sans)', whiteSpace: 'pre-wrap' }}
        >
          {formatReportField(finalReport.detailedSummary)}
        </pre>
      </div>

      <button
        type="button"
        className="btn-accent"
        style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
        onClick={onRestart}
      >
        Start New Session
      </button>
    </div>
  );
}

export default ReportScreen;