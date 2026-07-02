import { DOMAINS, DIFFICULTIES } from "../data/interviewOptions";

function SetupPanel({
  selectedDomain,
  setSelectedDomain,
  selectedDifficulty,
  setSelectedDifficulty,
  onStart,
}) {
  return (
    <div className="setup-panel">
      <h2 className="section-title">
        <span className="section-number">1</span> Choose Your Focus Domain
      </h2>

      <div className="roles-grid">
        {DOMAINS.map((domain) => (
          <div
            key={domain.id}
            className={`role-card ${selectedDomain?.id === domain.id ? "selected" : ""}`}
            onClick={() => setSelectedDomain(domain)}
          >
            <div>
              <div className="role-icon-box">{domain.icon}</div>
              <h3 className="role-name">{domain.name}</h3>
              <p className="role-desc">{domain.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="difficulty-section">
        <h2 className="section-title">
          <span className="section-number">2</span> Choose Difficulty Level
        </h2>

        <div className="difficulty-selector">
          {DIFFICULTIES.map((level) => (
            <button
              key={level}
              type="button"
              className={`difficulty-btn ${level.toLowerCase()} ${selectedDifficulty === level ? "selected" : ""}`}
              onClick={() => setSelectedDifficulty(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="action-box">
        <button
          type="button"
          className="start-btn"
          disabled={!selectedDomain || !selectedDifficulty}
          onClick={onStart}
        >
          Start Session
        </button>

        {!selectedDomain || !selectedDifficulty ? (
          <span className="error-hint">
            Configure both options above to open the interview container.
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default SetupPanel;
