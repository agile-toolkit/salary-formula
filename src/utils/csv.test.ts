import { describe, it, expect } from 'vitest'
import { escapeCsvCell, toCsvRow } from './csv'

describe('escapeCsvCell', () => {
  it('wraps plain value in double quotes', () => {
    expect(escapeCsvCell('hello')).toBe('"hello"')
  })

  it('doubles embedded double quotes (RFC 4180)', () => {
    expect(escapeCsvCell('Ann "Senior" Smith')).toBe('"Ann ""Senior"" Smith"')
  })

  it('handles empty string', () => {
    expect(escapeCsvCell('')).toBe('""')
  })

  it('handles value that is only a double quote', () => {
    expect(escapeCsvCell('"')).toBe('""""')
  })

  it('preserves commas without extra quoting', () => {
    expect(escapeCsvCell('a,b')).toBe('"a,b"')
  })
})

describe('toCsvRow', () => {
  it('joins escaped cells with commas', () => {
    expect(toCsvRow(['Alice', '1.2', '80000'])).toBe('"Alice","1.2","80000"')
  })

  it('properly escapes a cell with a quote in a full row', () => {
    expect(toCsvRow(['Ann "Senior" Smith', '1.3'])).toBe('"Ann ""Senior"" Smith","1.3"')
  })
})
