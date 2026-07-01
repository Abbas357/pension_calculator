import { describe, expect, it } from 'vitest'
import { commutationRate } from '../src/lib/pension/commutationTable'

describe('commutationRate', () => {
  it('uses table[age+1-20] for ages below 60', () => {
    expect(commutationRate(20)).toBeCloseTo(476.8092, 4) // index (20+1-20)=1
    expect(commutationRate(59)).toBeCloseTo(148.4628, 4) // index (59+1-20)=40
  })
  it('uses table[age-20] for ages 60 and above', () => {
    expect(commutationRate(60)).toBeCloseTo(148.4628, 4) // index (60-20)=40
    expect(commutationRate(71)).toBeCloseTo(89.9796, 4) // index (71-20)=51, last entry
  })
})
