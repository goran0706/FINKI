# `typeof` and `instanceof` Operators

## Overview

JavaScript provides the `typeof` and `instanceof` operators for runtime type inspection. Both operators answer questions
about values, but they operate at different levels: `typeof` identifies the primitive type category or callable nature
of a value, while `instanceof` checks whether an object exists in a constructor's prototype chain. `typeof` is primarily
used for primitive checks, whereas `instanceof` is used for object relationship checks.

## `typeof` Operator

**Type Inspection (`typeof`):** Returns a string representing the type category of its operand. The syntax is
`typeof value`, and the result is always a string.

## `typeof` Return Values

The possible results are:

| Value Type | Result        |
|:-----------|:--------------|
| Undefined  | `"undefined"` |
| Boolean    | `"boolean"`   |
| Number     | `"number"`    |
| BigInt     | `"bigint"`    |
| String     | `"string"`    |
| Symbol     | `"symbol"`    |
| Function   | `"function"`  |
| Object     | `"object"`    |

## Primitive Type Detection

**Primitive Checking:** `typeof` is reliable for most primitive values, such as numbers, strings, booleans, bigints,
symbols, and undefined.

| Expression         | Result        |
|:-------------------|:--------------|
| `typeof 42`        | `"number"`    |
| `typeof "text"`    | `"string"`    |
| `typeof true`      | `"boolean"`   |
| `typeof 10n`       | `"bigint"`    |
| `typeof Symbol()`  | `"symbol"`    |
| `typeof undefined` | `"undefined"` |

## The `typeof null` Behavior

**Historical Compatibility:** `typeof null` returns `"object"` even though `null` is a primitive value, a behavior
originating from early JavaScript implementations that cannot be changed because existing web applications depend on it.
Consequently, correct null checking requires an explicit comparison like `value === null`.

## Functions and `typeof`

**Callable Detection:** Functions return `"function"` even though functions are technically objects in JavaScript. This
special behavior exists because functions have callable behavior, though `typeof` does not distinguish between different
function types (such as normal functions, arrow functions, class constructors, async functions, or generator functions).

`typeof function () {}`

## Undeclared Variables

**Safe Identifier Check:** `typeof` can be used with undeclared variables without throwing a `ReferenceError`, returning
`"undefined"` specifically to allow safe existence checks where direct variable access would otherwise fail.

`typeof unknownVariable`

## `typeof` Limitations

**Type Category Limitations:** `typeof` does not provide complete object classification because arrays, plain objects,
dates, and regular expressions all return `"object"`, requiring additional checks for specific object types.

| Expression          | Result     |
|:--------------------|:-----------|
| `typeof []`         | `"object"` |
| `typeof {}`         | `"object"` |
| `typeof new Date()` | `"object"` |
| `typeof /regex/`    | `"object"` |

## `instanceof` Operator

**Prototype Chain Check (`instanceof`):** Determines whether an object's prototype chain contains the `prototype`
property of a constructor, returning a boolean (`true` if the prototype exists in the chain, `false` otherwise).

`object instanceof Constructor`

## `instanceof` Behavior

**Prototype Relationship:** `instanceof` does not check the object's constructor name directly; instead, it checks
whether `Constructor.prototype` appears anywhere in the object's prototype chain (
`object.__proto__ === Constructor.prototype` or higher).

## Primitive Values and `instanceof`

**Object Requirement:** Primitive values generally return `false` with `instanceof` (e.g., `5 instanceof Number` is
`false`), whereas primitive wrapper objects return `true` (e.g., `new Number(5) instanceof Number` is `true`).

## Arrays and `instanceof`

**Array Detection:** Arrays are objects whose prototype chain contains `Array.prototype`, so `[] instanceof Array`
evaluates to `true`, though arrays originating from different execution realms can cause unexpected results.

`[] instanceof Array`

## Cross-Realm Objects

**Realm Difference:** Objects created in different JavaScript environments (such as different browser windows, iframes,
or separate execution contexts) have different prototype chains, which can cause an array created in another realm to
fail a `value instanceof Array` check. For reliable cross-realm checks, use dedicated methods such as
`Array.isArray(value)`.

## Custom `instanceof` Behavior

**`Symbol.hasInstance`:** Constructors can customize `instanceof` behavior by defining `Symbol.hasInstance`, allowing
objects to override the default prototype chain inspection.

## `typeof` vs `instanceof`

| Feature                         | `typeof` | `instanceof` |
|:--------------------------------|:---------|:-------------|
| Checks primitive types          | Yes      | No           |
| Checks prototype chain          | No       | Yes          |
| Returns                         | String   | Boolean      |
| Works with undeclared variables | Yes      | No           |
| Identifies arrays               | No       | Yes          |
| Identifies custom classes       | No       | Yes          |

## Type Checking Patterns

**Primitive Validation:** Use `typeof` for primitive checks (e.g., `typeof value === "string"`,
`typeof value === "number"`).

**Object Classification:** Use more specific checks for objects:

| Requirement           | Recommended Check            |
|:----------------------|:-----------------------------|
| Null value            | `value === null`             |
| Array                 | `Array.isArray(value)`       |
| Date object           | `value instanceof Date`      |
| Custom class instance | `value instanceof ClassName` |

## Best Practices

* **Use `typeof` for Primitive Type Checks:** `typeof` is the standard tool for checking primitive categories such as
  strings, numbers, booleans, bigints, symbols, functions, and undefined.

* **Always Handle `null` Separately:** `typeof null` returns `"object"` due to historical JavaScript behavior. Use
  `value === null` when explicitly checking for null values.

* **Use `Number.isNaN()` for Numeric Validation:** `typeof value === "number"` only confirms that a value belongs to the
  number type. It does not exclude `NaN`, which is also classified as a number by JavaScript.

    ```javascript
    typeof NaN === "number"; // true
    Number.isNaN(NaN); // true
    ```

* **Do Not Use `typeof` as a Complete Object Type System:** `typeof` only identifies broad categories. Arrays, dates,
  regular expressions, maps, sets, and custom objects all return `"object"`.

* **Use `Array.isArray()` Instead of `instanceof Array` for General Array Detection:** `Array.isArray()` correctly
  identifies arrays across different JavaScript realms, including objects created inside iframes or separate execution
  contexts.

* **Use `instanceof` When Prototype Relationships Matter:** `instanceof` is appropriate when checking whether an object
  belongs to a specific class hierarchy or inherits from a particular constructor.

* **Do Not Use `instanceof` With Primitive Values:** Primitive values do not participate in prototype chains. Use
  `typeof` for primitive checks and `instanceof` only for objects.

* **Avoid Relying Only on Constructor Names:** Constructor names can be changed, overridden, or unavailable across
  execution contexts. Prototype relationships are more reliable because JavaScript inheritance is prototype-based.

* **Be Careful With Cross-Realm Objects:** Objects created in different environments may fail `instanceof` checks
  because they inherit from different prototype objects. Prefer built-in detection methods when cross-realm
  compatibility matters.

* **Prefer Feature Detection Over Type Assumptions:** When working with flexible APIs, check whether required
  capabilities exist instead of assuming a specific object type.

* **Use Custom `Symbol.hasInstance` Carefully:** Customizing `instanceof` behavior can be useful for advanced
  abstractions but may make type checks less predictable for other developers.