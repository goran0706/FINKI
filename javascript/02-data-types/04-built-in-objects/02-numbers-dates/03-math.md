# Math

## Concept and ECMAScript Specification

The `Math` namespace object contains static mathematical constants and functions. According to the ECMA-262
specification, `Math` is a built-in object that is not a function object; it lacks a `[[Call]]` internal method and
cannot be invoked as a function or instantiated using the `new` operator. Attempting to invoke `Math()` or `new Math()`
throws a `TypeError`. All properties and methods on `Math` are static, and its internal `[[Prototype]]` slot points
directly to `Object.prototype`.

| Characteristic           | ECMAScript Specification Behavior                                                        |
|:-------------------------|:-----------------------------------------------------------------------------------------|
| Invocation Attempts      | Throws a `TypeError` when called as a function or constructor                            |
| Prototype Inheritance    | `Math` inherits directly from `Object.prototype`                                         |
| Internal Slot Properties | Non-constructor namespace object lacking `[[Call]]` and `[[Construct]]` slots            |
| Precision and Types      | Operates on standard 64-bit float `Number` primitives; does not accept `BigInt` operands |

## Mathematical Constants

The `Math` object exposes immutable static properties representing fundamental mathematical constants. These properties
are defined with descriptor flags `writable: false` and `configurable: false` to guarantee constancy across execution
contexts.

| Constant Property | Specification Value / Description                                                    |
|:------------------|:-------------------------------------------------------------------------------------|
| `Math.E`          | Euler's number, the base of natural logarithms ($\approx 2.718281828459045$)         |
| `Math.LN2`        | Natural logarithm of $2$ ($\approx 0.6931471805599453$)                              |
| `Math.LN10`       | Natural logarithm of $10$ ($\approx 2.302585092994046$)                              |
| `Math.LOG2E`      | Base-$2$ logarithm of $E$ ($\approx 1.4426950408889634$)                             |
| `Math.LOG10E`     | Base-$10$ logarithm of $E$ ($\approx 0.4342944819032518$)                            |
| `Math.PI`         | Ratio of the circumference of a circle to its diameter ($\approx 3.141592653589793$) |
| `Math.SQRT1_2`    | Square root of $1/2$ ($\approx 0.7071067811865476$)                                  |
| `Math.SQRT2`      | Square root of $2$ ($\approx 1.4142135623730951$)                                    |

## Static Mathematical Methods

`Math` methods provide floating-point rounding, logarithmic, trigonometric, and random number algorithms. Many `Math`
functions execute underlying hardware or C++ standard library floating-point routines directly.

| Method                     | Specification Behavior                                                               |
|:---------------------------|:-------------------------------------------------------------------------------------|
| `Math.abs(x)`              | Returns the absolute value of `x`                                                    |
| `Math.ceil(x)`             | Returns the smallest integer greater than or equal to `x`                            |
| `Math.floor(x)`            | Returns the largest integer less than or equal to `x`                                |
| `Math.trunc(x)`            | Returns the integer portion of `x` by removing fractional digits                     |
| `Math.round(x)`            | Returns the value of `x` rounded to the nearest integer                              |
| `Math.max(...args)`        | Returns the largest of zero or more numbers; returns `NaN` if any argument is `NaN`  |
| `Math.min(...args)`        | Returns the smallest of zero or more numbers; returns `NaN` if any argument is `NaN` |
| `Math.pow(base, exponent)` | Returns `base` raised to `exponent` (equivalent to `base ** exponent`)               |
| `Math.random()`            | Returns a pseudo-random floating-point number in the range $[0, 1)$                  |
| `Math.sqrt(x)`             | Returns the square root of `x`; returns `NaN` if `x` is negative                     |

## Use Cases

Static methods on `Math` serve critical computation roles across graphics, algorithms, and data processing:

* **Generating bounded random values:** Mapping the pseudo-random output of `Math.random()` to integer ranges for
  dynamic selection algorithms.
* **Truncating floating-point numbers:** Removing fractional component values deterministically using `Math.trunc()`
  instead of implicit string coercion.
* **Calculating geometric distances:** Computing Euclidean distances between multidimensional coordinates using
  `Math.hypot()`.

## Best Practices

* **Never attempt to instantiate Math:** Access constants and operations directly as static properties on `Math` without
  using the `new` operator.
* **Do not pass BigInt values to Math methods:** Convert `BigInt` values to standard numbers explicitly before calling
  `Math` methods, as passing `BigInt` directly throws a `TypeError`.
* **Avoid Math.random for cryptographic operations:** Use `crypto.getRandomValues()` instead of `Math.random()` when
  security or cryptographic unpredictability is required.
* **Prefer Math.trunc over bitwise operators for truncation:** Use `Math.trunc()` instead of bitwise OR `x | 0` to
  preserve readability and handle values exceeding 32-bit signed integer limits correctly.
* **Beware of negative zero results:** Keep in mind that operations like `Math.round(-0.1)` or negation can return
  negative zero (`-0`), requiring explicit checks if strict equality or formatting matters.
* **Understand rounding differences for negative numbers:** Differentiate between `Math.floor()` (rounds down toward
  negative infinity) and `Math.trunc()` (rounds toward zero) when processing negative floating-point values.
* **Spread array arguments carefully with `Math.max` and `Math.min`:** Avoid stack overflow or argument length limits
  when spreading massive arrays into `Math.max(...arr)` by chunking or using reduction loops instead.
* **Handle empty argument lists gracefully:** Provide explicit initial numbers or check array lengths before calling
  `Math.max()` or `Math.min()` with no arguments to prevent unexpected `-Infinity` or `Infinity` returns.
* **Use `Math.hypot()` for geometric distance calculations:** Prefer `Math.hypot(x, y)` over manual Pythagorean theorem
  implementations (`Math.sqrt(x*x + y*y)`) to prevent intermediate overflow or underflow precision loss.
* **Account for pseudo-random predictability:** Recognize that `Math.random()` uses a non-cryptographic pseudo-random
  number generator and should never be used for tokens, security keys, or randomized testing bounds.
* **Check for `NaN` propagation in calculations:** Validate that inputs to `Math` methods are finite numbers to prevent
  chained mathematical operations from silently evaluating to `NaN`.
* **Use `Math.fround()` for single-precision optimization:** Convert double-precision floats to 32-bit single-precision
  floats using `Math.fround()` when interfacing with WebGL buffers or optimizing memory usage.
* **Avoid manual rounding multiplication bugs:** Use precision formatting or scaling techniques when rounding decimals (
  e.g., currency) to mitigate standard floating-point representation inaccuracies.
* **Combine `Math.floor()` with `Math.random()` correctly for ranges:** Ensure random integer generation formulas
  between a minimum and maximum bound account for inclusive or exclusive limits properly.
* **Keep trigonometric angle units in radians:** Remember that `Math.sin()`, `Math.cos()`, and `Math.tan()` accept
  angles expressed in radians rather than degrees, requiring explicit conversion when necessary.