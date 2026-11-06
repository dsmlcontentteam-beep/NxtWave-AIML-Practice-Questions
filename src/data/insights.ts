/**
 * What AI/ML interviews actually ask about, from NxtWave's own placement-interview data
 * (Hiring Intelligence, 72 ML and AI companies, Jan–Oct 2026). Aggregates only, no company names.
 * To hide the panel, set INTERVIEW_INSIGHTS to an empty list.
 */
export const INSIGHTS_SOURCE =
  "Share of 72 ML and AI companies that asked about each area in NxtWave's placement interviews, Jan–Oct 2026.";

export const INTERVIEW_INSIGHTS: Array<{ label: string; companies: number; note: string }> = [
  { label: 'Your projects', companies: 66, note: 'The capstones here are interview material.' },
  { label: 'Python and data handling', companies: 43, note: 'NumPy, pandas and clean code.' },
  { label: 'Machine learning', companies: 38, note: 'Algorithms, metrics and model choices.' },
  { label: 'Deep learning, NLP or CV', companies: 27, note: 'More often at higher packages.' },
];
export const INSIGHTS_TOTAL = 72;
