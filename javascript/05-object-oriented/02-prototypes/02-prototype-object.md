# Object Prototype

## Object.prototype Concept

**Object.prototype:** The root prototype object from which ordinary JavaScript objects inherit shared methods and
properties as the final prototype in the default object prototype chain.

Many common object behaviors come from `Object.prototype`, including:

* `toString()`
* `valueOf()`
* `hasOwnProperty()`

## Prototype Chain Root & Hierarchy

Most JavaScript objects eventually inherit from `Object.prototype`, which ultimately terminates at `null`. Built-in
types extend this hierarchy through specialized prototypes.

| Level                 | Example          |
|:----------------------|:-----------------|
| Instance              | Array object     |
| Specialized prototype | Array.prototype  |
| Root prototype        | Object.prototype |
| End of chain          | null             |

## Object.prototype Methods

`Object.prototype` provides shared methods available to inherited objects without duplication.

| Method                   | Purpose                          |
|:-------------------------|:---------------------------------|
| `toString()`             | Returns a string representation  |
| `valueOf()`              | Returns primitive representation |
| `hasOwnProperty()`       | Checks direct properties         |
| `isPrototypeOf()`        | Checks prototype relationships   |
| `propertyIsEnumerable()` | Checks property enumerability    |

## Objects Without Prototypes (`Object.create(null)`)

Objects created using `Object.create(null)` have no prototype (`null`), meaning they lack `Object.prototype` inheritance
and default methods, making them ideal for clean dictionary-like structures.

## Prototype Pollution & Modification

Modifying `Object.prototype` globally affects every inherited object and can introduce security vulnerabilities known as
prototype pollution, where unwanted property changes alter application behavior.

## Performance Considerations

| Factor            | Description                        |
|:------------------|:-----------------------------------|
| Chain depth       | More levels require more searching |
| Prototype changes | Can affect engine optimization     |
| Shared methods    | Reduce memory usage                |

## Use Cases

* **Understanding inherited methods:** Explains where common object methods originate.
* **Debugging objects:** Helps identify inherited properties and behavior.
* **Designing object structures:** Allows better decisions about inheritance.
* **Security awareness:** Helps prevent prototype-related vulnerabilities.

## Best Practices

* **Avoid modifying Object.prototype:** Changes affect all objects that inherit from it globally.
* **Use `Object.create(null)` only when necessary:** Removing `Object.prototype` changes normal object behavior and
  removes built-in methods.
* **Understand that `Object.prototype` is the root prototype:** Recognize that normal objects inherit built-in methods
  from it.
* **Use prototype inspection when debugging:** Identify where properties and methods originate using
  `Object.getPrototypeOf()`.
* **Keep object-specific data on instances:** Use prototypes exclusively for shared behavior.
* **Prefer `Object.hasOwn()` over inherited `hasOwnProperty()`:** Call `Object.hasOwn(obj, prop)` directly to safely
  check own properties on objects created with `Object.create(null)` or objects where prototype methods might be
  shadowed.
* **Be cautious of unexpected inherited properties in lookup loops:** Use `Object.keys()`, `Object.entries()`, or
  `for...of` with `Object.entries()` alongside checks to avoid walking up prototype chains unintentionally during
  iteration.
* **Sanitize external inputs to prevent prototype pollution:** Ensure deep merge utilities, JSON parsers, and query
  string deserializers block keys like `__proto__`, `constructor`, or `prototype`.
* **Use maps instead of plain dictionaries for untrusted keys:** Leverage `Map` structures when handling dynamic user
  input to prevent prototype collision security bugs completely.
* **Freeze prototype-less dictionaries when immutable:** Apply `Object.freeze()` to hash maps created via
  `Object.create(null)` if their structure should remain locked after initialization.
* **Avoid relying on `toString()` or `valueOf()` coercion blindly:** Handle object-to-primitive conversions explicitly
  when working with custom objects that override root prototype methods.
* **Test dictionary behavior for missing built-in methods:** Verify that code consuming `Object.create(null)` instances
  does not accidentally attempt to call methods like `toString()` or `hasOwnProperty()` directly on the object.
* **Inspect property enumerability carefully:** Use `propertyIsEnumerable()` when validating whether custom or inherited
  properties should be included in serialization routines.
* **Understand the performance impact of prototype pollution defense:** Balance runtime security checks with efficiency
  when sanitizing deeply nested objects from external APIs.
* **Do not override root prototype methods locally unless necessary:** Refrain from rewriting `toString()` or
  `valueOf()` on standard object instances unless custom formatting is explicitly required.
* **Keep prototype chains aligned with standard ECMAScript specifications:** Avoid manual manipulation of internal
  prototype pointers outside of standard delegation patterns.
* **Audit dependencies for known prototype pollution vulnerabilities:** Regularly check third-party libraries and
  parsing packages to ensure they protect against object injection flaws.
* **Use `Reflect` APIs for robust property management:** Leverage `Reflect.has()` and `Reflect.get()` when inspecting or
  manipulating properties across complex prototype hierarchies.
* **Document dictionary object constraints clearly:** Note whether a specific data container utilizes
  `Object.create(null)` so other maintainers understand its lack of standard prototype methods.
* **Verify object type safety using modern checks:** Combine `Object.prototype.toString.call()` with strict type guards
  when handling diverse data types accurately in utility functions.