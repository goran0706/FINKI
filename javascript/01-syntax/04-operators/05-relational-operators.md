# Relational Operators

## Overview

Relational operators compare the ordering relationship between two values. They determine whether one value is greater
than, less than, greater than or equal to, or less than or equal to. Relational comparisons always return a Boolean
value. The comparison behavior depends on the operand types. JavaScript may perform numeric conversion or string
comparison according to the ECMAScript relational comparison rules.

| Operator | Meaning                  |
|:---------|:-------------------------|
| `>`      | Greater than             |
| `<`      | Less than                |
| `>=`     | Greater than or equal to |
| `<=`     | Less than or equal to    |

## Numeric Relational Comparison

**Numeric Comparison:** When operands are not both strings, JavaScript attempts to convert them into numeric values
before performing the comparison. The comparison uses numeric ordering. If either operand becomes `NaN`, the relational
comparison result is `false`.

| Operand Example           | Conversion Behavior         |
|:--------------------------|:----------------------------|
| Number and Number         | Direct numeric comparison   |
| Numeric string and Number | String converted to Number  |
| Boolean and Number        | Boolean converted to Number |
| `null` and Number         | `null` converted to `0`     |
| `undefined`               | Converted to `NaN`          |

## String Relational Comparison

**String Comparison:** When both operands are strings, JavaScript compares them lexicographically using Unicode code
point ordering. The comparison does not use human language sorting rules. For example, uppercase and lowercase
characters may not follow expected alphabetical ordering because Unicode values determine ordering.

| Comparison Type       | Behavior                            |
|:----------------------|:------------------------------------|
| Two strings           | Unicode code point comparison       |
| String and non-string | Numeric comparison after conversion |

## Lexicographical Ordering

**Lexicographical Comparison:** Strings are compared character by character. The first differing character determines
the comparison result. If one string is a prefix of another, the shorter string is considered smaller. This behavior is
suitable for technical identifiers but not always suitable for user-facing text sorting.

## Equality Relationship

**Relational Equality:** The operators `>=` and `<=` combine ordering with equality. They return `true` when the
operands are equal according to relational comparison rules. They are not equivalent to combining strict equality with
greater-than or less-than checks because JavaScript applies its relational comparison algorithm.

## Objects in Relational Comparisons

**Object-to-Primitive Conversion:** When objects participate in relational comparison, JavaScript converts them into
primitive values before comparing. The conversion process uses `Symbol.toPrimitive`, `valueOf()`, and `toString()`. The
resulting primitive value determines whether numeric or string comparison occurs.

## `NaN` Behavior

**NaN Relational Behavior:** Comparisons involving `NaN` always return `false`. This behavior differs from normal
mathematical expectations because `NaN` represents an invalid numeric result.

| Expression Concept | Result  |
|:-------------------|:--------|
| `NaN > value`      | `false` |
| `NaN < value`      | `false` |
| `NaN >= value`     | `false` |
| `NaN <= value`     | `false` |

## BigInt Relational Comparison

**BigInt Comparison:** Relational operators support comparisons between `BigInt` values and other numeric values. Unlike
arithmetic operators, relational comparisons can compare `BigInt` and `Number` values. However, precision limitations
still apply to `Number` values outside the safe integer range.

## Sorting Considerations

**Sorting Numeric Data:** Relational operators are commonly used inside comparison functions for sorting. Numeric data
should be compared numerically rather than converted to strings, because string ordering follows lexicographical rules.

| Values           | String Ordering           |
|:-----------------|:--------------------------|
| `"10"` and `"2"` | `"10"` comes before `"2"` |

Numeric ordering produces the expected mathematical result.

## Best Practices

* **Do not rely on implicit conversion for business logic comparisons:** Explicit conversion makes input assumptions
  clear and prevents unexpected behavior from values such as empty strings or `null`.
* **Use locale-aware comparison for user-facing text:** Relational operators compare Unicode values, not
  language-specific alphabetical ordering.
* **Validate numeric input before comparison:** Values originating from APIs, forms, or external systems should be
  converted and validated before numeric comparison.
* **Be careful when mixing `BigInt` and `Number`:** Relational comparison is supported, but precision differences can
  produce incorrect assumptions when large numbers exceed the safe integer range of `Number`.