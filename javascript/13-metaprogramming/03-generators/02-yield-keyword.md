# The JavaScript Yield Keyword

The `yield` keyword is the fundamental mechanism that drives JavaScript generator functions. It allows a generator to
pause its execution, emit a value to the caller, and retain its internal execution state until resumed.

## Core Syntax and Mechanics

When a generator function executes and encounters a `yield` expression, it evaluates the expression following `yield`,
packages it into an `IteratorResult` object `{ value, done: false }`, and suspends further execution.

```javascript
function* numberEmitter() {
    yield 100;
    yield 200;
    return 300;
}

const gen = numberEmitter();
console.log(gen.next()); // { value: 100, done: false }
console.log(gen.next()); // { value: 200, done: false }
console.log(gen.next()); // { value: 300, done: true }
```

## Two-Way Data Flow and Resumption Values

The `yield` keyword does not only output data outward; it also receives input data passed into the generator via the
`.next(value)` method call. The value passed to `.next()` becomes the evaluation result of the suspended `yield`
expression.

```javascript
function* accumulator() {
    let total = 0;
    while (true) {
        const increment = yield total;
        if (increment !== undefined) {
            total += increment;
        }
    }
}

const acc = accumulator();
console.log(acc.next());     // { value: 0, done: false }
console.log(acc.next(10));   // { value: 10, done: false }
console.log(acc.next(5));    // { value: 15, done: false }
```

## Delegation with Yield Star (`yield*`)

The `yield*` expression delegates control of iteration to another iterable or generator object. It iterates through the
operand completely, yielding each value sequentially before returning execution to the parent generator.

```javascript
function* innerStream() {
    yield 'a';
    yield 'b';
}

function* outerStream() {
    yield 1;
    yield* innerStream();
    yield 2;
}

console.log([...outerStream()]); // Outputs: [1, 'a', 'b', 2]
```

## Comparative Analysis of Yield Expression Behaviors

| Expression Syntax   | Behavior                                          | Target Operand Type                      |
|:--------------------|:--------------------------------------------------|:-----------------------------------------|
| `yield expression`  | Suspends execution and emits the evaluated value. | Any JavaScript value                     |
| `yield* expression` | Delegates iteration to a nested iterable object.  | Any iterable (`Array`, `Set`, Generator) |

## Production Best Practices

* **Validate resumption inputs:** Always check whether values passed into `yield` via `.next(val)` are defined before
  performing arithmetic or object property access.
* **Use `yield*` for collection composition:** Prefer `yield*` over manual `for...of` delegation loops when flattening
  nested generators to maintain clean and concise codebases.