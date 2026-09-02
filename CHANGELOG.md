# Changelog

## Unreleased

## 0.2.0 — E1: Data trust & robustness cleanup (2026-09-02)

- **fix**: every `localStorage.setItem` call site (8 total, including
  `ThemeToggle`) now goes through a shared `safeSetItem()` helper
  (`src/utils/storage.ts`) that catches `QuotaExceededError` and Safari
  private-browsing exceptions. Profile and scenario save confirmations
  only flip to "Saved!" when the write actually succeeded — on failure
  they now show an inline error banner instead of silently discarding
  the data while telling the user it was saved. ([#43](https://github.com/agile-toolkit/salary-formula/issues/43))
- **fix**: standardized on a single canonical `formatCurrency()`
  (`Intl.NumberFormat`-based, full precision) everywhere a salary is
  displayed. Removed `formatSalary()`, an abbreviated formatter (`$80K`)
  that had drifted into use on some screens while others already used
  `formatCurrency()` (`$80,000`) — the same salary no longer shows two
  different precisions depending which tab you're on. ([#42](https://github.com/agile-toolkit/salary-formula/issues/42))
- **fix**: `Profile` now captures the `currency` it was saved under.
  Comparison and Equity views previously relabeled every saved profile
  with whatever the currency selector currently shows, silently
  mislabeling profiles saved under a different currency; they now show
  each profile in its own saved currency (falling back to the current
  selector for profiles saved before this field existed) and display a
  warning when profiles span more than one currency, since aggregate
  stats (equity ratio, totals) still compare raw numbers without
  conversion. ([#40](https://github.com/agile-toolkit/salary-formula/issues/40))
- **chore**: closed 11 stale `approved` GitHub issues that were already
  implemented, confirmed against source before closing — no functional
  change, repo housekeeping only.
- docs: add `.artefacts/GOAL.md` and `.artefacts/ROADMAP.md`, fill in README with dev commands, localStorage keys, and tech notes, add this CHANGELOG. Docs-only pass — no behavior change; documents functionality that previously only lived in `.artefacts/BRIEF.md`.
- docs: move GOAL.md and ROADMAP.md from .artefacts/ to the repo root.
