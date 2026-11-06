import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { COLUMNS, loadQuestions, parseCsv } from './sheet.mjs';

const categories = JSON.parse(
  readFileSync(new URL('../data/categories.json', import.meta.url), 'utf8'),
);
const URL_A = 'https://learning.ccbp.in/course?c_id=a&s_id=1&t_id=x';
const URL_B = 'https://learning.ccbp.in/course?c_id=a&s_id=2&t_id=x';
const header = COLUMNS.join(',');
const row = (over = {}) => {
  const r = {
    id: 'ML-001',
    category: 'Machine Learning',
    course: 'Intro to ML',
    topic: 'KNN',
    title: 'K-Nearest Neighbors',
    description: '',
    difficulty: 'Intermediate',
    type: 'Coding',
    academy_url: URL_A,
    video_url: '',
    order: '',
    status: 'live',
    verified_by: '',
    notes: '',
    ...over,
  };
  return COLUMNS.map((c) => (String(r[c]).includes(',') ? `"${r[c]}"` : r[c])).join(',');
};
const sheet = (...rows) => [header, ...rows].join('\n');

describe('parseCsv', () => {
  it('handles quotes, commas, newlines in quotes, CRLF and a BOM', () => {
    expect(parseCsv('﻿a,b\r\n"x, y","say ""hi""\nthere"\r\n')).toEqual([
      ['a', 'b'],
      ['x, y', 'say "hi"\nthere'],
    ]);
  });
});

describe('loadQuestions', () => {
  it('loads live rows and maps the category tag to its id', () => {
    const { questions, errors } = loadQuestions(sheet(row()), categories);
    expect(errors).toEqual([]);
    expect(questions).toEqual([
      expect.objectContaining({ id: 'ML-001', categoryId: 'ml', academyUrl: URL_A }),
    ]);
  });

  it('accepts aliases and any letter case for tags and values', () => {
    const { questions, errors } = loadQuestions(
      sheet(row({ category: 'ml', difficulty: 'beginner', type: 'coding', status: 'LIVE' })),
      categories,
    );
    expect(errors).toEqual([]);
    expect(questions[0]).toMatchObject({
      categoryId: 'ml',
      difficulty: 'Beginner',
      type: 'Coding',
    });
  });

  it('shows drafts only on preview builds, and never hidden rows', () => {
    const csv = sheet(
      row(),
      row({ id: 'ML-002', status: 'draft', academy_url: URL_B }),
      row({ id: 'ML-003', status: 'hidden', academy_url: 'https://learning.ccbp.in/x' }),
    );
    expect(loadQuestions(csv, categories).questions.map((q) => q.id)).toEqual(['ML-001']);
    const preview = loadQuestions(csv, categories, { showDrafts: true }).questions;
    expect(preview.map((q) => [q.id, q.draft ?? false])).toEqual([
      ['ML-001', false],
      ['ML-002', true],
    ]);
  });

  it('refuses links outside the student learning portal', () => {
    for (const bad of [
      'http://learning.ccbp.in/course?x=1',
      'https://niat.ccbp.in/course?x=1',
      'https://drive.google.com/x',
      'https://user@learning.ccbp.in/x',
      'learning.ccbp.in/course',
    ]) {
      const { errors } = loadQuestions(sheet(row({ academy_url: bad })), categories);
      expect(errors.join(' '), bad).toMatch(/academy_url/);
    }
    const video = loadQuestions(sheet(row({ video_url: 'https://youtu.be/x' })), categories);
    expect(video.errors.join(' ')).toMatch(/video_url/);
  });

  it('names the row and the problem for every mistake', () => {
    const { errors } = loadQuestions(
      sheet(
        row(),
        row({ academy_url: URL_A }), // duplicate id and duplicate live link
        row({
          id: 'X-1',
          category: 'Data Science',
          difficulty: 'Easy',
          type: 'Quiz',
          academy_url: URL_B,
        }),
        row({ id: 'X-2', title: '', academy_url: 'https://learning.ccbp.in/y' }),
      ),
      categories,
    );
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^Row 3 \(ML-001\): "id" ML-001 is used twice/),
        expect.stringMatching(/^Row 3 .*same as live row ML-001/),
        expect.stringMatching(/^Row 4 .*unknown category "Data Science"/),
        expect.stringMatching(/^Row 4 .*"difficulty" must be one of/),
        expect.stringMatching(/^Row 4 .*"type" must be one of/),
        expect.stringMatching(/^Row 5 .*"title" is empty/),
      ]),
    );
  });

  it('rejects a sheet without the required columns', () => {
    const { errors } = loadQuestions('title,link\nA,B', categories);
    expect(errors[0]).toMatch(/missing the column/);
  });

  it('accepts the real question sheet in the repo', () => {
    const csv = readFileSync(new URL('../data/questions.csv', import.meta.url), 'utf8');
    const { questions, errors, stats } = loadQuestions(csv, categories);
    expect(errors).toEqual([]);
    expect(questions.length).toBe(stats.live);
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
    expect(questions.every((q) => q.academyUrl.startsWith('https://learning.ccbp.in/'))).toBe(true);
  });
});
