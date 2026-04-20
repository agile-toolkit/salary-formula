# Salary Formula — Brief

## Overview

Transparent salary formula explorer: factors, scenarios, saved comparisons. React 18, Vite, Tailwind, react-i18next. Deploy: GitHub Pages.

## Features

- [x] Formula builder and main calculator UI
- [x] Comparison view — title, empty state when none saved, delete (`ComparisonView.tsx`)
- [x] Comparison i18n — `comparison.empty` wired to empty state; `comparison.add` wired to Load button; dead `comparison.no_saved` removed from locales

## Backlog

## Tech notes

- No backend; all client-side.

## Agent Log

### 2026-04-20 — feat: wire comparison.empty and comparison.add i18n keys

- Done: replaced hardcoded "Load" with `t('comparison.add')`; replaced `t('comparison.no_saved')` with `t('comparison.empty')` in empty state; removed dead `comparison.no_saved` key from `en.json` and `ru.json`
- All BRIEF features implemented
- Next task: check needs-review issues for human feedback

### 2026-04-19 — docs: BRIEF template (AGENT_AUTONOMOUS)

- Done: Template migration.
- Next task: Wire `comparison.empty` / `comparison.add` in `src/components/ComparisonView.tsx` or remove keys from `en.json`+`ru.json`.
