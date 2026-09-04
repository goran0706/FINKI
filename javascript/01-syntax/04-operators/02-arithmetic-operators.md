# Arithmetic Operators

## Overview

Arithmetic operators perform mathematical operations on numeric values. JavaScript arithmetic is based on the `Number`
type, which uses IEEE 754 double-precision binary floating-point representation. This representation provides a wide
numeric range but cannot represent every decimal fraction exactly. Arithmetic operators may perform implicit type
conversion depending on operand types. The `+` operator has additional behavior because it performs both numeric
addition and string concatenation.

## Arithmetic Operator Reference

| Operator | Operation      |
|:---------|:---------------|
| `+`      | Addition       |
| `-`      | Subtraction    |
| `*`      | Multiplication |
| `/`      | Division       |
| `%`      | Remainder      |
| `**`     | Exponentiation |

## Addition Operator (`+`)

**Addition Operator (`+`):** Performs numeric addition when both operands are converted to numeric values. When string
conversion occurs, the operator performs string concatenation instead. The `+` operator is overloaded by JavaScript's
type coercion rules.

| Operand Types      | Behavior             |
|:-------------------|:---------------------|
| Number + Number    | Numeric addition     |
| String + Any value | String concatenation |
| Any value + String | String concatenation |

Because of this behavior, mixed-type arithmetic can produce unexpected results when implicit conversion is not
considered.

## Subtraction Operator (`-`)

**Subtraction Operator (`-`):** Converts operands to numeric values and calculates the difference between the left and
right operands. Unlike `+`, subtraction does not perform string concatenation. String operands are converted to numbers
when possible.

## Multiplication Operator (`*`)

**Multiplication Operator (`*`):** Converts operands to numeric values and returns the mathematical product. The result
follows JavaScript numeric conversion rules. Invalid numeric conversions produce `NaN`.

## Division Operator (`/`)

**Division Operator (`/`):** Divides the left operand by the right operand and returns the numeric result. JavaScript
does not throw an exception for division by zero.

| Operation             | Result      |
|:----------------------|:------------|
| Positive number / `0` | `Infinity`  |
| Negative number / `0` | `-Infinity` |
| `0` / `0`             | `NaN`       |

## Remainder Operator (`%`)

**Remainder Operator (`%`):** Returns the remainder produced after division of the left operand by the right operand.
The operator is commonly called modulo, but JavaScript implements remainder semantics. The result keeps the sign of the
dividend.

| Expression Concept | Behavior           |
|:-------------------|:-------------------|
| Positive dividend  | Positive remainder |
| Negative dividend  | Negative remainder |

For mathematical modulo behavior where a non-negative result is required, additional normalization logic is necessary.

## Exponentiation Operator (`**`)

**Exponentiation Operator (`**`):** Raises the left operand to the power of the right operand. The exponentiation
operator has higher precedence than multiplication, division, addition, and subtraction. The left operand must be
evaluated before the exponentiation operation, while the operator associates from right to left.

## Numeric Conversion During Arithmetic

**Numeric Coercion:** Most arithmetic operators automatically convert operands to numeric values before performing
calculations. Conversion follows JavaScript's abstract operations defined by ECMAScript.

| Value              | Numeric Conversion |
|:-------------------|:-------------------|
| `true`             | `1`                |
| `false`            | `0`                |
| `null`             | `0`                |
| `undefined`        | `NaN`              |
| Numeric string     | Number value       |
| Non-numeric string | `NaN`              |

Implicit conversion can hide data errors, especially when processing external input.

## Floating-Point Precision

**IEEE 754 Floating-Point Representation:** JavaScript `Number` values are represented using binary floating-point
arithmetic. Many decimal fractions cannot be represented exactly because their binary representation requires repeating
fractions. This affects calculations involving decimal precision. The issue is not JavaScript arithmetic capability but
the limitations of binary floating-point representation.

## Decimal Precision Handling

**Exact Decimal Calculations:** Do not use `Number` as a representation for exact decimal values such as currency
amounts, invoices, financial balances, or accounting calculations. The limitation is not arithmetic accuracy but decimal
representation. Store values as integers representing the smallest unit when possible, such as cents instead of dollars,
or use a decimal arithmetic implementation when fractional decimal operations are required.

## Arithmetic With `BigInt`

**BigInt Arithmetic:** JavaScript provides `BigInt` for integer calculations exceeding the safe integer range of
`Number`. `BigInt` supports arithmetic operations but cannot be mixed directly with `Number` values. Use `BigInt` when
integer precision beyond `Number.MAX_SAFE_INTEGER` is required.

| Type Combination    | Result     |
|:--------------------|:-----------|
| `BigInt` + `BigInt` | Supported  |
| `Number` + `Number` | Supported  |
| `BigInt` + `Number` | Type error |

## Arithmetic Edge Cases

### `NaN`

**Not-a-Number (`NaN`):** A numeric value representing an invalid or undefined mathematical result. `NaN` has special
comparison behavior: it is not equal to itself, and arithmetic operations involving `NaN` generally produce `NaN`. Use
`Number.isNaN()` for reliable detection.

### Infinity

**Infinity Values:** JavaScript represents values beyond numeric limits using positive and negative infinity. Infinity
participates in arithmetic operations according to mathematical rules defined by IEEE 754.

## Best Practices

* **Avoid Using Floating-Point Numbers for Exact Decimal Calculations:** JavaScript `Number` values cannot represent
  many decimal fractions exactly. Use integer representations (such as cents instead of dollars) or a decimal arithmetic
  implementation when exact decimal precision is required.
* **Avoid Relying on Implicit Numeric Conversion:** Most arithmetic operators automatically convert operands to numbers.
  Perform explicit conversion when processing external input to prevent unexpected results caused by strings, `null`,
  `undefined`, or invalid values.
* **Validate Values Before Arithmetic:** When arithmetic depends on external or user-provided data, verify that values
  are valid numbers before performing calculations. Invalid numeric conversions propagate `NaN` through most arithmetic
  operations.
* **Use `BigInt` Only for Large Integer Precision:** `BigInt` exists to represent integers beyond
  `Number.MAX_SAFE_INTEGER`. It is not a replacement for decimal arithmetic and cannot be mixed directly with `Number`
  values.
* **Handle Division by Zero Intentionally:** JavaScript does not throw an exception for division by zero. Be aware that
  the result is `Infinity`, `-Infinity`, or `NaN` depending on the operands.
* **Do Not Assume `%` Implements Mathematical Modulo:** The remainder operator preserves the sign of the dividend. When
  a non-negative modulo result is required, normalize the result explicitly.
* **Avoid Repeated Floating-Point Comparisons:** Direct equality comparisons between floating-point calculations may
  fail because of binary representation errors. Compare values using an acceptable tolerance when precision differences
  are expected.
* **Do Not Replace Arithmetic with Bitwise Operations:** Bitwise operators force 32-bit integer conversion and can
  silently truncate values outside the supported range. Use arithmetic operators unless bit-level manipulation is
  specifically required.
* **Prefer Readability to Clever Arithmetic Expressions:** Break complex calculations into meaningful intermediate
  variables rather than combining numerous arithmetic operations into a single expression.