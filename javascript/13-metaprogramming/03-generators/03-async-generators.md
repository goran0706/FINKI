# Asynchronous Generators in JavaScript

Asynchronous generators combine the deferred execution model of generator functions with asynchronous promises,
utilizing the `async function*` syntax. They return asynchronous iterators that enable sequential data consumption using
`for await...of` loops, making them the standard architectural pattern for streaming data pipelines, paginated API
fetching, and asynchronous event processing.

## Architectural Foundations and Syntax

An asynchronous generator function returns an async generator object. Unlike standard synchronous generators whose
`next()` method returns an `{ value, done }` result object directly, an async generator's `next()` method returns a
`Promise` that resolves to the iterator result object.

```javascript
async function* asyncNumberStream(limit) {
    for (let i = 1; i <= limit; i++) {
        // Simulate network or IO latency
        await new Promise((resolve) => setTimeout(resolve, 100));
        yield i;
    }
}

async function consumeAsyncStream() {
    const stream = asyncNumberStream(3);
    for await (const value of stream) {
        console.log(value); // Outputs: 1, 2, 3 with a 100ms delay between each
    }
}

consumeAsyncStream();
```

## Consuming Async Iterators Manually

While `for await...of` loops provide high-level abstraction for consuming async iterators, developers can also invoke
the underlying asynchronous methods manually by interacting with the returned promises directly.

```javascript
const stream = asyncNumberStream(2);

stream.next().then((result) => console.log(result)); // Promise resolves to { value: 1, done: false }
stream.next().then((result) => console.log(result)); // Promise resolves to { value: 2, done: false }
stream.next().then((result) => console.log(result)); // Promise resolves to { value: undefined, done: true }
```

## Delegation via Async Yield Star (`yield*`)

Async generators support delegation using `yield*`, allowing them to delegate iteration control to other asynchronous
iterables, standard synchronous iterables, or nested async generator functions.

```javascript
async function* innerAsyncSource() {
    yield 'alpha';
    yield 'beta';
}

async function* compositeAsyncStream() {
    yield 'start';
    yield* innerAsyncSource();
    yield 'end';
}

async function runComposition() {
    for await (const item of compositeAsyncStream()) {
        console.log(item); // Outputs: 'start', 'alpha', 'beta', 'end'
    }
}

runComposition();
```

## Comparative Analysis of Synchronous vs. Asynchronous Generators

| Feature                   | Synchronous Generators (`function*`)                  | Asynchronous Generators (`async function*`)            |
|:--------------------------|:------------------------------------------------------|:-------------------------------------------------------|
| **Return Signature**      | Iterator object yielding immediate values             | Async Iterator object yielding Promises                |
| **Consumption Construct** | `for...of` loops, spread syntax (`...`)               | `for await...of` loops                                 |
| **Primary Use Case**      | In-memory lazy collections and custom data structures | Stream processing, file chunks, paginated API requests |

## Production Best Practices

* **Ensure proper error handling with `try...catch`:** Wrap asynchronous operations inside `try...catch` blocks within
  async generators to handle network timeouts or rejected promises gracefully.
* **Guarantee resource cleanup:** Utilize `try...finally` blocks inside async generators to close database connections
  or stream sockets when consumers terminate iteration early via `break` or `throw`.