# JavaScript Reflect Methods Reference

The `Reflect` object provides thirteen static methods that correspond directly to the thirteen proxy trap hooks defined
in the ECMAScript specification. These methods allow developers to execute low-level object operations safely and
predictably.

## Complete Overview of Reflect Methods

The following table details all thirteen static methods available on the `Reflect` API:

| Reflect Static Method                            | Equivalent Operation / Syntax                 | Return Value                              |
|:-------------------------------------------------|:----------------------------------------------|:------------------------------------------|
| `Reflect.get(target, prop, receiver)`            | Property read (`target[prop]`)                | The value of the property                 |
| `Reflect.set(target, prop, val, receiver)`       | Property assignment (`target[prop] = val`)    | Boolean indicating success                |
| `Reflect.has(target, prop)`                      | The `in` operator (`prop in target`)          | Boolean indicating presence               |
| `Reflect.deleteProperty(target, prop)`           | The `delete` operator (`delete target[prop]`) | Boolean indicating success                |
| `Reflect.getOwnPropertyDescriptor(target, prop)` | `Object.getOwnPropertyDescriptor()`           | Property descriptor object or `undefined` |
| `Reflect.defineProperty(target, prop, desc)`     | `Object.defineProperty()`                     | Boolean indicating success                |
| `Reflect.getPrototypeOf(target)`                 | `Object.getPrototypeOf()`                     | The prototype object or `null`            |
| `Reflect.setPrototypeOf(target, proto)`          | `Object.setPrototypeOf()`                     | Boolean indicating success                |
| `Reflect.isExtensible(target)`                   | `Object.isExtensible()`                       | Boolean indicating extensibility          |
| `Reflect.preventExtensions(target)`              | `Object.preventExtensions()`                  | Boolean indicating success                |
| `Reflect.ownKeys(target)`                        | `Reflect.ownKeys()` (all own keys & symbols)  | Array of property keys                    |
| `Reflect.apply(target, thisArg, args)`           | Function call (`target.apply(thisArg, args)`) | Result of function execution              |
| `Reflect.construct(target, args, newTarget)`     | The `new` operator (`new target(...args)`)    | Newly instantiated object instance        |

## Detailed Technical Implementation of Key Methods

### Safe Property Assignment with `Reflect.set`

When assigning properties on objects that utilize getters or inheritance chains, `Reflect.set` accepts an optional
`receiver` argument. This argument ensures that `this` inside property setters correctly points to the proxy instance
rather than the underlying target.

```javascript
const targetObject = {
    _score: 0,
    set score(value) {
        this._score = value;
    }
};

const proxyInstance = new Proxy(targetObject, {
    set(target, property, value, receiver) {
        console.log(`Setting ${String(property)} to${value}`);
        return Reflect.set(target, property, value, receiver);
    }
});

proxyInstance.score = 100;
// Outputs:
// Setting score to 100
console.log(targetObject._score); // 100
```

### Function Invocation and Instantiation

`Reflect.apply` and `Reflect.construct` provide functional wrappers for calling functions and invoking constructors
without needing workarounds like `Function.prototype.apply.call()`.

```javascript
function calculateTax(rate) {
    return this.amount * rate;
}

const context = {amount: 500};
const tax = Reflect.apply(calculateTax, context, [0.2]);
console.log(tax); // 100

class UserRecord {
    constructor(name) {
        this.name = name;
    }
}

const user = Reflect.construct(UserRecord, ['Alice']);
console.log(user.name); // "Alice"
```

## Production Best Practices

* **Always pass the receiver in proxy chains:** When writing custom proxy traps that invoke `Reflect.get` or
  `Reflect.set`, always forward the `receiver` argument to preserve correct prototype binding.
* **Handle boolean return statuses:** Check the boolean return value of mutator methods like `Reflect.defineProperty`
  and `Reflect.set` when strict adherence to object invariants is required.