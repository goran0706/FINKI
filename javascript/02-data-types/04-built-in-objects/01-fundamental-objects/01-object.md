# Object

## Concept and ECMAScript Specification

The `Object` constructor creates object wrappers and serves as the fundamental building block of data structures in
ECMAScript. According to the ECMA-262 specification, almost all objects in JavaScript are instances of `Object` or
inherit from `Object.prototype`, occupying the top position of the prototype chain. An ordinary object in ECMAScript is
an abstract collection of properties, where each property maps a key—either a String or a Symbol—to a property
descriptor specifying its data value or accessor behavior alongside operational attributes.

| Characteristic       | ECMAScript Specification Behavior                                                                                        |
|:---------------------|:-------------------------------------------------------------------------------------------------------------------------|
| Internal Prototype   | Defaults to `Object.prototype` unless explicitly created with `null` via `Object.create(null)`                           |
| Key Types            | String or Symbol values only                                                                                             |
| Property Descriptors | Data Descriptors (`value`, `writable`) or Accessor Descriptors (`get`, `set`) with `enumerable` and `configurable` flags |
| Conversion Algorithm | Implements abstract operation `ToObject(argument)` during coercion operations                                            |

## Prototype and Properties Inspection

ECMAScript provides standardized static methods to query and traverse an object's prototype hierarchy and own property
keys. Static inspection utilities ensure predictable reflection without relying on prototype instance methods that may
be overridden or shadowed on user-defined objects.

| Method                                  | Specification Behavior                                                                        |
|:----------------------------------------|:----------------------------------------------------------------------------------------------|
| `Object.getPrototypeOf(obj)`            | Returns the `[[Prototype]]` internal slot of the target object                                |
| `Object.setPrototypeOf(obj, prototype)` | Sets the `[[Prototype]]` internal slot of the target object                                   |
| `Object.keys(obj)`                      | Returns an Array of an object's own enumerable String-keyed property names                    |
| `Object.values(obj)`                    | Returns an Array of an object's own enumerable String-keyed property values                   |
| `Object.entries(obj)`                   | Returns an Array of key-value pair arrays for own enumerable String-keyed properties          |
| `Object.getOwnPropertyNames(obj)`       | Returns an Array of all own String-keyed property names including non-enumerable properties   |
| `Object.getOwnPropertySymbols(obj)`     | Returns an Array of all own Symbol-keyed properties                                           |
| `Reflect.ownKeys(obj)`                  | Returns an Array of **all** own keys — String and Symbol, enumerable or not, in a single call |

`Reflect.ownKeys()` is the union of `Object.getOwnPropertyNames()` and `Object.getOwnPropertySymbols()` — reach for it
specifically when full reflection is needed and a single combined list is more convenient than merging two separate
arrays.

## Object.create()

`Object.create(proto, propertiesObject)` constructs a new object with its `[[Prototype]]` explicitly set to `proto`,
optionally applying property descriptors from `propertiesObject` at the same time. This is the standard way to establish
a prototype relationship **at creation time**, rather than assigning one afterward.

```javascript
const animalProto = {
    speak() {
        return `${this.name} makes a sound.`;
    },
};

const dog = Object.create(animalProto);
dog.name = 'Rex';
console.log(dog.speak()); // "Rex makes a sound."

// null-prototype object — no inherited members at all, not even toString/hasOwnProperty
const dict = Object.create(null);
dict.count = 1;
console.log(dict.hasOwnProperty); // undefined — nothing inherited
```

## Property Definition and Manipulation

Modifying property attributes directly requires low-level property descriptor controls. Methods such as
`Object.defineProperty()` and `Object.assign()` allow precise definition of mutability, enumerability, and
configurability, or shallow copying of enumerable own properties across objects.

| Operation                                      | ECMAScript Internal Algorithm                                                                                        |
|:-----------------------------------------------|:---------------------------------------------------------------------------------------------------------------------|
| `Object.defineProperty(obj, prop, descriptor)` | Invokes the internal `[[DefineOwnProperty]]` method to define or modify a property descriptor                        |
| `Object.assign(target, ...sources)`            | Executes `[[Get]]` on source own enumerable properties and `[[Set]]` on the target object                            |
| `Object.create(proto, propertiesObject)`       | Instantiates a new ordinary object with its `[[Prototype]]` set to `proto` and applies optional property descriptors |

## Integrity Levels and Restrictions

ECMAScript defines three distinct levels of object mutation restrictions that alter internal object behaviors:
preventing extensions, sealing, and freezing. These methods mutate the target object in-place and modify internal flags
or descriptors to control structural alterations and value updates.

| Method                          | Can Add Properties | Can Delete Properties | Can Mutate Values   |
|:--------------------------------|:-------------------|:----------------------|:--------------------|
| `Object.preventExtensions(obj)` | No                 | Yes                   | Yes                 |
| `Object.seal(obj)`              | No                 | No                    | Yes (if `writable`) |
| `Object.freeze(obj)`            | No                 | No                    | No                  |

## Checking Integrity State

Each restriction has a matching checker method that tests whether it has already been applied — useful for verifying an
object's protection level before performing a sensitive operation, rather than assuming it:

| Method                     | Returns `true` when...                                |
|:---------------------------|:------------------------------------------------------|
| `Object.isExtensible(obj)` | New properties can still be added                     |
| `Object.isSealed(obj)`     | The object is sealed (frozen objects are also sealed) |
| `Object.isFrozen(obj)`     | The object is fully frozen                            |

```javascript
const locked = Object.freeze({id: 1});
Object.isExtensible(locked); // false
Object.isSealed(locked);     // true
Object.isFrozen(locked);     // true
```

## Use Cases

* **Defining immutable constants and config trees:** Apply `Object.freeze()` to environment settings, feature flags, or
  shared constant maps so a stray assignment elsewhere in the codebase fails loudly (strict mode) instead of silently
  corrupting shared state.
* **Creating prototype-less dictionaries:** Use `Object.create(null)` when building a hash map from untrusted or dynamic
  keys (e.g., counting words in user-submitted text) — this eliminates the risk of a key like `"toString"` or
  `"__proto__"` colliding with an inherited method.
* **Establishing prototype relationships explicitly at creation:** Use `Object.create(proto)` when you need one object
  to inherit behavior from another without the overhead of a full class, or when replicating classic
  prototypal-inheritance patterns found in older codebases.
* **Reflective property access for serialization and debugging tooling:** Use `Object.getOwnPropertyNames()` /
  `Reflect.ownKeys()` when writing generic inspection utilities (loggers, deep-equality checkers, custom serializers)
  that must see every property — including non-enumerable and symbol-keyed ones — not just the "normal" ones
  `Object.keys()` would return.
* **Guarding public API surfaces from mutation:** Use `Object.seal()` on objects returned from a library's public
  interface when consumers should be able to update existing values but never add or remove fields — this catches
  accidental typo'd properties (`response.statuss = true`) that would otherwise be silently created.
* **Validating object integrity before a sensitive operation:** Use `Object.isFrozen()` / `Object.isSealed()` as a guard
  clause before code that assumes an object's shape is stable — for example, before caching a reference to an object's
  properties for repeated fast access.
* **Restricting dynamic property growth on state containers:** Use `Object.preventExtensions()` combined with
  pre-declared getters/setters when building a state container that should only ever expose a fixed, known set of
  fields, even though those fields' values can still change.

## Best Practices

* **Assign a prototype at creation time with `Object.create()`; never reassign it later with
  `Object.setPrototypeOf()`.** These two guidelines are one rule, not two separate tips: `Object.create(proto)`
  establishes the `[[Prototype]]` link when the object's hidden class is first being built, which engines optimize well.
  Calling `Object.setPrototypeOf()` on an already-existing object forces a hidden-class change after the fact, which is
  measurably slower and can deoptimize every other object sharing that shape — so the fix is always to set the prototype
  up front, not to avoid changing it later as an isolated afterthought.
* **Use `Object.create(null)` for secure dictionary hashing:** Initialize hash maps with a `null` prototype to eliminate
  inherited member collisions entirely during key-value storage — this is the single most common legitimate reason to
  reach for `Object.create()` in modern code.
* **Use static methods over prototype methods:** Prefer invocation of `Object.hasOwn(obj, prop)` over direct instance
  invocation (`obj.hasOwnProperty(prop)`) to guard against shadowed or missing methods, particularly on
  `Object.create(null)` objects, which have no inherited `hasOwnProperty` at all.
* **Apply `Object.freeze()` for top-level immutability:** Lock state objects at runtime boundaries using
  `Object.freeze()` to enforce unexpected mutation guards, and check `Object.isFrozen()` first if the code path needs to
  confirm protection rather than blindly re-applying it.
* **Understand shallow freeze limitations:** Remember that `Object.freeze()` is shallow and does not recursively freeze
  nested objects, requiring a recursive deep-freeze helper for nested state trees.
* **Verify object integrity defensively before sensitive operations:** Use `Object.isExtensible()`, `Object.isSealed()`,
  and `Object.isFrozen()` to check an object's current protection level before code that assumes a fixed shape, rather
  than assuming a restriction was applied somewhere upstream.
* **Beware of performance overhead with frozen objects:** Recognize that heavy runtime freezing can degrade property
  modification performance in performance-critical code paths, since every write attempt still has to check the frozen
  flag even though it will fail.
* **Combine `Object.preventExtensions()` with pre-declared getters/setters for controlled extension patterns:** Use
  extension prevention when building secure state containers that forbid new dynamic properties while still allowing
  existing ones to change.
* **Leverage `Reflect.ownKeys()` for complete property reflection:** Use `Reflect.ownKeys()` when both string-keyed and
  symbol-keyed properties need to be retrieved from an object instance in one call, instead of separately calling and
  merging `Object.getOwnPropertyNames()` and `Object.getOwnPropertySymbols()`.
* **Keep property descriptor configuration flags explicit:** Always specify `writable`, `enumerable`, and `configurable`
  flags explicitly when defining properties via `Object.defineProperty()`, since omitted flags silently default to
  `false` — the opposite of what plain assignment produces.
* **Guard against modifying non-configurable properties:** Avoid attempting to redefine or delete properties whose
  descriptors have `configurable: false`, as it triggers runtime type errors in strict mode.
* **Validate object shape compatibility before assignment:** Ensure source and target objects maintain compatible
  structures to maximize hidden class caching efficiency across operations.
* **Avoid modifying built-in prototype objects:** Refrain from extending `Object.prototype` directly to prevent
  prototype pollution and key collisions across libraries and every `for...in` loop in the codebase.