# for...of Statement

The `for...of` statement iterates over the **values produced by an iterable**. Unlike `for...in`, which enumerates
object property keys, `for...of` consumes the iterable's iterator and assigns each produced value to the loop variable.

```javascript id="for-of-basic"
const values = [10, 20, 30];

for (const value of values) {
    console.log(value);
}

// 10
// 20
// 30
```

The fundamental distinction is:

```text id="for-of-distinction"
for...in → enumerable property keys
for...of  → iterable values
```

`for...of` therefore works with data structures that implement the **iterable protocol**, rather than specifically with
ordinary object properties.

## Basic Syntax

The general syntax is:

```javascript id="for-of-syntax"
for (variable of iterable) {
    statement;
}
```

For example:

```javascript id="for-of-array"
const values = ["a", "b", "c"];

for (const value of values) {
    console.log(value);
}
```

The loop variable receives each value produced by the iterable.

## Iterable Protocol

An object is iterable when it provides a method at `Symbol.iterator` that returns an iterator.

```javascript id="for-of-symbol-iterator"
const iterable = {
    [Symbol.iterator]() {
        // return an iterator
    }
};
```

The iterator must provide a `next()` method that returns iterator result objects:

```javascript id="for-of-iterator"
const iterable = {
    [Symbol.iterator]() {
        let current = 1;

        return {
            next() {
                if (current <= 3) {
                    return {
                        value: current++,
                        done: false
                    };
                }

                return {
                    value: undefined,
                    done: true
                };
            }
        };
    }
};

for (const value of iterable) {
    console.log(value);
}

// 1
// 2
// 3
```

`for...of` handles the iterator protocol automatically.

The loop does not directly access indexes or object properties. It requests successive values from the iterable's
iterator.

## Iterator Consumption

Conceptually, a `for...of` loop performs repeated iterator advancement:

```text id="for-of-consumption"
Get iterator
    ↓
Call next()
    ↓
Check done
    ↓
Assign value
    ↓
Execute loop body
    ↓
Call next() again
```

When the iterator reports:

```javascript id="iterator-done"
{
    done: true
}
```

the loop terminates.

This is fundamentally different from a traditional `for` loop, which explicitly manages a counter and termination
condition.

## Arrays

Arrays are iterable.

```javascript id="for-of-values"
const values = [10, 20, 30];

for (const value of values) {
    console.log(value);
}
```

The loop produces:

```text id="for-of-array-output"
10
20
30
```

The values are produced in array iteration order.

Unlike `for...in`, the loop variable contains the elements rather than their property keys.

## Array Indexes

`for...of` does not directly provide array indexes.

```javascript id="for-of-no-index"
const values = ["a", "b", "c"];

for (const value of values) {
    console.log(value);
}
```

If both the index and value are required, use `entries()`:

```javascript id="for-of-entries"
const values = ["a", "b", "c"];

for (const [index, value] of values.entries()) {
    console.log(index, value);
}
```

This produces:

```text id="for-of-entries-output"
0 a
1 b
2 c
```

This is generally preferable to manually maintaining a separate counter.

## Sparse Arrays

`for...of` treats arrays according to their array iterator semantics rather than enumerating only existing property
keys.

```javascript id="for-of-sparse"
const values = [];

values[2] = "c";

for (const value of values) {
    console.log(value);
}
```

The array iterator advances through the array's indexed range, producing `undefined` for the holes:

```text id="for-of-sparse-output"
undefined
undefined
c
```

This differs from `for...in`, which enumerates only existing enumerable properties:

```javascript id="for-in-sparse-comparison"
for (const key in values) {
    console.log(key);
}

// 2
```

This distinction is important when processing sparse arrays.

## Strings

Strings are iterable.

```javascript id="for-of-string"
const text = "hello";

for (const character of text) {
    console.log(character);
}
```

The loop produces the string's Unicode code points as represented by the string iterator.

This is different from indexing through UTF-16 code units.

For example:

```javascript id="for-of-unicode"
const text = "A😀B";

for (const character of text) {
    console.log(character);
}
```

The iteration produces:

```text id="for-of-unicode-output"
A
😀
B
```

This makes `for...of` preferable to a simple index-based loop when the intended operation is character/code-point
iteration rather than raw UTF-16 code-unit processing.

## Sets

`Set` instances are iterable.

```javascript id="for-of-set"
const values = new Set([10, 20, 30]);

for (const value of values) {
    console.log(value);
}
```

The values are produced according to the `Set` iteration semantics.

Duplicate values have already been removed by the `Set`:

```javascript id="for-of-set-duplicates"
const values = new Set([10, 10, 20, 20, 30]);

for (const value of values) {
    console.log(value);
}

// 10
// 20
// 30
```

## Maps

`Map` instances are iterable.

The default `Map` iterator produces key/value pairs:

```javascript id="for-of-map"
const users = new Map([
    ["alice", 30],
    ["bob", 40]
]);

for (const [name, age] of users) {
    console.log(name, age);
}
```

This produces:

```text id="for-of-map-output"
alice 30
bob 40
```

The default iteration behavior of `Map` is equivalent to iterating its entries.

Explicitly calling `entries()` communicates the same intent:

```javascript id="for-of-map-entries"
for (const [name, age] of users.entries()) {
    console.log(name, age);
}
```

Maps can also be iterated by keys or values:

```javascript id="for-of-map-keys-values"
for (const key of users.keys()) {
    console.log(key);
}

for (const value of users.values()) {
    console.log(value);
}
```

## Typed Arrays

Typed arrays are iterable.

```javascript id="for-of-typed-array"
const values = new Uint8Array([10, 20, 30]);

for (const value of values) {
    console.log(value);
}
```

The loop receives the typed array's values.

`for...of` therefore provides a consistent iteration mechanism across ordinary arrays and typed arrays.

## Arguments Object

The `arguments` object in ordinary functions is iterable in modern JavaScript environments.

```javascript id="for-of-arguments"
function printArguments() {
    for (const argument of arguments) {
        console.log(argument);
    }
}

printArguments("a", "b", "c");
```

The loop consumes the object's iterator rather than enumerating its property names.

## DOM Collections

Many platform-provided collection objects are iterable.

For example, APIs that expose iterable collections can be consumed directly:

```javascript id="for-of-dom"
for (const element of document.querySelectorAll("div")) {
    console.log(element);
}
```

Whether a particular host object is iterable depends on the Web API's defined interface.

The important point is that `for...of` is based on the iterable protocol, not on whether an object resembles an array.

## Plain Objects

Ordinary objects are not iterable by default.

```javascript id="for-of-object-error"
const object = {
    name: "Alice",
    age: 30
};

for (const value of object) {
    console.log(value);
}
```

This results in a `TypeError` because the object does not provide the required iterable protocol.

To iterate an object's values, convert its properties into an iterable:

```javascript id="for-of-object-values"
for (const value of Object.values(object)) {
    console.log(value);
}
```

For keys:

```javascript id="for-of-object-keys"
for (const key of Object.keys(object)) {
    console.log(key);
}
```

For key/value pairs:

```javascript id="for-of-object-entries"
for (const [key, value] of Object.entries(object)) {
    console.log(key, value);
}
```

## for...of vs for...in

The distinction between the two constructs is fundamental.

```javascript id="for-of-vs-for-in"
const values = ["a", "b", "c"];

for (const key in values) {
    console.log(key);
}

for (const value of values) {
    console.log(value);
}
```

`for...in` produces:

```text id="for-in-array-result"
0
1
2
```

`for...of` produces:

```text id="for-of-array-result"
a
b
c
```

The comparison is:

| Mechanism  | Primary purpose      | Produces      |            Prototype properties             | Iterable required |
|:-----------|:---------------------|:--------------|:-------------------------------------------:|:-----------------:|
| `for...in` | Property enumeration | Property keys | Can include inherited enumerable properties |        No         |
| `for...of` | Iterable iteration   | Values        |        No property-chain enumeration        |        Yes        |

Use `for...of` when the conceptual operation is consuming values from a collection.

Use `for...in` when the conceptual operation is enumerating object properties.

## for...of vs for Statement

A traditional `for` loop gives explicit control over initialization, condition, and update:

```javascript id="for-vs-for-of"
for (let index = 0; index < values.length; index++) {
    console.log(values[index]);
}
```

`for...of` delegates iteration to the iterable:

```javascript id="for-of-simple"
for (const value of values) {
    console.log(value);
}
```

The traditional `for` statement is useful when explicit index control is required.

`for...of` is usually clearer when the operation is simply:

```text id="for-of-intent"
for each value in this iterable
```

## break in for...of Loops

A `for...of` loop can be terminated using `break`.

```javascript id="for-of-break"
const values = [10, 20, 30, 40];

for (const value of values) {
    if (value === 30) {
        break;
    }

    console.log(value);
}
```

The loop terminates when the condition is satisfied.

Importantly, terminating iteration also participates in the iterator's cleanup protocol when the iterator provides an
appropriate `return()` method.

## continue in for...of Loops

`continue` skips the remainder of the current iteration and requests the next value from the iterator.

```javascript id="for-of-continue"
const values = [10, 20, 30, 40];

for (const value of values) {
    if (value === 20) {
        continue;
    }

    console.log(value);
}
```

The result is:

```text id="for-of-continue-output"
10
30
40
```

Unlike a traditional `for` loop, there is no explicit update expression in the `for...of` syntax. The next iterator step
is performed automatically.

## return in for...of Loops

A function can return from inside a `for...of` loop:

```javascript id="for-of-return"
function findValue(values, target) {
    for (const value of values) {
        if (value === target) {
            return value;
        }
    }

    return undefined;
}
```

Returning from the loop exits the surrounding function and terminates the active iteration.

## throw in for...of Loops

An exception can also terminate iteration:

```javascript id="for-of-throw"
function process(values) {
    for (const value of values) {
        if (!isValid(value)) {
            throw new Error("Invalid value");
        }

        handle(value);
    }
}
```

Iterator cleanup semantics apply when abrupt completion exits the loop.

## Iterator Cleanup

One of the important differences between `for...of` and index-based loops is that `for...of` interacts directly with the
iterator protocol.

When iteration terminates abruptly, such as through `break`, `return`, or `throw`, the active iterator can be closed
through its `return()` method when one is provided.

A custom iterable can observe this:

```javascript id="for-of-return-cleanup"
const iterable = {
    [Symbol.iterator]() {
        return {
            next() {
                return {
                    value: 1,
                    done: false
                };
            },

            return() {
                console.log("Iterator closed");

                return {
                    done: true
                };
            }
        };
    }
};

for (const value of iterable) {
    break;
}

// Iterator closed
```

This allows iterators to release resources when iteration ends before normal exhaustion.

## Generators

Generator functions produce iterators that are also iterable.

```javascript id="for-of-generator"
function* numbers() {
    yield 1;
    yield 2;
    yield 3;
}

for (const value of numbers()) {
    console.log(value);
}
```

The generator produces:

```text id="for-of-generator-output"
1
2
3
```

`for...of` therefore provides a natural mechanism for consuming generator output.

## Lazy Iteration

Because `for...of` consumes values from an iterator one at a time, an iterable can generate values lazily.

```javascript id="for-of-lazy"
function* numbers() {
    let value = 1;

    while (value <= 3) {
        yield value++;
    }
}

for (const value of numbers()) {
    console.log(value);
}
```

The generator does not have to construct the complete collection before iteration begins.

This is useful for sequences that are:

* expensive to calculate,
* potentially large,
* generated on demand,
* backed by external resources,
* or conceptually infinite.

## Infinite Iterables

An iterable can produce values indefinitely.

```javascript id="for-of-infinite"
function* numbers() {
    let value = 0;

    while (true) {
        yield value++;
    }
}

for (const value of numbers()) {
    console.log(value);

    if (value === 10) {
        break;
    }
}
```

Without the `break`, the loop would continue consuming values indefinitely.

The termination behavior of a `for...of` loop is therefore determined by both the iterable and the control flow
surrounding the iteration.

## Custom Iterables

Custom objects can implement `Symbol.iterator` to define their iteration behavior.

```javascript id="for-of-custom"
const range = {
    start: 1,
    end: 3,

    [Symbol.iterator]() {
        let current = this.start;

        return {
            next: () => {
                if (current <= this.end) {
                    return {
                        value: current++,
                        done: false
                    };
                }

                return {
                    value: undefined,
                    done: true
                };
            }
        };
    }
};

for (const value of range) {
    console.log(value);
}
```

The object itself is not an array, but it is iterable because it implements `Symbol.iterator`.

## Iterator vs Iterable

An iterable and an iterator are related but distinct concepts.

An **iterable** provides:

```javascript id="iterable-protocol"
object[Symbol.iterator]()
```

An **iterator** provides:

```javascript id="iterator-protocol"
iterator.next()
```

A typical iterable returns an iterator:

```text id="iterable-iterator"
Iterable
   │
   └── Symbol.iterator()
          │
          ▼
       Iterator
          │
          └── next()
```

Many built-in objects, including arrays, sets, maps, strings, and generators, are iterable.

## Reusable and Single-Use Iterables

Not every iterable behaves like a reusable collection.

An iterable can return a new iterator each time:

```javascript id="for-of-reusable"
const values = [1, 2, 3];

for (const value of values) {
    console.log(value);
}

for (const value of values) {
    console.log(value);
}
```

Both loops iterate through all values because each call to `values[Symbol.iterator]()` produces a fresh iterator.

Generators behave differently:

```javascript id="for-of-generator-single"
function* numbers() {
    yield 1;
    yield 2;
    yield 3;
}

const iterator = numbers();

for (const value of iterator) {
    console.log(value);
}

for (const value of iterator) {
    console.log(value);
}
```

The second loop has no remaining values because the iterator has already been exhausted.

This distinction matters when an API exposes an iterator directly rather than a reusable iterable collection.

## Destructuring

`for...of` works naturally with destructuring.

For arrays of objects:

```javascript id="for-of-object-destructure"
const users = [
    {name: "Alice", age: 30},
    {name: "Bob", age: 40}
];

for (const {name, age} of users) {
    console.log(name, age);
}
```

For map entries:

```javascript id="for-of-map-destructure"
for (const [key, value] of usersMap) {
    console.log(key, value);
}
```

This is one of the major readability advantages of `for...of` when iterable elements have structured values.

## const and let

The loop variable can be declared with `const` or `let`.

Use `const` when the binding does not need reassignment:

```javascript id="for-of-const"
for (const value of values) {
    console.log(value);
}
```

Use `let` when the loop body intentionally reassigns the binding:

```javascript id="for-of-let"
for (let value of values) {
    value *= 2;

    console.log(value);
}
```

Reassigning the loop variable does not modify the underlying iterable element automatically.

For primitive values:

```javascript id="for-of-reassignment"
const values = [10, 20, 30];

for (let value of values) {
    value *= 2;
}

console.log(values);

// [10, 20, 30]
```

The local binding was changed; the array was not.

For object values, however, mutating the referenced object affects the same object stored in the collection:

```javascript id="for-of-object-mutation"
const users = [
    {active: false},
    {active: false}
];

for (const user of users) {
    user.active = true;
}

console.log(users);
```

The objects themselves are shared references.

## Block Scope

A `for...of` loop using `let` or `const` creates a block-scoped loop binding.

```javascript id="for-of-scope"
for (const value of values) {
    console.log(value);
}

// value is not accessible here
```

The loop variable cannot be accessed outside the loop.

## Closures and Loop Bindings

Each iteration of a `for...of` loop using `let` or `const` has an iteration-specific binding.

```javascript id="for-of-closures"
const values = [1, 2, 3];
const callbacks = [];

for (const value of values) {
    callbacks.push(() => value);
}

console.log(callbacks[0]());
console.log(callbacks[1]());
console.log(callbacks[2]());

// 1
// 2
// 3
```

Each closure captures the corresponding iteration binding.

This differs from older patterns involving a single `var` binding.

## Mutating the Iterable

The effects of modifying an iterable during iteration depend on the iterable's iterator semantics.

For arrays:

```javascript id="for-of-array-mutation"
const values = [1, 2, 3];

for (const value of values) {
    if (value === 1) {
        values.push(4);
    }

    console.log(value);
}
```

The array iterator observes the array as it advances, so mutations can affect subsequent iteration.

Such code is difficult to reason about and should generally be avoided unless the behavior is intentional and well
understood.

When predictable iteration is required, avoid modifying the collection being consumed.

## Adding Elements During Iteration

Appending elements to an array while iterating can cause those elements to be visited:

```javascript id="for-of-push"
const values = [1, 2, 3];

for (const value of values) {
    if (value === 3) {
        values.push(4);
    }

    console.log(value);
}
```

The resulting behavior follows the array iterator's semantics rather than a precomputed snapshot.

Do not rely on this as a general collection-processing pattern.

## Removing Elements During Iteration

Removing elements can cause elements to be skipped because the iterator advances through the changing array.

```javascript id="for-of-splice"
const values = [1, 2, 3, 4];

for (const value of values) {
    if (value === 2) {
        values.splice(1, 1);
    }
}
```

Mutating the collection while iterating can therefore produce unintuitive results.

Prefer constructing a new collection or performing a separate mutation phase when possible.

## Async Iteration

`for...of` is for synchronous iterables.

It does not automatically await promises:

```javascript id="for-of-promises"
const promises = [
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3)
];

for (const promise of promises) {
    console.log(promise);
}
```

The loop receives the promises themselves.

For asynchronous iterables, use `for await...of`:

```javascript id="for-await-of"
for await (const value of asyncIterable) {
    console.log(value);
}
```

`for await...of` is a separate iteration construct designed to consume asynchronous iteration.

## Performance Considerations

`for...of` provides clean iterable-based semantics without requiring explicit index management.

For arrays, a traditional index-based `for` loop can sometimes provide lower-level control, but performance differences
should not be assumed without profiling.

```javascript id="for-of-performance"
for (const value of values) {
    process(value);
}
```

is often preferable to:

```javascript id="for-index-performance"
for (let index = 0; index < values.length; index++) {
    process(values[index]);
}
```

when the index is not part of the operation.

The choice should primarily be driven by semantics and readability unless profiling identifies iteration as a meaningful
performance bottleneck.

## Best Practices

* **Use `for...of` when iterating values:** It directly expresses the intent to consume values from an iterable.
* **Use `for...in` for property keys instead:** Do not interchange the two constructs. `for...in` and `for...of` operate
  on fundamentally different protocols.
* **Prefer `for...of` for arrays:** It avoids treating array indexes as the primary iteration result and does not
  accidentally include arbitrary enumerable properties.
* **Use `entries()` when indexes are required:** `for (const [index, value] of values.entries())` is clearer than
  maintaining a separate counter.
* **Use `Object.values()` for object values:** Plain objects are not iterable by default, so explicitly obtain an
  iterable of their values.
* **Use `Object.entries()` for object key/value pairs:** This makes the desired own-property enumeration explicit.
* **Use `Map` and `Set` through `for...of`:** These collections are designed around the iterable protocol.
* **Understand the iterable protocol:** `for...of` consumes `Symbol.iterator()` and repeatedly calls the resulting
  iterator's `next()` method.
* **Do not assume every object is iterable:** A plain object does not become iterable merely because it contains
  enumerable properties.
* **Prefer `const` for the loop binding:** Use `let` only when the loop body intentionally reassigns the binding.
* **Do not confuse reassignment with mutation:** Reassigning a loop variable does not modify the underlying collection
  element, while mutating a referenced object can.
* **Avoid modifying the iterable during iteration:** Adding or removing elements can affect subsequent iteration and
  make behavior difficult to reason about.
* **Understand iterator cleanup:** `break`, `return`, and `throw` can terminate iteration early and trigger iterator
  cleanup through `return()` when supported.
* **Distinguish reusable iterables from single-use iterators:** A collection such as an array can normally be iterated
  repeatedly, while an already-consumed iterator may have no values remaining.
* **Use `for await...of` for asynchronous iteration:** `for...of` does not automatically await promises or consume
  asynchronous iterables.
* **Use generators when lazy production is useful:** `for...of` integrates directly with generator-based sequences.
* **Do not optimize away readability without evidence:** Use index-based loops or other lower-level mechanisms when they
  provide a real semantic or measured performance benefit, not merely because they appear more primitive.
* **Choose the iteration construct based on the data model:** Use `for...of` for iterable values, `for...in` for
  property enumeration, and a traditional `for` when explicit counter/index control is required.
