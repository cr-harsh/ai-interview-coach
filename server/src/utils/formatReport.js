function normalizeReportField(value) {
  if (value == null || value === '') return '';

  if (typeof value === 'string') return value;

  if (typeof value === 'number') return String(value);

  if (Array.isArray(value)) {
    return value.map((item) => `• ${normalizeReportField(item)}`).join('\n');
  }

  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, val]) => {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        return `${label}:\n${normalizeReportField(val)}`;
      })
      .join('\n\n');
  }

  return String(value);
}

module.exports = { normalizeReportField };