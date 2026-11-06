import { TrendingUp } from 'lucide-react';
import { INSIGHTS_SOURCE, INSIGHTS_TOTAL, INTERVIEW_INSIGHTS } from '../data/insights';

/** Real interview data, aggregated: what share of ML/AI companies asked about each area. */
export function InterviewInsights() {
  if (INTERVIEW_INSIGHTS.length === 0) return null;
  return (
    <section
      aria-labelledby="insights-title"
      className="grid gap-6 rounded-2xl border border-line bg-surface p-5 shadow-soft sm:p-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"
    >
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide text-brand-deep uppercase">
          <TrendingUp className="size-3.5" aria-hidden /> Interview data
        </span>
        <h3 id="insights-title" className="mt-3 text-[clamp(20px,2.4vw,26px)]">
          What ML Engineer interviews ask about
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
          These questions map to what companies actually test. Projects come up almost everywhere,
          so the capstones here double as interview stories.
        </p>
      </div>
      <div>
        <ul className="grid gap-4">
          {INTERVIEW_INSIGHTS.map((s) => {
            const pct = Math.round((100 * s.companies) / INSIGHTS_TOTAL);
            return (
              <li key={s.label} className="grid gap-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[14px] font-semibold text-ink">{s.label}</span>
                  <span className="font-mono text-[13px] text-ink tabular-nums">
                    {pct}%{' '}
                    <span className="text-muted">
                      · {s.companies} of {INSIGHTS_TOTAL}
                    </span>
                  </span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-surface-2"
                  role="img"
                  aria-label={`${pct}% of companies`}
                >
                  <div className="h-full rounded-r-[4px] bg-brand" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[12.5px] text-muted">{s.note}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-[12px] text-muted">{INSIGHTS_SOURCE}</p>
      </div>
    </section>
  );
}
