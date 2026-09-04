/* eslint-disable react/prop-types */
import { useMemo } from "react";

function calculatePrimes(iterations, multiplier) {
  let primes = [];
  for (let i = 0; i < iterations; i++) {
    let isPrime = true;
    for (let j = 2; j < multiplier; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      primes.push(i);
    }
  }
  return primes;
}

function RenderPrimes({ iterations, multiplier }) {
  // cache the result of a calculation between re-renders.
  const primes = useMemo(
    () => calculatePrimes(iterations, multiplier),
    [iterations, multiplier]
  );
  return <div>Primes! {primes}</div>;
}

export default RenderPrimes;
