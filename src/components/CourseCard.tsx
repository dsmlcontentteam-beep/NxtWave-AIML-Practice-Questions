import { ArrowRight } from 'lucide-react';
import { accentOf, iconOf, tintOf } from '../data/categories';
import type { Category } from '../types';

export function CourseCard({
  category,
  step,
  count,
  courses,
  onSelect,
}: {
  category: Category;
  step: number;
  count: number;
  courses: number;
  onSelect: () => void;
}) {
  const Icon = iconOf(category);
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-5 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
      style={{ ['--accent' as string]: accentOf(category) }}
      aria-label={`${category.fullName ?? category.name}: ${count} questions across ${courses} course${courses === 1 ? '' : 's'}. Show them in the practice hub.`}
    >
      {/* A thin accent bar that lights up on hover. */}
      <span
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
        style={{ background: accentOf(category) }}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3">
        <span
          className="grid size-11 place-items-center rounded-xl"
          style={{ color: accentOf(category), background: tintOf(category, 14) }}
        >
          <Icon className="size-5" aria-hidden />
        </span>
        <span className="font-mono text-[12px] font-semibold text-muted">
          {String(step).padStart(2, '0')}
        </span>
      </div>
      <h3 className="mt-4 font-sans text-[18px] font-bold tracking-tight">
        {category.name}
        {category.fullName && (
          <span className="block text-[12.5px] font-medium tracking-normal text-muted">
            {category.fullName}
          </span>
        )}
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{category.description}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Skills">
        {category.skills.map((s) => (
          <li
            key={s}
            className="rounded-md border border-line bg-surface-2 px-2 py-0.5 text-[12px] font-medium text-ink-2"
          >
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-4 [margin-top:max(1.25rem,auto)]">
        <span className="text-[13px] text-muted">
          <b className="font-display text-[16px] text-ink tabular-nums">{count}</b> questions ·{' '}
          {courses} course{courses === 1 ? '' : 's'}
        </span>
        <span
          className="inline-flex items-center gap-1 text-[13px] font-semibold transition-transform group-hover:translate-x-0.5"
          style={{ color: accentOf(category) }}
        >
          Practice <ArrowRight className="size-4" aria-hidden />
        </span>
      </div>
    </button>
  );
}
