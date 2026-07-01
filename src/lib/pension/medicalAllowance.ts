import { trimNum } from './format'
import { MEDICAL_INCREASE_PCT } from './constants'
import type { MedicalAllowanceDetails } from './types'

/**
 * Medical allowance is computed off the *2010* increase running total (not the final chained
 * total), per the legacy `cpension()` — 25% of that for BPS < 16, else 20%, plus a further 25%
 * increase on top, plus an optional Orderly Allowance passthrough for BPS > 19.
 */
export function computeMedicalAllowance(
  bps: number,
  inc2010Total: number,
  orderlyAllowance: number,
): MedicalAllowanceDetails {
  const medicalRatePct = bps < 16 ? 25 : 20
  const medical2010 = trimNum(inc2010Total * (medicalRatePct / 100), 2)
  const medicalIncreaseAmount = trimNum(medical2010 * (MEDICAL_INCREASE_PCT / 100), 2)

  return {
    medicalRatePct,
    medical2010,
    medicalIncreasePct: MEDICAL_INCREASE_PCT,
    medicalIncreaseAmount,
    orderlyAllowance: bps > 19 && orderlyAllowance > 0 ? orderlyAllowance : null,
  }
}
