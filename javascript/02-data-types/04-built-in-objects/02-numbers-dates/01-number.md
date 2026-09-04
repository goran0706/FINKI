# Number

## Concept and ECMAScript Specification

The `Number` constructor is a wrapper object used to represent and manipulate numeric values. According to the ECMA-262
specification, numbers in JavaScript are double-precision 64-bit binary format IEEE 754 values. In addition to
representing floating-point numbers, the `Number` type includes three symbolic values: `+Infinity`, `-Infinity`, and
`NaN` ("Not-a-Number"). Calling `Number(value)` explicitly executes the internal `ToNumber` abstract operation to
convert an argument to a numeric primitive.

| Characteristic          | ECMAScript Specification Behavior                                                                      |
|:------------------------|:-------------------------------------------------------------------------------------------------------|
| Internal Representation | IEEE 754 double-precision 64-bit binary format (1 sign bit, 11 exponent bits, 52 fraction bits)        |
| Function Invocation     | `Number(value)` executes the `ToNumber` abstract operation and returns a number primitive              |
| Constructor Invocation  | `new Number(value)` allocates a new object instance with a `[[NumberData]]` internal slot              |
| Safe Integer Range      | Integers between $-(2^{53} - 1)$ and $2^{53} - 1$ can be accurately represented without precision loss |

## Static Properties and Constants

The `Number` constructor includes pre-defined static properties representing critical numerical boundaries, mathematical
limits, and sentinel values defined by the IEEE 754 standard.

| Static Property            | Specification Value / Meaning                                                                                              |
|:---------------------------|:---------------------------------------------------------------------------------------------------------------------------|
| `Number.MAX_VALUE`         | Largest positive finite number representable ($\approx 1.7976931348623157 \times 10^{308}$)                                |
| `Number.MIN_VALUE`         | Smallest positive non-zero value closest to zero ($\approx 5 \times 10^{-324}$)                                            |
| `Number.MAX_SAFE_INTEGER`  | Maximum integer that can be safely represented without rounding error ($2^{53} - 1$, or `9007199254740991`)                |
| `Number.MIN_SAFE_INTEGER`  | Minimum integer that can be safely represented without rounding error ($-(2^{53} - 1)$, or `-9007199254740991`)            |
| `Number.EPSILON`           | Difference between `1` and the smallest value greater than `1` representable ($\approx 2.220446049250313 \times 10^{-16}$) |
| `Number.NaN`               | Special "Not-a-Number" value corresponding to IEEE 754 quiet NaN                                                           |
| `Number.POSITIVE_INFINITY` | Positive infinity representation (`+Infinity`)                                                                             |
| `Number.NEGATIVE_INFINITY` | Negative infinity representation (`-Infinity`)                                                                             |

## Static and Instance Methods

ECMAScript provides robust static utility methods on `Number` for parsing and checking numerical bounds without the
implicit type coercion enforced by legacy global parsing utilities. Prototype methods format or serialize numerical
values.

| Method                                    | Specification Behavior                                                                                     |
|:------------------------------------------|:-----------------------------------------------------------------------------------------------------------|
| `Number.isFinite(value)`                  | Determines whether the passed value is a finite number without performing type coercion                    |
| `Number.isNaN(value)`                     | Determines whether the passed value is strictly `NaN` without performing type coercion                     |
| `Number.isInteger(value)`                 | Determines whether the value is a number and an integer value                                              |
| `Number.isSafeInteger(value)`             | Determines whether the value is an integer within the safe integer bounds                                  |
| `Number.parseFloat(string)`               | Parses a string argument and returns a floating-point number (equivalent to global `parseFloat`)           |
| `Number.parseInt(string, radix)`          | Parses a string argument and returns an integer of the specified radix (equivalent to global `parseInt`)   |
| `Number.prototype.toFixed(digits)`        | Formats a number using fixed-point notation with the specified number of digits after the decimal point    |
| `Number.prototype.toPrecision(precision)` | Returns a string representing the number to the specified precision in fixed-point or exponential notation |

## Use Cases

`Number` utilities and validation methods ensure precision and stability across numerical operations:

* **Floating-point equality comparisons:** Utilizing `Number.EPSILON` to perform safe precision checks on floating-point
  arithmetic calculations.
* **Safe input verification:** Checking incoming numeric IDs or counters using `Number.isSafeInteger()` before
  processing data.
* **Strict type checking:** Using `Number.isNaN()` instead of global `isNaN()` to check for invalid calculations without
  accidental type conversions.

## Best Practices

* **Avoid using new Number(value):** Use `Number(value)` as a function for type conversion; never instantiate `Number`
  object wrappers as they behave as truthy objects.
* **Prefer Number.isNaN over global isNaN:** Use `Number.isNaN()` because it does not coerce non-numeric inputs to
  numbers before checking for `NaN`.
* **Prefer Number.isFinite over global isFinite:** Use `Number.isFinite()` to ensure strictly non-coercive finite value
  checks.
* **Use `Number.EPSILON` for floating-point comparisons:** Compare floating-point results by verifying that their
  absolute difference is less than `Number.EPSILON`.
* **Validate large integers against MAX_SAFE_INTEGER:** Verify that integer values stay within `Number.MIN_SAFE_INTEGER`
  and `Number.MAX_SAFE_INTEGER` bounds, or transition to `BigInt` for arbitrary precision.
* **Use `BigInt` for precise financial or cryptographic computations:** Switch from standard double-precision floats to
  `BigInt` when absolute integer precision is mandatory beyond safe bounds.
* **Beware of precision loss in floating-point arithmetic:** Account for standard IEEE 754 rounding inaccuracies when
  performing repetitive addition or multiplication on decimals.
* **Prefer `Number.parseInt()` over global `parseInt()`:** Use static number methods to maintain consistent namespace
  hygiene and predictable function behavior.
* **Verify numeric strings explicitly before conversion:** Guard against unexpected `NaN` outputs by validating input
  string patterns using regular expressions before casting to numbers.
* **Handle division by zero safely:** Anticipate infinity results (`Infinity` or `-Infinity`) when dividing finite
  numbers by zero instead of assuming runtime errors will throw.
* **Format currencies using `Intl.NumberFormat`:** Avoid manual `toFixed()` string concatenation for currency output and
  rely on Internationalization APIs for locale-aware formatting.
* **Check for integer types before bitwise operations:** Ensure numbers are integers within valid 32-bit ranges when
  performing bitwise manipulation to avoid unexpected operand truncation.
* **Avoid strict equality checks on decimal calculations:** Always use a tolerance threshold or `Number.EPSILON` rather
  than `===` when checking decimal equality.
* **Sanitize external inputs for `NaN` propagation:** Check calculated metrics for `NaN` values before rendering user
  interfaces or persisting payloads to databases.
* **Understand radix behavior in parsing:** Always supply an explicit radix argument to `Number.parseInt()` when parsing
  numeric strings to prevent unintended octal or hexadecimal conversions.