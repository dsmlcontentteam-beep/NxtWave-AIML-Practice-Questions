import { ArrowUpRight, CirclePlay, CodeXml, FlaskConical, Rocket } from 'lucide-react';
import { accentOf, CATEGORY_BY_ID } from '../data/categories';
import { track } from '../lib/analytics';
import type { Question, QuestionType } from '../types';
import { DifficultyBadge } from './DifficultyBadge';

const TYPE_ICON: Record<QuestionType, typeof CodeXml> = {
  Coding: CodeXml,
  Practical: FlaskConical,
  Project: Rocket,
};

const plain = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
/** True when the title already names the topic ("Boosting" / "Boosting"). */
const saysTopic = (q: Question) => plain(q.title).includes(plain(q.topic));

export function QuestionCard({ q }: { q: Question }) {
  const category = CATEGORY_BY_ID.get(q.categoryId);
  const TypeIcon = TYPE_ICON[q.type];
  const props = { id: q.id, category: q.categoryId, difficulty: q.difficulty };
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-line-2 hover:shadow-lift sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex min-w-0 items-center gap-1.5 text-[12px] font-semibold text-ink-2">
          {category && (
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ background: accentOf(category) }}
              aria-hidden
            />
          )}
          <span className="truncate">{category?.short ?? q.categoryId}</span>
        </span>
        <span className="flex items-center gap-1.5">
          {q.draft && (
            <span
              className="rounded-md border border-dashed border-warn px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-warn"
              title="Preview only: this link has not been verified yet"
            >
              DRAFT
            </span>
          )}
          <DifficultyBadge level={q.difficulty} />
        </span>
      </div>

      <h4 className="mt-3 font-sans text-[16px] leading-snug font-semibold tracking-tight text-ink">
        {q.title}
      </h4>
      {/* The course is the group heading above; the topic shows only when it adds something. */}
      {!saysTopic(q) && <p className="mt-1 text-[13px] font-medium text-muted">{q.topic}</p>}
      {q.description && (
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{q.description}</p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-2 px-2 py-1 text-[12px] font-medium text-ink-2">
          <TypeIcon className="size-3.5" aria-hidden /> {q.type}
        </span>
        <div className="flex items-center gap-1">
          {q.videoUrl && (
            <a
              href={q.videoUrl}
              target="_blank"
              rel="noopener"
              onClick={() => track('concept_clicked', props)}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-[13px] font-semibold text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
              aria-label={`Watch the concept for ${q.title} on NxtWave Academy (opens in a new tab)`}
            >
              <CirclePlay className="size-4" aria-hidden /> Watch concept
            </a>
          )}
          <a
            href={q.academyUrl}
            target="_blank"
            rel="noopener"
            onClick={() => track('solve_clicked', { ...props, source: 'explorer' })}
            className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-2 text-[13px] font-semibold text-brand-ink transition-transform hover:-translate-y-px active:translate-y-0"
            aria-label={`Solve ${q.title} on NxtWave Academy (opens in a new tab)`}
          >
            Solve Question <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </article>
  );
}
