/** Maps a Work Profiles average skill proficiency (1–5) to a Skills Score multiplier, snapped to 0.05 steps. */
export function proficiencyToSkillsMultiplier(avgProficiency: number, min: number, max: number): number {
  const clamped = Math.max(1, Math.min(5, avgProficiency))
  const raw = min + ((clamped - 1) / 4) * (max - min)
  return Math.round(raw / 0.05) * 0.05
}
