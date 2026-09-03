# Salary Formula

A transparent salary calculation tool — formula-driven compensation with full visibility into every factor. Build a formula from five factors (base, seniority, skills, location, performance), save and compare named profiles, model what-if scenarios, and check pay equity — all client-side, no backend or login.

Part of the [Agile Tools](https://github.com/bthos) suite built on ICAgile source materials.

See `GOAL.md` for why this app exists and `ROADMAP.md` for what's next.

## Stack
React 18 · TypeScript · Vite · Tailwind CSS · react-i18next (EN/ES/BE/RU)

## Dev commands
```bash
npm install
npm run dev       # start Vite dev server
npm run build      # tsc typecheck + production build
npm run preview    # preview the production build locally
npm test           # run Vitest unit tests (pure-logic coverage, node environment)
```

## Deploy
GitHub Pages via GitHub Actions on push to `main`. CI runs `npm test` before `npm run build`.

## localStorage keys

All keys live on the shared Agile Toolkit origin, so sibling apps can read them directly. Keys below are the ones this app **writes**; it also *reads* (but does not write) `wp-profiles-export` (Work Profiles) and `team-identity:charter` (Team Identity) to pre-fill data.

| Key | Shape | Purpose |
|-----|-------|---------|
| `salary-formula-profiles` | `Profile[]` — `{ id, name, factors, currency? }` | Saved salary profiles (source of truth for Comparison/Equity views). `currency` is captured at save time (optional, for backward compatibility with profiles saved before this field existed — `ComparisonView`/`EquityView` fall back to the current global currency selector when absent) so Comparison/Equity display each profile in the currency it was actually saved under, instead of relabeling every profile with whatever the selector currently shows. |
| `salary_scenarios_v1` | `Scenario[]` | Saved what-if scenarios shown in Scenario view |
| `salary-formula:lastSession` | `{lastScenario: string\|null, profileCount: number, totalSalaryRange: {min, max, currency}\|null, updatedAt: ISO string}` | Dashboard card summary; written on every profile/scenario save |
| `salary-formula:teamHourlyRate` | `{totalAnnual: number, currency: string, profileCount: number, hourlyRate: number, updatedAt: ISO string}` | Read by Scrum Facilitator to price ceremony time; written on every profile save/delete, removed when no profiles remain |
| `sprint_metrics_salary_bridge_v1` | `{profiles: [{name, annualSalary, currency}], exportedAt}` | Read by Sprint Metrics for team cost/sprint math; written on demand via "Share with Sprint Metrics" |
| `salary-formula:pendingChangeRecord` | `{title, type: 'formula_revision', scenarioName, factorDeltas: Record<string,string>, currency, createdAt}` | Read by Change Planner to pre-fill a new change record; written opt-in when saving a scenario |
| `salary-formula:lastReviewed` | ISO timestamp string | Drives the "formula review overdue" banner (>180 days or absent) |

## Tech notes

- No backend; all state is client-side React state persisted to localStorage (see table above). All reads and writes are guarded: reads that can fail JSON-parsing are wrapped in try/catch, and every `localStorage.setItem` call goes through `safeSetItem()` (`src/utils/storage.ts`), which swallows `QuotaExceededError`/private-browsing exceptions and returns whether the write actually succeeded. Save handlers only flip their "Saved!" confirmation UI when the underlying write succeeded — on failure they show an inline error banner instead of silently discarding the data.
- Currency formatting: `formatCurrency()` (`src/utils/salary.ts`, `Intl.NumberFormat`-based, full precision e.g. `$80,000`) is the single canonical formatter, used everywhere a salary figure is displayed. An earlier abbreviated formatter (`formatSalary`, e.g. `$80K`) has been removed — it produced a different precision than `formatCurrency` for the same value depending on which screen you were on.
- i18n via `react-i18next`, with locale files in `src/i18n/{en,es,be,ru}.json`; the language picker in `AppHeader` cycles EN → ES → BE → RU.
- Theming: `darkMode: ['selector', '[data-theme="dark"]']` in `tailwind.config.js`, toggled by `ThemeToggle.tsx` (own `theme` localStorage key, not part of the cross-app data bridge), with an anti-flash inline script in `index.html` that applies the stored theme before first paint.
- Formula sharing: `FormulaConfig` (factors + currency) is base64-encoded into `window.location.hash` via `history.replaceState` on every change (`src/utils/formulaUrl.ts`), and hydrated back on load — no backend needed for a shareable link.
- `html2canvas` (used for "Save as Image" in Comparison view) is dynamically `import()`-ed on first use rather than bundled statically, to keep the main chunk small.
- Cross-app reads: Work Profiles (`wp-profiles-export`) and Team Identity (`team-identity-charter`) localStorage keys are read (read-only) to pre-fill Skills Score and profile names respectively — see `src/utils/crossAppReads.ts` and the localStorage table above for what this app writes in the other direction.
- Unit tests live alongside the code they cover (`src/**/*.test.ts`), run via `vitest run` in a `node` environment (no DOM/component testing — pure-logic coverage only). CI runs `npm test` before `npm run build`.

## Source materials
See `.artefacts/BRIEF.md` for the full feature checklist and run-by-run agent log.
