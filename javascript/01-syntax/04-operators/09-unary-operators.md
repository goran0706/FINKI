# Unary Operators

## Overview

Unary operators operate on a single operand. Unlike binary operators, which require two operands, unary operators
perform operations using only one value. Unary operators may return a new value without modifying the original operand,
or they may directly modify the referenced value depending on the operator.

| Category                | Operators  |
|:------------------------|:-----------|
| Arithmetic sign         | `+`, `-`   |
| Increment and decrement | `++`, `--` |
| Logical negation        | `!`        |
| Bitwise negation        | `~`        |
| Type inspection         | `typeof`   |
| Object removal          | `delete`   |
| Value conversion        | `void`     |

## Unary Plus (`+`)

**Unary Plus (`+`):** Converts its operand into a number using JavaScript's numeric conversion rules. It is commonly
used as a concise numeric conversion operation. The result is a number, not a string.

| Input       | Result |
|:------------|:-------|
| `"42"`      | `42`   |
| `true`      | `1`    |
| `false`     | `0`    |
| `null`      | `0`    |
| `undefined` | `NaN`  |
| `"abc"`     | `NaN`  |

```javascript
const value = +"42";
```

## Unary Minus (`-`)

**Unary Minus (`-`):** Converts the operand to a number and returns its negated value. Unary minus performs numeric
conversion before applying the sign.

```javascript
const value = -"42";
```

```javascript
-42
```

## Logical NOT (`!`)

**Logical NOT (`!`):** Converts the operand to a Boolean value and returns the opposite Boolean result. The operator
uses JavaScript truthiness rules. Using two logical NOT operators converts a value into an explicit Boolean (`!!value`),
performing Boolean conversion through negation twice.

| Value       | Boolean Conversion | Result of `!` |
|:------------|:-------------------|:--------------|
| `true`      | `true`             | `false`       |
| `false`     | `false`            | `true`        |
| `0`         | `false`            | `true`        |
| `""`        | `false`            | `true`        |
| `null`      | `false`            | `true`        |
| `undefined` | `false`            | `true`        |

## Bitwise NOT (`~`)

**Bitwise NOT (`~`):** Performs bitwise inversion by converting the operand to a 32-bit signed integer and flipping
every bit. Bitwise operators operate on 32-bit integer representations, even when the original value is a JavaScript
`Number`.

```javascript
~(x) === -(x + 1)
```

```javascript
~5
```

```javascript
-(5 + 1)
```

```javascript
-6
```

## `typeof` Operator

**Type Inspection (`typeof`):** Returns a string describing the type category of its operand. `typeof null` returning
`"object"` is a historical language behavior preserved for compatibility.

| Value     | Result        |
|:----------|:--------------|
| Number    | `"number"`    |
| String    | `"string"`    |
| Boolean   | `"boolean"`   |
| Object    | `"object"`    |
| Function  | `"function"`  |
| Undefined | `"undefined"` |
| Symbol    | `"symbol"`    |
| BigInt    | `"bigint"`    |

| Expression                  | Result        |
|:----------------------------|:--------------|
| `typeof null`               | `"object"`    |
| `typeof undeclaredVariable` | `"undefined"` |

## `delete` Operator

**Property Removal (`delete`):** Removes a property from an object. The operator returns a Boolean indicating whether
the deletion operation succeeded. `delete` removes object properties, not variables in normal lexical declarations.

```javascript
delete object.property;
```

| Situation                     | Result                           |
|:------------------------------|:---------------------------------|
| Configurable property removed | `true`                           |
| Non-configurable property     | `false` or throws in strict mode |

## `void` Operator

**Discarded Result (`void`):** Evaluates an expression and always returns `undefined`. The expression is executed, but
its resulting value is discarded. Common historical usage includes preventing `javascript:` URL navigation (
`javascript:void(0)`), though modern application code rarely requires this pattern.

```javascript
void expression
```

## Unary Operators and Type Conversion

**Implicit Conversion:** Several unary operators perform automatic type conversion. Understanding these conversions is
required because JavaScript allows operations between different primitive types.

| Operator | Conversion Behavior        |
|:---------|:---------------------------|
| `+`      | Converts to Number         |
| `-`      | Converts to Number         |
| `!`      | Converts to Boolean        |
| `~`      | Converts to 32-bit Integer |
| `typeof` | Returns type description   |
| `void`   | Returns `undefined`        |

## Unary Operators and Objects

**Object Conversion:** Unary operators applied to objects may trigger primitive conversion through JavaScript's coercion
mechanisms. Objects can define custom conversion behavior through `Symbol.toPrimitive`, `valueOf()`, and `toString()`.
The final result depends on the conversion process.

## Unary Operators and BigInt

**BigInt Restrictions:** Some unary operators have restrictions when used with BigInt values. The unary plus operator
cannot be applied to BigInt values because it would conflict with asm.js compatibility requirements, throwing a
`TypeError` (e.g., `+1n`). Other unary operations such as unary minus are supported where the operation is
mathematically defined.

## Best Practices

* **Use unary plus only for simple numeric conversion:** For complex parsing requirements, use explicit conversion
  functions such as `Number()` or validation logic.
* **Avoid using `!!` when readability is more important than brevity:** Explicit Boolean conversion can make intent
  clearer in complex code.
* **Do not use bitwise operators for general arithmetic:** Bitwise operations convert values to 32-bit integers and can
  lose precision for large numbers.
* **Use `typeof` for primitive checks and basic guards:** It is useful for distinguishing types but has known
  limitations such as `typeof null` returning `"object"`.
* **Avoid relying on implicit coercion in critical calculations:** Explicit conversions reduce ambiguity and prevent
  unexpected type transformations.
* **Use `delete` only when removing object properties intentionally:** Frequent deletion in performance-sensitive code
  can affect object optimization strategies in JavaScript engines.