# JavaScript Proxy Traps Reference

Proxy traps are handler methods that intercept fundamental operations performed on a target object. The ECMAScript
specification defines thirteen distinct traps corresponding to every low-level interaction possible on a JavaScript
object.

## Complete Overview of Proxy Traps

The following table summarizes all thirteen proxy traps available in JavaScript:

| Trap Method                                   | Intercepted Operation                             | Default Forwarding Mechanism                          |
|:----------------------------------------------|:--------------------------------------------------|:------------------------------------------------------|
| `get(target, prop, receiver)`                 | Property reads (`obj.prop`, `obj['prop']`)        | `Reflect.get(target, prop, receiver)`                 |
| `set(target, prop, value, receiver)`          | Property assignments (`obj.prop = val`)           | `Reflect.set(target, prop, value, receiver)`          |
| `has(target, prop)`                           | The `in` operator (`prop in obj`)                 | `Reflect.has(target, prop)`                           |
| `deleteProperty(target, prop)`                | The `delete` operator (`delete obj.prop`)         | `Reflect.deleteProperty(target, prop)`                |
| `getOwnPropertyDescriptor(target, prop)`      | `Object.getOwnPropertyDescriptor()`               | `Reflect.getOwnPropertyDescriptor(target, prop)`      |
| `defineProperty(target, prop, desc)`          | `Object.defineProperty()`                         | `Reflect.defineProperty(target, prop, desc)`          |
| `getPrototypeOf(target)`                      | `Object.getPrototypeOf()` or `__proto__`          | `Reflect.getPrototypeOf(target)`                      |
| `setPrototypeOf(target, proto)`               | `Object.setPrototypeOf()`                         | `Reflect.setPrototypeOf(target, proto)`               |
| `isExtensible(target)`                        | `Object.isExtensible()`                           | `Reflect.isExtensible(target)`                        |
| `preventExtensions(target)`                   | `Object.preventExtensions()`                      | `Reflect.preventExtensions(target)`                   |
| `ownKeys(target)`                             | `Object.keys()`, `getOwnPropertyNames()`, symbols | `Reflect.ownKeys(target)`                             |
| `apply(target, thisArg, argumentsList)`       | Function invocation (`proxy()`)                   | `Reflect.apply(target, thisArg, argumentsList)`       |
| `construct(target, argumentsList, newTarget)` | The `new` operator (`new proxy()`)                | `Reflect.construct(target, argumentsList, newTarget)` |

## Detailed Technical Implementation of Key Traps

### Intercepting Property Access with `get` and `set`

The `get` and `set` traps are the most commonly utilized traps in reactive programming frameworks and data validation
layers. They allow developers to intercept reads and writes, perform sanitization, or trigger UI updates.

```javascript
const validationHandler = {
    set(target, property, value, receiver) {
        if (property === 'age') {
            if (typeof value !== 'number' || value < 0) {
                throw new TypeError('Age must be a positive number.');
            }
        }
        return Reflect.set(target, property, value, receiver);
    },

    get(target, property, receiver) {
        if (property in target) {
            return Reflect.get(target, property, receiver);
        }
        return `Property '${String(property)}' does not exist.`;
    }
};

const user = new Proxy({name: 'Alice', age: 30}, validationHandler);

console.log(user.name); // "Alice"
console.log(user.email); // "Property 'email' does not exist."

user.age = 35; // Success
// user.age = -5; Throws TypeError: Age must be a positive number.
```

### Intercepting Function Invocation with `apply`

When a proxy wraps a target function, the `apply` trap intercepts direct function calls, allowing argument
transformation, execution timing, or access control.

```javascript
const targetFunction = function (a, b) {
    return a + b;
};

const loggingHandler = {
    apply(target, thisArg, argumentList) {
        console.log(`Calling function with arguments: ${JSON.stringify(argumentList)}`);
        const startTime = performance.now();
        const result = Reflect.apply(target, thisArg, argumentList);
        const duration = performance.now() - startTime;
        console.log(`Execution completed in ${duration.toFixed(2)}ms with result:${result}`);
        return result;
    }
};

const wrappedFunction = new Proxy(targetFunction, loggingHandler);
wrappedFunction(10, 20);
```

### Intercepting Object Construction with `construct`

The `construct` trap intercepts the instantiation of constructor functions via the `new` operator.

```javascript
class ServerInstance {
    constructor(host) {
        this.host = host;
    }
}

const singletonHandler = {
    instance: null,
    construct(target, args, newTarget) {
        if (!this.instance) {
            this.instance = Reflect.construct(target, args, newTarget);
        }
        return this.instance;
    }
};

const SingletonServer = new Proxy(ServerInstance, singletonHandler);
const serverA = new SingletonServer('localhost');
const serverB = new SingletonServer('remote');

console.log(serverA === serverB); // true (enforces singleton pattern)
```

## Production Best Practices

* **Respect internal invariants:** ECMAScript enforces strict internal invariants for proxies wrapping non-extensible
  objects or frozen prototypes. For example, if a target property is non-writable and non-configurable, a trap cannot
  report a different value without throwing a TypeError.
* **Always return boolean flags from mutator traps:** Traps like `set`, `deleteProperty`, and `preventExtensions` must
  return explicit boolean values (`true` for success, `false` for failure in non-strict mode) when using direct returns
  instead of delegating to `Reflect`.