# Boolean

## Concept and ECMAScript Specification

The `Boolean` constructor represents a logical entity having two values: `true` and `false`. According to the ECMA-262
specification, `Boolean` can be invoked as a standard function to perform explicit type conversion or as a constructor
using the `new` operator to create a `Boolean` object wrapper. Calling `Boolean(value)` executes the internal
`ToBoolean` abstract operation on the supplied argument, coercing any ECMAScript language value to its primitive boolean
equivalent without creating an object instance.

| Characteristic         | ECMAScript Specification Behavior                                                           |
|:-----------------------|:--------------------------------------------------------------------------------------------|
| Function Invocation    | `Boolean(value)` invokes the `ToBoolean` abstract operation and returns a boolean primitive |
| Constructor Invocation | `new Boolean(value)` allocates a new ordinary object with a `[[BooleanData]]` internal slot |
| Prototype Inheritance  | `Boolean.prototype` inherits directly from `Object.prototype`                               |
| Coercion Target        | Used implicitly in conditional expressions, logical operators, and control flow statements  |

## ToBoolean Abstract Operation and Coercion Rules

The `ToBoolean` abstract operation converts any value to a primitive boolean based on defined specification rules.
ECMAScript classifies all values into truthy or falsy categories, where a tiny set of specific primitive values coerces
to `false` and all other objects and primitives coerce to `true`.

| Input Value Type    | ToBoolean Result                                                      |
|:--------------------|:----------------------------------------------------------------------|
| `Undefined`         | `false`                                                               |
| `Null`              | `false`                                                               |
| `Boolean`           | Returns the input boolean value unchanged                             |
| `Number`            | `false` if argument is `+0`, `-0`, or `NaN`; otherwise `true`         |
| `BigInt`            | `false` if argument is `0n`; otherwise `true`                         |
| `String`            | `false` if argument is empty string `""` (length 0); otherwise `true` |
| `Symbol` / `Object` | `true` for all objects, including wrappers like `new Boolean(false)`  |

## Instance Properties and Prototype Methods

Boolean wrapper instances store their underlying primitive state inside the `[[BooleanData]]` internal slot. Prototype
methods on `Boolean.prototype` extract or format this internal value when called on boolean primitives or object
instances.

| Method                         | Specification Behavior                                                          |
|:-------------------------------|:--------------------------------------------------------------------------------|
| `Boolean.prototype.toString()` | Converts the `[[BooleanData]]` internal value to `"true"` or `"false"`          |
| `Boolean.prototype.valueOf()`  | Returns the primitive boolean stored within the `[[BooleanData]]` internal slot |

## Use Cases

Explicit boolean conversions and predicate evaluations underpin decision-making and flow control in JavaScript
application execution:

* **Explicit truthiness conversion:** Converting arbitrary values to boolean primitives using double negation `!!value`
  or the `Boolean(value)` function.
* **Filtering array elements:** Passing `Boolean` directly as a callback to `Array.prototype.filter()` to remove all
  falsy entries from a collection.
* **Validating state conditions:** Evaluating logical conditions within branching expressions to enforce deterministic
  execution paths.

## Best Practices

* **Never use the Boolean constructor with new:** Avoid instantiating `new Boolean(value)` because object instances
  evaluate to truthy regardless of their underlying primitive boolean state.
* **Prefer Boolean function or double negation for type coercion:** Use explicit `Boolean(val)` or `!!val` to coerce
  values to primitives cleanly and predictably.
* **Avoid loose equality when testing boolean state:** Refrain from comparing values directly to booleans using `==` to
  prevent unintended implicit type coercion side effects.