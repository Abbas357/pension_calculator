export type PensionType =
  | 'superannuation'
  | 'retiring'
  | 'ddservice'
  | 'daretirement'

export type Government =
  | 'federal'
  | 'kpk'
  | 'punjab'
  | 'sindh'
  | 'balochistan'
  | 'gb'
  | 'ajk'

export interface PensionFormInput {
  ptype: PensionType
  govt: Government
  name: string
  dob: string | null
  doa: string | null
  dor: string | null
  dod: string | null
  eolEnabled: boolean
  eolYears: number
  eolMonths: number
  eolDays: number
  bps: number
  basicPay: number
  specialPay: number
  personalPay: number
  qualificationPay: number
  overseasPay: number
  spa: number
  orderlyAllowance: number
  otherPensionablePay: number
  commutePct: number
}

export interface DurationYMD {
  years: number
  months: number
  days: number
}

export interface ServiceDetails {
  dorOrDodLabel: string
  dorOrDod: string
  dob: string
  ageAtEvent: DurationYMD
  doa: string
  lengthOfService: DurationYMD
  eolDeducted: DurationYMD | null
  qualifyingServiceRaw: number
  qualifyingServiceYears: number
  qualifyingServiceCapped: boolean
}

export interface EmolumentsDetails {
  basicPay: number
  retiringYearIncrement: number | null
  specialPay: number
  personalPay: number
  qualificationPay: number
  overseasPay: number
  spa: number
  otherPensionablePay: number
  totalEmoluments: number
  payWarning: string | null
}

export interface PensionCalculationDetails {
  grossPensionLabel: string
  grossPension: number
  isCommuted: boolean
  commutePct: number
  commutedPortion: number | null
  netPension: number
  commuttRate: number | null
  commutationOrGratuityLabel: string | null
  commutationOrGratuityAmount: number | null
  dateOfRestoration: string | null
}

export interface IncreaseStep {
  key: string
  yearLabel: string
  ratePctLabel: string
  increaseAmount: number
  runningTotal: number
  visible: boolean
  isFloorRow?: boolean
  floorLabel?: string
}

export interface MedicalAllowanceDetails {
  medicalRatePct: number
  medical2010: number
  medicalIncreasePct: number
  medicalIncreaseAmount: number
  orderlyAllowance: number | null
}

export interface PensionResult {
  headerLabel: string
  commutationOptedLabel: string | null
  service: ServiceDetails
  emoluments: EmolumentsDetails
  pensionCalc: PensionCalculationDetails
  increases: IncreaseStep[]
  netPensionBaselineLabel: string
  netPensionBaselineAmount: number
  medical: MedicalAllowanceDetails
  finalNetPensionPayable: number
  isFamilyPension: boolean
  meta: {
    govt: Government
    ptype: PensionType
    isProvinceAliasedToKpk: boolean
    isFederal: boolean
  }
}
