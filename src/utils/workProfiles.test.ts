import { describe, it, expect } from 'vitest'
import { proficiencyToSkillsMultiplier } from './workProfiles'

describe('proficiencyToSkillsMultiplier', () => {
  it('maps the lowest proficiency (1) to the min multiplier', () => {
    expect(proficiencyToSkillsMultiplier(1, 0.7, 1.4)).toBeCloseTo(0.7)
  })

  it('maps the highest proficiency (5) to the max multiplier', () => {
    expect(proficiencyToSkillsMultiplier(5, 0.7, 1.4)).toBeCloseTo(1.4)
  })

  it('maps the midpoint proficiency (3) to the midpoint multiplier', () => {
    expect(proficiencyToSkillsMultiplier(3, 0.7, 1.4)).toBeCloseTo(1.05)
  })

  it('clamps proficiency values above 5', () => {
    expect(proficiencyToSkillsMultiplier(9, 0.7, 1.4)).toBeCloseTo(1.4)
  })

  it('clamps proficiency values below 1', () => {
    expect(proficiencyToSkillsMultiplier(-2, 0.7, 1.4)).toBeCloseTo(0.7)
  })

  it('snaps the result to 0.05 steps', () => {
    const result = proficiencyToSkillsMultiplier(2.3, 0.7, 1.4)
    expect(Math.round(result / 0.05)).toBeCloseTo(result / 0.05, 5)
  })
})
