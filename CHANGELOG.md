# Changelog

## Unreleased

## 0.2.7 — Fix TemplatesModal close button using the × variant (2026-09-03)

- **fix (follow-up)**: `TemplatesModal.tsx`'s close button used `×`
  (multiplication sign, U+00D7) rather than `✕`, a variant the original
  emoji→SVG sweep's grep missed. Replaced with the same `CloseIcon`.
  The many other `×` occurrences in this app (ComparisonView, EquityView,
  FactorSlider, LearnView, SalaryCalculator, ScenarioView) are genuine
  multiplication notation for formula factors (e.g. "1.25×") — left as
  plain text, not decorative icons.

## 0.2.6 — Replace decorative ✕ emoji with an SVG icon (2026-09-03)

- **feat**: replaced the scenario-delete `✕` text glyph with `CloseIcon`
  from the new shared `icons.tsx` (`currentColor`, no visual color
  change). Part of a suite-wide emoji→SVG sweep the user asked for —
  smallest footprint in the suite, only one occurrence.

## 0.2.5 — Facilitator Mode (2026-09-03)

- **feat**: added Facilitator (projector) Mode — a presentation toggle for
  in-room walkthroughs, bigger UI via one CSS rule (everything sized in
  `rem` scales automatically) plus hiding the nav pills and language
  picker while active. Toggled from a new header button next to the theme
  toggle, session-scoped via `sessionStorage`. Adopted from the shared
  design-system pattern (`useFacilitatorMode.ts` + `FacilitatorToggle.tsx`),
  originally built for Team Identity.

## 0.2.4 — Fix Team Identity import reading the wrong localStorage key (2026-09-03)

- **fix (broken integration, key mismatch)**: "Import from Team
  Identity" (`SalaryCalculator.tsx`) read `team-identity:charter`
  (colon-separated) — Team Identity has only ever written
  `team-identity-charter` (hyphenated, `App.tsx`'s `STORAGE_KEY`). The
  picker always found zero members and silently fell back to its "no
  data" state, regardless of whether a charter existed. Found by a
  suite-wide cross-app link audit. Extracted `readWpProfiles`/
  `readTiMembers` into `src/utils/crossAppReads.ts` (tested) while
  fixing the key name.

## 0.2.3 — Normalize LanguagePicker dark shades (2026-09-02)

- **fix (consistency)**: `LanguagePicker.tsx` already had dark-mode
  classes, but on slightly different shades than the design-system's
  canonical copy (e.g. `dark:text-gray-300` vs. `dark:text-gray-400`,
  chevron icon missing its own dark variant entirely). Normalized to
  match the canonical copy exactly, alongside a suite-wide sweep that
  found the same component had drifted into 3 different shade
  combinations across repos.

## 0.2.2 — Turn dead-end import hints into clickable links (2026-09-02)

- **fix**: when no Work Profiles or Team Identity data was found to
  import, `SalaryCalculator.tsx` showed plain, non-interactive text
  telling the user to "Open the Work Profiles/Team Identity app first" —
  a dead end, unlike the clickable cross-app links used elsewhere in the
  suite. Turned both into actual links opening the sibling app.
- Found via a suite-wide UX audit.

## 0.2.1 — Remove Management 3.0 references; fix invisible brand colors (2026-09-02)

- **content**: removed "Management 3.0" text from the equity-ratio
  warning, the "Why Transparent Salaries" body, the Learn page intro,
  `index.html`'s meta description, `README.md`, and a code comment in
  `src/data/defaultFormula.ts` — reworded to describe the approach
  generically. All 4 locales updated.
- **fix**: `brand-200`/`brand-300`/`brand-800`/`brand-900` were
  referenced in 2 components but never defined in `tailwind.config.js` —
  invisible borders/backgrounds/text in both light and dark mode. Same
  class of bug found and fixed across several repos this session.
  Completed the `brand` scale with Tailwind's own `blue` values.

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
