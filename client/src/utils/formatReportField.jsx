export const formatReportField = (value) => {
  if (value == null || value === "") return "";

  if (typeof value === "string") return value;

  if (typeof value === "number") return String(value);

  if (Array.isArray(value)) {
    return value.map((item) => `• ${formatReportField(item)}`).join("\n");
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, val]) => {
        const label = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        return `${label}:\n${formatReportField(val)}`;
      })
      .join("\n\n");
  }

  return String(value);
};

export const normalizeFinalReport = (report) => ({
  score: typeof report?.score === "number" ? report.score : 0,
  overallFeedback: formatReportField(report?.overallFeedback),
  detailedSummary: formatReportField(report?.detailedSummary),
  overallStrengths: formatReportField(report?.overallStrengths),
  weakAreas: formatReportField(report?.weakAreas),
  recommendation: formatReportField(report?.recommendation),
});
