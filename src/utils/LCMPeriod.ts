// Limited by the highest frequency input being 10.0 (100)
const fixedPrimes = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 97, 101, 103,
]

// frequencies assumed to be float between 0 & 10 with a maximum 1 decimal place
export const LCMPeriod = (frequencies: number[]) => {
  console.log({ frequencies })
  const multipliedFrequencies = frequencies.map((frequency) => {
    return Math.trunc(frequency * 10)
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
  console.log('lcm', multipliedPrimeFactors / 10)

  return multipliedPrimeFactors / 10
}
