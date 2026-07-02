import {
  age,
  capQualifyingServiceYears,
  lengthOfService,
  qualifyingServiceYearsRaw,
  shiftDate,
} from './dateMath'
import { checkPay } from './payScaleTables'
import { retiringYearIncrement } from './incrementTables'
import { commutationRate } from './commutationTable'
import { computeIncreaseChain } from './increaseEngine'
import { computeMedicalAllowance } from './medicalAllowance'
import { trimNum } from './format'
import {
  DDSERVICE_COMMUTE_PCT,
  FAMILY_PENSION_MULTIPLIER,
  GOVERNMENTS,
  PENSION_FRACTION_DENOMINATOR,
  PENSION_FRACTION_NUMERATOR,
} from './constants'
import type { PensionFormInput, PensionResult } from './types'

function requiredFieldsPresent(form: PensionFormInput): boolean {
  const hasEventDate = form.ptype === 'ddservice' ? !!form.dod : !!form.dor
  return !!form.dob && !!form.doa && hasEventDate && form.bps > 0 && form.basicPay > 0
}

export function calculatePension(form: PensionFormInput): PensionResult | null {
  if (!requiredFieldsPresent(form)) return null

  const dob = form.dob!
  const doa = form.doa!
  const isDdService = form.ptype === 'ddservice'
  const isDaRetirement = form.ptype === 'daretirement'
  const eventDate = isDdService ? form.dod! : form.dor!

  const govtMeta = GOVERNMENTS.find((g) => g.value === form.govt)!
  const isFederal = form.govt === 'federal'

  // ── Service details ──────────────────────────────────────────────
  const ageAtRetirement = age(dob, eventDate)
  const lengthOfServiceValue = lengthOfService(doa, eventDate)

  const hasEol = form.eolEnabled && form.eolYears + form.eolMonths + form.eolDays > 0
  const qualifyingServiceStart = hasEol
    ? shiftDate(doa, form.eolYears, form.eolMonths, form.eolDays)
    : doa

  const qualifyingServiceRaw = Math.max(
    0,
    qualifyingServiceYearsRaw(qualifyingServiceStart, eventDate),
  )
  const { years: qualifyingServiceYears, capped: qualifyingServiceCapped } =
    capQualifyingServiceYears(qualifyingServiceRaw)

  const service: PensionResult['service'] = {
    dorOrDodLabel: isDdService ? 'Date of Death' : 'Date of Retirement',
    dorOrDod: eventDate,
    dob,
    ageAtRetirement,
    doa,
    lengthOfService: lengthOfServiceValue,
    eolDeducted: hasEol
      ? { years: form.eolYears, months: form.eolMonths, days: form.eolDays }
      : null,
    qualifyingServiceRaw,
    qualifyingServiceYears,
    qualifyingServiceCapped,
  }

  // ── Emoluments ────────────────────────────────────────────────────
  const payWarning = checkPay(form.basicPay, form.bps, eventDate)
  const increment = retiringYearIncrement(eventDate, form.bps)
  const retiringYearIncrementValue = increment > 0 ? increment : null

  const totalEmoluments = trimNum(
    form.basicPay +
      (retiringYearIncrementValue ?? 0) +
      form.specialPay +
      form.personalPay +
      form.qualificationPay +
      form.overseasPay +
      form.spa +
      form.otherPensionablePay,
    2,
  )

  const emoluments: PensionResult['emoluments'] = {
    basicPay: form.basicPay,
    retiringYearIncrement: retiringYearIncrementValue,
    specialPay: form.specialPay,
    personalPay: form.personalPay,
    qualificationPay: form.qualificationPay,
    overseasPay: form.overseasPay,
    spa: form.spa,
    otherPensionablePay: form.otherPensionablePay,
    totalEmoluments,
    payWarning,
  }

  // ── Gross pension & commutation ─────────────────────────────────
  const grossPension = trimNum(
    (totalEmoluments * qualifyingServiceYears * PENSION_FRACTION_NUMERATOR) /
      PENSION_FRACTION_DENOMINATOR,
    2,
  )

  const shouldCommute = form.commutePct !== 0 || isDdService
  let netPension = grossPension
  let pensionCalc: PensionResult['pensionCalc']

  if (shouldCommute) {
    const commutePct = isDdService ? DDSERVICE_COMMUTE_PCT : form.commutePct
    const commutedPortion = trimNum((grossPension * commutePct) / 100, 2)
    const commuttRate = commutationRate(ageAtRetirement.years)
    netPension = trimNum(grossPension - commutedPortion, 2)

    let dateOfRestoration: string | null = null
    let commutationOrGratuityLabel: string | null = null

    if (isDdService) {
      commutationOrGratuityLabel = 'Gratuity Amount'
    } else {
      commutationOrGratuityLabel = 'Commutation Amount'
      const dorYear = Number(form.dor!.substring(0, 4))
      const dorMonth = form.dor!.substring(5, 7)
      const dorDay = form.dor!.substring(8, 10)
      const restorationYear = dorYear + Math.round(commuttRate / 12)
      dateOfRestoration = `${restorationYear}-${dorMonth}-${dorDay}`
    }

    pensionCalc = {
      grossPensionLabel: 'Gross Pension',
      grossPension,
      isCommuted: true,
      commutePct,
      commutedPortion,
      netPension,
      commuttRate,
      commutationOrGratuityLabel,
      commutationOrGratuityAmount: trimNum(commuttRate * commutedPortion, 2),
      dateOfRestoration,
    }
  } else {
    pensionCalc = {
      grossPensionLabel: 'Net Pension',
      grossPension,
      isCommuted: false,
      commutePct: 0,
      commutedPortion: null,
      netPension,
      commuttRate: null,
      commutationOrGratuityLabel: null,
      commutationOrGratuityAmount: null,
      dateOfRestoration: null,
    }
  }

  // ── Family pension multiplier (Death After Retirement) ───────────
  let baselineNetPension = netPension
  let netPensionBaselineLabel = 'Net Pension'
  if (isDaRetirement) {
    baselineNetPension = trimNum(netPension * FAMILY_PENSION_MULTIPLIER, 2)
    netPensionBaselineLabel = '75% Family Pension w.e.f Date of Death'
  }

  // ── Annual increases 2010→2025 ───────────────────────────────────
  const { steps, inc2010Total, finalTotal } = computeIncreaseChain(
    baselineNetPension,
    eventDate,
    isFederal,
    form.ptype,
  )

  // ── Medical allowance ─────────────────────────────────────────────
  const medical = computeMedicalAllowance(form.bps, inc2010Total, form.orderlyAllowance)

  const finalNetPensionPayable = trimNum(
    finalTotal +
      medical.medical2010 +
      medical.medicalIncreaseAmount +
      (medical.orderlyAllowance ?? 0),
    2,
  )

  // ── Header / labels ────────────────────────────────────────────────
  const ptypeSuffix: Record<PensionFormInput['ptype'], string> = {
    superannuation: 'on Superannuation Pension',
    retiring: 'on Retiring Pension',
    ddservice: 'on Death During Service',
    daretirement: 'on Death After Retirement',
  }
  const headerLabel = `Retired from ${govtMeta.label} ${ptypeSuffix[form.ptype]}`

  const commutationOptedLabel = isDdService
    ? null
    : form.commutePct !== 0
      ? `Opted for ${form.commutePct}% commutation`
      : 'Opted for no commutation'

  return {
    headerLabel,
    commutationOptedLabel,
    service,
    emoluments,
    pensionCalc,
    increases: steps,
    netPensionBaselineLabel,
    netPensionBaselineAmount: baselineNetPension,
    medical,
    finalNetPensionPayable,
    isFamilyPension: isDaRetirement,
    meta: {
      govt: form.govt,
      ptype: form.ptype,
      isProvinceAliasedToKpk: govtMeta.aliasedToKpk,
      isFederal,
    },
  }
}
