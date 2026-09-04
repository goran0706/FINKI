# Advanced Conditions

## Truthy and Falsy Evaluation

**Truthy and Falsy Evaluation:** JavaScript's automatic conversion of values into Boolean equivalents when a Boolean
context requires a true or false decision. JavaScript does not require conditions to contain explicit Boolean values
because any value can be evaluated as either truthy or falsy across common Boolean contexts:

| Context                 | Example            |
|:------------------------|:-------------------|
| Conditional statements  | `if` conditions    |
| Logical operators       | `&&`, `\|\|`, `!`  |
| Conditional expressions | Ternary operator   |
| Loop conditions         | `while` conditions |

## Falsy Values

**Falsy Values:** Values that convert to `false` when evaluated in a Boolean context. All other values are truthy.
JavaScript has a fixed set of falsy values:

| Value       | Type      |
|:------------|:----------|
| `false`     | Boolean   |
| `0`         | Number    |
| `-0`        | Number    |
| `0n`        | BigInt    |
| `""`        | String    |
| `null`      | Null      |
| `undefined` | Undefined |
| `NaN`       | Number    |

## Truthy Values

**Truthy Values:** Values that convert to `true` when evaluated in a Boolean context. Empty objects and empty arrays are
also truthy, which differs from some other languages where empty collections may evaluate as false.

| Value             | Reason                                     |
|:------------------|:-------------------------------------------|
| Non-empty strings | Contains characters                        |
| Non-zero numbers  | Represents a numeric value                 |
| Objects           | All objects are truthy                     |
| Arrays            | Arrays are objects and therefore truthy    |
| Functions         | Functions are objects and therefore truthy |

## Boolean Conversion

**Boolean Conversion:** The process of converting any JavaScript value into a Boolean result. Explicit conversion can be
performed with the `Boolean()` function, while implicit conversion occurs automatically in conditional contexts. The
conversion rules are identical:

| Input           | Boolean Result |
|:----------------|:---------------|
| Falsy value     | `false`        |
| Any other value | `true`         |

## Common Truthiness Mistakes

**Empty Collections:** Empty arrays and objects are truthy, meaning checking whether a collection contains data requires
checking its size or properties instead of relying on Boolean conversion.

| Expression    | Result |
|:--------------|:-------|
| `Boolean([])` | `true` |
| `Boolean({})` | `true` |

**Numeric Validation:** Zero is falsy. A condition that checks only truthiness cannot distinguish between a valid zero
and a missing value, requiring explicit comparisons when zero is valid.

| Value       | Meaning             |
|:------------|:--------------------|
| `0`         | Valid numeric value |
| `null`      | Missing value       |
| `undefined` | Missing value       |

## Short-Circuit Evaluation

**Short-Circuit Evaluation:** A logical operator behavior where JavaScript stops evaluating an expression once the final
result is already determined. The skipped expression is never evaluated.

| Operator | Stops Evaluation When                     |
|:---------|:------------------------------------------|
| `&&`     | Left operand is falsy                     |
| `\|\|`   | Left operand is truthy                    |
| `??`     | Left operand is not `null` or `undefined` |

## Logical AND (`&&`)

**Logical AND Short-Circuiting:** The `&&` operator evaluates operands from left to right and stops when it encounters
the first falsy value. The operator returns one of its operands, not necessarily a Boolean value.

| Left Operand | Result                              |
|:-------------|:------------------------------------|
| Falsy        | Returns left operand                |
| Truthy       | Evaluates and returns right operand |

## Logical OR (`||`)

**Logical OR Short-Circuiting:** The `||` operator evaluates operands from left to right and stops when it encounters
the first truthy value. Historically, `||` has been used for fallback values, but it treats all falsy values as missing.

| Left Operand | Result                              |
|:-------------|:------------------------------------|
| Truthy       | Returns left operand                |
| Falsy        | Evaluates and returns right operand |

## Nullish Coalescing (`??`)

**Nullish Coalescing:** A fallback operator that only considers `null` and `undefined` as missing values, preserving
valid falsy values unlike `||`:

| Left Operand    | Result                |
|:----------------|:----------------------|
| `null`          | Returns right operand |
| `undefined`     | Returns right operand |
| Any other value | Returns left operand  |

| Value       | `value \|\| fallback` | `value ?? fallback` |
|:------------|:----------------------|:--------------------|
| `0`         | Uses fallback         | Uses `0`            |
| `false`     | Uses fallback         | Uses `false`        |
| `""`        | Uses fallback         | Uses `""`           |
| `null`      | Uses fallback         | Uses fallback       |
| `undefined` | Uses fallback         | Uses fallback       |

## Short-Circuiting and Side Effects

**Conditional Execution:** Short-circuit operators can control whether expressions execute. Expressions with side
effects should be used carefully because short-circuiting determines whether those effects occur.

| Use Case            | Description                            |
|:--------------------|:---------------------------------------|
| Guard conditions    | Execute only when a requirement is met |
| Default values      | Provide fallback values                |
| Optional operations | Avoid accessing unavailable data       |

## Best Practices

* **Use `??` when handling missing values:** If values such as `0`, `false`, or empty strings are valid data, `??`
  prevents accidental replacement.
* **Use `||` only when all falsy values should trigger fallback behavior:** Logical OR treats every falsy value as
  missing.
* **Do not use truthiness checks for values where zero or empty strings are meaningful:** Explicit comparisons avoid
  confusing valid data with absent data.
* **Use short-circuit evaluation for simple conditional execution:** Complex expressions with multiple side effects
  become difficult to reason about.
* **Check collections explicitly:** Arrays and objects are always truthy, so validate their contents using length, size,
  or property checks instead of Boolean conversion.