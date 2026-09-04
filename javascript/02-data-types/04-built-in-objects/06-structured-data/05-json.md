# JSON

## Concept and ECMAScript Specification

The `JSON` namespace object contains static methods for parsing values encoded in JavaScript Object Notation (JSON) and
converting values into JSON strings. According to the ECMA-262 specification, `JSON` is a built-in global namespace
object—similar to `Math` or `Atomics`—and is not a constructor function. It lacks a `[[Call]]` internal method and
cannot be invoked or instantiated using `new`; attempting to do so throws a `TypeError`.

The JSON data interchange format implemented by ECMAScript adheres to the IETF RFC 8259 specification. Valid JSON
structures are strictly limited to six primary primitive/composite types: objects, arrays, strings, numbers, booleans,
and `null`.

| Characteristic          | ECMAScript Specification Behavior                                               |
|:------------------------|:--------------------------------------------------------------------------------|
| Invocation Attempts     | Throws a `TypeError` when called as a function or constructor                   |
| Prototype Inheritance   | `JSON` inherits directly from `Object.prototype`                                |
| Valid Data Types        | `Object`, `Array`, `String`, `Number`, `Boolean`, `Null`                        |
| Serialization Omissions | `undefined`, `Symbol`, and `Function` values are omitted or converted to `null` |
| Cyclic References       | Throws a `TypeError` when serializing structures with circular references       |

## Static Utility Methods

The `JSON` namespace object provides two primary static methods for parsing and stringifying data structures, alongside
a string tag property.

| Method / Property                              | Category             | Specification Behavior                                                                                   |
|:-----------------------------------------------|:---------------------|:---------------------------------------------------------------------------------------------------------|
| `JSON.parse(text [, reviver])`                 | Parsing Method       | Constructs ECMAScript values/objects described by a JSON string, applying an optional transform function |
| `JSON.stringify(value [, replacer [, space]])` | Serialization Method | Converts an ECMAScript value into a valid JSON formatted string                                          |
| `JSON[Symbol.toStringTag]`                     | Tag Property         | Evaluates to `"JSON"`, used by `Object.prototype.toString()`                                             |

## Reviver and Replacer Parameter Signature

Both primary methods accept functional transformation arguments to customize parsing or serialization behaviors
dynamically.

| Parameter  | Method           | Parameter Type                    | Specification Behavior                                                                 |
|:-----------|:-----------------|:----------------------------------|:---------------------------------------------------------------------------------------|
| `reviver`  | `JSON.parse`     | `Function(key, value)`            | Invoked for every parsed key-value pair; returning `undefined` deletes the property    |
| `replacer` | `JSON.stringify` | `Function(key, value)` or `Array` | Function filters/transforms values; Array acts as an explicit whitelist of object keys |
| `space`    | `JSON.stringify` | `Number` or `String`              | Indents output using specified count of spaces (up to 10) or string characters         |

## Special Serialization Behavior and `toJSON()`

When `JSON.stringify()` encounters an object, it checks if that object possesses a `toJSON()` method. If present,
`JSON.stringify()` calls `toJSON(key)` and serializes the returned value instead of the original object. Built-in types
like `Date` implement `Date.prototype.toJSON()`, returning an ISO 8601 string representation.

| Data Type / Value                                     | `JSON.stringify()` Result                      |
|:------------------------------------------------------|:-----------------------------------------------|
| `undefined`, `Function`, `Symbol` (Object properties) | Omitted from generated object string           |
| `undefined`, `Function`, `Symbol` (Array elements)    | Converted to `"null"` inside array string      |
| `undefined`, `Function`, `Symbol` (Standalone values) | Returns `undefined`                            |
| `NaN`, `Infinity`, `-Infinity`                        | Converted to `"null"`                          |
| Object with `toJSON()` method                         | Returns serialized result of `object.toJSON()` |

## Use Cases

`JSON` static methods handle data interchange and state serialization across application layers:

* **API Payload Exchange:** Deserializing HTTP response text via `JSON.parse()` and encoding client payloads via
  `JSON.stringify()`.
* **Deep Cloning Simple Structures:** Performing structured shallow/deep cloning of plain objects and arrays that do not
  contain functions, symbols, or circular references.
* **Custom Date and Type Reconstruction:** Using `reviver` functions during `JSON.parse()` to automatically convert ISO
  date strings back into native `Date` instances.

## Best Practices

* **Never attempt to instantiate JSON:** Access methods directly as static properties on `JSON` without `new`.
* **Wrap JSON.parse in try...catch blocks:** Parse operations throw a `SyntaxError` when receiving malformed JSON
  strings; always handle potential parsing failures gracefully.
* **Implement toJSON for custom classes:** Define a `.toJSON()` method on domain objects that contain non-serializable
  fields or circular structures to return a clean, serializable object representation.
* **Use structuredClone for deep copies:** Avoid using `JSON.parse(JSON.stringify(obj))` for deep cloning objects when
  `structuredClone()` is available, as JSON serialization loses type information (`Date`, `RegExp`, `Map`, `Set`,
  `TypedArray`).
* **Handle circular reference exceptions:** Guard serialization calls with error handling or validation when serializing
  complex, deeply nested user objects to prevent unhandled `TypeError` crashes.
* **Use reviver functions to restore typed objects:** Reconstruct specialized types like `Date` or custom class
  instances on the fly by inspecting keys and values during `JSON.parse(text, reviver)`.
* **Whitelist object keys with replacer arrays:** Pass an array of strings as the `replacer` argument in
  `JSON.stringify()` to select specific object properties for serialization cleanly.
* **Limit indentation spacing for readable logs:** Specify numeric space arguments (between 1 and 10) when calling
  `JSON.stringify(obj, null, 2)` to format debug outputs and configuration files nicely.
* **Be aware of numeric precision limits:** Keep in mind that extremely large integers or high-precision floats may lose
  precision during JSON parsing and serialization roundtrips.
* **Avoid serializing non-plain objects blindly:** Inspect class instances before serialization to ensure that inherited
  properties or internal states are not omitted unexpectedly by `JSON.stringify()`.
* **Sanitize external inputs before parsing:** Ensure that untrusted strings passed into `JSON.parse()` originate from
  verified schemas to protect against injection or malformed data attacks.
* **Cache parsed JSON results for performance:** Store heavy parsed JSON payloads in local variables or caches when
  repeatedly accessing identical data structures within high-frequency functions.
* **Understand `undefined` array behavior:** Remember that array elements containing `undefined` or functions serialize
  as `null`, which can distort array lengths and indices upon deserialization.
* **Prefer native JSON methods over manual parsers:** Utilize built-in `JSON.parse()` and `JSON.stringify()` instead of
  third-party custom parsing functions for maximum speed and specification compliance.
* **Validate serialized structures against schemas:** Pair `JSON.parse()` with runtime schema validators (such as Zod or
  JSON Schema) to guarantee that deserialized payloads match expected application types.