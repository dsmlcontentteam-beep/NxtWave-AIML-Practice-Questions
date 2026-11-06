import { Info, SearchX } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { accentOf, CATEGORY_BY_ID } from '../data/categories';
import { SHOWING_DRAFTS } from '../data/questions';
import { track } from '../lib/analytics';
import { countBy, filterQuestions, groupByCourse } from '../lib/filters';
import { useDebounced } from '../lib/hooks';
import type { Category, Difficulty, Filters, Question } from '../types';
import { ALL } from '../types';
import { CategoryTabs, DifficultyFilter } from './FilterControls';
import { QuestionCard } from './QuestionCard';
import { SearchBar } from './SearchBar';
import { SectionHeading } from './SectionHeading';

interface Props {
  questions: Question[];
  categories: Category[];
  filters: Filters;
  onChange: (next: Partial<Filters>) => void;
}

export function QuestionExplorer({ questions, categories, filters, onChange }: Props) {
  const query = useDebounced(filters.query, 200);
  // The search box filters once typing pauses, so the grid doesn't jump on every key.
  const effective = useMemo(
    () => ({ category: filters.category, difficulty: filters.difficulty, query }),
    [filters.category, filters.difficulty, query],
  );

  const results = useMemo(
    () => filterQuestions(questions, effective, CATEGORY_BY_ID),
    [questions, effective],
  );
  // Facet counts: each control shows what you'd get if you changed only that control.
  const categoryCounts = useMemo(
    () =>
      countBy(
        filterQuestions(questions, { ...effective, category: ALL }, CATEGORY_BY_ID),
        (q) => q.categoryId,
      ),
    [questions, effective],
  );
  const levelCounts = useMemo(
    () =>
      countBy(
        filterQuestions(questions, { ...effective, difficulty: ALL }, CATEGORY_BY_ID),
        (q) => q.difficulty,
      ),
    [questions, effective],
  );
  const groups = useMemo(() => groupByCourse(results), [results]);
  const filtered =
    filters.category !== ALL || filters.difficulty !== ALL || filters.query.trim() !== '';
  const selected = CATEGORY_BY_ID.get(filters.category);

  // Search is tracked once the student stops typing: whether it found anything, never the text.
  const resultCount = useRef(results.length);
  resultCount.current = results.length;
  useEffect(() => {
    if (query.trim().length >= 2) track('search_used', { results: resultCount.current });
  }, [query]);

  const clear = () => onChange({ category: ALL, difficulty: ALL, query: '' });

  return (
    <section
      id="practice"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
      aria-labelledby="practice-title"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Practice hub" title="Your Coding Practice Hub">
          Explore the questions available across our learning portal. Pick a topic, solve questions,
          and strengthen your practical understanding.
        </SectionHeading>
      </div>

      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-3">
        <CategoryTabs
          categories={categories}
          value={filters.category}
          counts={categoryCounts}
          total={[...categoryCounts.values()].reduce((a, b) => a + b, 0)}
          onChange={(id) => {
            onChange({ category: id });
            track('category_selected', { category: id, source: 'explorer' });
          }}
        />
        <div className="flex flex-col gap-3 md:flex-row">
          <SearchBar value={filters.query} onChange={(v) => onChange({ query: v })} />
          <DifficultyFilter
            value={filters.difficulty}
            counts={levelCounts}
            onChange={(d: Difficulty | 'all') => {
              onChange({ difficulty: d });
              track('level_selected', { level: d });
            }}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="text-[14px] text-ink-2" aria-live="polite">
          <b className="font-display text-ink tabular-nums">{results.length}</b>{' '}
          {results.length === 1 ? 'question' : 'questions'}
          {selected ? (
            <>
              {' '}
              in <b className="text-ink">{selected.fullName ?? selected.name}</b>
            </>
          ) : (
            ' across all subjects'
          )}
          {filters.difficulty !== ALL && <> · {filters.difficulty}</>}
          {query.trim() && <> · matching “{query.trim()}”</>}
        </p>
        {filtered && (
          <button
            type="button"
            onClick={clear}
            className="text-[13.5px] font-semibold text-brand-deep hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="mt-3 flex items-start gap-2 rounded-xl border border-line bg-surface-2/70 px-3.5 py-2.5 text-[13px] text-ink-2">
        <Info className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
        <span>
          <b className="text-ink">Solve Question</b> opens the exact question on NxtWave Academy in
          a new tab.
          {SHOWING_DRAFTS && (
            <>
              {' '}
              <b className="text-warn">Preview build:</b> questions marked DRAFT are not verified
              yet and are hidden on the live site.
            </>
          )}
        </span>
      </p>

      {results.length === 0 ? (
        <div className="mt-8 grid justify-items-center gap-3 rounded-2xl border border-dashed border-line-2 bg-surface px-6 py-14 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-surface-2 text-muted">
            <SearchX className="size-6" aria-hidden />
          </span>
          <h3 className="font-sans text-[18px] font-bold tracking-tight">No questions match</h3>
          <p className="max-w-sm text-[14px] text-ink-2">
            Try a different word, another level, or all subjects. Topics like “regression”, “pandas”
            or “CNN” work well.
          </p>
          <button
            type="button"
            onClick={clear}
            className="mt-1 rounded-xl bg-ink px-4 py-2.5 text-[14px] font-semibold text-surface"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-10">
          {groups.map((g) => {
            const c = CATEGORY_BY_ID.get(g.categoryId);
            const headingId = `course-${g.key.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
            return (
              <section key={g.key} aria-labelledby={headingId}>
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="h-6 w-1 rounded-full"
                    style={{ background: c ? accentOf(c) : 'var(--line-2)' }}
                    aria-hidden
                  />
                  <h3 id={headingId} className="font-sans text-[17px] font-bold tracking-tight">
                    {g.course}
                  </h3>
                  <span className="rounded-md bg-surface-2 px-1.5 font-mono text-[12px] text-muted tabular-nums">
                    {g.items.length}
                  </span>
                  {filters.category === ALL && c && c.name !== g.course && (
                    <span className="hidden text-[12.5px] text-muted sm:inline">{c.name}</span>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {g.items.map((q) => (
                    <QuestionCard key={q.id} q={q} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}
