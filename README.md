# NxtWave AI/ML Interview Preparation

A single landing page that gathers the coding questions from NxtWave's Python for Data Analytics,
Machine Learning, Deep Learning, NLP and Computer Vision courses, as a list. Students filter them by
subject and level, then **Solve Question** opens the exact question on NxtWave Academy
(`learning.ccbp.in`) in a new tab. Academy handles sign-in and solving.

It is part of the NxtWave **Career Preparation Program**. The goal is to take students through the
learning portal first, so their basics are clear before interview preparation starts. The roadmap is
organized by role: Machine Learning Engineer is open, and other roles are locked as "Coming soon".

**What the page deliberately leaves out:**
- no login;
- no backend or database;
- no code editor;
- no video player.

It is a static site, built with React 19, TypeScript, Vite 8 and Tailwind CSS 4, with Lucide icons
and Vercel Web Analytics.

## Run it locally

```bash
npm install
npm run dev          # http://localhost:5410
npm test             # checks the question sheet and the filters
npm run build        # production build in dist/ (checks the sheet first)
npm run preview      # serve the production build on http://localhost:4410
```

Node 20 or newer.

## Where the questions come from

| File                          | What it is                                                                                          |
| ----------------------------- | --------------------------------------------------------------------------------------------------- |
| `data/questions.csv`          | **The question sheet. The only file to edit to add, change or remove questions.**                   |
| `data/categories.json`        | The five subject areas: names, the tag values the sheet uses, descriptions, skills, icons, colours. |
| `data/questions.template.csv` | An empty sheet with the right header row.                                                           |
| `data/missing-links.csv`      | Coding practices from the master sheet that have no Academy link yet (PyTorch).                     |
| `docs/QUESTIONS-SHEET.md`     | The column-by-column format and the rules every row must pass.                                      |
| `src/data/roles.ts`           | The role tabs on the roadmap. Set `open: true` on a role once its roadmap is ready.                 |

Every count on the page is computed from the sheet, never typed in. That covers the hero numbers,
the per-subject counts, the filter counts and the "how many days" estimate.

### Updating questions

1. Edit the Google Sheet. Keep row 1 as in `docs/QUESTIONS-SHEET.md`.
2. **File → Download → Comma-separated values (.csv)**. Save it over `data/questions.csv`.
3. Run `npm run questions`. It either prints `✓ questions: N on the page…`, or lists each bad row
   and what is wrong with it.
4. Commit and push. Vercel rebuilds automatically, and the build refuses a sheet with errors.

Only rows with `status` = `live` reach students.
- On a **Preview** deployment, set the environment variable `SHOW_DRAFTS=true` to also see `draft`
  rows, marked **DRAFT**, so they can be checked before going live.
- Links must be `https://learning.ccbp.in/…`. Any other host (NIAT, Drive, YouTube) is refused.

### Current data (6 Nov 2026)

The 70 coding questions were taken from the DSML master sheet's Academy course tabs. Each one
keeps its exact Academy unit link, and its "Watch concept" link is the Academy session for the
same topic.

- **59 are `live`:** the master sheet shows their production status as Done.
- **11 are `draft`:** 2 ML and 9 Intro-to-NLP rows show no Done status. Check them on Academy,
  then set them to `live`.
- **PyTorch:** 13 coding practices have no links in the master sheet (`data/missing-links.csv`).
- **Difficulty:** every value is a suggestion. Confirm it in the sheet.
- **Descriptions:** all empty for now. Add one line each if you like.

## Deploy to Vercel

1. Push this folder to the company GitHub repository. It is its own repo, unrelated to the prep
   platform.
2. In Vercel, under **Add New → Project**, import the repository.
3. Vercel detects Vite from `vercel.json`:
   - build command `npm run build`;
   - output directory `dist`.

   Nothing else to configure.
4. Optional: **Settings → Environment Variables** → add `SHOW_DRAFTS` = `true` for the **Preview**
   environment only.
5. Deploy. Every push to the main branch redeploys production; other branches get Preview URLs.

`vercel.json` also sends basic security headers and long-term caching for the hashed assets.

## Analytics (Vercel Web Analytics)

1. In the Vercel project, open **Analytics → Enable**. No code change is needed: the page already
   includes `@vercel/analytics`.
2. Analytics loads only in builds made on Vercel, so local runs make no analytics requests.

**What gets recorded:**
- **Page views:** visits, referrers, countries and devices. No cookies and no personal data. These
  are available on the free Hobby plan within its monthly event allowance.
- **Click events:** sent by the page, but per Vercel's docs custom events show in the dashboard
  only on **Pro** and above. They appear automatically after an upgrade.

| Event               | When                                          | Properties                                                      |
| ------------------- | --------------------------------------------- | --------------------------------------------------------------- |
| `solve_clicked`     | A Solve button is clicked                     | `id`, `category`, `difficulty`, `source` (`explorer` or `hero`) |
| `concept_clicked`   | A Watch concept link is clicked               | `id`, `category`, `difficulty`                                  |
| `category_selected` | A subject is chosen                           | `category`, `source` (`explorer`, `hero`)                       |
| `level_selected`    | A difficulty is chosen                        | `level`                                                         |
| `cta_clicked`       | A hero, navbar or final CTA button is clicked | `source`                                                        |

## Sharing filtered links

Filters live in the URL, so mentors can share a ready-made view on WhatsApp:

- `/?topic=ml`: Machine Learning only
- `/?topic=nlp&level=Advanced`: advanced NLP questions

Topic ids: `python`, `ml`, `dl`, `nlp`, `cv`. Levels: `Beginner`, `Intermediate`, `Advanced`.

## Branding

The NxtWave mark is in `src/components/Logo.tsx` (and `public/favicon.svg`), the same mark the
NxtWave Prep platform uses. To use the official logo files from the brand team:
1. Put them in `public/brand/`.
2. Swap the SVG in `Logo.tsx` for `<img src="/brand/…" alt="NxtWave" />`.

## Quality checks done

- **Unit tests:** the CSV parser and validator (quotes, bad links, duplicates, unknown tags, the
  real sheet) and the filters.
- **Browser checks** on the production build:
  - every Solve link is an exact Academy question URL that opens in a new tab;
  - filters, empty state and shared links work;
  - keyboard skip link;
  - no sideways scroll at 390 px;
  - dark mode;
  - no console errors.
