# Salary Formula — Goal

## Problem
Compensation decisions are usually opaque: a number is handed down with little explanation of how it was reached, which erodes trust and makes it hard for a manager to justify or revisit a figure later. Management 3.0's Salary Formula approach fixes this by expressing pay as an explicit product of factors (base rate, seniority, skills, location, performance) that anyone can inspect — but teams need a tool to build, save, compare, and periodically review that formula, and to share the resulting numbers with the other planning tools they already use, without standing up a backend.

## Audience
Engineering managers and team leads adopting Management 3.0 practices in small-to-mid organizations, using the app client-side in a browser (GitHub Pages, no login) to design a formula, save salary profiles for their team, and prepare for compensation conversations — often alongside sibling Agile Toolkit apps (Work Profiles, Team Identity, Sprint Metrics, Scrum Facilitator, Change Planner) running in the same browser origin.

## Success criteria
1. A manager can build a salary formula from the five standard factors and see the resulting salary recalculate live as sliders move.
2. A manager can save multiple named profiles, compare them side by side, and export the comparison as CSV or an image.
3. A manager can model what-if scenarios and see deltas against a baseline before committing to a formula change.
4. A manager can assess pay equity across saved profiles (distribution, ratio, per-factor spread) without a separate spreadsheet.
5. Data this app writes (profiles, scenarios, team rate, last-reviewed date) is picked up by other Agile Toolkit apps via documented localStorage keys, with no shared backend or manual export step.

## Non-goals
- No backend or server-side storage — all state lives in the browser's localStorage, scoped to the shared Agile Toolkit origin.
- No real payroll processing, tax/legal compliance, or live currency conversion — figures are indicative inputs to a conversation, not authoritative payroll output.
- No multi-user real-time collaboration — sharing happens via URL links or localStorage snapshots, not live sync between simultaneous users.
- No user accounts or authentication.
