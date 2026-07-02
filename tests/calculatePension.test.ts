import { describe, expect, it } from 'vitest'
import { calculatePension } from '../src/lib/pension/calculatePension'
import { computeIncreaseChain } from '../src/lib/pension/increaseEngine'
import type { PensionFormInput } from '../src/lib/pension/types'

const baseInput: PensionFormInput = {
  ptype: 'superannuation',
  govt: 'kpk',
  name: '',
  dob: null,
  doa: null,
  dor: null,
  dod: null,
  eolEnabled: false,
  eolYears: 0,
  eolMonths: 0,
  eolDays: 0,
  bps: 0,
  basicPay: 0,
  specialPay: 0,
  personalPay: 0,
  qualificationPay: 0,
  overseasPay: 0,
  spa: 0,
  orderlyAllowance: 0,
  otherPensionablePay: 0,
  commutePct: 0,
}

describe('calculatePension', () => {
  it('returns null when required fields are missing', () => {
    expect(calculatePension(baseInput)).toBeNull()
  })

  it('KPK superannuation with EOL: caps qualifying service and reduces it via the shifted DOA', () => {
    const result = calculatePension({
      ...baseInput,
      govt: 'kpk',
      ptype: 'superannuation',
      dob: '1963-06-15',
      doa: '1985-07-10',
      dor: '2023-01-15',
      eolEnabled: true,
      eolYears: 1,
      eolMonths: 0,
      eolDays: 0,
      bps: 17,
      basicPay: 51910, // aligned to the 2022-07-01 BPS-17 scale (45070 + 2*3420)
      commutePct: 20,
    })

    expect(result).not.toBeNull()
    const r = result!

    // Service details
    expect(r.service.dorOrDodLabel).toBe('Date of Retirement')
    expect(r.service.ageAtRetirement).toEqual({ years: 59, months: 7, days: 0 })
    expect(r.service.lengthOfService).toEqual({ years: 37, months: 6, days: 5 })
    expect(r.service.eolDeducted).toEqual({ years: 1, months: 0, days: 0 })
    expect(r.service.qualifyingServiceRaw).toBe(37)
    expect(r.service.qualifyingServiceYears).toBe(30)
    expect(r.service.qualifyingServiceCapped).toBe(true)

    // Emoluments
    expect(r.emoluments.payWarning).toBeNull()
    expect(r.emoluments.retiringYearIncrement).toBeNull() // January retirement -> no increment
    expect(r.emoluments.totalEmoluments).toBeCloseTo(51910, 2)

    // Gross/commuted/net pension
    expect(r.pensionCalc.grossPension).toBeCloseTo(36337.0, 2)
    expect(r.pensionCalc.isCommuted).toBe(true)
    expect(r.pensionCalc.commutedPortion).toBeCloseTo(7267.4, 2)
    expect(r.pensionCalc.commuttRate).toBeCloseTo(148.4628, 4)
    expect(r.pensionCalc.netPension).toBeCloseTo(29069.6, 2)
    expect(r.pensionCalc.commutationOrGratuityLabel).toBe('Commutation Amount')
    expect(r.pensionCalc.commutationOrGratuityAmount).toBeCloseTo(1078938.55, 2)
    expect(r.pensionCalc.dateOfRestoration).toBe('2035-01-15')

    // Increase chain wiring: baseline should be the net pension (not multiplied, not ddservice)
    expect(r.netPensionBaselineLabel).toBe('Net Pension')
    expect(r.netPensionBaselineAmount).toBeCloseTo(29069.6, 2)
    const expectedChain = computeIncreaseChain(29069.6, '2023-01-15', false, 'superannuation')
    expect(r.increases).toEqual(expectedChain.steps)

    // Medical allowance computed off the 2010 running total (unchanged here since inc2010=0)
    expect(r.medical.medicalRatePct).toBe(20) // bps 17 >= 16
    expect(r.medical.medical2010).toBeCloseTo(5813.92, 2)
    expect(r.medical.medicalIncreaseAmount).toBeCloseTo(1453.48, 2)
    expect(r.medical.orderlyAllowance).toBeNull()

    expect(r.finalNetPensionPayable).toBeCloseTo(55601.81, 2)
    expect(r.headerLabel).toBe('Retired from Government of Khyber Pakhtunkhwa on Superannuation Pension')
    expect(r.commutationOptedLabel).toBe('Opted for 20% commutation')
    expect(r.meta.isProvinceAliasedToKpk).toBe(false)
  })

  it('Federal Death During Service: uses DOD throughout, forces 25% commutation, labels as Gratuity', () => {
    const result = calculatePension({
      ...baseInput,
      govt: 'federal',
      ptype: 'ddservice',
      dob: '1970-03-05',
      doa: '1995-08-01',
      dod: '2021-09-20',
      dor: null,
      bps: 19,
      basicPay: 68360, // aligned to the 2017-07-01 BPS-19 scale (59210 + 3*3050)
      commutePct: 35, // should be ignored/forced to 25 for ddservice
    })

    expect(result).not.toBeNull()
    const r = result!

    expect(r.service.dorOrDodLabel).toBe('Date of Death')
    expect(r.service.dorOrDod).toBe('2021-09-20')
    expect(r.service.ageAtRetirement).toEqual({ years: 51, months: 6, days: 15 })
    expect(r.service.lengthOfService).toEqual({ years: 26, months: 1, days: 19 })
    expect(r.service.qualifyingServiceYears).toBe(26)
    expect(r.service.qualifyingServiceCapped).toBe(false)

    expect(r.emoluments.retiringYearIncrement).toBeCloseTo(3050, 2)
    expect(r.emoluments.totalEmoluments).toBeCloseTo(71410, 2)

    expect(r.pensionCalc.grossPension).toBeCloseTo(43322.07, 2)
    expect(r.pensionCalc.commutePct).toBe(25) // forced regardless of the 35 requested
    expect(r.pensionCalc.commutedPortion).toBeCloseTo(10830.52, 2)
    expect(r.pensionCalc.netPension).toBeCloseTo(32491.55, 2)
    expect(r.pensionCalc.commutationOrGratuityLabel).toBe('Gratuity Amount')
    expect(r.pensionCalc.dateOfRestoration).toBeNull()

    expect(r.commutationOptedLabel).toBeNull() // hidden entirely for ddservice
    expect(r.isFamilyPension).toBe(false)

    const expectedChain = computeIncreaseChain(32491.55, '2021-09-20', true, 'ddservice')
    expect(r.increases).toEqual(expectedChain.steps)

    expect(r.medical.medicalRatePct).toBe(20) // bps 19 >= 16
    expect(r.medical.orderlyAllowance).toBeNull() // bps must be > 19, not just >=

    expect(r.finalNetPensionPayable).toBeCloseTo(115684.58, 2)
  })

  it('Death After Retirement: uses DOR (not DOD) for age/increments, applies the 75% family multiplier', () => {
    const result = calculatePension({
      ...baseInput,
      govt: 'kpk',
      ptype: 'daretirement',
      dob: '1960-06-01',
      doa: '1985-06-01',
      dor: '2015-06-01',
      dod: '2020-06-01',
      bps: 17,
      basicPay: 18400, // aligned to the 2011-07-01 BPS-17 scale (16000 + 2*1200)
      commutePct: 15,
    })

    expect(result).not.toBeNull()
    const r = result!

    expect(r.service.dorOrDodLabel).toBe('Date of Retirement')
    expect(r.service.dorOrDod).toBe('2015-06-01')
    expect(r.service.ageAtRetirement).toEqual({ years: 55, months: 0, days: 0 }) // age at DOR, not DOD
    expect(r.service.qualifyingServiceYears).toBe(30)

    expect(r.pensionCalc.grossPension).toBeCloseTo(13720.0, 2)
    expect(r.pensionCalc.netPension).toBeCloseTo(11662.0, 2)
    expect(r.pensionCalc.commutationOrGratuityLabel).toBe('Commutation Amount')
    expect(r.pensionCalc.dateOfRestoration).toBe('2030-06-01')

    expect(r.isFamilyPension).toBe(true)
    expect(r.netPensionBaselineLabel).toBe('75% Family Pension w.e.f Date of Death')
    expect(r.netPensionBaselineAmount).toBeCloseTo(8746.5, 2) // 11662 * 0.75
    expect(r.commutationOptedLabel).toBe('Opted for 15% commutation') // not hidden for daretirement
  })

  it('aliases non-federal, non-KPK provinces to the KPK calculation path', () => {
    const punjab = calculatePension({
      ...baseInput,
      govt: 'punjab',
      dob: '1963-06-15',
      doa: '1985-07-10',
      dor: '2023-01-15',
      bps: 17,
      basicPay: 51910,
      commutePct: 20,
    })
    const kpk = calculatePension({
      ...baseInput,
      govt: 'kpk',
      dob: '1963-06-15',
      doa: '1985-07-10',
      dor: '2023-01-15',
      bps: 17,
      basicPay: 51910,
      commutePct: 20,
    })

    expect(punjab!.finalNetPensionPayable).toBeCloseTo(kpk!.finalNetPensionPayable, 2)
    expect(punjab!.meta.isProvinceAliasedToKpk).toBe(true)
    expect(kpk!.meta.isProvinceAliasedToKpk).toBe(false)
  })
})
