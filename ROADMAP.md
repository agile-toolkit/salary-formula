# Salary Formula — Roadmap

Derived from GOAL.md. Rebuilt when GOAL changes or an epic ships.

## Current epic
None — idle. See `## Next epics` below.

## Current epic
None — idle. See `## Next epics` below.

## Next epics
None queued — E1 (below) was the only scoped epic and has shipped. Next
`research` run should look for new candidates.

## Recently shipped
**Turn dead-end import hints into clickable links** (2026-09-02) — see `## Shipped`. A suite-wide UX audit flagged the "no data found" hints for Work Profiles/Team Identity import as plain non-interactive text, unlike the clickable cross-app links used elsewhere. Turned both into links.

**E1: Data trust & robustness cleanup** (2026-09-02) — see `## Shipped`.
[#40](https://github.com/agile-toolkit/salary-formula/issues/40),
[#42](https://github.com/agile-toolkit/salary-formula/issues/42),
[#43](https://github.com/agile-toolkit/salary-formula/issues/43).

## Repo cleanup (2026-09-02)
Closed 11 stale `approved` issues (#3, #5, #7, #12, #13–#17, #19, #39) that
were already implemented — confirmed against source before closing, two
(#12, #19) after correcting an initial mis-read that only checked for a
utility function's existence rather than whether it was actually wired into
the UI.

## Polish backlog
- Team Identity import in `SalaryCalculator.tsx` (`readTiMembers()`) reads
  `team-identity:charter`, but Team Identity's actual key is
  `team-identity-charter` (no colon, hyphen not colon) — confirmed against
  `team-identity/src/App.tsx`'s `STORAGE_KEY`. The import silently always
  finds zero members. Found while implementing E1; not fixed here since it's
  unrelated to E1's three issues.
- `factorBreakdown()` in `src/utils/salary.ts` duplicates logic already
  inline in `SalaryCalculator.tsx`'s "Factor breakdown" card (found while
  investigating #12) — minor DRY cleanup, not a functional bug.

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

**v0.2.0 — [E1: Data trust & robustness cleanup](https://github.com/agile-toolkit/salary-formula/issues/43)** (2026-09-02):
- ~~`safeSetItem()` helper (`src/utils/storage.ts`) wraps all 8
  `localStorage.setItem` call sites; save confirmations only show on actual
  success, with an inline error banner on failure~~
- ~~Single canonical `formatCurrency()` formatter everywhere a salary is
  shown; removed the abbreviated `formatSalary()` that gave the same value
  different precision on different screens~~
- ~~`Profile.currency` captured at save time; Comparison/Equity views now
  label each profile in its own saved currency instead of the current
  selector, plus a mixed-currency warning when profiles span more than one~~

**Turn dead-end import hints into clickable links** (2026-09-02):
- ~~The "no data found" hints for Work Profiles/Team Identity import are
  now clickable links to the sibling app instead of plain text~~
