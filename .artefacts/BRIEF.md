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

## Backlog

<!-- Issues awaiting human review; agent appends here during research runs -->
- [x] [#2] Research: ES + BE locale support — implemented
- [x] [#3] Integration: link salary profiles to Work Profiles app — implemented
- [x] [#4] Feature: export comparison as image or CSV
- [ ] [#5] Technical: keyboard navigation and accessibility audit for factor sliders
- [x] [#6] Feature: what-if scenario comparison — implemented
- [x] [#7] Integration: Sprint Metrics — team payroll budget dashboard — implemented
- [ ] [#12] Feature: factor contribution breakdown chart in Calculator
- [ ] [#13] Integration: Team Identity — import team members as salary profiles
- [ ] [#14] Feature: formula review date reminder
- [x] [#15] Integration: Dashboard localStorage key (salary-formula:lastSession) — implemented
- [x] [#16] Feature: formula templates library for faster onboarding — implemented
- [x] [#17] Feature: shareable formula URL for collaborative review — implemented
- [x] [#18] Feature: pay equity analysis view (EquityView, salary distribution + ratio) — implemented
- [x] [#19] Integration: Scrum Facilitator — meeting cost calculator (salary-formula:teamHourlyRate key) — implemented
- [x] [#20] Integration: Change Planner — log formula changes as change records (salary-formula side: writes `salary-formula:pendingChangeRecord` on opt-in scenario save)

## localStorage keys

| Key | Written by | Shape |
|-----|-----------|-------|
| `salary-formula:lastSession` | `App.tsx` `handleSaveProfile` / `handleSaveScenario` | `{lastScenario: string\|null, profileCount: number, totalSalaryRange: {min, max, currency}\|null, updatedAt: ISO string}` |
| `salary-formula-profiles` | `App.tsx` `saveProfiles` | `Profile[]` |
| `salary_scenarios_v1` | `App.tsx` `saveScenarios` | `Scenario[]` |
| `sprint_metrics_salary_bridge_v1` | `ComparisonView.tsx` share button | `{profiles: [{name, annualSalary, currency}], exportedAt}` |
| `salary-formula:teamHourlyRate` | `App.tsx` `handleSaveProfile` / `handleDeleteProfile` | `{totalAnnual: number, currency: string, profileCount: number, hourlyRate: number, updatedAt: ISO string}` |
| `salary-formula:pendingChangeRecord` | `FormulaBuilder.tsx` opt-in checkbox on scenario save | `{title, type: 'formula_revision', scenarioName, factorDeltas: Record<string,string>, currency, createdAt}` |

## Tech notes

- No backend; all client-side.

## Agent Log

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
