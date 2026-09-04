# JavaScript Iterable Protocol

The iterable protocol is a core structural contract in ECMAScript that allows JavaScript objects to define or customize
their iteration behavior. It dictates how values are exposed to iteration constructs such as `for...of` loops, array
destructuring, the spread operator (`...`), and array-from construction.

## Protocol Mechanics

For an object to be considered iterable, it must implement the iterable protocol. This requires the object (or one of
its prototype chain ancestors) to possess a property keyed by the well-known symbol `Symbol.iterator`.

When an iteration construct interacts with an iterable object, the following sequence occurs:

1. The engine looks up the method located at `obj[Symbol.iterator]`.
2. The engine invokes this method with no arguments, expecting it to return an iterator object.
3. The iteration construct repeatedly invokes the iterator's `next()` method to retrieve individual sequence values
   until completion.

```javascript
const collection = {
    items: ['alpha', 'beta', 'gamma'],
    [Symbol.iterator]() {
        let index = 0;
        const items = this.items;
        return {
            next() {
                if (index < items.length) {
                    return {value: items[index++], done: false};
                }
                return {value: undefined, done: true};
            }
        };
    }
};

for (const value of collection) {
    console.log(value); // Outputs: 'alpha', 'beta', 'gamma'
}
```

## Built-in Iterables

Many standard built-in data structures in JavaScript implement the iterable protocol natively out of the box:

* **Arrays and TypedArrays:** `Array`, `Int8Array`, `Float32Array`, etc.
* **Collections:** `Map`, `Set`.
* **Strings:** String primitives and String objects iterate over individual Unicode code points.
* **DOM Collections:** `NodeList` and `HTMLCollection`.

```javascript
const text = "JS";
for (const char of text) {
    console.log(char); // Outputs: 'J', 'S'
}
```

## Manual Protocol Consumption

While high-level language features like `for...of` abstract away the underlying mechanics, developers can also consume
iterables manually by explicitly retrieving the iterator via `Symbol.iterator` and calling `next()` directly.

```javascript
const numbers = [10, 20];
const iterator = numbers[Symbol.iterator]();

console.log(iterator.next()); // { value: 10, done: false }
console.log(iterator.next()); // { value: 20, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

## Best Practices

* **Ensure idempotency of iterator creation:** Invoking `[Symbol.iterator]()` multiple times on the same collection
  should ideally return fresh, independent iterator instances to avoid shared state corruption during nested loops.
* **Check for iterable status defensively:** When writing utility functions that accept generic inputs, verify that
  `typeof input[Symbol.iterator] === 'function'` before attempting iteration.