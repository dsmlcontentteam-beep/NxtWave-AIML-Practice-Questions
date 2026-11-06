import { useCallback, useMemo, useState } from 'react';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { Navbar } from './components/Navbar';
import { PreparationExpectations } from './components/PreparationExpectations';
import { PreparationRoadmap } from './components/PreparationRoadmap';
import { QuestionExplorer } from './components/QuestionExplorer';
import { CATEGORIES } from './data/categories';
import { QUESTIONS } from './data/questions';
import { track } from './lib/analytics';
import { scrollToId } from './lib/hooks';
import { readFilters, writeFilters } from './lib/url-state';
import type { Filters } from './types';
import { ALL } from './types';

export function App() {
  const [filters, setFilters] = useState<Filters>(() => readFilters(CATEGORIES.map((c) => c.id)));

  const update = useCallback((next: Partial<Filters>) => {
    setFilters((f) => {
      const merged = { ...f, ...next };
      writeFilters(merged);
      return merged;
    });
  }, []);

  // Everything shown as a number is counted from the question sheet, never typed in.
  const categories = useMemo(
    () =>
      CATEGORIES.map((c) => {
        const items = QUESTIONS.filter((q) => q.categoryId === c.id);
        return { ...c, count: items.length };
      }).filter((c) => c.count > 0),
    [],
  );
  const totals = useMemo(
    () => ({
      questions: QUESTIONS.length,
      categories: categories.length,
      courses: new Set(QUESTIONS.map((q) => q.course)).size,
      videos: QUESTIONS.filter((q) => q.videoUrl).length,
    }),
    [categories.length],
  );
  // A friendly first question: the first Beginner one in roadmap order.
  const starter = useMemo(() => {
    const order = new Map(categories.map((c, i) => [c.id, i]));
    const byRoadmap = [...QUESTIONS].sort(
      (a, b) =>
        (order.get(a.categoryId) ?? 99) - (order.get(b.categoryId) ?? 99) || a.order - b.order,
    );
    return byRoadmap.find((q) => q.difficulty === 'Beginner' && !q.draft) ?? byRoadmap[0];
  }, [categories]);

  const goToPractice = (source: string) => {
    track('cta_clicked', { source });
    scrollToId('practice');
  };
  const selectCategory = (id: string, source: string) => {
    update({ category: id, difficulty: ALL });
    track('category_selected', { category: id, source });
    scrollToId('practice');
  };

  return (
    <>
      <a
        href="#practice"
        className="sr-only z-50 rounded-lg bg-ink px-3 py-2 text-surface focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to the questions
      </a>
      <Navbar onStart={() => goToPractice('navbar')} />
      <main>
        <HeroSection
          totals={totals}
          categories={categories}
          starter={starter}
          onStart={() => goToPractice('hero_start')}
          onExplore={() => {
            track('cta_clicked', { source: 'hero_explore' });
            scrollToId('roadmap');
          }}
          onSelectCategory={(id) => selectCategory(id, 'hero')}
        />
        <PreparationRoadmap categories={categories} />
        <QuestionExplorer
          questions={QUESTIONS}
          categories={categories}
          filters={filters}
          onChange={update}
        />
        <HowItWorks />
        <PreparationExpectations total={totals.questions} />
        <FinalCTA
          onExplore={() => {
            update({ category: ALL, difficulty: ALL });
            goToPractice('final_cta');
          }}
        />
      </main>
      <Footer />
    </>
  );
}
