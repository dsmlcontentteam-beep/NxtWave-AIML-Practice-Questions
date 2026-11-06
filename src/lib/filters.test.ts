import { describe, expect, it } from 'vitest';
import type { Category, Question } from '../types';
import { countBy, filterQuestions, groupByCourse, matchesQuery } from './filters';

const cat = (id: string, name: string, fullName?: string): Category => ({
  id,
  name,
  short: name,
  fullName,
  description: '',
  skills: [],
  icon: 'brain',
  accent: 'g0',
});
const CATS = new Map([
  ['ml', cat('ml', 'Machine Learning')],
  ['nlp', cat('nlp', 'NLP', 'Natural Language Processing')],
]);
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
  it('searches titles, topics, courses and the category name, every word', () => {
    expect(matchesQuery(QS[1] as Question, 'knn')).toBe(true);
    expect(matchesQuery(QS[0] as Question, 'supervised regression')).toBe(true);
    expect(matchesQuery(QS[0] as Question, 'regression knn')).toBe(false);
    expect(matchesQuery(QS[2] as Question, 'natural language', CATS.get('nlp'))).toBe(true);
    expect(matchesQuery(QS[1] as Question, '  K-Nearest  ')).toBe(true);
  });

  it('combines category, difficulty and search', () => {
    const ids = (f: Parameters<typeof filterQuestions>[1]) =>
      filterQuestions(QS, f, CATS).map((x) => x.id);
    expect(ids({ category: 'all', difficulty: 'all', query: '' })).toEqual(['a', 'b', 'c']);
    expect(ids({ category: 'ml', difficulty: 'all', query: '' })).toEqual(['a', 'b']);
    expect(ids({ category: 'ml', difficulty: 'Beginner', query: '' })).toEqual(['b']);
    expect(ids({ category: 'all', difficulty: 'all', query: 'embeddings' })).toEqual(['c']);
    expect(ids({ category: 'nlp', difficulty: 'Beginner', query: '' })).toEqual([]);
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
