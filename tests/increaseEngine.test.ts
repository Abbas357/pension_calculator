import { describe, expect, it } from 'vitest'
import { computeIncreaseChain } from '../src/lib/pension/increaseEngine'

/** Asserts a step's amount/runningTotal/visibility against hand-computed expected values. */
function expectStep(
  steps: ReturnType<typeof computeIncreaseChain>['steps'],
  key: string,
  amount: number,
  runningTotal: number,
  visible = true,
) {
  const step = steps.find((s) => s.key === key)
  expect(step, `step ${key} should exist`).toBeDefined()
  expect(step!.increaseAmount).toBeCloseTo(amount, 2)
  expect(step!.runningTotal).toBeCloseTo(runningTotal, 2)
  expect(step!.visible).toBe(visible)
}

describe('computeIncreaseChain', () => {
  it('KPK, DOR after the 2022-06-30 cutoff: only the unconditional 2022-2025 steps apply', () => {
    const { steps, inc2010Total, finalTotal } = computeIncreaseChain(
      29069.6,
      '2023-01-15',
      false,
      'superannuation',
    )

    expectStep(steps, '2010', 0, 29069.6, false)
    expectStep(steps, '2011', 0, 29069.6, false)
    expectStep(steps, '2012', 0, 29069.6, false)
    expectStep(steps, '2013', 0, 29069.6, false)
    expectStep(steps, '2014', 0, 29069.6, false)
    expectStep(steps, '2015', 0, 29069.6, false)
    expectStep(steps, '2016', 0, 29069.6, false)
    expectStep(steps, '2017', 0, 29069.6, false)
    expectStep(steps, '2018', 0, 29069.6, false)
    expect(steps.find((s) => s.key === 'floor2018')).toBeUndefined()
    expectStep(steps, '2019', 0, 29069.6, false)
    expectStep(steps, '2021', 0, 29069.6, false)
    expect(steps.find((s) => s.key === '04-2022')).toBeUndefined()
    expectStep(steps, '2022', 4360.44, 33430.04)
    expectStep(steps, '2023', 5850.26, 39280.3)
    expect(steps.find((s) => s.key === 'floor2023')).toBeUndefined()
    expectStep(steps, '2024', 5892.05, 45172.35)
    expectStep(steps, '2025', 3162.06, 48334.41)

    expect(inc2010Total).toBeCloseTo(29069.6, 2)
    expect(finalTotal).toBeCloseTo(48334.41, 2)
  })

  it('Federal, DOD before the 2022-06-30 cutoff: fed-only rates, gating, and the non-carried 04/2022 row', () => {
    const { steps, inc2010Total, finalTotal } = computeIncreaseChain(
      32491.55,
      '2021-09-20',
      true,
      'ddservice',
    )

    expectStep(steps, '2010', 0, 32491.55, false)
    expectStep(steps, '2011', 4873.73, 37365.28) // fed: unconditional 15%
    expectStep(steps, '2012', 0, 37365.28, false)
    expectStep(steps, '2013', 0, 37365.28, false) // fed 10% rate, but gated out by 2016 cutoff
    expectStep(steps, '2014', 0, 37365.28, false)
    expectStep(steps, '2015', 2802.4, 40167.68) // fed: unconditional 7.5%
    expectStep(steps, '2016', 4016.77, 44184.45)
    expectStep(steps, '2017', 4418.45, 48602.9)
    expectStep(steps, '2018', 4860.29, 53463.19)
    expect(steps.find((s) => s.key === 'floor2018')).toBeUndefined() // 53463.19 > 7500 death floor
    expectStep(steps, '2019', 5346.32, 58809.51)
    expectStep(steps, '2021', 5880.95, 64690.46)
    expectStep(steps, '04-2022', 6469.05, 71159.51) // display-only row
    // 2022 is based on the 2021 running total, NOT the 04/2022 row (legacy quirk preserved)
    expectStep(steps, '2022', 9703.57, 74394.03)
    expectStep(steps, '2023', 13018.96, 87412.99)
    expect(steps.find((s) => s.key === 'floor2023')).toBeUndefined() // 87412.99 > 9000 death floor
    expectStep(steps, '2024', 13111.95, 100524.94)
    expectStep(steps, '2025', 7036.75, 107561.69)

    expect(inc2010Total).toBeCloseTo(32491.55, 2)
    expect(finalTotal).toBeCloseTo(107561.69, 2)
  })

  it('Federal, low baseline before all cutoffs: triggers the 2018 minimum-pension floor', () => {
    const { steps } = computeIncreaseChain(100, '2015-01-01', true, 'superannuation')

    expectStep(steps, '2010', 15, 115)
    expectStep(steps, '2011', 17.25, 132.25)
    expectStep(steps, '2012', 26.45, 158.7)
    expectStep(steps, '2013', 15.87, 174.57)
    expectStep(steps, '2014', 17.46, 192.03)
    expectStep(steps, '2015', 14.4, 206.43)
    expectStep(steps, '2016', 20.64, 227.07)
    expectStep(steps, '2017', 22.71, 249.78)
    expectStep(steps, '2018', 24.98, 274.76)

    const floorStep = steps.find((s) => s.key === 'floor2018')
    expect(floorStep, 'floor2018 row should be injected').toBeDefined()
    expect(floorStep!.runningTotal).toBeCloseTo(10000, 2)
    expect(floorStep!.isFloorRow).toBe(true)

    expectStep(steps, '2019', 1000, 11000)
    expectStep(steps, '2021', 1100, 12100)
    expectStep(steps, '04-2022', 1210, 13310)
    expectStep(steps, '2022', 1815, 13915)
    expectStep(steps, '2023', 2435.13, 16350.13)
    expect(steps.find((s) => s.key === 'floor2023')).toBeUndefined() // 16350.13 > 12000 regular floor
    expectStep(steps, '2024', 2452.52, 18802.65)
    expectStep(steps, '2025', 1316.19, 20118.84)
  })

  it('Federal override: undoes the 2018 floor entirely when DOR is after 2023-06-30', () => {
    const { steps } = computeIncreaseChain(50, '2024-01-01', true, 'superannuation')
    // 2010/2012/2013/2014/2016/2017/2018 are gated to 0 (dor past their cutoffs), but fed's
    // unconditional 2011 (+15%) and 2015 (+7.5%) still apply: 50 -> 57.5 -> 61.81.
    // 2018 would floor to 10000, but the fed override undoes it back to inc2017Total + inc2018.
    expect(steps.find((s) => s.key === 'floor2018')).toBeUndefined()
    const step2018 = steps.find((s) => s.key === '2018')
    expect(step2018!.runningTotal).toBeCloseTo(61.81, 2)
  })
})
