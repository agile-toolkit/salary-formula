export function escapeCsvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`
}

export function toCsvRow(cells: string[]): string {
  return cells.map(escapeCsvCell).join(',')
}
