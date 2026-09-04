# Comparison Operators

## Overview

Comparison operators evaluate relationships between values and return a Boolean result. JavaScript comparison behavior
depends on the operator used and whether type coercion is allowed. Comparison operators are commonly used in conditional
execution, validation logic, sorting operations, and control flow expressions.

| Category             | Purpose                                         |
|:---------------------|:------------------------------------------------|
| Equality operators   | Determine whether values are equal or different |
| Relational operators | Compare ordering relationships between values   |

## Comparison Operator Reference

| Operator | Category   | Description                      |
|:---------|:-----------|:---------------------------------|
| `==`     | Equality   | Loose equality comparison        |
| `!=`     | Equality   | Loose inequality comparison      |
| `===`    | Equality   | Strict equality comparison       |
| `!==`    | Equality   | Strict inequality comparison     |
| `>`      | Relational | Greater than comparison          |
| `<`      | Relational | Less than comparison             |
| `>=`     | Relational | Greater than or equal comparison |
| `<=`     | Relational | Less than or equal comparison    |

## Boolean Result

**Comparison Result:** All comparison operators produce a Boolean primitive value. The result represents whether the
comparison condition evaluates to true or false. Comparison operators do not modify their operands.

## Equality vs Relational Comparison

* **Equality Comparison:** Determines whether two values represent the same value according to JavaScript equality
  rules.
* **Relational Comparison:** Determines the ordering relationship between values.

These operations use different ECMAScript comparison algorithms. Equality focuses on identity or value equivalence.
Relational comparison focuses on ordering.

## Type Coercion

**Type Coercion:** JavaScript may automatically convert values during comparison depending on the operator. Loose
equality (`==`) performs type coercion before comparison. Strict equality (`===`) does not perform type coercion.
Relational operators may convert values to numbers or strings depending on operand types.

## Strict Equality Recommendation

**Strict Equality (`===`):** Compares both value and type without performing implicit conversion. Strict equality
provides predictable behavior because the comparison does not depend on coercion rules.

| Comparison                                | Result    |
|:------------------------------------------|:----------|
| Number vs Number with same value          | Equal     |
| String vs Number with same representation | Not equal |
| Boolean vs Number                         | Not equal |
| Object references pointing to same object | Equal     |

## Object Comparison

**Reference Equality:** Objects, arrays, and functions are compared by reference identity, not by their internal
contents. Two separate objects containing identical properties are not considered equal because they represent different
object identities. Objects are equal only when both operands reference the same object.

## Special Numeric Values

### `NaN`

**NaN Comparison Behavior:** `NaN` is not equal to any value, including itself. Use `Number.isNaN()` when checking for
`NaN`.

| Expression Concept | Result  |
|:-------------------|:--------|
| `NaN === NaN`      | `false` |
| `NaN == NaN`       | `false` |

### `-0` and `0`

**Zero Comparison Behavior:** JavaScript treats `-0` and `0` as equal in normal equality comparisons. Use `Object.is()`
when distinguishing `-0` from `0`.

| Comparison | Result |
|:-----------|:-------|
| `-0 === 0` | `true` |

## Relational Comparison

**Relational Operators:** Compare whether one value is greater, smaller, or equal in ordering.

| Operator | Meaning                        |
|:---------|:-------------------------------|
| `>`      | Left value is greater          |
| `<`      | Left value is smaller          |
| `>=`     | Left value is greater or equal |
| `<=`     | Left value is smaller or equal |

## String Relational Comparison

**String Comparison:** When both operands are strings, relational comparison uses lexicographical ordering based on
Unicode code points. The comparison is not based on locale-specific alphabetical rules. For human language sorting, use
locale-aware comparison mechanisms such as `Intl.Collator`.

## Numeric Relational Comparison

**Numeric Comparison:** When operands are not both strings, relational operators attempt numeric conversion. Values that
cannot be converted produce `false` comparisons because the result becomes `NaN`.

## Best Practices

* **Prefer Strict Equality (`===`) by Default:** Strict equality compares both value and type without performing
  implicit type coercion, making comparison behavior more predictable and easier to reason about.
* **Use Loose Equality (`==`) Only Intentionally:** Loose equality follows complex coercion rules defined by ECMAScript.
  Use it only when those coercion rules are explicitly desired and well understood.
* **Do Not Compare Objects by Their Contents Using Equality Operators:** Objects, arrays, and functions are compared by
  reference identity, not by their internal structure. Use explicit property comparisons or a dedicated deep comparison
  strategy when structural equality is required.
* **Use `Object.is()` for Edge Cases:** `Object.is()` correctly distinguishes `-0` from `0` and considers `NaN` equal to
  itself, making it appropriate for the few situations where JavaScript's standard equality semantics are insufficient.
* **Use `Number.isNaN()` to Detect `NaN`:** Since `NaN` is never equal to itself, avoid equality operators when checking
  for invalid numeric values.
* **Avoid Relying on Implicit Type Conversion in Comparisons:** Explicitly convert values to the expected type before
  comparison whenever data originates from user input, external APIs, or loosely typed sources.
* **Avoid Using Relational Operators with Mixed Types:** Although JavaScript performs automatic conversion, comparing
  different data types can produce results that are difficult to predict. Normalize operand types before performing
  relational comparisons.
* **Avoid Relying on String Relational Comparison for User-Facing Sorting:** String comparisons use Unicode code-point
  ordering rather than language-specific collation rules. Use `Intl.Collator` or locale-aware comparison methods for
  displaying sorted text.
* **Choose the Appropriate Comparison for the Data Being Compared:** Use numeric comparisons for numbers, string
  comparisons for text, reference comparisons for object identity, and explicit comparison logic when comparing complex
  data structures.