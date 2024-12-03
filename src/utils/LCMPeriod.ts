// frequencies assumed to be float between 0 & 10 with a maximum 1 decimal place
export const LCMPeriod = (frequencies: number[]) => {
  // Helper function to find GCD using Euclidean algorithm
  const gcd = (a: number, b: number): number => {
    while (b !== 0) {
      const temp = b
      b = a % b
      a = temp
    }
    return a
  }

  // Find how many rotations each frequency makes in 1 second
  const rotationsPerSecond = frequencies.map((freq) => Math.round(freq * 100))

  // Find GCD of all rotations
  const gcdRotations = rotationsPerSecond.reduce((a, b) => gcd(a, b))

  // The time period is 1 second divided by the GCD
  const result = 100 / gcdRotations

  return result
}
