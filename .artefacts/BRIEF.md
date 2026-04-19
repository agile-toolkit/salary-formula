# BRIEF

Derived per [`agent-state.NO-BRIEF.md`](https://github.com/agile-toolkit/.github/blob/main/agent-state.NO-BRIEF.md). There was **no prior** `BRIEF.md`. Sources: `README.md`, `src/i18n/en.json` / `ru.json`, `src/`. Generated **2026-04-19**.

## Product scope (from `README.md`)

- **Salary Formula** — transparent, formula-driven compensation; every factor visible.
- Stack: React 18, TypeScript, Vite, Tailwind, react-i18next (EN/RU).

## Build

- `npm run build` — **passes** (verified **2026-04-19**).

## TODO / FIXME in `src/`

- None.

## i18n — orphaned keys

- **`comparison.add`**, **`comparison.empty`** — present in locale files, **not** referenced in `src/` (`ComparisonView.tsx` uses `comparison.title`, `comparison.no_saved`, `comparison.delete`). Either add UI (empty state CTA + add row) or remove keys.

## Hardcoded user-visible strings

- No extra findings in this pass.

## Classification (NO-BRIEF)

- **Status:** `in-progress` — small locale/UI drift on comparison screen.
- **First next task:** In `src/components/ComparisonView.tsx`, wire **`comparison.empty`** when the saved-comparisons list is empty and **`comparison.add`** on the control that opens “add scenario” (or delete both keys from `en.json` / `ru.json` if product drops that flow).
