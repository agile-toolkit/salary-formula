import { describe, it, expect, beforeEach } from 'vitest'
import { readWpProfiles, readTiMembers } from './crossAppReads'

// This repo's vitest environment is 'node' (see vitest.config.ts) since every
// other test file is pure functions with no DOM dependency — a minimal
// in-memory stub is enough here rather than pulling in jsdom for one file.
function createLocalStorageStub(): Storage {
  let store: Record<string, string> = {}
  return {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => { store[k] = v },
    removeItem: (k: string) => { delete store[k] },
    clear: () => { store = {} },
    key: () => null,
    length: 0,
  } as Storage
}

beforeEach(() => {
  globalThis.localStorage = createLocalStorageStub()
})

describe('readWpProfiles', () => {
  it('returns an empty array when wp-profiles-export is unset', () => {
    expect(readWpProfiles()).toEqual([])
  })

  it('reads profiles from the Work Profiles export shape', () => {
    const profiles = [{ id: '1', name: 'Alice', skills: [{ id: 's1', name: 'React', proficiency: 4 }] }]
    localStorage.setItem('wp-profiles-export', JSON.stringify({ profiles }))
    expect(readWpProfiles()).toEqual(profiles)
  })

  it('recovers gracefully from malformed JSON', () => {
    localStorage.setItem('wp-profiles-export', 'not-json')
    expect(readWpProfiles()).toEqual([])
  })

  it('returns an empty array when profiles is not an array', () => {
    localStorage.setItem('wp-profiles-export', JSON.stringify({ profiles: 'nope' }))
    expect(readWpProfiles()).toEqual([])
  })
})

describe('readTiMembers', () => {
  it('returns an empty array when team-identity-charter is unset', () => {
    expect(readTiMembers()).toEqual([])
  })

  it('reads members from Team Identity\'s actual key (hyphenated, not colon-separated)', () => {
    localStorage.setItem('team-identity-charter', JSON.stringify({ members: ['Alice', 'Bob'] }))
    expect(readTiMembers()).toEqual(['Alice', 'Bob'])
  })

  it('does not read the old, never-written colon-separated key', () => {
    localStorage.setItem('team-identity:charter', JSON.stringify({ members: ['Ghost'] }))
    expect(readTiMembers()).toEqual([])
  })

  it('filters out falsy member entries', () => {
    localStorage.setItem('team-identity-charter', JSON.stringify({ members: ['Alice', '', null, 'Bob'] }))
    expect(readTiMembers()).toEqual(['Alice', 'Bob'])
  })

  it('recovers gracefully from malformed JSON', () => {
    localStorage.setItem('team-identity-charter', 'not-json')
    expect(readTiMembers()).toEqual([])
  })
})
