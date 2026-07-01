/** Per-BPS (1..22) retiring-year increment amounts for each dated scale. Verbatim from legacy `$.fn.inc`. */
const SCALE_2011 = [150, 170, 200, 230, 260, 290, 320, 350, 380, 420, 460, 500, 550, 610, 700, 800, 1200, 1500, 1600, 2350, 2600, 3050]
const SCALE_2015 = [195, 220, 260, 300, 340, 375, 415, 455, 495, 544, 595, 650, 715, 790, 905, 1035, 1555, 1950, 2075, 3050, 3375, 3960]
const SCALE_2016 = [240, 275, 325, 370, 420, 470, 510, 560, 610, 670, 740, 800, 880, 980, 1120, 1280, 1930, 2400, 2560, 3750, 4150, 4870]
const SCALE_2017 = [290, 330, 390, 440, 500, 560, 610, 670, 730, 800, 880, 960, 1050, 1170, 1330, 1520, 2300, 2870, 3050, 4510, 5000, 5870]
const SCALE_2022 = [430, 490, 580, 660, 750, 840, 910, 1000, 1090, 1190, 1310, 1430, 1560, 1740, 1980, 2260, 3420, 4260, 4530, 6690, 7420, 8710]

/**
 * The "retiring year increment" applied to emoluments when the retirement/death month falls
 * between July and November (month < 6 or == 12 gets zero — a mid-year increment convention).
 * Mirrors legacy `$.fn.inc`.
 */
export function retiringYearIncrement(dateStr: string, bps: number): number {
  const month = Number(dateStr.substring(5, 7))
  if (month < 6 || month === 12) return 0

  const d = new Date(dateStr)
  const june302011 = new Date('2011-06-30')
  const june302015 = new Date('2015-06-30')
  const june302016 = new Date('2016-06-30')
  const june302017 = new Date('2017-06-30')
  const june302022 = new Date('2022-06-30')

  if (d > june302011 && d <= june302015) return SCALE_2011[bps - 1]
  if (d > june302015 && d <= june302016) return SCALE_2015[bps - 1]
  if (d > june302016 && d <= june302017) return SCALE_2016[bps - 1]
  if (d > june302017 && d <= june302022) return SCALE_2017[bps - 1]
  if (d > june302022) return SCALE_2022[bps - 1]

  return 0
}
