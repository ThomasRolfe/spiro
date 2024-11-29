// Limited by the highest frequency input being 10.00 (1000)
const fixedPrimes = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157,
  163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239,
  241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331,
  337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421,
  431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509,
  521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613,
  617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709,
  719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821,
  823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919,
  929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997,
]

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

  // Helper function to find LCM of two numbers
  const lcm = (a: number, b: number): number => {
    return Math.abs(a * b) / gcd(a, b)
  }

  // Find how many rotations each frequency makes in 1 second
  const rotationsPerSecond = frequencies.map((freq) => Math.round(freq * 100))

  // Find GCD of all rotations
  const gcdRotations = rotationsPerSecond.reduce((a, b) => gcd(a, b))

  // The time period is 1 second divided by the GCD
  const result = 100 / gcdRotations

  console.log({ result })

  return result
}
