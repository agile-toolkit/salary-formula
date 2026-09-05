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
**Fix residual mixed-currency mislabeling in cross-app bridge writes** (2026-09-05) — see `## Shipped`. Closes out [#40](https://github.com/agile-toolkit/salary-formula/issues/40): the on-screen fix shipped in v0.2.0, but the Sprint Metrics bridge export and the Dashboard's `lastSession` summary still labeled every profile with the current currency selector rather than each profile's own saved currency. Also re-verified and closed [#43](https://github.com/agile-toolkit/salary-formula/issues/43) and [#42](https://github.com/agile-toolkit/salary-formula/issues/42), both already fully shipped in v0.2.0.

**Add glass effect to the header** (2026-09-04) — see `## Shipped`. `AppHeader.tsx`'s background changed to a translucent blur, matching the Dashboard's own nav — user-reported inconsistency.

**Facilitator Mode persists across suite apps** (2026-09-03) — see `## Shipped`. `useFacilitatorMode`'s storage key changed to the shared `agile-toolkit:facilitatorMode` so the mode survives switching to another suite app in the same tab, per direct user request.

**Fix TemplatesModal close button using the × variant** (2026-09-03) — see `## Shipped`. Follow-up to the emoji→SVG sweep — this button used `×` (multiplication sign) rather than `✕`, missed by the original grep.

**Replace decorative ✕ emoji with an SVG icon** (2026-09-03) — see `## Shipped`. Part of a suite-wide emoji→SVG sweep the user asked for.

**Facilitator Mode** (2026-09-03) — see `## Shipped`. A user asked for the presentation/projector mode already built for Team Identity to be adopted suite-wide; this is repo 5 of an 11-repo rollout, adopting the pattern now shared in `design-system/`.

**Fix Team Identity import reading the wrong localStorage key** (2026-09-03) — see `## Shipped`. A suite-wide cross-app link audit found "Import from Team Identity" read a key (`team-identity:charter`) Team Identity has never written — it writes `team-identity-charter` instead. The picker always showed its "no data" fallback, no matter what.

**Normalize LanguagePicker dark shades** (2026-09-02) — see `## Shipped`. `LanguagePicker.tsx` had dark-mode classes on slightly different shades than the design-system's canonical copy. Normalized to match exactly.

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
No small un-filed items queued. Both prior entries resolved this pass (2026-09-04): the Team Identity import key line was stale — `readTiMembers()` already reads the correct `team-identity-charter` key (shipped earlier, `## Shipped` below; the polish line just never got removed). The `factorBreakdown()` duplication was real — `SalaryCalculator.tsx`'s "Factor breakdown" card reimplemented the same percentage math inline instead of calling the shared, tested function; now calls `factorBreakdown()` directly.

## Shipped
- ~~Fix residual mixed-currency mislabeling in the Sprint Metrics bridge
  export and the Dashboard `lastSession` summary — both still used the
  currency selector instead of each profile's own saved currency~~
  (2026-09-05)
- ~~Dedupe factor-breakdown percentage math: `SalaryCalculator.tsx`'s inline calc now calls the shared, tested `factorBreakdown()`~~
- ~~Add glass/backdrop-blur effect to the header, matching the Dashboard's own nav~~
- ~~Unify Facilitator Mode's storage key to the shared `agile-toolkit:facilitatorMode` so it persists across suite apps~~
- ~~Fix TemplatesModal's close button using the × variant instead of ✕~~
- ~~Replace the scenario-delete ✕ text glyph with a shared SVG icon~~
- ~~Facilitator Mode — bigger UI + hidden nav/language picker for in-room presentation, adopted from the shared design-system pattern~~
- ~~Fix "Import from Team Identity" reading a key (`team-identity:charter`) nothing ever wrote~~
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

**Normalize LanguagePicker dark shades** (2026-09-02):
- ~~Synced `LanguagePicker.tsx`'s dark-mode shades exactly with the
  design-system's canonical copy~~
