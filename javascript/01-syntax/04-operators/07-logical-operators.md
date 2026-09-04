# Logical Operators

## Overview

Logical operators evaluate expressions using JavaScript truthiness rules and control conditional evaluation through
short-circuit behavior.

JavaScript provides three logical operators:

| Operator | Name        | Purpose                                              |
|:---------|:------------|:-----------------------------------------------------|
| `&&`     | Logical AND | Evaluates whether all required conditions are truthy |
| `\|\|`   | Logical OR  | Selects the first truthy value                       |
| `!`      | Logical NOT | Inverts truthiness                                   |

Unlike many languages where logical operators always return Boolean values, JavaScript logical operators return one of
their operand values.

## Truthiness Evaluation

**Truthiness:** JavaScript converts values to Boolean equivalents when evaluating logical conditions.

The following values are always falsy:

| Value       |
|:------------|
| `false`     |
| `0`         |
| `-0`        |
| `0n`        |
| `""`        |
| `null`      |
| `undefined` |
| `NaN`       |

All other JavaScript values are truthy, including:

| Value              |
|:-------------------|
| Empty objects `{}` |
| Empty arrays `[]`  |
| Functions          |
| Non-empty strings  |

## Logical AND (`&&`)

**Logical AND Operator (`&&`):** Evaluates operands from left to right and returns the first falsy operand. If all
operands are truthy, it returns the final operand.

The operator does not convert the result into a Boolean.

| Evaluation           | Result                             |
|:---------------------|:-----------------------------------|
| First operand falsy  | Returns first operand              |
| First operand truthy | Evaluates and returns next operand |
| All operands truthy  | Returns final operand              |

## Logical OR (`||`)

**Logical OR Operator (`||`):** Evaluates operands from left to right and returns the first truthy operand. If all
operands are falsy, it returns the final operand.

| Evaluation           | Result                 |
|:---------------------|:-----------------------|
| First operand truthy | Returns first operand  |
| First operand falsy  | Evaluates next operand |
| All operands falsy   | Returns final operand  |

`||` is commonly used for fallback values, but it treats every falsy value as missing.

This means valid values such as:

- `0`
- `false`
- `""`

will trigger the fallback.

## Logical NOT (`!`)

**Logical NOT Operator (`!`):** Converts its operand to a Boolean value and returns the opposite Boolean result.

The conversion process follows JavaScript truthiness rules.

| Operand      | Result  |
|:-------------|:--------|
| Truthy value | `false` |
| Falsy value  | `true`  |

## Double NOT (`!!`)

**Boolean Conversion Pattern (`!!`):** Applying the NOT operator twice converts any value into its Boolean equivalent.

The first `!` performs truthiness conversion and inversion.

The second `!` reverses the inversion, leaving only the Boolean representation.

This pattern is a shorthand for explicit Boolean conversion.

## Short-Circuit Evaluation

**Short-Circuit Evaluation:** Logical operators stop evaluating as soon as the final result is determined.

This behavior affects:

- Performance.
- Side effects.
- Function execution.
- Conditional initialization.

| Operator | Stops When              |
|:---------|:------------------------|
| `&&`     | A falsy value is found  |
| `\|\|`   | A truthy value is found |

Expressions after the stopping point are not evaluated.

## Logical Operators and Returned Values

**Operand Return Behavior:** JavaScript returns the actual operand value instead of a converted Boolean.

This allows logical operators to act as value selection mechanisms.

| Operator   | Returns                      |
|:-----------|:-----------------------------|
| `a && b`   | `a` if falsy, otherwise `b`  |
| `a \|\| b` | `a` if truthy, otherwise `b` |

This behavior is heavily used in JavaScript application patterns.

## Logical Assignment Relationship

Logical operators have corresponding assignment forms:

| Operator | Assignment Form |
|:---------|:----------------|
| `&&`     | `&&=`           |
| `\|\|`   | `\|\|=`         |

Logical assignment preserves the same short-circuit behavior while assigning the result back to the target.

## `||` vs `??`

**Nullish Coalescing Difference:** The `||` operator uses truthiness, while `??` only considers `null` and `undefined`
as missing values.

| Value       | `value \|\| fallback` | `value ?? fallback` |
|:------------|:----------------------|:--------------------|
| `0`         | Uses fallback         | Keeps `0`           |
| `false`     | Uses fallback         | Keeps `false`       |
| `""`        | Uses fallback         | Keeps `""`          |
| `null`      | Uses fallback         | Uses fallback       |
| `undefined` | Uses fallback         | Uses fallback       |

Use `??` when falsy values are valid application data.

## Best Practices

* **Avoid using `||` for default values when falsy values are meaningful:** Configuration values, counters, feature
  flags, and user input often contain valid falsy values such as `0` or `false`.

* **Use `??` when handling missing values:** Nullish coalescing expresses the intent that only absent values should
  trigger fallback behavior.

* **Avoid relying on short-circuit evaluation for complex side effects:** Although JavaScript guarantees evaluation
  order, embedding mutations or function calls inside logical expressions can reduce readability.

* **Use logical operators for value selection only when the behavior is obvious:** Returning operands instead of
  Booleans is powerful but can make code harder to understand when used excessively.
