# Integrating Reflect with Proxies

The `Reflect` API and the `Proxy` object are designed as symbiotic counterparts in ECMAScript. Every low-level
interception hook in a `Proxy` handler has a direct, identical static method counterpart on the `Reflect` object. This
relationship provides the standard architectural pattern for forwarding intercepted operations back to a target object
safely and correctly.

## The Problem of Context and `this` Binding

When building proxies, a common pitfall is manipulating or accessing target object properties directly inside traps
without utilizing `Reflect`. This bypasses the proxy wrapper for subsequent operations and can cause severe bugs when
dealing with accessor properties (getters and setters) that rely on correct `this` binding.

Consider an object inheritance hierarchy where a parent object defines a getter referencing `this.value`. If a proxy
wraps a child object that inherits from this parent, accessing the getter through direct target lookup will cause `this`
to point to the raw target rather than the proxy receiver, breaking reactive tracking or custom trap logic.

```javascript
const parent = {
    get description() {
        return `Value is ${this.val}`;
    }
};

const child = Object.create(parent);
child.val = 42;

const proxy = new Proxy(child, {
    get(target, prop, receiver) {
        console.log(`Intercepted read for: ${prop}`);
        // INCORRECT: Direct access uses target, losing receiver context
        // return target[prop];

        // CORRECT: Reflect.get forwards the receiver (proxy instance)
        return Reflect.get(target, prop, receiver);
    }
});

console.log(proxy.description);
// Outputs:
// Intercepted read for: description
// Value is 42 (Correctly binds 'this' to the proxy receiver)
```

## Complete Proxy-Reflect Architectural Pattern

A production-grade proxy implementation consistently pairs every trap handler with its corresponding `Reflect` method.
This guarantees that internal slots, prototype chains, property descriptors, and receiver contexts are preserved across
all interactions.

```javascript
function createSecureProxy(targetObject, allowedProperties) {
    return new Proxy(targetObject, {
        get(target, prop, receiver) {
            if (typeof prop === 'string' && !allowedProperties.has(prop)) {
                throw new Error(`Access denied to property: ${prop}`);
            }
            return Reflect.get(target, prop, receiver);
        },

        set(target, prop, value, receiver) {
            if (typeof prop === 'string' && !allowedProperties.has(prop)) {
                throw new Error(`Modification denied to property: ${prop}`);
            }
            return Reflect.set(target, prop, value, receiver);
        },

        has(target, prop) {
            if (typeof prop === 'string' && !allowedProperties.has(prop)) {
                return false;
            }
            return Reflect.has(target, prop);
        },

        ownKeys(target) {
            return Reflect.ownKeys(target).filter(
                (key) => typeof key !== 'string' || allowedProperties.has(key)
            );
        }
    });
}

const sensitiveData = {
    publicName: 'Public API Endpoint',
    secretToken: 'abc-123-xyz'
};

const allowed = new Set(['publicName']);
const secureApi = createSecureProxy(sensitiveData, allowed);

console.log(secureApi.publicName); // "Public API Endpoint"
console.log('secretToken' in secureApi); // false
// secureApi.secretToken; Throws Error: Access denied to property: secretToken
```

## Comparative Analysis: Direct Target Access vs. Reflect Forwarding in Proxies

| Approach                                                       | Prototype Chain Integrity                             | `this` / Receiver Binding                      | Conformance to ECMAScript Specs                       |
|:---------------------------------------------------------------|:------------------------------------------------------|:-----------------------------------------------|:------------------------------------------------------|
| **Direct Target Access (`target[prop]`)**                      | Broken (bypasses proxy traps on nested reads)         | Points to raw target object instead of proxy   | Non-compliant with standard proxy forwarding patterns |
| **Reflect Forwarding (`Reflect.get(target, prop, receiver)`)** | Preserved (maintains full prototype chain resolution) | Correctly bound to the proxy receiver instance | Fully compliant and robust                            |

## Production Best Practices

* **Default to Reflect forwarding:** Unless an operation is being entirely mocked, suppressed, or virtualized from
  scratch, every proxy trap should return the result of its corresponding `Reflect` method.
* **Always forward the receiver argument:** In `get`, `set`, and custom method traps, ensure the `receiver` parameter is
  passed down into `Reflect.get` or `Reflect.set` to maintain transparent virtualization across inheritance boundaries.
* **Validate return types for mutator traps:** Ensure mutator traps (`set`, `deleteProperty`, `preventExtensions`)
  return strict boolean values matching the `Reflect` return signature to avoid engine runtime type assertions.