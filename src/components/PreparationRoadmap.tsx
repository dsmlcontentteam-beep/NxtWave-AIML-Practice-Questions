import { Lock } from 'lucide-react';
import { ROLES } from '../data/roles';
import { useReveal } from '../lib/hooks';
import type { Category } from '../types';
import { CourseCard } from './CourseCard';
import { InterviewInsights } from './InterviewInsights';
import { SectionHeading } from './SectionHeading';

export function PreparationRoadmap({
  categories,
  onSelect,
}: {
  categories: Array<Category & { count: number; courses: number }>;
  onSelect: (id: string) => void;
}) {
  const ref = useReveal<HTMLElement>();
  // Only one role has a roadmap today; the other tabs are locked.
  const active = ROLES.find((r) => r.open);
  const total = categories.reduce((n, c) => n + c.count, 0);

  return (
    <section
      id="roadmap"
      ref={ref}
      className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <SectionHeading eyebrow="Your preparation roadmap" title="Choose a Role, Follow Its Roadmap">
        Machine learning is a core part of many AI and data roles, so every roadmap builds on it.
        Pick a subject area to see its questions.
      </SectionHeading>

      <div role="tablist" aria-label="Roles" className="mt-8 flex flex-wrap gap-2">
        {ROLES.map((r) => {
          const on = r.id === active?.id;
          return (
            <button
              key={r.id}
              type="button"
              role="tab"
              id={`role-${r.id}`}
              aria-selected={on}
              aria-controls={on ? 'role-panel' : undefined}
              disabled={!r.open}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-[14px] font-semibold whitespace-nowrap transition-colors ${
                on
                  ? 'border-ink bg-ink text-surface shadow-soft'
                  : r.open
                    ? 'border-line bg-surface text-ink-2 hover:border-line-2 hover:text-ink'
                    : 'cursor-not-allowed border-dashed border-line-2 bg-transparent text-muted'
              }`}
            >
              {!r.open && <Lock className="size-3.5" aria-hidden />}
              {r.name}
              {!r.open && (
                <span className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[10.5px] font-semibold tracking-wide uppercase">
                  {/* Short on phones, so all three roles fit without scrolling sideways. */}
                  <span className="sm:hidden">Soon</span>
                  <span className="hidden sm:inline">Coming soon</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="role-panel"
        aria-labelledby={active ? `role-${active.id}` : undefined}
        className="mt-5"
      >
        <p className="text-[14px] text-ink-2">
          <b className="text-ink">{active?.name} roadmap</b> · {categories.length} subject areas ·{' '}
          {total} questions, in the order most students learn them.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <CourseCard
              key={c.id}
              category={c}
              step={i + 1}
              count={c.count}
              courses={c.courses}
              onSelect={() => onSelect(c.id)}
            />
          ))}
          <div className="flex flex-col justify-center rounded-2xl border border-dashed border-line-2 p-5">
            <span className="eyebrow">How to use this</span>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
              New to an area? Finish its course on NxtWave Academy first, then come back and
              practice. Two or three questions a day covers everything in a couple of weeks.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <InterviewInsights />
        </div>
      </div>
    </section>
  );
}
