# BRIEF — Salary Formula

## What this app does
A transparent salary calculation tool based on Management 3.0's Salary Formula approach. Team members and managers can input parameters (skill level, experience, market rate, performance factors) and see how a salary is calculated — making compensation transparent and formula-driven rather than opaque negotiation.

## Target users
HR managers, team leads, and team members in organizations that want to adopt transparent, formula-based compensation. Works for both individual self-assessment and team-wide salary reviews.

## Core features (MVP)
- Formula builder: define factors (base, seniority multiplier, skill score, location coefficient, etc.)
- Input sliders/fields for each factor with live salary calculation
- Comparison view: see how different factor values affect the outcome
- Save and export formula configuration + results as PDF/CSV
- Pre-built formula template based on the source material

## Educational layer
- Explanation of each formula factor with the Management 3.0 rationale
- "Why transparent salaries?" intro panel
- Common pitfalls and anti-patterns in salary formulas
- Reference to source material

## Tech stack
React 18 + TypeScript + Vite + Tailwind CSS. No backend (localStorage for saved formulas). GitHub Pages deployment.

## Source materials in `.artefacts/`
- `salary formula.pdf` — Management 3.0 salary formula methodology and examples

## i18n
English + Russian (react-i18next). Currency formatting must be locale-aware.

## Agentic pipeline roles
- `/vadavik` — spec & requirements validation
- `/lojma` — UX/UI design (formula builder, live calculator, comparison view)
- `/laznik` — architecture (formula engine, state management)
- `@cmok` — implementation
- `@bahnik` — QA (calculation accuracy, edge cases with 0/negative values)
- `@piarun` — documentation
- `@zlydni` — git commits & GitHub Pages deploy
