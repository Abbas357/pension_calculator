import type { DurationYMD } from './types'
import { QUALIFYING_SERVICE_CAP_YEARS } from './constants'

/**
 * All dates in this module are `YYYY-MM-DD` strings. The borrow arithmetic below is a
 * verbatim port of the legacy jQuery plugin / blade script's day/month "borrowing" logic —
 * it is an administrative convention (not calendar-accurate diffing), so it must be
 * reproduced exactly rather than replaced with a generic date-diff library.
 */

interface DateParts {
  day: number
  month: number
  year: number
}

function parts(date: string): DateParts {
  return {
    day: Number(date.substring(8, 10)),
    month: Number(date.substring(5, 7)),
    year: Number(date.substring(0, 4)),
  }
}

/** -1 if d1 < d2, 0 if equal, 1 if d1 > d2. Mirrors legacy `$.fn.compareDates`. */
export function compareDates(d1: string, d2: string): -1 | 0 | 1 {
  const a = d1.split('-').map(Number)
  const b = d2.split('-').map(Number)
  for (let i = 0; i < 3; i++) {
    if (a[i] > b[i]) return 1
    if (a[i] < b[i]) return -1
  }
  return 0
}

/** Adds y/m/d to a YYYY-MM-DD date, normalizing overflow via Date.UTC. Mirrors legacy `shiftDate`. */
export function shiftDate(dateStr: string, y: number, m: number, d: number): string {
  const p = dateStr.split('-').map(Number)
  const dt = new Date(Date.UTC(p[0] + y, p[1] - 1 + m, p[2] + d))
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(dt.getUTCDate()).padStart(2, '0')
  return `${dt.getUTCFullYear()}-${mm}-${dd}`
}

/** Age (or any from→to duration) using the legacy borrow algorithm. Mirrors `$.fn.age`. */
export function age(fromDate: string, toDate: string): DurationYMD {
  const from = parts(fromDate)
  const to = { ...parts(toDate) }

  if (from.day > to.day) {
    to.day += 30
    to.month--
  }
  if (from.month > to.month) {
    to.month += 12
    to.year--
  }

  return {
    days: to.day - from.day,
    months: to.month - from.month,
    years: to.year - from.year,
  }
}

/** Length of service between appointment and retirement/death. Mirrors `$.fn.lservice`. */
export function lengthOfService(doa: string, dor: string): DurationYMD {
  const start = parts(doa)
  const end = { ...parts(dor) }

  if (start.day > end.day) {
    end.day += 30
    end.month--
  }
  if (end.month < start.month) {
    end.month += 12
    end.year--
  }

  let qd = end.day - start.day
  let qm = end.month - start.month
  let qy = end.year - start.year

  if (qd > 30) {
    qd -= 30
    qm++
  }
  if (qm > 12) {
    qm -= 12
    qy++
  }

  return { years: qy, months: qm, days: qd }
}

/**
 * Uncapped qualifying-service years, mirroring the legacy `$.fn.qservice` / blade
 * `netQualifyingYears` shared formula (before the 30-year display cap is applied).
 */
export function qualifyingServiceYearsRaw(doa: string, dor: string): number {
  const start = parts(doa)
  const end = { ...parts(dor) }

  if (start.day > end.day) {
    end.day += 30
    end.month--
  }
  if (end.month < start.month) {
    end.month += 12
    end.year--
  }

  const qd = end.day - start.day
  let qm = end.month - start.month
  let qy = end.year - start.year

  if (qd > 30) qm++
  if (qm > 5) qy++

  return qy
}

export function capQualifyingServiceYears(rawYears: number): {
  years: number
  capped: boolean
} {
  const years = Math.max(0, rawYears)
  if (years > QUALIFYING_SERVICE_CAP_YEARS) {
    return { years: QUALIFYING_SERVICE_CAP_YEARS, capped: true }
  }
  return { years, capped: false }
}

/** Default DOR when only DOB is known: DOB + 60 years (superannuation age), same month/day. */
export function defaultRetirementDate(dob: string): string {
  return shiftDate(dob, 60, 0, 0)
}
