/** Age-indexed commutation factor table (ages 20..72), verbatim from legacy `$.fn.commtt`. */
const COMMUTATION_TABLE = [
  486.0156, 476.8092, 467.5836, 458.3688, 449.1648, 439.9812, 430.8072, 421.6464, 412.5, 403.3716,
  393.6853, 385.1688, 376.0944, 367.0428, 358.0116, 349.0092, 340.0344, 331.0896, 322.1784, 313.2108,
  304.4736, 295.6872, 286.9512, 278.208, 269.6556, 261.1104, 252.6456, 244.266, 235.9836, 227.8092,
  219.7548, 211.8312, 204.06, 196.452, 189.0204, 181.7736, 174.7224, 167.8656, 161.208, 154.7436,
  148.4628, 142.3584, 136.4208, 130.6464, 125.028, 119.6316, 114.2568, 109.6968, 104.0904, 99.2364,
  94.5336, 89.9796,
]

/** Commutation rate for a given age. Mirrors legacy `$.fn.commtt` (age < 60 looks up age+1). */
export function commutationRate(age: number): number {
  const index = age < 60 ? age + 1 - 20 : age - 20
  return COMMUTATION_TABLE[index]
}
