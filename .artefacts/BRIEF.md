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

## Backlog

<!-- Issues awaiting human review; agent appends here during research runs -->
- [x] [#2] Research: ES + BE locale support — implemented
- [x] [#3] Integration: link salary profiles to Work Profiles app — implemented
- [ ] [#4] Feature: export comparison as image or CSV
- [ ] [#5] Technical: keyboard navigation and accessibility audit for factor sliders
- [x] [#6] Feature: what-if scenario comparison — implemented
- [x] [#7] Integration: Sprint Metrics — team payroll budget dashboard — implemented

## Tech notes

- No backend; all client-side.

## Agent Log

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
