# Rest Syntax (`...`)

## Overview

Rest syntax (`...`) collects multiple elements into a single value. Although rest syntax uses the same three-dot
notation as spread syntax, the behavior is the opposite: spread expands values, while rest collects values. The exact
meaning is determined by the position where the syntax appears.

| Syntax Context           | Behavior                                   |
|:-------------------------|:-------------------------------------------|
| Function parameters      | Collects remaining arguments into an array |
| Destructuring assignment | Collects remaining elements or properties  |
| Array destructuring      | Collects remaining iterable values         |
| Object destructuring     | Collects remaining enumerable properties   |

## Rest Parameters

**Rest Parameters:** A function parameter prefixed with `...` collects all remaining arguments passed to the function
into a single array, replacing the older `arguments` object pattern when a real array is required.

`function sum(...numbers) {}`

## Rest Parameter Behavior

**Argument Collection:** Rest parameters collect arguments that are not matched by earlier parameters, and the rest
parameter must always be the final parameter in the function parameter list.

`function example(first, second, ...remaining) {}`

## Rest Parameter Restrictions

**Final Parameter Requirement:** A rest parameter must always appear at the end of the parameter list because JavaScript
needs an unambiguous point where remaining arguments begin.

`function example(...rest, value) {}`

## Rest Parameters vs `arguments`

**Arguments Object:** Functions traditionally exposed an array-like `arguments` object containing all received
arguments, but rest parameters provide a modern, explicit alternative preferred for new code.

| Feature                                  | Rest Parameter | `arguments` |
|:-----------------------------------------|:---------------|:------------|
| Real Array                               | Yes            | No          |
| Available in arrow functions             | Yes            | No          |
| Supports array methods directly          | Yes            | No          |
| Named parameters before remaining values | Yes            | No          |

## Rest in Array Destructuring

**Array Rest Pattern:** During destructuring, rest syntax collects remaining iterable elements into a new array
containing all values that were not assigned to earlier positions.

`const [first, ...remaining] = values;`

## Array Rest Behavior

**Remaining Element Collection:** Rest collection happens after previous destructuring positions are resolved, and the
rest element always receives an array. For instance, executing `const [a, b, ...rest] = [1, 2, 3, 4];` yields:

| Variable | Value    |
|:---------|:---------|
| `a`      | `1`      |
| `b`      | `2`      |
| `rest`   | `[3, 4]` |

## Rest in Object Destructuring

**Object Rest Pattern:** During object destructuring, rest collects remaining enumerable own properties that were not
already extracted into a new object container.

`const { id, ...details } = user;`

## Object Rest Behavior

**Property Exclusion:** Object rest removes properties already selected by the destructuring pattern and creates a
shallow copy of the remaining properties.

| Source Property                   | Included in Rest |
|:----------------------------------|:-----------------|
| Extracted property                | No               |
| Remaining enumerable own property | Yes              |
| Prototype property                | No               |
| Non-enumerable property           | No               |

## Rest and Shallow Copying

**Shallow Collection:** Rest syntax creates a new array or object container but does not clone nested values, meaning
the collected structure gets a new identity while nested references to remain connected.

| Value Type       | Result |
|:-----------------|:-------|
| Primitive        | Copied |
| Object reference | Shared |
| Nested array     | Shared |

## Rest With Default Values

**Destructuring Defaults:** Rest syntax can be combined with default values in destructuring patterns, applying default
values only when the extracted value is `undefined` (whereas `null` does not trigger a default).

## Rest Parameters and Function Design

**Variable Argument Functions:** Rest parameters are commonly used for functions that accept flexible numbers of
arguments—such as utility, aggregation, wrapper, or higher-order functions—allowing normal array processing methods.

## Rest and Function Wrappers

**Argument Forwarding:** Rest parameters are commonly combined with spread syntax when forwarding arguments; rest
collects incoming arguments and spread sends those collected values along in adapter or wrapper functions.

## Rest Syntax vs Spread Syntax

| Feature           | Rest Syntax               | Spread Syntax            |
|:------------------|:--------------------------|:-------------------------|
| Purpose           | Collect values            | Expand values            |
| Direction         | Many values → One value   | One value → Many values  |
| Creates container | Yes                       | Creates output container |
| Common locations  | Parameters, destructuring | Calls, literals          |

## Best Practices

* **Prefer rest parameters over `arguments`:** Rest parameters provide a real array, work with arrow functions, and make
  function intent explicit.
* **Use rest destructuring when only selected data should remain:** It is useful for removing known properties while
  keeping the remaining object data.
* **Remember that rest creates shallow copies:** Nested objects remain shared references and require separate cloning if
  independent state is required.
* **Avoid excessive use of object rest for large objects:** Object rest copies properties and creates a new object,
  which can introduce unnecessary allocations in performance-sensitive paths.
* **Use rest and spread together intentionally:** Rest collects data and spread forwards it. Confusing their direction
  can introduce unnecessary copying or incorrect argument handling.