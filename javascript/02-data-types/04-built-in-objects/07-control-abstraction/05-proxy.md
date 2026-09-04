# Proxy

## Concept and ECMAScript Specification

The `Proxy` constructor creates a wrapper object that wraps a target object and enables the interception and
customization of fundamental operations (such as property lookup, assignment, enumeration, and function invocation).
According to the ECMA-262 specification, a `Proxy` is an exotic object that delegates its internal methods to a
user-defined handler object.

If a handler trap is defined, the proxy executes the handler method when the corresponding operation occurs; if a trap
is omitted, the operation is forwarded directly to the underlying target object.

| Characteristic              | ECMAScript Specification Behavior                                                                                                                                   |
|:----------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Function Invocation         | Calling `Proxy()` without `new` throws a `TypeError`                                                                                                                |
| Invariants Rule             | Traps cannot violate target object invariants (e.g., returning a modified property value for a non-configurable, non-writable target property throws a `TypeError`) |
| Target Object Compatibility | Target can be any valid ECMAScript object, including functions, arrays, or other proxies                                                                            |
| Revocability                | Revocable proxies created via `Proxy.revocable()` can be permanently disabled at runtime                                                                            |

## Static Utility Methods

The `Proxy` constructor includes a static utility method to instantiate revocable proxy instances.

| Static Method                      | Specification Operational Behavior                                                 |
|:-----------------------------------|:-----------------------------------------------------------------------------------|
| `Proxy.revocable(target, handler)` | Creates a revocable proxy object; returns an object containing `{ proxy, revoke }` |

## Handler Traps

The `handler` object contains optional methods ("traps") that intercept standard internal operations performed on the
proxy instance.

| Handler Trap                                   | Intercepted Operations / Internal Method                             |
|:-----------------------------------------------|:---------------------------------------------------------------------|
| `get(target, property, receiver)`              | Property access (`proxy.prop`, `proxy[prop]`)                        |
| `set(target, property, value, receiver)`       | Property assignment (`proxy.prop = val`)                             |
| `has(target, property)`                        | The `in` operator (`prop in proxy`)                                  |
| `deleteProperty(target, property)`             | Property deletion (`delete proxy.prop`)                              |
| `apply(target, thisArg, argumentsList)`        | Function call (`proxy(...args)`, `proxy.call()`, `proxy.apply()`)    |
| `construct(target, argumentsList, newTarget)`  | Constructor invocation (`new proxy(...args)`)                        |
| `getOwnPropertyDescriptor(target, property)`   | `Object.getOwnPropertyDescriptor()`                                  |
| `defineProperty(target, property, attributes)` | `Object.defineProperty()`, `Reflect.defineProperty()`                |
| `getPrototypeOf(target)`                       | `Object.getPrototypeOf()`, `Reflect.getPrototypeOf()`, `__proto__`   |
| `setPrototypeOf(target, prototype)`            | `Object.setPrototypeOf()`, `Reflect.setPrototypeOf()`                |
| `isExtensible(target)`                         | `Object.isExtensible()`, `Reflect.isExtensible()`                    |
| `preventExtensions(target)`                    | `Object.preventExtensions()`, `Reflect.preventExtensions()`          |
| `ownKeys(target)`                              | `Object.keys()`, `Object.getOwnPropertyNames()`, `Reflect.ownKeys()` |

## Use Cases

`Proxy` instances serve as key components in reactive frameworks, validation wrappers, and virtualizations:

* **Reactive State Management:** Intercepting property writes (`set` trap) to trigger view updates or dependency
  tracking in modern UI frameworks.
* **Validation and Schema Enforcement:** Validating types or ranges during property updates and throwing errors before
  bad data reaches the underlying object.
* **Access Control & Auditing:** Creating read-only view wrappers or logging interactions for debugging and security
  boundaries.

## Best Practices

* **Always instantiate Proxy using new:** Call `new Proxy(target, handler)` explicitly to avoid runtime `TypeError`
  exceptions.
* **Combine Proxy traps with Reflect methods:** Delegate default behaviors inside traps using `Reflect` methods with
  matching signatures (e.g., `Reflect.get(target, prop, receiver)` inside the `get` trap) to maintain correct context
  and prototype invariants.
* **Respect Object Invariants:** Ensure trap returns do not conflict with non-configurable or non-writable target
  properties to prevent runtime invariant violation errors.
* **Use Revocable Proxies for memory-safe exposure:** Use `Proxy.revocable()` when exposing objects across security
  boundaries or temporary lifecycles, enabling explicit revocation (`revoke()`) when the access window closes.
* **Forward all unhandled operations correctly:** Define comprehensive trap coverage or allow default fallback
  mechanisms to prevent unexpected `undefined` returns on unhandled operations.
* **Beware of performance overhead in high-frequency loops:** Avoid wrapping objects in proxies inside
  performance-critical algorithms or tight rendering loops, as trap indirection adds execution overhead.
* **Validate parameters within traps strictly:** Check property keys, types, and input assignments inside `set` or `get`
  traps before forwarding changes to underlying targets.
* **Handle receiver arguments in getter traps carefully:** Always pass the `receiver` argument down through
  `Reflect.get()` to ensure correct prototype chain lookup and method binding context.
* **Use proxies for transparent data mocking and logging:** Implement telemetry or api mocks cleanly by logging
  interactions inside proxy traps without altering production models.
* **Protect sensitive data structures with read-only wrappers:** Restrict direct state mutations by intercepting and
  rejecting write attempts within `set` and `deleteProperty` traps.
* **Ensure proxy invariants do not break library consumers:** Maintain strict adherence to ECMAScript property
  descriptor rules when implementing custom `getOwnPropertyDescriptor` traps.
* **Clean up revoked proxies to assist garbage collection:** Revoke temporary proxies promptly when components unmount
  or sessions close to release retained target references.
* **Test proxy behavior thoroughly against edge cases:** Verify edge cases like symbol property lookups, prototype
  inheritance chains, and built-in method calls against your custom proxy traps.
* **Avoid complex side effects inside validation traps:** Keep trap logic pure and side-effect free outside of explicit
  state mutation tracking or error throwing.
* **Use proxies for schema-driven state normalization:** Coerce or format inputs automatically during property
  assignment inside `set` traps to maintain consistent data structures.