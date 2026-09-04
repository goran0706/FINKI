# Optional Chaining Operator (`?.`)

## Overview

The optional chaining operator (`?.`) provides safe access to properties, methods, and elements when a reference may be
`null` or `undefined`. Without optional chaining, accessing a property or calling a method on `null` or `undefined`
throws a `TypeError`. Optional chaining stops evaluation when a nullish value is encountered and returns `undefined`.
The operator checks only for `null` and `undefined`; it does not check for general falsy values (`false`, `0`, `""`,
`NaN`), which allow evaluation to continue normally.

## Syntax Forms

| Syntax                 | Purpose                           |
|:-----------------------|:----------------------------------|
| `object?.property`     | Optional property access          |
| `object?.[expression]` | Optional computed property access |
| `object?.method()`     | Optional method call              |
| `function?.()`         | Optional function invocation      |

## Optional Property Access

**Optional Property Access (`?.`):** Checks whether the value on the left side is `null` or `undefined` before
performing property access. If the value exists, normal property lookup rules apply; if the value is nullish, the
expression returns `undefined`. This pattern safely evaluates nested properties where any intermediate value may be
missing.

`user?.profile?.name`

## Optional Computed Property Access

**Optional Computed Access (`?.[]`):** Provides safe access when the property key is calculated dynamically. The
property expression is evaluated only if the object exists, preventing unnecessary computation when the chain stops
because the value is nullish.

`object?.[propertyName]`

## Optional Method Calls

**Optional Method Call (`?.()`):** Calls a method only when the reference exists, which is commonly used for optional
callbacks. The operator checks only whether the value is `null` or `undefined`—it does not check whether an existing
value is callable.

`callback?.()`

| Value              | Result              |
|:-------------------|:--------------------|
| `undefined`        | Returns `undefined` |
| Function           | Executes function   |
| Non-function value | Throws `TypeError`  |

## Optional Chaining Evaluation

**Short-Circuit Evaluation:** When an optional chain encounters `null` or `undefined`, remaining connected operations
are skipped, returning `undefined` and preventing runtime errors caused by missing references.

| Expression State                  | Result                   |
|:----------------------------------|:-------------------------|
| Object exists                     | Continue property access |
| Intermediate value is `null`      | Return `undefined`       |
| Intermediate value is `undefined` | Return `undefined`       |

## Continuous Chain Requirement

**Continuous Chain:** Optional chaining applies only to operations directly connected in the same chain. Breaking the
chain with grouping creates a new expression following normal JavaScript evaluation rules, where an intermediate
`undefined` value can still cause errors when accessed outside the optional chain.

## Optional Chaining With Arrays

**Array Access:** Optional chaining can safely access arrays that may not exist without raising an error. Optional
chaining does not validate array indexes, so accessing an unavailable index on an existing array still returns
`undefined` according to normal array behavior.

`response?.items?.[0]`

## Optional Chaining vs Logical AND (`&&`)

Before optional chaining was introduced, developers commonly used logical AND checks (such as
`object && object.property`). The behavior differs because `&&` evaluates general truthiness while `?.` checks strictly
for nullish values.

| Value       | `value && value.property` | `value?.property`   |
|:------------|:--------------------------|:--------------------|
| `null`      | Stops evaluation          | Returns `undefined` |
| `undefined` | Stops evaluation          | Returns `undefined` |
| `false`     | Stops evaluation          | Continues           |
| `0`         | Stops evaluation          | Continues           |
| `""`        | Stops evaluation          | Continues           |

## Optional Chaining With Nullish Coalescing

**Default Value Pattern:** Optional chaining (`?.`) is frequently combined with nullish coalescing (`??`) to retrieve
optional values safely while providing fallback values for missing data, preserving valid falsy values in the process.

`const name = user?.profile?.name ?? "Unknown";`

## Optional Chaining and Undeclared Variables

**Identifier Resolution:** Optional chaining cannot protect access to variables that do not exist, as the JavaScript
engine must resolve the variable identifier before optional chaining can be applied.

| Situation                             | Result                  |
|:--------------------------------------|:------------------------|
| Existing object with missing property | Returns `undefined`     |
| Existing object with null property    | Returns `undefined`     |
| Undeclared variable                   | Throws `ReferenceError` |

## Optional Chaining Limitations

**Read Access Only:** Optional chaining is designed for retrieving values and does not support write operations, meaning
assignment, increment, or decrement operations through `?.` are invalid syntax.

## Best Practices

* **Use optional chaining when missing values are expected:** It is appropriate for optional configuration, API
  responses, callbacks, and partially populated objects.
* **Do not use optional chaining to hide application errors:** If a value is required for correct execution, validate it
  explicitly instead of allowing missing values to propagate.
* **Combine `?.` with `??` for safe defaults:** Use optional chaining for access and nullish coalescing for replacement
  logic.
* **Avoid excessive optional chaining in business logic:** Very long chains can hide where invalid state originates and
  make debugging more difficult.
* **Validate external input separately:** Optional chaining prevents access errors but does not validate data shape,
  types, or business rules.