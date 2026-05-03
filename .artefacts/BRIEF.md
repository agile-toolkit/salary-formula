# Salary Formula — Brief

## Overview

Transparent salary formula explorer: factors, scenarios, saved comparisons. React 18, Vite, Tailwind, react-i18next. Deploy: GitHub Pages.

## Features

- [x] Formula builder and main calculator UI
- [x] Comparison view — title, empty state when none saved, delete (`ComparisonView.tsx`)
- [x] Comparison i18n — `comparison.empty` wired to empty state; `comparison.add` wired to Load button; dead `comparison.no_saved` removed from locales
- [x] ES + BE locale support — `src/i18n/es.json` and `src/i18n/be.json` added; language switcher cycles EN → ES → BE → RU

## Backlog

<!-- Issues awaiting human review; agent appends here during research runs -->
- [x] [#2] Research: ES + BE locale support — implemented
- [ ] [#3] Integration: link salary profiles to Work Profiles app
- [ ] [#4] Feature: export comparison as image or CSV
- [ ] [#5] Technical: keyboard navigation and accessibility audit for factor sliders
- [ ] [#6] Feature: what-if scenario comparison — save and diff multiple formula configurations
- [ ] [#7] Integration: Sprint Metrics — team payroll budget dashboard

## Tech notes

- No backend; all client-side.

## Agent Log

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
