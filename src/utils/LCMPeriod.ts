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
  console.log({ frequencies })
  const multipliedFrequencies = frequencies.map((frequency) => {
    return Math.trunc(frequency * 100)
  })

  const frequencyPrimeFactors = new Map()

  for (let i = 0; multipliedFrequencies.length > i; i++) {
    let remainder = multipliedFrequencies[i]
    const factors = new Map()
    const tempPrimes = [...fixedPrimes]
    let currentPrime = tempPrimes.shift()
    while (remainder > 1) {
      if (!currentPrime) {
        throw Error('Ran out of prime numbers')
      }
      // Number is divisible by current prime
      if (remainder % currentPrime === 0) {
        factors.set(currentPrime, (factors.get(currentPrime) ?? 0) + 1)
        remainder = remainder / currentPrime
        continue
      }

      // Number is not divisible by current prime
      currentPrime = tempPrimes.shift()
    }

    frequencyPrimeFactors.set(multipliedFrequencies[i], factors)
  }

  // Look at all factors & take only the highest value of factor for each
  const greatestPrimeFactors = new Map()

  frequencyPrimeFactors.forEach((primeCountMap) => {
    primeCountMap.forEach((count: number, primeFactor: number) => {
      const currentPrimeCount = greatestPrimeFactors.get(primeFactor) ?? 0

      greatestPrimeFactors.set(primeFactor, Math.max(currentPrimeCount, count))
    })
  })

  let multipliedPrimeFactors = 1

  greatestPrimeFactors.forEach((primeCount, prime) => {
    multipliedPrimeFactors *= prime ** primeCount
  })

  console.log('greatestPrimeFactors', greatestPrimeFactors)
  console.log('lcm', multipliedPrimeFactors / 100)

  return multipliedPrimeFactors / 100
}
