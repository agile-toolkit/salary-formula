export interface WpSkill {
  id: string
  name: string
  proficiency: number
}

export interface WpProfile {
  id: string
  name: string
  skills: WpSkill[]
}

/** Work Profiles' `wp-profiles-export` — read to pre-fill the Skills Score picker. */
export function readWpProfiles(): WpProfile[] {
  try {
    const data = JSON.parse(localStorage.getItem('wp-profiles-export') ?? 'null')
    return Array.isArray(data?.profiles) ? data.profiles : []
  } catch {
    return []
  }
}

/**
 * Team Identity's `team-identity-charter` — read to pre-fill the profile-name
 * picker. Note the hyphen: Team Identity's own key is `team-identity-charter`
 * (App.tsx, STORAGE_KEY), not `team-identity:charter` — this used to read the
 * colon variant, which nothing ever wrote, so the picker was always empty.
 */
export function readTiMembers(): string[] {
  try {
    const data = JSON.parse(localStorage.getItem('team-identity-charter') ?? 'null')
    return Array.isArray(data?.members) ? data.members.filter(Boolean) : []
  } catch {
    return []
  }
}
