import { describe, expect, it } from 'vitest'
import {
  age,
  capQualifyingServiceYears,
  compareDates,
  defaultRetirementDate,
  lengthOfService,
  qualifyingServiceYearsRaw,
  shiftDate,
} from '../src/lib/pension/dateMath'

describe('compareDates', () => {
  it('returns 0 for equal dates', () => {
    expect(compareDates('2020-01-01', '2020-01-01')).toBe(0)
  })
  it('returns 1 when the first date is later', () => {
    expect(compareDates('2020-01-02', '2020-01-01')).toBe(1)
    expect(compareDates('2021-01-01', '2020-12-31')).toBe(1)
    expect(compareDates('2020-02-01', '2020-01-31')).toBe(1)
  })
  it('returns -1 when the first date is earlier', () => {
    expect(compareDates('2020-01-01', '2020-01-02')).toBe(-1)
  })
})

describe('shiftDate', () => {
  it('adds years/months/days without overflow', () => {
    expect(shiftDate('2020-01-10', 1, 2, 3)).toBe('2021-03-13')
  })
  it('normalizes month overflow into the next year', () => {
    expect(shiftDate('2020-11-01', 0, 3, 0)).toBe('2021-02-01')
  })
  it('normalizes day overflow into the next month', () => {
    expect(shiftDate('2020-01-25', 0, 0, 10)).toBe('2020-02-04')
  })
})

describe('defaultRetirementDate', () => {
  it('adds 60 years to the date of birth', () => {
    expect(defaultRetirementDate('1965-05-04')).toBe('2025-05-04')
  })
})

describe('age (borrow algorithm)', () => {
  it('computes a simple case with no borrowing', () => {
    expect(age('1990-01-01', '2020-01-01')).toEqual({ years: 30, months: 0, days: 0 })
  })
  it('borrows a month when dob.day > event.day', () => {
    // 1965-05-15 -> 2025-03-10: equivalent to 60y - 2m5d = 59y 9m 25d
    expect(age('1965-05-15', '2025-03-10')).toEqual({ years: 59, months: 9, days: 25 })
  })
  it('borrows a year when dob.month > event.month', () => {
    expect(age('1970-03-05', '2021-09-20')).toEqual({ years: 51, months: 6, days: 15 })
  })
})

describe('lengthOfService (borrow algorithm)', () => {
  it('computes a simple case with no borrowing', () => {
    expect(lengthOfService('1990-01-20', '2020-01-25')).toEqual({ years: 30, months: 0, days: 5 })
  })
  it('borrows a year when end.month < start.month', () => {
    expect(lengthOfService('1995-08-01', '2021-09-20')).toEqual({
      years: 26,
      months: 1,
      days: 19,
    })
  })
})

describe('qualifyingServiceYearsRaw + capQualifyingServiceYears', () => {
  it('rolls qm into qy when qm > 5 (uncapped, exceeds 30 years)', () => {
    // 1986-07-10 -> 2023-01-15: qd=5, qm=6 (>5 rolls up) -> qy=36+1=37
    const raw = qualifyingServiceYearsRaw('1986-07-10', '2023-01-15')
    expect(raw).toBe(37)
    expect(capQualifyingServiceYears(raw)).toEqual({ years: 30, capped: true })
  })
  it('does not cap when raw years is 30 or below', () => {
    const raw = qualifyingServiceYearsRaw('1995-08-01', '2021-09-20')
    expect(raw).toBe(26)
    expect(capQualifyingServiceYears(raw)).toEqual({ years: 26, capped: false })
  })
})
