# Question sheet format

Every question on the landing page comes from one sheet. Each row is one Academy question (one
coding practice, coding assignment or capstone). Keep row 1 exactly as below, in this order.

| Column        | Required | What to put                                                                                                                                                                 | Example                                                |
| ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `id`          | Yes      | A short, unique ID. Never reuse or change it once live (analytics use it). Prefix by category: `PY-`, `ML-`, `DL-`, `NLP-`, `CV-`.                                          | `ML-004`                                               |
| `category`    | Yes      | The tag that decides which section the question appears in. **Exactly one of:** `Python for Data Analytics`, `Machine Learning`, `Deep Learning`, `NLP`, `Computer Vision`. | `Machine Learning`                                     |
| `course`      | Yes      | The Academy course it belongs to.                                                                                                                                           | `Introduction to ML and Classification Algorithms`     |
| `topic`       | Yes      | The topic or subtopic.                                                                                                                                                      | `Naive Bayes`                                          |
| `title`       | Yes      | What students see on the card. 80 characters max.                                                                                                                           | `Naive Bayes Coding Assignment`                        |
| `description` | No       | One line on what they will do. 160 characters max.                                                                                                                          | `Build a spam filter with Multinomial Naive Bayes.`    |
| `difficulty`  | Yes      | `Beginner`, `Intermediate` or `Advanced`.                                                                                                                                   | `Intermediate`                                         |
| `type`        | Yes      | `Coding`, `Practical` or `Project`.                                                                                                                                         | `Coding`                                               |
| `academy_url` | Yes      | The **exact** question link on NxtWave Academy, copied from the portal or the verified sheet. Must start with `https://learning.ccbp.in/`.                                  | `https://learning.ccbp.in/course?c_id=…&s_id=…&t_id=…` |
| `video_url`   | No       | The Academy link of the session that teaches the concept ("Watch concept"). Leave empty if there is none.                                                                   | `https://learning.ccbp.in/course?c_id=…&s_id=…&t_id=…` |
| `order`       | No       | A number to sort questions inside a category (lower first). Empty means sheet order.                                                                                        | `4`                                                    |
| `status`      | Yes      | `live` (shown to students), `draft` (hidden on the live site) or `hidden`. Only set `live` after the link is verified.                                                      | `live`                                                 |
| `verified_by` | No       | Who checked the link, and when. Never shown to students.                                                                                                                    | `Rami, 7 Nov`                                          |
| `notes`       | No       | Anything for the team. Never shown to students.                                                                                                                             | `Check difficulty`                                     |

## Rules the site checks before every build

- Every `id` is unique, and `category`, `difficulty`, `type` and `status` use the allowed values.
- `academy_url` and `video_url` are `https://learning.ccbp.in/…` links (other hosts are refused,
  so a NIAT or Drive link can never reach students).
- No two live questions share the same `academy_url`.
- Titles and descriptions stay within their length limits.

If a row breaks a rule, the build stops and names the row and the problem.

## Tips for the Google Sheet

- Freeze row 1, and add **Data → Data validation → Dropdown** on `category`, `difficulty`,
  `type` and `status` with the values above, so nobody can mistype a tag.
- To publish: **File → Download → Comma-separated values (.csv)** of the questions tab, save it
  as `data/questions.csv` in this project, then run `npm run questions` (or just deploy: the build
  checks and loads it automatically).

## Files in `data/`

- `questions.csv`: **the working sheet.** It holds 70 questions taken from the DSML master sheet:
  every coding unit with an Academy link, with its concept session as `video_url`.
  - 59 are `live`.
  - 11 are `draft`, because the master sheet shows no "Done" production status for them. Check
    them on Academy, then set them to `live`.
  - Difficulty values are suggestions, so confirm them. Add descriptions if you like.
  - Import it into Google Sheets with **File → Import → Upload**.
- `questions.template.csv`: the empty format, with the header row only.
- `missing-links.csv`: 13 PyTorch coding practices that have **no link** in the master sheet.
  Ask for their Academy links, then add them as rows.
