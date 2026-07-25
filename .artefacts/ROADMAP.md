# Salary Formula — Roadmap

Derived from GOAL.md. Rebuilt when GOAL changes or an epic ships.

## Current epic
None — idle. See `## Next epics` below.

## Next epics
1. **E1: Data trust & robustness cleanup** — serves #2, #4. Three needs-review issues, each past the 7-day review threshold and each undermining confidence in numbers the app displays or saves: mixed-currency profiles are mislabeled in Comparison/Equity views ([#40](https://github.com/agile-toolkit/salary-formula/issues/40)), the same salary renders as `$80K` in some views and `$80,000` in others because two formatters are never reconciled ([#42](https://github.com/agile-toolkit/salary-formula/issues/42)), and 7 of 8 `localStorage.setItem` call sites are unguarded so a save can silently fail while the UI reports success ([#43](https://github.com/agile-toolkit/salary-formula/issues/43)). BRIEF.md's Agent Log already queues these in order #43 → #42 → #40 for the next run.

## Polish backlog
- Nothing queued beyond the issues in E1 above — no additional no-issue polish items identified in this pass.

## Shipped
- ~~Formula builder & calculator with 5-factor multiplier model~~
- ~~Comparison view — save/compare/delete profiles, CSV/image export~~
- ~~What-if scenario comparison with delta badges vs. baseline~~
- ~~Pay equity analysis view (distribution, ratio, per-factor spread)~~
- ~~Formula templates library for faster onboarding~~
- ~~Shareable formula URL (base64-encoded hash, no backend)~~
- ~~Formula review date reminder (180-day staleness banner)~~
- ~~i18n: EN/ES/BE/RU locales~~
- ~~Light/dark theme~~
- ~~Unified AppHeader + LanguagePicker~~
- ~~Keyboard accessibility for factor sliders~~
- ~~Cross-app integrations: Work Profiles, Team Identity, Sprint Metrics, Scrum Facilitator, Change Planner (localStorage bridges)~~
- ~~Vitest unit test coverage for formula/equity calculations~~
- ~~Code-split html2canvas to shrink main bundle~~
- ~~CSV export RFC 4180 quote-escaping fix~~
