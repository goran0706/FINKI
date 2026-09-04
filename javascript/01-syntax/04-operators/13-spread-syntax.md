# Spread Syntax (`...`)

## Overview

Spread syntax (`...`) expands an iterable or object into individual elements or properties. Spread syntax is provided by
ECMAScript for specific expression contexts—it is not a standalone operator—and its behavior depends on where the syntax
is used. While it creates new containers, it does not perform deep cloning.

| Context            | Behavior                                            |
|:-------------------|:----------------------------------------------------|
| Function arguments | Expands iterable values into separate arguments     |
| Array literals     | Expands iterable values into array elements         |
| Object literals    | Expands enumerable own properties into a new object |

## Spread in Function Calls

**Argument Spread:** When used inside a function call, spread syntax expands an iterable (such as Arrays, Strings, Sets,
Maps, or custom iterables, though not ordinary objects) into individual function arguments.

`Math.max(...numbers)`

## Spread in Array Literals

**Array Spread:** When used inside an array literal, spread syntax inserts each iterable element into a new array that
has a brand-new identity.

`const copy = [...original];`

The elements inside the array follow normal assignment behavior:

| Element Type    | Result           |
|:----------------|:-----------------|
| Primitive value | Value copied     |
| Object          | Reference copied |
| Nested array    | Reference copied |

## Spread and Shallow Copying

**Shallow Copy:** Spread syntax copies only the first level of a structure. In an expression like
`const copy = { ...original };`, the outer object is new, but nested objects remain shared references because spread
syntax does not clone object graphs.

`const copy = { ...original };`

## Object Spread

**Object Spread:** Inside object literals, spread syntax copies enumerable own properties from source objects into a new
object using property enumeration rules rather than the iterable protocol. This distinction explains why `[...object]`
fails for normal objects, whereas `{...object}` works.

`const merged = { ...defaults, ...configuration };`

## Property Override Behavior

**Property Collision:** When multiple objects contain the same property key, later spread operations overwrite earlier
values, making this pattern common for configuration overrides.

| Source Order     | Result              |
|:-----------------|:--------------------|
| Earlier property | Replaced            |
| Later property   | Becomes final value |

## Property Copy Rules

**Enumerable Own Properties:** Object spread copies only enumerable properties directly owned by the source object. It
ignores prototype properties, non-enumerable properties, property descriptors, and class private fields, resulting in a
normal object containing copied property values.

## Spread and Property Descriptors

**Descriptor Loss:** Object spread copies property values rather than preserving original property descriptors,
producing normal writable properties instead of preserving custom flags or getters/setters.

| Descriptor               | Preserved |
|:-------------------------|:----------|
| Value                    | Yes       |
| Writable flag            | No        |
| Enumerable flag          | No        |
| Configurable flag        | No        |
| Getter/setter definition | No        |

## Spread vs `Object.assign()`

**Object Spread and `Object.assign()`:** Both perform shallow copying of enumerable own properties, but their mutation
behavior differs: use spread syntax when creating new values, and use `Object.assign()` when intentionally modifying an
existing target object.

| Feature                          | Spread Syntax | `Object.assign()`     |
|:---------------------------------|:--------------|:----------------------|
| Creates a new object             | Yes           | Only if target is new |
| Mutates existing object          | No            | Yes                   |
| Copies enumerable own properties | Yes           | Yes                   |
| Preserves prototype              | No            | No                    |
| Copies descriptors               | No            | No                    |
| Triggers target setters          | No            | Yes                   |

## Spread With Strings

**String Expansion:** Strings are iterable and can be expanded into individual string elements operating on Unicode code
points rather than user-perceived characters.

`[..."hello"]`

## Spread With Function Arguments

**Argument Expansion Limits:** Spreading very large collections into function calls can exceed engine argument limits,
so for large datasets, prefer APIs designed for bulk processing instead of converting large collections into individual
arguments.

## Spread and Immutability

**Immutable Update Pattern:** Spread syntax is frequently used in functional programming and state management to create
updated arrays and objects without mutating the original container, though container-level immutability does not
automatically provide immutability for nested objects.

## Best Practices

* **Do not use spread as a deep clone mechanism:** Spread only creates shallow copies. Nested objects, arrays, and
  references to remain shared.
* **Use spread for controlled immutable updates:** It is appropriate when modifying a known shallow level of application
  state.
* **Use structured cloning or specialized cloning strategies for deep copies:** Complex object graphs require dedicated
  solutions because spread cannot preserve independent nested state.
* **Understand enumerable property behavior before spreading objects:** Object spread ignores prototypes, non-enumerable
  properties, and descriptors.
* **Avoid spreading extremely large collections into function calls:** Large argument expansion can create memory
  pressure and exceed runtime limits.
* **Use spread intentionally when merging objects:** Later properties overwrite earlier properties, so object ordering
  directly affects the final result.