/**
 * Reads the question sheet (CSV exported from Google Sheets) and checks every row before it can
 * reach students. Plain JavaScript with no dependencies, so it runs in any Node build (Vercel too).
 */

export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
export const TYPES = ['Coding', 'Practical', 'Project'];
export const STATUSES = ['live', 'draft', 'hidden'];
/** Only links on the student learning portal may reach students. */
export const ALLOWED_HOSTS = ['learning.ccbp.in'];
export const COLUMNS = [
  'id',
  'category',
  'course',
  'topic',
  'title',
  'description',
  'difficulty',
  'type',
  'academy_url',
  'video_url',
  'order',
  'status',
  'verified_by',
  'notes',
];
const REQUIRED = [
  'id',
  'category',
  'course',
  'topic',
  'title',
  'difficulty',
  'type',
  'academy_url',
  'status',
];

/** RFC 4180 CSV: quoted fields, doubled quotes, commas and newlines inside quotes, CRLF, a BOM. */
export function parseCsv(text) {
  const src = text.replace(/^﻿/, '');
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"' && field === '') quoted = true;
    else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += ch;
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

function allowedUrl(raw) {
  try {
    const u = new URL(raw);
    return u.protocol === 'https:' && ALLOWED_HOSTS.includes(u.hostname) && !u.username;
  } catch {
    return false;
  }
}

/**
 * Validates the sheet and returns the questions students may see, plus every problem found.
 * `showDrafts` adds draft rows (flagged) for preview builds; hidden rows never appear.
 */
export function loadQuestions(csvText, categories, { showDrafts = false } = {}) {
  const rows = parseCsv(csvText);
  const errors = [];
  if (rows.length === 0) return { questions: [], errors: ['The sheet is empty.'], stats: {} };
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const missing = REQUIRED.filter((c) => !header.includes(c));
  if (missing.length) {
    return {
      questions: [],
      errors: [
        `Row 1 is missing the column(s): ${missing.join(', ')}. See docs/QUESTIONS-SHEET.md.`,
      ],
      stats: {},
    };
  }
  const byName = new Map();
  for (const c of categories) {
    for (const n of [c.name, c.id, ...(c.aliases ?? [])]) byName.set(n.trim().toLowerCase(), c.id);
  }
  const ids = new Set();
  const liveUrls = new Map();
  const questions = [];
  const stats = { live: 0, draft: 0, hidden: 0 };

  rows.slice(1).forEach((cells, i) => {
    const line = i + 2;
    const get = (col) => (cells[header.indexOf(col)] ?? '').trim();
    const problem = (msg) => errors.push(`Row ${line} (${get('id') || 'no id'}): ${msg}`);
    for (const col of REQUIRED) if (!get(col)) problem(`"${col}" is empty`);
    const id = get('id');
    if (id && !/^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$/.test(id))
      problem('"id" may only use letters, digits, - and _ (40 characters max)');
    if (id && ids.has(id)) problem(`"id" ${id} is used twice`);
    ids.add(id);
    const categoryId = byName.get(get('category').toLowerCase());
    if (get('category') && !categoryId)
      problem(
        `unknown category "${get('category')}". Use one of: ${categories.map((c) => c.name).join(', ')}`,
      );
    const pick = (col, allowed) => {
      const v = get(col);
      const hit = allowed.find((a) => a.toLowerCase() === v.toLowerCase());
      if (v && !hit) problem(`"${col}" must be one of ${allowed.join(', ')} (got "${v}")`);
      return hit;
    };
    const difficulty = pick('difficulty', DIFFICULTIES);
    const type = pick('type', TYPES);
    const status = pick('status', STATUSES);
    if (get('title').length > 80) problem('"title" is longer than 80 characters');
    if (get('description').length > 160) problem('"description" is longer than 160 characters');
    const academyUrl = get('academy_url');
    if (academyUrl && !allowedUrl(academyUrl))
      problem(`"academy_url" must be an https link on ${ALLOWED_HOSTS.join(', ')}`);
    const videoUrl = get('video_url');
    if (videoUrl && !allowedUrl(videoUrl))
      problem(`"video_url" must be an https link on ${ALLOWED_HOSTS.join(', ')}, or empty`);
    const orderRaw = get('order');
    if (orderRaw && !/^\d{1,5}$/.test(orderRaw)) problem('"order" must be a whole number');
    if (status) stats[status] += 1;
    if (status === 'live' && academyUrl) {
      if (liveUrls.has(academyUrl))
        problem(`"academy_url" is the same as live row ${liveUrls.get(academyUrl)}`);
      liveUrls.set(academyUrl, id);
    }
    if (!(status === 'live' || (status === 'draft' && showDrafts))) return;
    questions.push({
      id,
      categoryId,
      course: get('course'),
      topic: get('topic'),
      title: get('title'),
      ...(get('description') ? { description: get('description') } : {}),
      difficulty,
      type,
      academyUrl,
      ...(videoUrl ? { videoUrl } : {}),
      order: orderRaw ? Number(orderRaw) : line,
      ...(status === 'draft' ? { draft: true } : {}),
    });
  });

  questions.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  return { questions, errors, stats };
}
