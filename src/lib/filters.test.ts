import { describe, expect, it } from 'vitest';
import type { Filters, Question } from '../types';
import { countBy, filterQuestions, groupByCourse } from './filters';

const q = (over: Partial<Question>): Question => ({
  id: 'x',
  categoryId: 'ml',
  course: 'Supervised Learning: Regression',
  topic: 'Logistic Regression',
  title: 'Logistic Regression',
  difficulty: 'Intermediate',
  type: 'Coding',
  academyUrl: 'https://learning.ccbp.in/x',
  order: 1,
  ...over,
});
const QS = [
  q({ id: 'a' }),
  q({
    id: 'b',
    title: 'K-Nearest Neighbors (KNN)',
    topic: 'K-Nearest Neighbors',
    difficulty: 'Beginner',
    course: 'Intro to ML',
  }),
  q({
    id: 'c',
    categoryId: 'nlp',
    title: 'Word Embeddings',
    topic: 'Vector Semantics',
    course: 'Intro to NLP',
    difficulty: 'Advanced',
  }),
];

describe('filters', () => {
  it('combines subject and difficulty', () => {
    const ids = (f: Filters) => filterQuestions(QS, f).map((x) => x.id);
    expect(ids({ category: 'all', difficulty: 'all' })).toEqual(['a', 'b', 'c']);
    expect(ids({ category: 'ml', difficulty: 'all' })).toEqual(['a', 'b']);
    expect(ids({ category: 'ml', difficulty: 'Beginner' })).toEqual(['b']);
    expect(ids({ category: 'all', difficulty: 'Advanced' })).toEqual(['c']);
    expect(ids({ category: 'nlp', difficulty: 'Beginner' })).toEqual([]);
  });

  it('groups by course in sheet order and counts facets', () => {
    expect(groupByCourse(QS).map((g) => [g.course, g.items.length])).toEqual([
      ['Supervised Learning: Regression', 1],
      ['Intro to ML', 1],
      ['Intro to NLP', 1],
    ]);
    expect(Object.fromEntries(countBy(QS, (x) => x.categoryId))).toEqual({ ml: 2, nlp: 1 });
  });
});
