# Salary Formula — Brief

## Overview

Transparent salary formula explorer: factors, scenarios, saved comparisons. React 18, Vite, Tailwind, react-i18next. Deploy: GitHub Pages.

## Features

- [x] Formula builder and main calculator UI
- [x] Comparison view — title, empty state when none saved, delete (`ComparisonView.tsx`)
- [x] Comparison i18n — `comparison.empty` wired to empty state; `comparison.add` wired to Load button; dead `comparison.no_saved` removed from locales

## Backlog

<!-- Issues awaiting human review; agent appends here during research runs -->
- [ ] [#2] Research: ES + BE locale support
- [ ] [#3] Integration: link salary profiles to Work Profiles app
- [ ] [#4] Feature: export comparison as image or CSV

## Tech notes

- No backend; all client-side.

## Agent Log

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
