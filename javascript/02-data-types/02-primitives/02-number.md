# Numbers & IEEE-754 Arithmetic Architecture

* **Number Type:** A unified implementation representing both integers and floating-point fractional numbers as a
  standard double-precision float value.


* **Floating-Point Arithmetic & IEEE-754 Representation:** Every number is stored under the binary floating-point
  arithmetic standard (IEEE 754), which partitions 64 bits into three explicit computational segments:
    * **Sign Bit:** 1 bit determining positive (`0`) or negative (`1`) status.
    * **Exponent:** 11 bits handling fractional magnitude shifts.
    * **Mantissa (Fraction):** 52 bits tracking exact decimal precision.


* **Floating-Point Precision Problems:** Because fractions are parsed using base-2 (binary) fractions instead of
  base-10 (decimal), numbers like `0.1` and `0.2` cannot be represented with perfect precision. They resolve to
  repeating binary fractions that introduce rounding errors, leading to operations like `0.1 + 0.2 === 0.3` evaluating
  to `false` (resolving instead to `0.30000000000000004`).


* **NaN (Not-a-Number):** A structural property representing an invalid or mathematically impossible arithmetic
  operation result (such as `0 / 0` or attempting `Math.sqrt(-1)`).
    * *Type Category:* Under the specification rules, `typeof NaN` evaluates as `"number"`.


* **Infinity:** IEEE 754 numeric bounds representations indicating values overflowing maximum processing limits.
  Overflowing positive limits yields `Infinity`, while dropping beneath negative limits yields `-Infinity`. Divides by
  zero yield signed infinities (`1 / 0 -> Infinity`; `-1 / 0 -> -Infinity`).


* **Signed Zero (`-0` vs `+0`):** Because the IEEE 754 floating-point standard dedicates an explicit, isolated bit
  entirely to track mathematical sign status, JavaScript engines recognize both a positive zero (`+0`) and a distinct
  negative zero (`-0`).
    * *Comparison Anomalies:* Strict equality operators fail to distinguish them (`-0 === +0` returns `true`).
    * *Diagnostic Isolation:* To safely distinguish between the two, developers must use `Object.is(-0, +0)` (which
      correctly evaluates as `false`) or perform an arithmetic division operation that yields signed infinities (
      `1 / 0 -> Infinity` vs `1 / -0 -> -Infinity`).

## Numbers & IEEE-754 Architecture Examples

```javascript
// 1. Unified Number Type
let integerNum = 42;
let floatNum = 3.14;
console.log(typeof integerNum); // "number"
console.log(typeof floatNum);   // "number"


// 2. Floating-Point Precision Problems (Base-2 vs Base-10)
console.log(0.1 + 0.2);         // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false

// Solution: Use Number.EPSILON or .toFixed() for comparisons
console.log(Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON); // true


// 3. NaN (Not-a-Number)
let invalidCalc = 0 / 0;
let badSqrt = Math.sqrt(-1);
console.log(invalidCalc);       // NaN
console.log(typeof NaN);        // "number"
console.log(NaN === NaN);       // false (use Number.isNaN() instead)


// 4. Infinity and Overflow Bounds
let maxOverflow = 1e309;        // Exceeds max float bounds
console.log(maxOverflow);       // Infinity
console.log(1 / 0);             // Infinity
console.log(-1 / 0);            // -Infinity


// 5. Signed Zero (-0 vs +0)
let posZero = +0;
let negZero = -0;

console.log(posZero === negZero);         // true

// Diagnostic Isolation using Object.is()
console.log(Object.is(posZero, negZero)); // false

// Diagnostic Isolation using Division
console.log(1 / posZero);                 // Infinity
console.log(1 / negZero);                 // -Infinity
```