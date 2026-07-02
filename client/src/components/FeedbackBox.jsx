function FeedbackBox({ feedback }) {
  if (!feedback) return null;

  return (
    <div className="feedback-box">
      <div className="feedback-header">
        <span>AI Coach Assessment</span>
      </div>
      <p className="feedback-text">{feedback}</p>
    </div>
  );
}

export default FeedbackBox;
