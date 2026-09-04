# BigInt

## Concept and ECMAScript Specification

The `BigInt` constructor provides a way to represent whole numbers larger than $2^{53} - 1$, which is the highest limit
the primitive `Number` type can reliably represent. According to the ECMA-262 specification, `BigInt` is a primitive
numeric type designed for arbitrary-precision integers. `BigInt` values cannot be instantiated using the `new` operator;
attempting to do so throws a `TypeError`. A `BigInt` primitive is created by appending `n` to the end of an integer
literal or by calling the `BigInt()` function without `new`.

| Characteristic          | ECMAScript Specification Behavior                                                                         |
|:------------------------|:----------------------------------------------------------------------------------------------------------|
| Function Invocation     | `BigInt(value)` converts the argument to a `BigInt` primitive via the `ToBigInt` abstract operation       |
| Constructor Invocation  | Throws a `TypeError` when called with `new`                                                               |
| Precision Range         | Arbitrary-precision integer capability constrained only by execution context memory limits                |
| Arithmetic Restrictions | Cannot be mixed directly with `Number` values in binary arithmetic operations without explicit conversion |

## Static Methods and Wrap Operations

The `BigInt` object provides static methods for wrapping `BigInt` values within explicit bit-width limits. These
operations are particularly useful when interfacing with low-level binary formats or matching fixed-width integer types
found in typed arrays and graphics APIs.

| Method                         | Specification Behavior                                                    |
|:-------------------------------|:--------------------------------------------------------------------------|
| `BigInt.asIntN(bits, bigint)`  | Clamps a `BigInt` value to a signed integer of the specified bit width    |
| `BigInt.asUintN(bits, bigint)` | Clamps a `BigInt` value to an unsigned integer of the specified bit width |

## Operations and Prototype Methods

`BigInt` supports standard binary arithmetic operators except for the unsigned right shift operator (`>>>`). Prototype
methods on `BigInt.prototype` format or convert the stored arbitrary-precision value.

| Method / Operator                          | Specification Behavior                                                                          |
|:-------------------------------------------|:------------------------------------------------------------------------------------------------|
| Arithmetic (`+`, `-`, `*`, `/`, `%`, `**`) | Performs arbitrary-precision integer calculations; division truncates toward zero               |
| Bitwise (`&`, `\|`, `^`, `~`, `<<`, `>>`)  | Performs bitwise operations using two's complement integer representations                      |
| `BigInt.prototype.toString(radix)`         | Returns a string representation of the `BigInt` value in the specified radix (defaults to `10`) |
| `BigInt.prototype.valueOf()`               | Returns the primitive `BigInt` value                                                            |

## Use Cases

`BigInt` primitives manage large integer values across complex data processing workflows:

* **High-precision timestamp tracking:** Handling nanosecond-accuracy system clocks or microsecond database timestamps
  without precision loss.
* **Large database identifier processing:** Storing and manipulating 64-bit primary keys (such as SQL `BIGINT` or UUID
  fields) accurately.
* **Cryptographic calculations:** Executing large integer mathematical computations required by security and encryption
  algorithms.

## Best Practices

* **Never attempt to call BigInt with new:** Invoke `BigInt(value)` directly as a function or use the literal `n` suffix
  to create `BigInt` values safely.
* **Do not mix BigInt and Number in arithmetic operations:** Coerce values explicitly to either `BigInt` or `Number`
  before performing binary arithmetic to avoid runtime `TypeError` exceptions.
* **Be cautious when coercing BigInt to Number:** Avoid converting large `BigInt` values to `Number` if the value
  exceeds `Number.MAX_SAFE_INTEGER`, as this causes truncation and precision loss.
* **Use JSON string serialization for BigInt values:** Implement explicit `toJSON` methods or custom replacer routines
  when calling `JSON.stringify()`, as native `BigInt` values do not serialize directly into standard JSON.
* **Avoid using unary plus with BigInt primitives:** Refrain from applying the unary plus operator (`+bigint`) to
  `BigInt` values, as it explicitly throws a `TypeError` rather than coercing them to numbers.
* **Use BigInt for fixed-width bit manipulation carefully:** Account for two's complement representation rules when
  applying bitwise operations or shift operators to negative `BigInt` values.
* **Leverage `BigInt.asIntN()` for overflow simulation:** Simulate standard integer overflows and wrapping behaviors
  found in low-level languages by passing computed results through `BigInt.asIntN()` or `BigInt.asUintN()`.
* **Be mindful of performance overhead in loops:** Recognize that frequent allocation and arithmetic computations
  involving arbitrary-precision `BigInt` values can incur higher CPU overhead than standard 64-bit `Number` primitives.
* **Check runtime environment support before usage:** Ensure targeted execution engines and older JavaScript runtimes
  support `BigInt` literals and constructors before deploying code into production bundles.
* **Handle division truncation correctly:** Keep in mind that division operations using `BigInt` (e.g., `5n / 2n`)
  automatically truncate fractional remainders toward zero, returning integer results.
* **Compare BigInt and Number values using loose equality cautiously:** Avoid unexpected conditional evaluations by
  casting values to a uniform type before executing comparison operators.
* **Cast user inputs safely before BigInt parsing:** Validate that incoming strings or numbers contain valid integer
  formats before passing them into the `BigInt()` constructor to prevent syntax exceptions.
* **Store cryptographic keys and hashes as BigInts:** Utilize `BigInt` structures to process large hexadecimal or binary
  hashes directly without splitting values across multiple standard number variables.
* **Avoid mixing BigInt with standard Math functions:** Cast `BigInt` values back to `Number` or use dedicated
  big-integer libraries when performing complex math routines, as global `Math` methods do not accept `BigInt`
  arguments.
* **Use explicit type checks for mixed collections:** Implement strict type guards using `typeof value === 'bigint'`
  when writing generic utility functions that accept both numbers and bigints.