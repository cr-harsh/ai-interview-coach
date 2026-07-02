function LoadingBox({ loadingPhase }) {
  const loadingText =
    loadingPhase === "complete"
      ? "Assembling Final Analysis..."
      : loadingPhase === "answer"
        ? "Submitting Answer..."
        : "Generating Question...";

  return (
    <div className="interview-container">
      <div className="loading-box">
        <div className="spinner"></div>
        <p className="loading-text">{loadingText}</p>
      </div>
    </div>
  );
}

export default LoadingBox;
