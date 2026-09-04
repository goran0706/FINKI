# BigInt Architecture

* **BigInt Type:** A separate numeric primitive optimized to handle arbitrarily large integer values that break the safe
  tracking boundaries of standard `Number` allocations.


* **Creating BigInt Values:** Instantiated by appending a trailing `n` character suffix to any integer literal
  expression (`100n`), or passing numeric strings into the global constructor function `BigInt("9007199254740992")`.


* **BigInt Limitations:**
    * Cannot be intermixed with standard numbers during basic arithmetic operations; doing so throws an immediate
      `TypeError`.
    * Mathematical division operations truncate fractional structures and round down toward zero, completely dropping
      decimal remainder blocks (`5n / 2n === 2n`).
    * Cannot be used in functions that expect standard floats, such as the built-in `Math` object methods.

## Examples and Real-World Usage

```javascript
// 1. Creating BigInt Values
const largeLiteral = 9007199254740993n;
const largeConstructed = BigInt("9007199254740992000");

// 2. Limitation: Intermixing with Numbers Throws TypeError
const bigVal = 10n;
const normalVal = 5;
// console.log(bigVal + normalVal); // Throws TypeError: Cannot mix BigInt and other types

// Explicit conversion is required if mixing types
console.log(bigVal + BigInt(normalVal)); // 15n

// 3. Limitation: Division Truncates Decimals
console.log(5n / 2n); // 2n (fractional remainder is completely dropped)

// 4. Limitation: Incompatible with the Math Object
console.log(Math.sqrt(16n)); // Throws TypeError
```

## Financial Precision: Standard Number vs. BigInt Solution

### The Problem: Standard Number Precision Failure

Using standard floating-point numbers (`Number`) for financial balances leads to rounding errors and risks overflowing
`Number.MAX_SAFE_INTEGER` on large institutional accounts or global ledgers.

```javascript
// PROBLEM: Standard Number Floating-Point Inaccuracy
// Representing $90,071,992,547,409.91 in standard float notation
let accountBalance = 90071992547409.91;
let deposit = 0.10;

// Floating-point precision error accumulates silently
let newBalance = accountBalance + deposit;
console.log(newBalance);
// Output: 90071992547410.01 (Incorrect fractional calculation!)

// Furthermore, exceeding Number.MAX_SAFE_INTEGER causes total precision corruption
let massiveAccount = 9007199254740991; // MAX_SAFE_INTEGER
console.log(massiveAccount + 2);       // 9007199254740993 (Silently corrupts data)
```

### The Solution: BigInt with Smallest Currency Units

To eliminate rounding errors and bypass safe integer bounds, professional systems store currency as an integer in its
smallest unit (cents) utilizing `BigInt` for arbitrary-precision math.

```javascript
// SOLUTION: BigInt Arbitrary-Precision Ledger
// $90,071,992,547,409.91 stored as exact integer cents
let accountBalanceCents = 900719925474099100n;
let depositCents = 10n; // $0.10

// Safe arbitrary-precision addition with zero rounding errors
let newBalanceCents = accountBalanceCents + depositCents;
console.log(newBalanceCents);
// Output: 900719925474099110n (Exact mathematical precision preserved)

// Formatting back to standard currency representation
function formatCurrency(cents) {
    let dollars = cents / 100n;
    let remainder = cents % 100n;
    return `$${dollars}.${remainder.toString().padStart(2, '0')}`;
}

console.log(formatCurrency(newBalanceCents));
// Output: "$9007199254740991.10"
```
