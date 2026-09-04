# Equality Operators

## Overview

Equality operators determine whether two values are considered equivalent according to JavaScript comparison rules.
JavaScript provides two equality models: loose equality, which performs type coercion before comparison, and strict
equality, which compares without type coercion. The choice between these operators directly affects predictability
because JavaScript can represent the same logical value using different runtime types.

| Operator Type   | Operators    | Behavior                                 |
|:----------------|:-------------|:-----------------------------------------|
| Loose equality  | `==`, `!=`   | Performs type coercion before comparison |
| Strict equality | `===`, `!==` | Compares without type coercion           |

## Strict Equality (`===`)

**Strict Equality Operator (`===`):** Compares two operands using the Strict Equality Comparison algorithm. The operands
must have the same type and the same value to produce `true`. Strict equality does not perform string-to-number
conversion, Boolean conversion, or object-to-primitive conversion.

| Comparison                    | Result  |
|:------------------------------|:--------|
| Same primitive type and value | `true`  |
| Different primitive types     | `false` |
| Different object references   | `false` |
| Same object reference         | `true`  |

## Strict Inequality (`!==`)

**Strict Inequality Operator (`!==`):** Returns the opposite result of strict equality. It evaluates to `true` when
operands differ in type or value. Strict inequality follows the same rules as strict equality but reverses the Boolean
result.

## Loose Equality (`==`)

**Loose Equality Operator (`==`):** Compares values after applying JavaScript type coercion rules. The comparison
algorithm may convert one or both operands before determining equality.

| Comparison Type         | Conversion Behavior           |
|:------------------------|:------------------------------|
| String and Number       | String converted to Number    |
| Boolean and other value | Boolean converted to Number   |
| `null` and `undefined`  | Considered equal              |
| Object and primitive    | Object converted to primitive |

## Loose Inequality (`!=`)

**Loose Inequality Operator (`!=`):** Returns the opposite Boolean result of loose equality. It uses the same coercion
rules as `==`.

## Equality and Type Conversion

**Implicit Conversion:** Loose equality can trigger conversion before comparison, which can produce results that are
surprising when operand types are not controlled. The conversion process is defined by ECMAScript's Abstract Equality
Comparison algorithm.

| Expression Concept                  | Result                  |
|:------------------------------------|:------------------------|
| Numeric string compared with number | May evaluate as equal   |
| Empty string compared with zero     | May evaluate as equal   |
| Boolean compared with number        | Boolean converted first |

## `null` and `undefined`

**Nullish Equality:** JavaScript defines a special equality relationship between `null` and `undefined`. Strict equality
distinguishes them because they are different primitive types, whereas loose equality treats them as equivalent because
both represent missing values.

| Comparison           | Result  |
|:---------------------|:--------|
| `null == undefined`  | `true`  |
| `null === undefined` | `false` |

## Object Equality

**Object Identity Comparison:** Equality operators compare objects by reference identity, not by their contents. Two
objects containing identical properties are not equal unless they reference the same object. Structural comparison
requires explicit logic.

| Situation                                  | Result    |
|:-------------------------------------------|:----------|
| Same object reference                      | Equal     |
| Different objects with identical structure | Not equal |

## `NaN` Equality

**NaN Equality Behavior:** `NaN` is not equal to itself using either equality operator. Use `Number.isNaN()` for
reliable `NaN` detection.

| Comparison    | Result  |
|:--------------|:--------|
| `NaN === NaN` | `false` |
| `NaN == NaN`  | `false` |

## `Object.is()` Comparison

**Object.is Comparison:** Provides a SameValue comparison algorithm that differs from both strict equality and loose
equality. `Object.is()` is useful when these edge cases have semantic meaning.

| Values          |  `===`  | `Object.is()` |
|:----------------|:-------:|:-------------:|
| `NaN` and `NaN` | `false` |    `true`     |
| `0` and `-0`    | `true`  |    `false`    |

## Best Practices

* **Prefer strict equality (`===`) and strict inequality (`!==`) for application code:** Strict comparison avoids
  implicit conversions and makes type assumptions visible.
* **Use loose equality only when the coercion behavior is intentional:** Common intentional use cases include checking
  whether a value is either `null` or `undefined`.
* **Do not use equality operators for object content comparison:** Equality operators verify identity, not structure.
  Use explicit comparison logic or serialization strategies when comparing data structures.
* **Use `Object.is()` for special numeric cases:** When distinguishing `NaN`, `0`, and `-0` matters, `Object.is()`
  expresses the intended comparison semantics.