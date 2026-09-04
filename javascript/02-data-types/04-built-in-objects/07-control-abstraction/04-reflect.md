# Reflect

## Concept and ECMAScript Specification

The `Reflect` namespace object provides static methods for interceptable JavaScript operations. According to the
ECMA-262 specification, `Reflect` is a built-in global namespace object—similar to `Math` or `JSON`—and is not a
constructor function. It lacks a `[[Call]]` internal method and cannot be invoked or instantiated using `new`;
attempting to do so throws a `TypeError`.

`Reflect` methods directly map to internal object operations (termed "internal methods" in the spec, such as `[[Get]]`,
`[[Set]]`, `[[Construct]]`, or `[[Delete]]`). The primary purpose of `Reflect` is to offer clean, functional returns (
usually booleans) for object operations instead of throwing exceptions, while providing a 1:1 mapping to `Proxy` handler
traps.

| Characteristic        | ECMAScript Specification Behavior                                                      |
|:----------------------|:---------------------------------------------------------------------------------------|
| Invocation Attempts   | Throws a `TypeError` when called as a function or constructor                          |
| Prototype Inheritance | `Reflect` inherits directly from `Object.prototype`                                    |
| Error Handling        | Returns boolean status indicators (`true`/`false`) for operations that otherwise throw |
| Proxy Alignment       | Every static method name and parameter signature matches a `Proxy` handler trap        |

## Static Reflection Methods

The `Reflect` object exposes static methods corresponding directly to fundamental internal object operations.

| Method                                                    | Internal Method         | Specification Behavior                                                               |
|:----------------------------------------------------------|:------------------------|:-------------------------------------------------------------------------------------|
| `Reflect.apply(target, thisArgument, argumentsList)`      | `[[Call]]`              | Calls a target function with specified `this` context and arguments                  |
| `Reflect.construct(target, argumentsList [, newTarget])`  | `[[Construct]]`         | Invokes a constructor function, equivalent to `new target(...args)`                  |
| `Reflect.get(target, propertyKey [, receiver])`           | `[[Get]]`               | Retrieves a property value, setting custom `this` via `receiver` for getters         |
| `Reflect.set(target, propertyKey, value [, receiver])`    | `[[Set]]`               | Sets a property value; returns `true` if successful, `false` on failure              |
| `Reflect.defineProperty(target, propertyKey, attributes)` | `[[DefineOwnProperty]]` | Defines an own property; returns `true` if successful, `false` otherwise             |
| `Reflect.deleteProperty(target, propertyKey)`             | `[[Delete]]`            | Deletes a property; returns `true` if deleted or absent, `false` if non-configurable |
| `Reflect.has(target, propertyKey)`                        | `[[HasProperty]]`       | Evaluates if a property exists (in operator equivalent); returns boolean             |
| `Reflect.getOwnPropertyDescriptor(target, propertyKey)`   | `[[GetOwnProperty]]`    | Returns descriptor object for an own property, or `undefined`                        |
| `Reflect.getPrototypeOf(target)`                          | `[[GetPrototypeOf]]`    | Returns internal prototype (`[[Prototype]]`), or `null`                              |
| `Reflect.setPrototypeOf(target, prototype)`               | `[[SetPrototypeOf]]`    | Sets internal prototype; returns `true` if successful, `false` on failure            |
| `Reflect.isExtensible(target)`                            | `[[IsExtensible]]`      | Checks if target allows new property additions; returns boolean                      |
| `Reflect.preventExtensions(target)`                       | `[[PreventExtensions]]` | Prevents new property additions; returns `true` if successful                        |
| `Reflect.ownKeys(target)`                                 | `[[OwnPropertyKeys]]`   | Returns an Array of all target own property keys (Strings and Symbols)               |

## Key Differences: Reflect vs. Object Methods

While several `Reflect` methods share names with static `Object` methods, their operational semantics differ
significantly in terms of return values and non-object argument handling.

| Operation          | `Object` Counterpart Behavior                                                      | `Reflect` Method Behavior                                               |
|:-------------------|:-----------------------------------------------------------------------------------|:------------------------------------------------------------------------|
| Define Property    | `Object.defineProperty` returns target object or **throws `TypeError`** on failure | `Reflect.defineProperty` returns `true` on success, `false` on failure  |
| Set Prototype      | `Object.setPrototypeOf` returns target object or **throws `TypeError`** on failure | `Reflect.setPrototypeOf` returns `true` on success, `false` on failure  |
| Non-object Input   | `Object.getPrototypeOf(42)` coerces `42` to an object wrapper                      | `Reflect.getPrototypeOf(42)` **throws `TypeError`** immediately         |
| Property Keys List | `Object.getOwnPropertyNames` + `Symbols` requires two distinct calls               | `Reflect.ownKeys` returns both String and Symbol keys in a single array |

## Use Cases

`Reflect` static methods streamline metaprogramming and dynamic execution paths:

* **Forwarding Proxy Traps:** Delegating operations seamlessly inside custom `Proxy` traps without breaking underlying
  object semantics.
* **Custom Getter Callbacks:** Utilizing `Reflect.get(target, key, receiver)` to ensure inherited getters execute with
  the correct `Proxy` receiver context.
* **Safe Property Definitions:** Replacing imperative `try...catch` blocks around `Object.defineProperty` with
  conditional boolean checks using `Reflect.defineProperty`.

## Best Practices

* **Never attempt to instantiate Reflect:** Access methods directly as static properties on `Reflect` without using
  `new`.
* **Always pass receiver in Proxy traps:** Use `Reflect.get(target, prop, receiver)` inside proxy `get` traps to ensure
  `this` bindings resolve correctly within getter functions.
* **Prefer Reflect.ownKeys for full property enumeration:** Use `Reflect.ownKeys()` when extracting all property
  keys—including non-enumerable properties and Symbols—in a single operation.
* **Validate target types:** Ensure arguments passed to `Reflect` methods are objects; non-object targets throw a
  `TypeError` instead of performing implicit primitive coercion.
* **Check boolean return codes explicitly:** Handle the boolean status indicators returned by methods like
  `Reflect.set()`, `Reflect.deleteProperty()`, and `Reflect.preventExtensions()` to manage failures cleanly without
  throwing exceptions.
* **Use `Reflect.apply` to invoke functions safely:** Call functions using `Reflect.apply(target, thisArg, args)`
  instead of legacy `Function.prototype.apply.call()` for cleaner and more robust invocation semantics.
* **Leverage `Reflect.construct` for dynamic subclassing:** Pass an explicit `newTarget` argument into
  `Reflect.construct(target, args, newTarget)` when forwarding constructor calls in custom class wrappers.
* **Forward all proxy traps with matching Reflect methods:** Mirror every custom `Proxy` handler trap using its direct
  `Reflect` counterpart to maintain standard JavaScript object behavior by default.
* **Avoid wrapping non-object arguments blindly:** Remember that unlike several `Object` utilities, `Reflect` methods
  reject primitive arguments instantly with type errors.
* **Use `Reflect.has` as a functional alternative to in:** Check for property existence using `Reflect.has(target, key)`
  when writing functional utility pipelines instead of keyword expressions.
* **Inspect property descriptors reliably:** Retrieve exact property definitions via
  `Reflect.getOwnPropertyDescriptor(target, key)` without triggering prototype chain lookups.
* **Keep prototype modifications clean:** Use `Reflect.setPrototypeOf()` to update inheritance links while safely
  capturing boolean success or failure outcomes.
* **Combine `Reflect.ownKeys` with Object.getOwnPropertyDescriptor:** Audit object properties thoroughly by mapping over
  keys returned from `Reflect.ownKeys()` to inspect flags and values.
* **Secure metaprogramming layers against tampering:** Rely on built-in `Reflect` methods rather than custom property
  lookup helpers to ensure core internal method invariants remain intact.
* **Cache reflection results in performance-critical loops:** Store frequently accessed prototype or descriptor queries
  outside tight execution frames to optimize metaprogramming overhead.