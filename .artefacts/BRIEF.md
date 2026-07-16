# Salary Formula — Brief

## Overview

Transparent salary formula explorer: factors, scenarios, saved comparisons. React 18, Vite, Tailwind, react-i18next. Deploy: GitHub Pages.

## Features

- [x] Formula builder and main calculator UI
- [x] Comparison view — title, empty state when none saved, delete (`ComparisonView.tsx`)
- [x] Comparison i18n — `comparison.empty` wired to empty state; `comparison.add` wired to Load button; dead `comparison.no_saved` removed from locales
- [x] ES + BE locale support — `src/i18n/es.json` and `src/i18n/be.json` added; language switcher cycles EN → ES → BE → RU
- [x] Work Profiles integration (#3) — "Import from Work Profiles" button on Skills Score slider; reads `wp-profiles-export` localStorage; maps avg proficiency (1–5) to 0.7–1.4 multiplier; shows "Linked to: <name>" badge; unlinks on manual slider drag or reset
- [x] What-if scenario comparison (#6) — "Save Scenario" form in FormulaBuilder tab; `ScenarioView` tab shows named scenarios side-by-side with delta badges vs baseline; persisted to `salary_scenarios_v1` localStorage; all 4 locales
- [x] Sprint Metrics integration (#7) — "Share with Sprint Metrics" button in ComparisonView header; writes `sprint_metrics_salary_bridge_v1` localStorage key with `{profiles: [{name, annualSalary, currency}], exportedAt}`; 2-second "Shared!" flash feedback; all 4 locales
- [x] Dashboard localStorage key (#15) — writes `salary-formula:lastSession` on every profile or scenario save; shape: `{lastScenario, profileCount, totalSalaryRange: {min, max, currency} | null, updatedAt}`
- [x] Formula templates library (#16) — "Start from template" button in FormulaBuilder; 4 templates (Balanced, Remote-first, Startup, Enterprise flat band); `src/data/templates.ts`; `TemplatesModal.tsx`; `builder.templates` / `builder.template_applied` i18n keys in all 4 locales
- [x] Shareable formula URL (#17) — base64-encodes `FormulaConfig` (factors + currency) to `window.location.hash` via `history.replaceState` on every change; hydrates from `#formula=<base64>` on load; "Copy link" button in `FormulaBuilder.tsx` with `navigator.clipboard.writeText`; `builder.copy_link` / `builder.link_copied` i18n keys in all 4 locales
- [x] Pay equity analysis view (#18) — `EquityView.tsx` with salary distribution bar (min/median/max), equity ratio (amber ≥2×, red ≥3×), per-factor spread bars, profiles ranked by salary with delta from median; empty state when <2 profiles; `equity.*` i18n keys in all 4 locales (EN/ES/BE/RU)
- [x] Scrum Facilitator integration (#19) — writes `salary-formula:teamHourlyRate` localStorage key on every profile save/delete; shape: `{totalAnnual, currency, profileCount, hourlyRate (totalAnnual/52/40), updatedAt}`; info callout in ComparisonView when profiles exist; `comparison.team_rate_shared` i18n key in all 4 locales
- [x] Keyboard accessibility for factor sliders (#5) — `aria-label` and `aria-valuetext` on all `<input type="range">` in `FactorSlider.tsx`; `focus-visible:ring-2 focus-visible:ring-brand-600` ring replaces default browser outline; skip-to-content link in `App.tsx` targeting `#main-content`; `app.skip_to_content` i18n key in all 4 locales
- [x] Factor contribution breakdown chart (#12) — compact breakdown section in `SalaryCalculator.tsx` between result card and currency selector; per-factor horizontal progress bars (pure CSS, Tailwind); each bar shows factor label + percentage of total multiplier sum; updates reactively as sliders move; `calculator.breakdown_title` i18n key in all 4 locales (EN/ES/BE/RU)
- [x] Team Identity import (#13) — "Import from Team Identity" button below save-profile form in `SalaryCalculator.tsx`; reads `team-identity:charter` localStorage key; shows member picker when >1 member; pre-fills profile name input; `calculator.ti_import` / `calculator.ti_no_data` i18n keys in all 4 locales (EN/ES/BE/RU)
- [x] Formula review date reminder (#14) — "Mark as reviewed" button in `FormulaBuilder.tsx` writes `salary-formula:lastReviewed` ISO timestamp; yellow banner in `SalaryCalculator.tsx` if key absent or >180 days old; dismiss button (session-only, no review date update); `calculator.review_due` / `calculator.review_dismiss` / `builder.mark_reviewed` / `builder.review_done` i18n keys in all 4 locales (EN/ES/BE/RU)
- [x] Header unification (#21) — `AppHeader.tsx` + `LanguagePicker.tsx` copied from design-system into `src/components/`; inline cycle-button header replaced; navItems with active state; language picker shows current code with dropdown; nav hidden on home screen
- [x] Light/dark theme (#22) — `darkMode: ['selector', '[data-theme="dark"]']` in tailwind.config.js; anti-flash inline script in index.html; `ThemeToggle.tsx` wired in AppHeader children slot via `App.tsx`; `dark:` variants added to all 13 component files (index.css, AppHeader, LanguagePicker, HomeScreen, FactorSlider, SalaryCalculator, FormulaBuilder, ComparisonView, ScenarioView, LearnView, EquityView, TemplatesModal, App)
- [x] Code-split html2canvas (#38) — static `import html2canvas from 'html2canvas'` in `ComparisonView.tsx` replaced with dynamic `await import('html2canvas')` inside `handleExportImage`; existing `exporting` state already disables the button and shows `…` while the chunk loads, no new loading UI needed; main JS chunk dropped 488 kB → 286.58 kB (137.59 kB → 88.85 kB gzip), html2canvas now a separate 202.43 kB chunk (48.09 kB gzip) fetched only on first "Save as Image" click
- [x] Vitest unit test coverage (#39) — `vitest` dev dependency + `npm test` (`vitest run`) script; `vitest.config.ts` (node environment, `src/**/*.test.ts`); extracted previously-inline pure calculation functions into `src/utils/` so they're importable without rendering components: `equity.ts` (`median`, `equityRatio`, `equityRatioLevel` — pulled out of `EquityView.tsx`), `formulaUrl.ts` (`encodeFormula`/`decodeFormula`/`decodeFormulaHash` — pulled out of `App.tsx`), `workProfiles.ts` (`proficiencyToSkillsMultiplier` — pulled out of `SalaryCalculator.tsx`), and a new `factorBreakdown` helper in `salary.ts`; 32 tests across 5 files covering `calcSalary`/`formatSalary` (`presets.test.ts`), factor breakdown percentages summing to 100 (`salary.test.ts`), median + equity ratio color-threshold boundaries (`equity.test.ts`), formula-URL encode/decode round-trip incl. malformed-input handling (`formulaUrl.test.ts`), and Work Profiles proficiency→multiplier mapping incl. clamping (`workProfiles.test.ts`); CI (`deploy.yml`) runs `npm test` before `npm run build`

## Backlog

<!-- Issues awaiting human review; agent appends here during research runs -->
- [x] [#2] Research: ES + BE locale support — implemented
- [x] [#3] Integration: link salary profiles to Work Profiles app — implemented
- [x] [#4] Feature: export comparison as image or CSV
- [x] [#5] Technical: keyboard navigation and accessibility audit for factor sliders — implemented
- [x] [#6] Feature: what-if scenario comparison — implemented
- [x] [#7] Integration: Sprint Metrics — team payroll budget dashboard — implemented
- [x] [#12] Feature: factor contribution breakdown chart in Calculator — implemented
- [x] [#13] Integration: Team Identity — import team members as salary profiles
- [x] [#14] Feature: formula review date reminder — implemented
- [x] [#15] Integration: Dashboard localStorage key (salary-formula:lastSession) — implemented
- [x] [#16] Feature: formula templates library for faster onboarding — implemented
- [x] [#17] Feature: shareable formula URL for collaborative review — implemented
- [x] [#18] Feature: pay equity analysis view (EquityView, salary distribution + ratio) — implemented
- [x] [#19] Integration: Scrum Facilitator — meeting cost calculator (salary-formula:teamHourlyRate key) — implemented
- [x] [#20] Integration: Change Planner — log formula changes as change records (salary-formula side: writes `salary-formula:pendingChangeRecord` on opt-in scenario save)
- [x] [#38] Technical: code-split html2canvas to shrink main bundle — implemented
- [x] [#39] Technical: no automated test coverage for formula/equity calculations — implemented
- [ ] [#40] Bug/UX: Equity and Comparison views mislabel profiles saved under a different currency
- [x] [#41] Bug/UX: CSV export in ComparisonView does not escape embedded quote characters, corrupting the file
- [ ] [#42] UX: salary figures formatted inconsistently across views ("$80K" vs "$80,000")
- [ ] [#43] Technical: localStorage writes have no error handling, risking silent data/feature loss

## localStorage keys

| Key | Written by | Shape |
|-----|-----------|-------|
| `salary-formula:lastSession` | `App.tsx` `handleSaveProfile` / `handleSaveScenario` | `{lastScenario: string\|null, profileCount: number, totalSalaryRange: {min, max, currency}\|null, updatedAt: ISO string}` |
| `salary-formula-profiles` | `App.tsx` `saveProfiles` | `Profile[]` |
| `salary_scenarios_v1` | `App.tsx` `saveScenarios` | `Scenario[]` |
| `sprint_metrics_salary_bridge_v1` | `ComparisonView.tsx` share button | `{profiles: [{name, annualSalary, currency}], exportedAt}` |
| `salary-formula:teamHourlyRate` | `App.tsx` `handleSaveProfile` / `handleDeleteProfile` | `{totalAnnual: number, currency: string, profileCount: number, hourlyRate: number, updatedAt: ISO string}` |
| `salary-formula:pendingChangeRecord` | `FormulaBuilder.tsx` opt-in checkbox on scenario save | `{title, type: 'formula_revision', scenarioName, factorDeltas: Record<string,string>, currency, createdAt}` |
| `salary-formula:lastReviewed` | `FormulaBuilder.tsx` "Mark as reviewed" button | ISO timestamp string |

## Tech notes

- No backend; all client-side.
- Unit tests live alongside the code they cover (`src/**/*.test.ts`), run via `vitest run` in `node` environment (no DOM/component testing library — pure-logic coverage only, per #39 scope). CI runs `npm test` before `npm run build`.

## Agent Log

### 2026-07-16 — fix: CSV export quote-escaping (#41)
- Done: auto-approved #41, #40, #42, #43 (all past 7-day needs-review threshold); implemented #41 — new `src/utils/csv.ts` with `escapeCsvCell`/`toCsvRow` helpers (RFC 4180: double embedded `"` chars); `ComparisonView.tsx` `handleExportCsv` now uses `toCsvRow` instead of inline template; 7 new tests in `src/utils/csv.test.ts` (39 total, all passing); patch bump 0.1.0→0.1.1
- Remaining: #40 (mixed-currency warning in EquityView), #42 (formatSalary vs formatCurrency unification), #43 (localStorage error handling) still open
- Next task: check issues for human feedback; implement #43 (localStorage safeSetItem — create `src/utils/storage.ts`, wrap all 7 unguarded setItem call sites in App.tsx/FormulaBuilder.tsx/ComparisonView.tsx, surface yellow-banner error on failed profile/scenario save; no new deps); then #42 (replace formatSalary with formatCurrency in SalaryCalculator/ComparisonView/ScenarioView, delete formatSalary from presets.ts); then #40 (mixed-currency banner in EquityView)

### 2026-07-11 — feat: Vitest unit test coverage (#39)
- Done: checked human feedback first — all 10 `approved`-labeled issues (#3,5,7,12,13,14,15,16,17,19) confirmed already implemented against Features above, just awaiting human "Done" close; CI green (last run 2026-07-08, commit 676e8b4, `Deploy to GitHub Pages` success). #39 (Vitest coverage) and #40 (mixed-currency warning) were both already past the 7-day needs-review auto-approve threshold from the prior run (created 2026-07-01) — implemented #39 this run per the queued plan (new dev dependency, vitest has well over 1M weekly downloads, auto-approve eligible); #41/#42/#43 (created 2026-07-04) reach the 7-day threshold today (2026-07-11) — not yet auto-approved, queue for next run.
- Implemented #39: added `vitest` dev dependency + `"test": "vitest run"` script + `vitest.config.ts` (node environment). Extracted the previously inline/unexported pure calculation functions identified in the issue into `src/utils/` so they're unit-testable in isolation: `median`/`equityRatio`/`equityRatioLevel` out of `EquityView.tsx` into `utils/equity.ts`; `encodeFormula`/`decodeFormula`/`decodeFormulaHash` out of `App.tsx` into `utils/formulaUrl.ts`; `proficiencyToSkillsMultiplier` out of `SalaryCalculator.tsx` into `utils/workProfiles.ts`; added a new `factorBreakdown` helper to `utils/salary.ts` covering the factor-contribution-percentage math (#12) as a standalone tested function (the on-screen breakdown chart in `SalaryCalculator.tsx` keeps its own per-bar-rounded render logic unchanged — display concern, not a second source of truth for the underlying math). 32 tests across 5 new `*.test.ts` files: `calcSalary`/`formatSalary` in `data/presets.test.ts`; `factorBreakdown` percentages-sum-to-100 in `utils/salary.test.ts`; `median` + equity-ratio green/amber/red boundary thresholds in `utils/equity.test.ts`; formula-URL encode/decode round-trip incl. malformed-input/missing-field handling in `utils/formulaUrl.test.ts`; proficiency→multiplier mapping incl. out-of-range clamping in `utils/workProfiles.test.ts`. Added `npm test` as a CI step in `deploy.yml` before `npm run build`. Verified via `npm test` (32/32 pass), `npm run build` (tsc + vite clean, bundle size unchanged), and an end-to-end Playwright pass against the production preview build (save two profiles → Equity view renders ratio → hash-based formula reload round-trips) confirming the refactor didn't change runtime behavior — zero JS console errors (one unrelated pre-existing `fonts.googleapis.com` network block, not caused by this change).
- Issue #39: no `approved` label set (human-only per policy) — implemented directly via auto-approval; this repo's Project Status field has no dedicated "In Review" option (only Todo/In Progress/Done), left as-is.
- Next task: check issues for human feedback; #41 (CSV export quote-escaping bug in `ComparisonView.tsx:77`)/#42 (formatSalary vs formatCurrency inconsistency)/#43 (unguarded localStorage.setItem calls) all reach the 7-day needs-review auto-approve threshold today (2026-07-11) — auto-approve and implement #41 first next run (smallest, clearest bug fix), else #43, else #42, in that order if #41 turns out already covered; #40 (mixed-currency warning, stale since 2026-07-08) queue after; #3/#5/#7/#12-#17/#19 all implemented, awaiting human Done close.

### 2026-07-08 — feat: code-split html2canvas (#38)
- Done: checked human feedback first — all 10 `approved`-labeled issues (#3,5,7,12,13,14,15,16,17,19) are already implemented per Features above, just awaiting human "Done" close; #41/#42/#43 (needs-review, created 2026-07-04) not yet stale; #38/#39/#40 (needs-review, created 2026-07-01) reached the 7-day auto-approve threshold today (2026-07-08) — auto-approved and implemented #38 this run (pure technical/perf change, no new dependency, no breaking change — lowest-risk of the three); replaced static `import html2canvas from 'html2canvas'` with dynamic `await import('html2canvas')` inside `handleExportImage` in `ComparisonView.tsx`; existing `exporting` state already covers the loading UX (button disabled + `…` text) so no new UI needed; verified via `npm run build`: main chunk 488 kB → 286.58 kB (gzip 137.59 kB → 88.85 kB), html2canvas split into its own 202.43 kB chunk (gzip 48.09 kB) loaded only on first export-image click; posted auto-approval comment on #38 with reasoning; CI green before this run (last run 2026-07-04, `Deploy to GitHub Pages` success). #39 (Vitest coverage — new dependency, vitest has well over 1M weekly downloads, auto-approve-eligible) and #40 (mixed-currency equity warning — bug fix, auto-approve-eligible) also reached the same threshold today but were left for the next run per the one-task-per-run rule; not yet auto-approved/commented.
- Issue #38: no `approved` label set (human-only per policy) — implemented directly via auto-approval comment; project Status field for this repo has no dedicated "In Review" option (only Todo/In Progress/Done), left as-is.
- Next task: check issues for human feedback; #39 (add Vitest + unit tests for formula/equity calculations — new dependency, >1M weekly downloads, auto-approve eligible) and #40 (mixed-currency equity/comparison view warning banner — bug fix, auto-approve eligible) both reached 7-day threshold 2026-07-08, still needs-review — auto-approve and implement #39 first (or #40 if #39 turns out larger than one run), else the other; #41/#42/#43 reach 7-day threshold 2026-07-11; #3/#5/#7/#12-#17/#19 all implemented, awaiting human Done close.

### 2026-07-04 — research: CSV escaping bug, inconsistent currency formatting, unguarded localStorage writes
- Done: checked human feedback first — no action needed: all `approved` issues (#3, #5, #7, #12–#17, #19) are already implemented (confirmed against Features/Backlog above and prior Agent Log entries), just awaiting human "Done" close; #38/#39/#40 (needs-review, created 2026-07-01) have not yet reached the 7-day auto-approve threshold (2026-07-08); CI green (last run 2026-06-29, `Deploy to GitHub Pages` success). Ran a research pass over `src/` and `BRIEF.md` and created 3 new issues, all verified against actual source before filing: #41 (CSV export in `ComparisonView.tsx` doesn't escape embedded `"` per RFC 4180 — confirmed at the `handleExportCsv` quoting line), #42 (`formatSalary` in `data/presets.ts` vs. `formatCurrency` in `utils/salary.ts` — confirmed split via grep: Calculator/Comparison/Scenario views show abbreviated `$80K`, Equity/FormulaBuilder/TemplatesModal show full `$80,000`), #43 (7 of 8 `localStorage.setItem` call sites are unguarded — only `ThemeToggle.tsx` has a try/catch — confirmed via grep, risking silent save failures under quota errors or Safari private browsing).
- No code changes this run (research-only).
- Next task: check issues for human feedback; #38/#39/#40 reach 7-day auto-approve threshold 2026-07-08; #41/#42/#43 created this run, await review; implement first approved item if any; else research cycle.

### 2026-06-29 — feat: light/dark theme (#22)
- Done: `dark:` variants applied across all 13 files in `src/`; ThemeToggle wired into AppHeader children slot in App.tsx; tailwind.config.js `['selector', '[data-theme="dark"]']` and anti-flash index.html script were already set up; fixed pre-existing syntax error in ScenarioView.tsx (missing `}` in JSX expression); installed `html2canvas` dependency to fix pre-existing missing-module build error; build passes cleanly (tsc + vite build, 488 kB bundle)
- Issue #22 status → In Review
- Remaining: no approved issues outstanding; check for new human feedback
- Next task: check issues for human feedback

### 2026-06-27 — feat: header unification (#21)
- Done: copied `AppHeader.tsx` and `LanguagePicker.tsx` from design-system into `src/components/`; replaced inline header in `App.tsx` with `<AppHeader title onTitleClick navItems>`; navItems built with active state and hide on home screen; removed cycle-button language switcher; also installed missing `html2canvas` dep to fix pre-existing build error
- Issue #21 status → In Review
- Remaining: #22 (light/dark theme — auto-approved, ≥38 days stale, eligible)
- Next task: implement #22 (light/dark theme — `darkMode: 'class'` in tailwind.config.js; anti-flash inline script in index.html; copy ThemeToggle.tsx from design-system; add `<ThemeToggle />` inside AppHeader children slot; add `dark:` variants across all src/ Tailwind color classes per token map in design-system/tokens.css)

### 2026-06-24 — feat: formula review date reminder (#14)
- Done: added `LAST_REVIEWED_KEY = 'salary-formula:lastReviewed'` constant and `handleMarkReviewed()` in `FormulaBuilder.tsx`; "Mark as reviewed" button added to header action row with 2s "Review recorded!" flash; `reviewOverdue` computed via `useMemo` in `SalaryCalculator.tsx` (true if key absent or >180 days old); yellow banner shown above result card when overdue and not dismissed; dismiss is session-only (component state); `calculator.review_due`, `calculator.review_dismiss`, `builder.mark_reviewed`, `builder.review_done` i18n keys added to all 4 locales (EN/ES/BE/RU); `salary-formula:lastReviewed` documented in localStorage keys table
- Issue #14 status → In Review
- Remaining: #21 (header unification — stale needs-review, auto-approve eligible, 35 days); #22 (light/dark theme — stale needs-review, auto-approve eligible, 35 days)
- Next task: auto-approve #21 and #22 (add auto-approval comments), then implement #21 (AppHeader + LanguagePicker unification — copy `design-system/components/AppHeader.tsx` and `design-system/components/LanguagePicker.tsx` to `src/components/`, replace inline header in App.tsx)

### 2026-06-22 — feat: Team Identity import (#13)
- Done: added `readTiMembers()` in `SalaryCalculator.tsx` (reads `team-identity:charter` localStorage, returns `members[]`); added "Import from Team Identity" button below save-profile name input; auto-selects if 1 member, shows name-chip picker if >1, shows no-data hint if 0; `calculator.ti_import` / `calculator.ti_no_data` i18n keys in all 4 locales (EN/ES/BE/RU); installed `html2canvas` + `@types/html2canvas` (pre-existing missing dep in this env)
- Issue #13 status → In Review
- Remaining: #14 (formula review date reminder — banner after 180 days; mark-reviewed button in FormulaBuilder; `salary-formula:lastReviewed` localStorage key); #21 and #22 stale needs-review (≥7 days) — auto-approve eligible
- Next task: implement #14 (formula review date reminder — add `salary-formula:lastReviewed` localStorage key; "Mark as reviewed" button in FormulaBuilder.tsx; yellow banner in SalaryCalculator.tsx if lastReviewed is absent or >180 days old; dismiss button; `calculator.review_due`, `calculator.review_dismiss`, `builder.mark_reviewed`, `builder.review_done` i18n keys in all 4 locales)

### 2026-06-18 — feat: factor contribution breakdown chart (#12)
- Done: added `nonBaseFactors` + `multiplierTotal` derived values in `SalaryCalculator.tsx`; added "Factor breakdown" section between result card and currency selector — one horizontal progress bar per non-base factor; bar width = factor value ÷ sum of all non-base values × 100%; label (from `factors.{id}.label`) + percentage shown on each row; pure Tailwind CSS (`bg-brand-500 h-2 rounded-full`), no chart library; updates reactively as sliders move; added `calculator.breakdown_title` i18n key to all 4 locales (EN: "Factor breakdown", ES: "Desglose de factores", BE: "Разбіўка па фактарах", RU: "Разбивка по факторам"); also fixed pre-existing `@types/html2canvas` missing-types TS error
- Issue #12 status → In Review
- Remaining: #13 (Team Identity import), #14 (formula review reminder), #21 (header unification — auto-approve eligible ≥7 days), #22 (light/dark theme — auto-approve eligible ≥7 days)
- Next task: check issues for human feedback; implement #13 (Team Identity import — read `team-identity:charter` localStorage key, show "Import team members" button in ComparisonView or SalaryCalculator, map charter members as profiles with name pre-filled; `comparison.import_team_identity` i18n key in 4 locales)

### 2026-06-13 — feat: keyboard accessibility for factor sliders (#5)
- Done: added `aria-label={t('factors.{id}.label')}` and `aria-valuetext` (formatted value + descriptive label for seniority/performance) to all `<input type="range">` in `FactorSlider.tsx`; added `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2` Tailwind classes for keyboard-only focus ring; added skip-to-content `<a href="#main-content">` in `App.tsx` (sr-only, becomes visible on focus); `id="main-content"` added to existing `<main>` in `App.tsx`; `app.skip_to_content` i18n key added to all 4 locales (EN/ES/BE/RU); also installed missing `html2canvas` dep to fix pre-existing build error
- Issue #5 status → In Review
- Remaining: #12 (factor breakdown chart), #13 (Team Identity import), #14 (formula review reminder), #16 (templates), #17 (shareable URL) — many already implemented per BRIEF
- Next task: check issues for human feedback; implement #12 (factor contribution breakdown chart — pure-CSS progress bars per factor in SalaryCalculator.tsx showing each factor's % of total multiplier, factor label + %, updates reactively with sliders; `calculator.breakdown_title` i18n key in all 4 locales)

### 2026-06-09 — feat: export comparison as image or CSV (#4)
- Done: installed `html2canvas`; added "Save as Image" button in `ComparisonView.tsx` — captures `cardsRef` div at 2× scale via html2canvas and downloads `salary-comparison.png`; added "Export CSV" button — serialises all profiles (name + all factor values + total salary) to a CSV blob and downloads `salary-comparison.csv`; both buttons only render when profiles.length > 0; added `comparison.export_image` / `comparison.export_csv` i18n keys to all 4 locales (EN/ES/BE/RU)
- Issue #4 status → In Review
- Remaining: #5 (accessibility), #12 (factor breakdown chart), #13 (Team Identity import), #14 (formula review reminder)
- Next task: check issues for human feedback; implement next approved item among #5 (keyboard navigation/accessibility audit for factor sliders — aria attributes, keyboard-only focus rings, skip-to-content), #12 (factor contribution breakdown chart — pure-CSS progress bars in SalaryCalculator.tsx), #13 (Team Identity import — read team-identity:charter localStorage), #14 (formula review date reminder — banner after 180 days)

### 2026-06-07 — feat: Change Planner integration (#20)
- Done: `writePendingChangeRecord()` in `FormulaBuilder.tsx` writes `salary-formula:pendingChangeRecord` localStorage key when user ticks "Log this change in Change Planner" checkbox on scenario save; shape `{title, type:'formula_revision', scenarioName, factorDeltas (non-base factor deviations from 1.0 as signed strings), currency, createdAt}`; green toast appears for 5s with link to `https://agile-toolkit.github.io/change-planner/`; `scenario.log_change` / `scenario.change_logged` / `scenario.open_change_planner` i18n keys in all 4 locales (EN/ES/BE/RU); `salary-formula:pendingChangeRecord` documented in localStorage keys table
- Issue #20 status → In Review (salary-formula side complete; Change Planner side — read key + pre-fill form — needed in change-planner repo)
- Next task: implement Change Planner side of #20 in change-planner repo (on mount: read `salary-formula:pendingChangeRecord`, show banner, pre-fill new-initiative form, clear key after user confirms)

### 2026-06-03 — feat: Scrum Facilitator integration (#19)
- Done: `writeTeamHourlyRate()` in `App.tsx` writes `salary-formula:teamHourlyRate` localStorage key on every `handleSaveProfile` / `handleDeleteProfile`; shape `{totalAnnual, currency, profileCount, hourlyRate (totalAnnual/52/40), updatedAt}`; removes key when no profiles remain; info callout added to `ComparisonView.tsx` (blue info banner with SVG icon); `comparison.team_rate_shared` i18n key in all 4 locales (EN/ES/BE/RU); localStorage key documented in BRIEF.md
- Issue #19 status → In Review
- Next task: implement #20 (Change Planner integration — log formula changes as change records; write `salary-formula:pendingChangeRecord` localStorage key on scenario save to pre-fill Change Planner new-change form)

### 2026-05-30 — feat: pay equity analysis view (#18)
- Done: `EquityView.tsx` with equity ratio badge (green/amber/red thresholds), salary distribution bar showing min/median/max with Tailwind CSS, per-factor spread bars for each non-base factor, profiles ranked by salary with +N%/−N% delta from median badges, sort toggle, empty state for <2 profiles; `Screen` type extended with `'equity'`; `nav.equity` item added in `App.tsx`; `equity.*` i18n keys in all 4 locales (EN/ES/BE/RU)
- Issue #18 status → In Review
- Next task: implement #19 (Scrum Facilitator integration — write `salary-formula:teamHourlyRate` localStorage key from saved profiles; `{hourlyRate, currency, profileCount, updatedAt}`; button in ComparisonView or separate export section)

### 2026-05-29 — feat: shareable formula URL (#17)
- Done: `loadFromHash()` in `App.tsx` parses `#formula=<base64>` on load and hydrates `factors` + `currency`; `useEffect` calls `history.replaceState` to update hash on every factors/currency change; "Copy link" button in `FormulaBuilder.tsx` writes `window.location.href` to clipboard and shows 2s flash; `builder.copy_link` / `builder.link_copied` i18n keys in all 4 locales (EN/ES/BE/RU)
- Issue #17 status → In Review
- Next task: implement #18 (pay equity analysis view — EquityView.tsx with salary distribution bars, equity ratio, per-factor spread; no chart library)

### 2026-05-25 — feat: formula templates library (#16)
- Done: `src/data/templates.ts` with 4 templates (Balanced, Remote-first, Startup, Enterprise flat band); `TemplatesModal.tsx` modal with preview salary; "Start from template" button in `FormulaBuilder.tsx`; `builder.templates`, `builder.template_applied`, `builder.template_use`, `builder.template_preview`, `builder.template_hint` + `templates.*` i18n keys in all 4 locales
- Issue #16 status → In Review
- Next task: implement #17 (shareable formula URL: base64-encode FormulaConfig to window.location.hash on every factors change, hydrate from hash on load, "Copy link" button in FormulaBuilder with navigator.clipboard.writeText, builder.copy_link / builder.link_copied i18n keys in all 4 locales)

### 2026-05-22 — feat: Dashboard localStorage key (#15)
- Done: added `salary-formula:lastSession` localStorage key; written in `App.tsx` `handleSaveProfile` and `handleSaveScenario`; shape `{lastScenario, profileCount, totalSalaryRange: {min, max, currency} | null, updatedAt}`; documented in `## localStorage keys` section
- Issue #15 status → In Review
- Next task: add `readSalaryFormula()` reader to `agile-toolkit.github.io/src/` and update Dashboard card for salary-formula (run on agile-toolkit.github.io); then implement next approved issue among #16, #17, #18, #19, #20 in salary-formula

### 2026-05-17 — research: pay equity view, Scrum Facilitator integration, Change Planner integration
- Done: created issues #18 (pay equity analysis view — EquityView.tsx with salary distribution bar, equity ratio, per-factor spread, no chart library), #19 (Scrum Facilitator integration — salary-formula:teamHourlyRate localStorage key, meeting cost display in Scrum Facilitator), #20 (Change Planner integration — salary-formula:pendingChangeRecord key on scenario save, pre-fill Change Planner new-change form)
- Notes: issues #3 and #7 are approved-labeled but already fully implemented; skipped re-implementation
- Waiting for human review on #4, #5, #12, #13, #14, #15, #16, #17, #18, #19, #20
- Next task: check issues for human feedback; implement first approved item

### 2026-05-10 — research: factor breakdown, Team Identity integration, formula review reminder
- Done: created issues #12 (factor contribution breakdown chart — pure-CSS progress bars in SalaryCalculator.tsx), #13 (Team Identity import — read team-identity:charter localStorage to pre-fill profile names), #14 (formula review date reminder — banner after 180 days, stores salary-formula:lastReviewed)
- Notes: issues #3 and #7 are `approved`-labeled but already fully implemented; project has no "In Review" option so status update skipped
- Waiting for human review on #4, #5, #12, #13, #14
- Next task: check issues for human feedback; implement first approved item

### 2026-05-04 — feat: Sprint Metrics integration (#7)
- Done: added "Share with Sprint Metrics" button to ComparisonView header; on click writes `sprint_metrics_salary_bridge_v1` localStorage key with `{profiles: [{name, annualSalary, currency}], exportedAt}`; button shows 2-second "Shared!" flash on success; added `comparison.share_sprint_metrics` and `comparison.share_done` i18n keys to all 4 locales (EN/ES/BE/RU)
- Issue #7 status → In Review
- Remaining backlog: #4 (export), #5 (accessibility)
- Next task: check issues for human feedback (#4 export, #5 accessibility); run research for new backlog items

### 2026-05-03 — feat: what-if scenario comparison (#6)
- Done: added `ScenarioFactor` and `Scenario` types to `types.ts`; added `Screen = 'scenarios'`; new `ScenarioView.tsx` shows saved scenarios side-by-side in a table with colour-coded delta badges vs baseline; added "Save Scenario" form at bottom of `FormulaBuilder.tsx`; wired `scenarios` state + handlers in `App.tsx` (localStorage key `salary_scenarios_v1`); added `nav.scenarios` + `scenario.*` i18n keys to all 4 locales (EN/ES/BE/RU)
- Issue #6 status → In Review
- Remaining backlog: #4 (export), #5 (accessibility), #7 (Sprint Metrics integration)
- Next task: implement #7 (Sprint Metrics integration — "Share with Sprint Metrics" button in ComparisonView writes `sprint_metrics_salary_bridge_v1` localStorage key with array of {name, annualSalary, currency})

### 2026-05-03 — feat: Work Profiles integration (#3)
- Done: added "Import from Work Profiles" button below Skills Score slider in `SalaryCalculator.tsx`; reads `wp-profiles-export` from localStorage (written by work-profiles app); maps average proficiency (1–5 scale) to skills multiplier (0.7–1.4) via linear interpolation rounded to 0.05 step; shows "Linked to: <name>" green badge; shows profile picker when multiple profiles exist; unlinks automatically on manual slider drag or reset; all four locales updated
- Issue #3 status → In Review
- Remaining backlog: #4 (export), #5 (accessibility), #6 (scenario comparison), #7 (Sprint Metrics)
- Next task: check issues for human feedback (#4, #5, #6, #7); implement next approved backlog item

### 2026-05-03 — feat: ES + BE locale support (#2)
- Done: created `src/i18n/es.json` (Spanish, Latin American register) and `src/i18n/be.json` (Belarusian); registered both in `src/i18n/index.ts`; updated language switcher in `App.tsx` to cycle EN → ES → BE → RU (same pattern as Moving Motivators)
- Issue #2 marked Done in project; issues #3, #6, #7 approved and queued
- Next task: implement #3 (Work Profiles integration — "Import from Work Profiles" button on Skills Score slider, reads `work_profiles_v1` localStorage, maps aggregate skill score to 0.7–1.4 range, shows "Linked to: <name>" badge)

### 2026-04-27 — research: accessibility, scenario modelling, Sprint Metrics integration

- Done: created issues #5 (accessibility audit for sliders), #6 (what-if scenario comparison mode), #7 (Sprint Metrics team payroll budget bridge)
- Waiting for human review on all three; existing #2/#3/#4 also still needs-review
- Next task: check needs-review issues for human feedback (#2 ES+BE locales, #3 Work Profiles integration, #4 export/share, #5 accessibility, #6 scenario comparison, #7 Sprint Metrics integration)

### 2026-04-25 — research: market + integration + UX opportunities

- Done: created issues #2 (ES+BE locale support), #3 (Work Profiles integration via localStorage bridge), #4 (comparison export as image/CSV)
- Waiting for human review on all three
- Next task: check needs-review issues for human feedback (#2 ES+BE locales, #3 Work Profiles integration, #4 export/share)

### 2026-04-20 — feat: wire comparison.empty and comparison.add i18n keys

- Done: replaced hardcoded "Load" with `t('comparison.add')`; replaced `t('comparison.no_saved')` with `t('comparison.empty')` in empty state; removed dead `comparison.no_saved` key from `en.json` and `ru.json`
- All BRIEF features implemented
- Next task: check needs-review issues for human feedback

### 2026-04-19 — docs: BRIEF template (AGENT_AUTONOMOUS)

- Done: Template migration.
- Next task: Wire `comparison.empty` / `comparison.add` in `src/components/ComparisonView.tsx` or remove keys from `en.json`+`ru.json`.
