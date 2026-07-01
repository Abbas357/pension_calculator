/** Rounds `num` to `places` decimals, mirroring the legacy `$.fn.trimNum` (round/ceil/floor by multiplier). */
export function trimNum(
  num: number,
  places: number,
  rounding: 'round' | 'ceil' | 'floor' = 'round',
): number {
  const multiplier = Math.pow(10, places)
  return Number(Math[rounding](num * multiplier) / multiplier)
}

/** Formats a number as "1,234.56", mirroring the legacy `$.fn.format`. */
export function formatCurrency(num: number): string {
  const fixed = num.toFixed(2)
  const [whole, decimals] = fixed.split('.')
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${withCommas}.${decimals}`
}

export function formatDurationYMD(d: { years: number; months: number; days: number }): string {
  const parts = [`${d.years} y`]
  if (d.months > 0) parts.push(`${d.months} m`)
  if (d.days > 0) parts.push(`${d.days} d`)
  return parts.join(', ')
}

/** Formats a YYYY-MM-DD date string as "YYYY - MM - DD", mirroring the legacy dob/dor/doa/dod helpers. */
export function formatDateSpaced(date: string): string {
  return `${date.substring(0, 4)} - ${date.substring(5, 7)} - ${date.substring(8, 10)}`
}
