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
  return (
    <section
      id="roadmap"
      ref={ref}
      className="reveal mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <SectionHeading
        eyebrow="Your preparation roadmap"
        title="Everything You Need to Practice for ML Engineering"
      >
        Five subject areas, in the order most students learn them. Pick one to see its questions.
      </SectionHeading>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="hidden rounded-2xl border border-dashed border-line-2 p-5 lg:flex lg:flex-col lg:justify-center">
          <span className="eyebrow">How to use this</span>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
            Start with the area you feel least sure about. Two or three questions a day is enough to
            cover everything in a couple of weeks.
          </p>
        </div>
      </div>
      <div className="mt-6">
        <InterviewInsights />
      </div>
    </section>
  );
}
