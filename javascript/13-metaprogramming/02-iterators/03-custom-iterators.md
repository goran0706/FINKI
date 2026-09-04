# Custom Iterators in JavaScript

Custom iterators enable developers to design bespoke iteration logic, lazy data processing pipelines, infinite
sequences, and specialized data structure traversals that integrate natively into standard JavaScript constructs like
`for...of` loops and spread syntax.

## Architectural Design Patterns for Custom Iterators

Building robust custom iterators involves combining the iterable protocol (`Symbol.iterator`) with the iterator
protocol (`next()`). By encapsulating state within a factory function or class instance, iterators can maintain cursor
positions, track traversal limits, and handle complex data transformations on the fly without materializing entire
datasets in memory.

### Stateful Iterator Classes

When implementing custom iteration logic requiring explicit state tracking across multiple traversal passes, defining a
dedicated class implementing both protocols is a reliable approach.

```javascript
class RangeStepIterator {
    constructor(start, end, step) {
        this.current = start;
        this.end = end;
        this.step = step;
    }

    [Symbol.iterator]() {
        return this;
    }

    next() {
        if (this.step > 0 ? this.current <= this.end : this.current >= this.end) {
            const value = this.current;
            this.current += this.step;
            return {value, done: false};
        }
        return {value: undefined, done: true};
    }
}

const range = new RangeStepIterator(0, 10, 3);
for (const n of range) {
    console.log(n); // Outputs: 0, 3, 6, 9
}
```

### Generator-Based Custom Iterators

JavaScript generator functions (`function*`) provide syntactic sugar that automatically constructs both iterable and
iterator protocols. They maintain local execution state across yields, making them the preferred pattern for custom
iteration.

```javascript
class PrimeNumberGenerator {
    constructor(limit) {
        this.limit = limit;
    }

    #isPrime(num) {
        if (num < 2) return false;
        for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
            if (num % i === 0) return false;
        }
        return true;
    }

    * [Symbol.iterator]() {
        let count = 0;
        let candidate = 2;

        while (count < this.limit) {
            if (this.#isPrime(candidate)) {
                yield candidate;
                count++;
            }
            candidate++;
        }
    }
}

const primes = new PrimeNumberGenerator(5);
console.log([...primes]); // Outputs: [2, 3, 5, 7, 11]
```

## Lazy Evaluation and Stream Pipelines

Custom iterators excel at lazy evaluation, allowing developers to chain transformations without intermediate array
allocations. This pattern mirrors functional stream APIs while operating entirely on synchronous generator functions.

```javascript
function* filter(iterable, predicate) {
    for (const item of iterable) {
        if (predicate(item)) {
            yield item;
        }
    }
}

function* map(iterable, mapper) {
    for (const item of iterable) {
        yield mapper(item);
    }
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const pipeline = map(
    filter(numbers, (n) => n % 2 === 0),
    (n) => n * 10
);

console.log([...pipeline]); // Outputs: [20, 40, 60, 80, 100]
```

## Error Handling and Resource Cleanup

When custom iterators interact with external resources such as database connections, file streams, or network sockets,
managing premature termination is critical. Iteration constructs like `for...of` invoke the iterator's optional
`return()` method when exiting early via a `break` or `throw` statement.

```javascript
class ManagedFileIterator {
    constructor(lines) {
        this.lines = lines;
        this.index = 0;
        this.isOpen = true;
    }

    [Symbol.iterator]() {
        return this;
    }

    next() {
        if (!this.isOpen || this.index >= this.lines.length) {
            return {value: undefined, done: true};
        }
        return {value: this.lines[this.index++], done: false};
    }

    return(value) {
        if (this.isOpen) {
            console.log('Closing file resource handle...');
            this.isOpen = false;
        }
        return {value, done: true};
    }
}
```

## Comparative Analysis of Iterator Construction Methods

| Construction Method         | State Management             | Syntax Complexity               | Resource Cleanup Support                      |
|:----------------------------|:-----------------------------|:--------------------------------|:----------------------------------------------|
| **Generator Functions**     | Automatic via local scope    | Minimal (declarative `yield`)   | Implicit via `try...finally` blocks           |
| **Manual Iterator Classes** | Explicit instance properties | Moderate (boilerplate `next()`) | Explicit via `return()` method implementation |
| **Array-Based Wrappers**    | Eager materialization        | Low                             | None (relies on garbage collection)           |

## Performance Profiles and Memory Optimization

Custom iterators bypass memory allocation overhead by processing elements one at a time. However, excessive closure
capture within generator functions or complex iterator nesting can introduce minor execution overhead compared to native
loops.

### Avoiding Memory Leaks

When implementing custom iterators over large datasets, ensure that internal references to completed nodes or parsed
buffers are cleared to allow garbage collection sweeps to reclaim memory.

## Best Practices

* **Prefer generators for readability:** Use generator functions (`function*`) for custom iteration logic to reduce
  boilerplate state machine code.
* **Implement cleanup logic in `finally` blocks:** Within generator functions, wrap resource-acquiring code in
  `try...finally` blocks to guarantee resource release during early loop breaks.
* **Keep iterators immutable regarding structure:** Avoid mutating underlying collections structurally while an iterator
  is actively traversing them unless explicitly protected by version checks.