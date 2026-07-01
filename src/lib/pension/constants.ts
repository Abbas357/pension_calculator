import type { Government, PensionType } from './types'

export const CUTOFF = {
  JUNE_30_2015: '2015-06-30',
  JUNE_30_2016: '2016-06-30',
  JUNE_30_2017: '2017-06-30',
  JUNE_30_2022: '2022-06-30',
  JUNE_30_2023: '2023-06-30',
} as const

export const PENSION_TYPES: { value: PensionType; label: string }[] = [
  { value: 'superannuation', label: 'Superannuation' },
  { value: 'retiring', label: 'Retiring' },
  { value: 'ddservice', label: 'Death During Service' },
  { value: 'daretirement', label: 'Death After Retirement' },
]

export const GOVERNMENTS: {
  value: Government
  label: string
  aliasedToKpk: boolean
}[] = [
  { value: 'federal', label: 'Federal Government', aliasedToKpk: false },
  { value: 'kpk', label: 'Government of Khyber Pakhtunkhwa', aliasedToKpk: false },
  { value: 'punjab', label: 'Government of Punjab', aliasedToKpk: true },
  { value: 'sindh', label: 'Government of Sindh', aliasedToKpk: true },
  { value: 'balochistan', label: 'Government of Balochistan', aliasedToKpk: true },
  { value: 'gb', label: 'Government of Gilgit-Baltistan', aliasedToKpk: true },
  { value: 'ajk', label: 'Government of Azad Jammu & Kashmir', aliasedToKpk: true },
]

export const BPS_OPTIONS = Array.from({ length: 22 }, (_, i) => i + 1)

export const MIN_PENSION_FLOOR_2018 = {
  regular: 10000,
  death: 7500,
} as const

export const MIN_PENSION_FLOOR_2023_FED = {
  regular: 12000,
  death: 9000,
} as const

export const PENSION_FRACTION_NUMERATOR = 7
export const PENSION_FRACTION_DENOMINATOR = 300
export const QUALIFYING_SERVICE_CAP_YEARS = 30
export const DDSERVICE_COMMUTE_PCT = 25
export const FAMILY_PENSION_MULTIPLIER = 0.75
export const MEDICAL_INCREASE_PCT = 25
