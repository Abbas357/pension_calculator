import { trimNum } from './format'
import { compareDates } from './dateMath'
import { CUTOFF, MIN_PENSION_FLOOR_2018, MIN_PENSION_FLOOR_2023_FED } from './constants'
import type { IncreaseStep, PensionType } from './types'

export interface IncreaseChainResult {
  steps: IncreaseStep[]
  inc2010Total: number
  finalTotal: number
}

/**
 * Ports the legacy `cpension()` compounding 2010->2025 annual pension-increase chain verbatim,
 * including its Federal vs KPK/other branching, cutoff-date gating, minimum-pension floors, and
 * the "04/2022" federal-only display row that is intentionally NOT carried into the running
 * total used by the 2022 step (a quirk of the source that must be preserved exactly).
 */
export function computeIncreaseChain(
  baselineNetPension: number,
  dor: string,
  isFederal: boolean,
  ptype: PensionType,
): IncreaseChainResult {
  const steps: IncreaseStep[] = []
  const isDeathType = ptype === 'ddservice' || ptype === 'daretirement'

  const pushStep = (
    key: string,
    yearLabel: string,
    ratePctLabel: string,
    amount: number,
    total: number,
  ) => {
    steps.push({
      key,
      yearLabel,
      ratePctLabel,
      increaseAmount: amount,
      runningTotal: total,
      visible: amount !== 0,
    })
  }

  const pushFloorRow = (key: string, total: number) => {
    steps.push({
      key,
      yearLabel: '',
      ratePctLabel: '',
      increaseAmount: 0,
      runningTotal: total,
      visible: true,
      isFloorRow: true,
      floorLabel: 'Minimum Pension Payable Rs.',
    })
  }

  // 2010: +15% if DOR <= 2017-06-30, else 0 (applies to both fed and kpk/other identically)
  const inc2010 =
    compareDates(dor, CUTOFF.JUNE_30_2017) === 1 ? 0 : trimNum(baselineNetPension * 0.15, 2)
  const inc2010t = baselineNetPension + inc2010
  pushStep('2010', '2010', '15%', inc2010, inc2010t)

  // 2011: fed always +15%; kpk/other gated by 2022 cutoff, same 15% rate
  const inc2011 = isFederal
    ? trimNum(inc2010t * 0.15, 2)
    : compareDates(dor, CUTOFF.JUNE_30_2022) === 1
      ? 0
      : trimNum(inc2010t * 0.15, 2)
  const inc2011t = inc2010t + inc2011
  pushStep('2011', '2011', '15%', inc2011, inc2011t)

  // 2012: +20% if DOR <= 2015-06-30
  const inc2012 = compareDates(dor, CUTOFF.JUNE_30_2015) === 1 ? 0 : trimNum(inc2011t * 0.2, 2)
  const inc2012t = inc2011t + inc2012
  pushStep('2012', '2012', '20%', inc2012, inc2012t)

  // 2013: fed +10%, kpk/other +15%; gated by 2016 cutoff
  const inc2013Rate = isFederal ? 0.1 : 0.15
  const inc2013 =
    compareDates(dor, CUTOFF.JUNE_30_2016) === 1 ? 0 : trimNum(inc2012t * inc2013Rate, 2)
  const inc2013t = inc2012t + inc2013
  pushStep('2013', '2013', isFederal ? '10%' : '15%', inc2013, inc2013t)

  // 2014: +10% if DOR <= 2016-06-30
  const inc2014 = compareDates(dor, CUTOFF.JUNE_30_2016) === 1 ? 0 : trimNum(inc2013t * 0.1, 2)
  const inc2014t = inc2013t + inc2014
  pushStep('2014', '2014', '10%', inc2014, inc2014t)

  // 2015: fed +7.5% always; kpk/other +10% gated by 2022 cutoff
  const inc2015Rate = isFederal ? 0.075 : 0.1
  const inc2015 = isFederal
    ? trimNum(inc2014t * inc2015Rate, 2)
    : compareDates(dor, CUTOFF.JUNE_30_2022) === 1
      ? 0
      : trimNum(inc2014t * inc2015Rate, 2)
  const inc2015t = inc2014t + inc2015
  pushStep('2015', '2015', isFederal ? '7.5%' : '10%', inc2015, inc2015t)

  // 2016/2017/2018: +10% each, gated by 2022 cutoff
  const inc2016 = compareDates(dor, CUTOFF.JUNE_30_2022) === 1 ? 0 : trimNum(inc2015t * 0.1, 2)
  const inc2016t = inc2015t + inc2016
  pushStep('2016', '2016', '10%', inc2016, inc2016t)

  const inc2017 = compareDates(dor, CUTOFF.JUNE_30_2022) === 1 ? 0 : trimNum(inc2016t * 0.1, 2)
  const inc2017t = inc2016t + inc2017
  pushStep('2017', '2017', '10%', inc2017, inc2017t)

  const inc2018 = compareDates(dor, CUTOFF.JUNE_30_2022) === 1 ? 0 : trimNum(inc2017t * 0.1, 2)
  let inc2018t = inc2017t + inc2018
  pushStep('2018', '2018', '10%', inc2018, inc2018t)

  // Minimum pension floor after 2018 (10000 regular / 7500 death types)
  const floor2018 = isDeathType ? MIN_PENSION_FLOOR_2018.death : MIN_PENSION_FLOOR_2018.regular
  let floor2018Applied = false
  if (inc2018t < floor2018) {
    inc2018t = floor2018
    floor2018Applied = true
  }

  // Fed-only override: undo the 2018 floor entirely if DOR is after 2023-06-30
  if (isFederal && compareDates(dor, CUTOFF.JUNE_30_2023) === 1) {
    inc2018t = inc2017t + inc2018
    floor2018Applied = false
  }

  if (floor2018Applied) pushFloorRow('floor2018', inc2018t)

  // 2019/2021: +10% each, gated by 2022 cutoff
  const inc2019 = compareDates(dor, CUTOFF.JUNE_30_2022) === 1 ? 0 : trimNum(inc2018t * 0.1, 2)
  const inc2019t = inc2018t + inc2019
  pushStep('2019', '2019', '10%', inc2019, inc2019t)

  const inc2021 = compareDates(dor, CUTOFF.JUNE_30_2022) === 1 ? 0 : trimNum(inc2019t * 0.1, 2)
  const inc2021t = inc2019t + inc2021
  pushStep('2021', '2021', '10%', inc2021, inc2021t)

  // 04/2022: federal-only display row. NOT carried forward into the 2022 step's base
  // (matches the legacy source exactly, where inc2022 is computed from inc2021t, not inc42022t).
  if (isFederal) {
    const inc42022 = compareDates(dor, CUTOFF.JUNE_30_2022) === 1 ? 0 : trimNum(inc2021t * 0.1, 2)
    const inc42022t = inc2021t + inc42022
    pushStep('04-2022', '04/2022', '10%', inc42022, inc42022t)
  }

  // 2022: +15% unconditional, based on inc2021t
  const inc2022 = trimNum(inc2021t * 0.15, 2)
  const inc2022t = inc2021t + inc2022
  pushStep('2022', '2022', '15%', inc2022, inc2022t)

  // 2023: +17.5% unconditional
  const inc2023 = trimNum(inc2022t * 0.175, 2)
  let inc2023t = inc2022t + inc2023
  pushStep('2023', '2023', '17.5%', inc2023, inc2023t)

  // Fed-only minimum floor after 2023 (12000 regular / 9000 death types)
  if (isFederal) {
    const floor2023 = isDeathType
      ? MIN_PENSION_FLOOR_2023_FED.death
      : MIN_PENSION_FLOOR_2023_FED.regular
    if (inc2023t < floor2023) {
      inc2023t = floor2023
      pushFloorRow('floor2023', inc2023t)
    }
  }

  // 2024/2025: unconditional
  const inc2024 = trimNum(inc2023t * 0.15, 2)
  const inc2024t = inc2023t + inc2024
  pushStep('2024', '2024', '15%', inc2024, inc2024t)

  const inc2025 = trimNum(inc2024t * 0.07, 2)
  const inc2025t = inc2024t + inc2025
  pushStep('2025', '2025', '7%', inc2025, inc2025t)

  return { steps, inc2010Total: inc2010t, finalTotal: inc2025t }
}
