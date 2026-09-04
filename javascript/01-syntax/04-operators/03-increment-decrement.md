# Increment and Decrement Operators

## Overview

Increment and decrement operators modify a numeric value by increasing or decreasing it by one. The operators are unary
operators because they operate on a single operand. Increment and decrement operators are commonly used in iteration,
counters, and state transitions.

| Operator | Name      | Operation                      |
|:---------|:----------|:-------------------------------|
| `++`     | Increment | Adds `1` to the operand        |
| `--`     | Decrement | Subtracts `1` from the operand |

## Prefix Increment and Decrement

**Prefix Operators:** The operator is placed before the operand. The operand is modified first, and the resulting value
is returned from the expression. The returned expression value represents the updated state.

| Operator  | Behavior                                   |
|:----------|:-------------------------------------------|
| `++value` | Increment value, then return the new value |
| `--value` | Decrement value, then return the new value |

## Postfix Increment and Decrement

**Postfix Operators:** The operator is placed after the operand. The current value is returned first, then the operand
is modified. The difference between prefix and postfix operators only affects the value produced by the expression. The
final stored value is the same after the operation completes.

| Operator  | Behavior                             |
|:----------|:-------------------------------------|
| `value++` | Return current value, then increment |
| `value--` | Return current value, then decrement |

## Numeric Conversion Behavior

**Increment and Decrement Conversion:** Before modification, the operand is converted to a numeric value using
JavaScript numeric conversion rules. This means these operators can operate on values that are not already numbers.
Values that cannot be converted to numbers produce `NaN`.

| Original Value | Numeric Result                          |
|:---------------|:----------------------------------------|
| Numeric string | Converted to number                     |
| Boolean        | `true` becomes `1`, `false` becomes `0` |
| `null`         | Converted to `0`                        |
| `undefined`    | Converted to `NaN`                      |

## Assignment Behavior

**Assignment Requirement:** Increment and decrement operators require a valid assignment target because they modify the
existing value. They cannot be applied to immutable values or non-reference expressions.

Valid targets include:

- Variables.
- Object properties.
- Array elements.

## Interaction With `const`

**Immutable Bindings:** Variables declared with `const` cannot be incremented or decremented because the binding cannot
be reassigned. The restriction applies to the binding, not necessarily to the internal state of referenced objects.

## Incrementing Object Properties

**Property Mutation:** Object properties can be incremented because the property reference can be updated. The object
itself remains the same identity while the property value changes.

## Side Effects

**Expression Side Effects:** Increment and decrement operators both modify state and return a value, which means they
can create side effects inside larger expressions. Combining them with other operations can reduce readability because
the expression result depends on evaluation order.

## Loop Usage

**Iteration Counters:** Increment operators are commonly used for numeric counters in loops because they provide concise
state updates.

* Modern JavaScript often uses higher-level iteration methods such as `for...of`, array iteration methods, or collection
  APIs when direct index manipulation is unnecessary.

## Prefix vs Postfix Performance

**Runtime Performance:** Modern JavaScript engines generally optimize prefix and postfix forms effectively when the
returned value is not used.

* The distinction is primarily semantic rather than a performance concern.
* Choose the form that communicates the intended behavior.

## Best Practices

* **Avoid complex expressions containing increment or decrement operations:** Combining mutation with additional
  calculations makes evaluation order harder to reason about and increases maintenance risk.
* **Prefer prefix operators when the updated value is required immediately:** Prefix form clearly communicates that the
  operation occurs before the value is consumed.
* **Use explicit arithmetic when mutation behavior is unclear:** Expressions such as `value += 1` can be easier to
  understand when the increment operation is part of broader state manipulation.
* **Avoid using increment operators for non-numeric state changes:** Although JavaScript performs conversion, relying on
  implicit conversion can hide invalid data and produce `NaN` unexpectedly.