import { Component } from 'react';

class ReportErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ReportErrorBoundary] Report view crashed:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="report-container">
          <span className="report-badge">Render Error</span>
          <h2 className="success-title">Could Not Display Report</h2>
          <p className="overall-feedback-text" style={{ textAlign: 'left' }}>
            The interview completed but the summary failed to render.
            {this.state.error?.message ? `\n\n${this.state.error.message}` : ''}
          </p>
          <button
            type="button"
            className="btn-accent"
            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
            onClick={this.props.onRestart}
          >
            Start New Session
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ReportErrorBoundary;
