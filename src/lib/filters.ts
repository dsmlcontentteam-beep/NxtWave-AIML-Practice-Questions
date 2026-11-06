import type { Category, Filters, Question } from '../types';
import { ALL } from '../types';

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Searchable text for a question: its title, topic, course, category and type. */
export const haystack = (q: Question, category?: Category) =>
  norm(
    [
      q.title,
      q.topic,
      q.course,
      q.description ?? '',
      q.type,
      category?.name ?? '',
      category?.fullName ?? '',
    ].join(' '),
  );

/** Every word of the query must appear somewhere ("knn regression" finds both words). */
export function matchesQuery(q: Question, query: string, category?: Category) {
  const words = norm(query).split(' ').filter(Boolean);
  if (words.length === 0) return true;
  const text = haystack(q, category);
  return words.every((w) => text.includes(w));
}

export function filterQuestions(
  questions: Question[],
  filters: Filters,
  categoryById: Map<string, Category>,
) {
  return questions.filter(
    (q) =>
      (filters.category === ALL || q.categoryId === filters.category) &&
      (filters.difficulty === ALL || q.difficulty === filters.difficulty) &&
      matchesQuery(q, filters.query, categoryById.get(q.categoryId)),
  );
}

/** Questions grouped by course, in the order courses first appear (the sheet's order). */
export function groupByCourse(questions: Question[]) {
  const groups = new Map<string, Question[]>();
  for (const q of questions) {
    const key = `${q.categoryId}::${q.course}`;
    groups.set(key, [...(groups.get(key) ?? []), q]);
  }
  return [...groups.entries()].map(([key, items]) => ({
    key,
    course: items[0]?.course ?? '',
    categoryId: items[0]?.categoryId ?? '',
    items,
  }));
}

export const countBy = <K extends string>(questions: Question[], key: (q: Question) => K) =>
  questions.reduce((m, q) => m.set(key(q), (m.get(key(q)) ?? 0) + 1), new Map<K, number>());
