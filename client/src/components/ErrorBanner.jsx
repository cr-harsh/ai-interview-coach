function ErrorBanner({ error, onClose }) {
  return (
    <div className="error-banner">
      <span>⚠️ {error}</span>
      <button type="button" className="error-close-btn" onClick={onClose}>
        ×
      </button>
    </div>
  );
}

export default ErrorBanner;
