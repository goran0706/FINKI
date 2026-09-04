# Practical Use Cases for JavaScript Proxies

JavaScript proxies provide powerful virtualization capabilities that solve complex architectural challenges across
modern web applications. By intercepting fundamental object operations, developers can implement advanced design
patterns that would otherwise require invasive boilerplate modifications to core business logic.

## Reactive State Management and Data Binding

Modern front-end frameworks and reactive data stores leverage proxies to automatically track state mutations and
synchronize UI rendering or side effects without requiring explicit setter method calls or dirty checking loops.

```javascript
function createReactiveStore(initialState, onStateChange) {
    return new Proxy(initialState, {
        set(target, property, value, receiver) {
            const oldValue = target[property];
            const success = Reflect.set(target, property, value, receiver);

            if (success && oldValue !== value) {
                onStateChange(property, value, oldValue);
            }

            return success;
        }
    });
}

const store = createReactiveStore(
    {count: 0, theme: 'light'},
    (prop, newVal, oldVal) => {
        console.log(`State mutation detected on '${prop}': changed from '${oldVal}' to '${newVal}'`);
    }
);

store.count = 1; // Triggers reactive change listener
store.theme = 'dark'; // Triggers reactive change listener
```

## Input Sanitization and Validation Layers

Proxies act as robust interceptors at data entry boundaries, ensuring that objects conform to strict domain models, type
constraints, and business rules before state mutation occurs.

```javascript
const productSchemaValidator = {
    set(target, property, value, receiver) {
        if (property === 'price') {
            if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
                throw new TypeError('Price must be a valid non-negative number.');
            }
        }
        if (property === 'sku') {
            if (typeof value !== 'string' || !/^SKU-\d+$/.test(value)) {
                throw new Error('SKU must match format SKU-#####.');
            }
        }
        return Reflect.set(target, property, value, receiver);
    }
};

const product = new Proxy({name: 'Laptop', price: 999.99, sku: 'SKU-10045'}, productSchemaValidator);

product.price = 849.99; // Valid assignment
// product.price = -50; Throws TypeError
// product.sku = 'INVALID'; Throws Error
```

## Virtual Properties and Default Fallback Values

Proxies can intercept property reads to provide dynamic computed properties, fallback values for missing keys, or
automatic object nested property autovivification.

```javascript
const fallbackHandler = {
    get(target, property, receiver) {
        if (property in target) {
            return Reflect.get(target, property, receiver);
        }
        return `[Missing Value: ${String(property)}]`;
    }
};

const localizedStrings = new Proxy({welcome: 'Welcome, User'}, fallbackHandler);

console.log(localizedStrings.welcome); // "Welcome, User"
console.log(localizedStrings.farewell); // "[Missing Value: farewell]"
```

## Private Property Enforcers and Access Control

Before ECMAScript introduced native private class fields (`#`), proxies were widely used to emulate strict encapsulation
by hiding underscored internal properties from external enumeration and inspection.

```javascript
const securityHandler = {
    get(target, property, receiver) {
        if (typeof property === 'string' && property.startsWith('_')) {
            throw new Error(`Access denied: Property '${property}' is private.`);
        }
        return Reflect.get(target, property, receiver);
    },
    ownKeys(target) {
        // Hide private keys from Object.keys() and iteration
        return Reflect.ownKeys(target).filter(key => typeof key !== 'string' || !key.startsWith('_'));
    }
};

const secureAccount = new Proxy({username: 'alice', _balance: 50000}, securityHandler);

console.log(secureAccount.username); // "alice"
console.log(Object.keys(secureAccount)); // ['username']
// secureAccount._balance; Throws Error: Access denied
```

## Comparative Analysis of Proxy Use Cases

| Architecture Pattern       | Primary Trap Utilized   | Architectural Advantage                                  | Potential Trade-off                          |
|:---------------------------|:------------------------|:---------------------------------------------------------|:---------------------------------------------|
| **Reactive State Binding** | `set`                   | Automatic change notification without manual dispatchers | Minor property access latency                |
| **Input Validation**       | `set`, `defineProperty` | Enforces domain invariants at data boundary              | Overhead during bulk property initialization |
| **Default Fallbacks**      | `get`                   | Eliminates repetitive undefined guards                   | Can mask legitimate spelling errors in keys  |
| **Access Control**         | `get`, `ownKeys`, `has` | Encapsulates private fields and internal states          | Breaks standard object inspection tools      |

## Production Best Practices

* **Cache proxy instances where appropriate:** Creating new proxy instances inside high-frequency render loops or
  utility functions increases garbage collection pressure; instantiate proxies once at initialization boundaries.
* **Combine with `Reflect` systematically:** Always forward unhandled operations through `Reflect` methods to guarantee
  standard prototype chain resolution and correct receiver context preservation.
* **Be aware of identity mismatch:** A proxy object is a distinct entity from its underlying target object (
  `proxy !== target`). Storing references to both in maps or sets can lead to unexpected reference equality failures.