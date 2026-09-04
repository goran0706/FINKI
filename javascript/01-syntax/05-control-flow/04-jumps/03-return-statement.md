# Return Statement

The `return` statement terminates execution of the current function and optionally provides a value to the caller. It
transfers control from the function body back to the point where the function was invoked.

```javascript id="return-basic"
function add(a, b) {
    return a + b;
}

const result = add(2, 3);

console.log(result); // 5
```

A `return` statement can either return a value or terminate the function without returning an explicit value.

```javascript id="return-forms"
function stop() {
    return;
}

function getValue() {
    return 42;
}
```

When execution reaches `return`, the function immediately stops executing its remaining body.

## Return Syntax

The general syntax is:

```javascript id="return-syntax"
return;
return expression;
```

`return;` terminates the function and produces `undefined`.

```javascript id="return-undefined"
function stop() {
    return;
}

console.log(stop()); // undefined
```

`return expression;` evaluates the expression and returns its resulting value.

```javascript id="return-expression"
function calculate() {
    const value = 10 * 5;

    return value;
}

console.log(calculate()); // 50
```

The expression is evaluated before the function returns.

```javascript id="return-evaluation"
function calculate() {
    return 10 + 20 * 2;
}

console.log(calculate()); // 50
```

## Returning `undefined`

A function that reaches its closing brace without executing a `return` statement returns `undefined`.

```javascript id="implicit-undefined"
function noReturn() {
    const value = 42;
}

console.log(noReturn()); // undefined
```

The same result occurs with an explicit `return;`.

```javascript id="explicit-undefined"
function explicitUndefined() {
    return;
}

console.log(explicitUndefined()); // undefined
```

There is therefore a distinction between returning no explicit value and returning a specific value such as `null`.

```javascript id="undefined-vs-null"
function missingValue() {
    return;
}

function emptyValue() {
    return null;
}

console.log(missingValue()); // undefined
console.log(emptyValue());   // null
```

`undefined` and `null` are different values and should not be treated as interchangeable.

## Expression Evaluation

The expression following `return` is evaluated before control leaves the function.

```javascript id="return-evaluation-order"
function calculate() {
    const first = 10;
    const second = 20;

    return first + second;
}
```

Any side effects required to evaluate the expression occur before the function returns.

```javascript id="return-side-effect"
let count = 0;

function increment() {
    return ++count;
}

console.log(increment()); // 1
console.log(count);       // 1
```

Function calls used as part of the returned expression are also evaluated first.

```javascript id="return-function-call"
function getValue() {
    return calculate();
}

function calculate() {
    return 42;
}
```

Returning an expression does not defer its evaluation.

## Function Termination

A `return` statement immediately terminates the current function execution.

```javascript id="return-termination"
function process() {
    console.log("before");

    return 42;

    console.log("after");
}

process();

// before
```

The statement after `return` is unreachable.

```javascript id="unreachable-return"
function example() {
    return true;

    // Unreachable
    performWork();
}
```

`return` therefore acts as a control-flow transfer as well as a value-producing statement.

## Return from Normal Functions

Regular functions can return any JavaScript value.

```javascript id="return-values"
function returnNumber() {
    return 42;
}

function returnString() {
    return "hello";
}

function returnBoolean() {
    return true;
}

function returnObject() {
    return {
        name: "Alice"
    };
}

function returnArray() {
    return [1, 2, 3];
}
```

Functions can also return functions.

```javascript id="return-function"
function createGreeter() {
    return function greet(name) {
        return `Hello, ${name}`;
    };
}

const greet = createGreeter();

console.log(greet("Alice")); // Hello, Alice
```

A function can return any JavaScript value because functions are first-class values.

## Return from Arrow Functions

Arrow functions support two return forms.

A concise arrow function implicitly returns the expression following `=>`.

```javascript id="arrow-implicit-return"
const add = (a, b) => a + b;

console.log(add(2, 3)); // 5
```

An arrow function with a block body requires an explicit `return`.

```javascript id="arrow-explicit-return"
const add = (a, b) => {
    return a + b;
};
```

These forms are equivalent in their returned value.

```javascript id="arrow-equivalent"
const first = value => value * 2;

const second = value => {
    return value * 2;
};
```

A block-bodied arrow function that does not explicitly return a value produces `undefined`.

```javascript id="arrow-no-return"
const calculate = value => {
    value * 2;
};

console.log(calculate(10)); // undefined
```

A concise arrow body cannot contain an explicit `return` statement.

```javascript id="arrow-invalid-return"
const calculate = value =>
return value * 2;
```

The expression itself is the implicit return value.

## Returning Object Literals from Arrow Functions

A concise arrow function returning an object literal requires parentheses around the object.

```javascript id="arrow-object-return"
const createUser = name => ({
    name
});

console.log(createUser("Alice"));
```

Without parentheses, `{}` is interpreted as a block body rather than an object literal.

```javascript id="arrow-object-block"
const createUser = name => {
    name;
};

console.log(createUser("Alice")); // undefined
```

The explicit-return form avoids this ambiguity.

```javascript id="arrow-object-explicit"
const createUser = name => {
    return {
        name
    };
};
```

## Return from Class Methods

Class methods can use `return` in the same way as other functions.

```javascript id="class-method-return"
class Calculator {
    add(a, b) {
        return a + b;
    }
}

const calculator = new Calculator();

console.log(calculator.add(2, 3)); // 5
```

A `return` from a method terminates that method invocation.

```javascript id="class-method-termination"
class User {
    getName() {
        return this.name;

        console.log("unreachable");
    }
}
```

Static methods also return values normally.

```javascript id="static-method-return"
class MathUtil {
    static square(value) {
        return value * value;
    }
}

console.log(MathUtil.square(5)); // 25
```

## Return from Constructors

Constructors have special return semantics.

A base constructor normally produces the newly created instance. If a constructor explicitly returns an object, that
object becomes the result of the `new` expression.

```javascript id="constructor-object-return"
class Example {
    constructor() {
        return {
            value: 42
        };
    }
}

const instance = new Example();

console.log(instance.value); // 42
```

Returning a primitive value from a base constructor does not replace the constructed object.

```javascript id="constructor-primitive-return"
class Example {
    constructor() {
        return 42;
    }
}

const instance = new Example();

console.log(instance instanceof Example); // true
```

Constructor return behavior is therefore different from ordinary functions.

## Return from Nested Blocks

A `return` statement does not merely exit the nearest block. It exits the entire current function.

```javascript id="return-block"
function example(value) {
    if (value > 10) {
        return "large";
    }

    return "small";
}
```

The `return` exits the function even though it occurs inside an `if` block.

The same applies to nested blocks.

```javascript id="return-nested-block"
function example() {
    {
        {
            return 42;
        }
    }

    console.log("unreachable");
}
```

JavaScript does not have a block-local `return`.

## Return from Loops

A `return` inside a loop terminates the entire function, not merely the current iteration.

```javascript id="return-loop"
function findFirstEven(values) {
    for (const value of values) {
        if (value % 2 === 0) {
            return value;
        }
    }

    return undefined;
}

console.log(findFirstEven([1, 3, 6, 9])); // 6
```

This differs fundamentally from `break`.

```javascript id="return-vs-break"
function example(values) {
    for (const value of values) {
        if (value === 5) {
            break;
        }
    }

    return "function continues";
}
```

`break` exits the loop while `return` exits the function.

A `return` inside nested loops exits all loops belonging to the current function.

```javascript id="return-nested-loops"
function findPair(matrix) {
    for (const row of matrix) {
        for (const value of row) {
            if (value === 42) {
                return value;
            }
        }
    }

    return undefined;
}
```

## Return from `switch`

A `return` can be used directly inside a `switch` statement.

```javascript id="return-switch"
function getLabel(value) {
    switch (value) {
        case 1:
            return "one";

        case 2:
            return "two";

        default:
            return "unknown";
    }
}
```

Because `return` terminates the function, a `break` is unnecessary when every branch returns.

```javascript id="switch-return"
function describe(value) {
    switch (value) {
        case "active":
            return "The value is active";

        case "inactive":
            return "The value is inactive";

        default:
            return "Unknown state";
    }
}
```

This is different from a `switch` that merely exits a case with `break`.

## Return and `break`

`return` and `break` both transfer control, but their scopes are different.

| Statement  | Effect                                                       |
|:-----------|:-------------------------------------------------------------|
| `return`   | Exits the current function                                   |
| `break`    | Exits the nearest applicable loop or `switch`                |
| `continue` | Skips the remainder of the current loop iteration            |
| `throw`    | Exits the current execution path by propagating an exception |

Example:

```javascript id="return-break-continue"
function findValue(values) {
    for (const value of values) {
        if (value === null) {
            continue;
        }

        if (value === -1) {
            break;
        }

        if (value === 42) {
            return value;
        }
    }

    return undefined;
}
```

The three statements produce different control-flow behavior even though they may occur in the same loop.

## Return from Callbacks

A `return` inside a callback exits the callback function, not the function that created or invoked the callback.

```javascript id="callback-return"
function process(values) {
    values.forEach(value => {
        if (value < 0) {
            return;
        }

        console.log(value);
    });

    console.log("finished");
}
```

Here, `return` only terminates the current callback invocation.

It does not terminate `process()`.

```javascript id="callback-return-function"
function process(values) {
    values.forEach(value => {
        return value;
    });

    console.log("still executes");
}
```

The returned value from the callback is handled according to the API invoking the callback.

## Return from `forEach()`

`return` cannot be used inside a `forEach()` callback to return from the containing function.

```javascript id="foreach-return"
function findValue(values) {
    values.forEach(value => {
        if (value === 42) {
            return value;
        }
    });

    return undefined;
}
```

The `return value` only returns from that particular callback invocation.

If the function itself needs to terminate when a value is found, a loop or a method designed for searching should be
used.

```javascript id="foreach-search-alternative"
function findValue(values) {
    for (const value of values) {
        if (value === 42) {
            return value;
        }
    }

    return undefined;
}
```

Methods such as `find()` have their own callback return semantics.

```javascript id="find-return"
const value = values.find(value => value === 42);
```

Here, returning `true` from the callback indicates that the desired element has been found; it does not return from the
containing function.

## Return from `map()`

`map()` uses callback return values as the values of the resulting array.

```javascript id="map-return"
const doubled = [1, 2, 3].map(value => {
    return value * 2;
});

console.log(doubled); // [2, 4, 6]
```

The callback's `return` therefore has meaning to `map()`.

It still does not terminate the function containing the `map()` call.

```javascript id="map-return-containing"
function calculate(values) {
    const result = values.map(value => {
        return value * 2;
    });

    return result;
}
```

Callback return semantics must therefore be distinguished from function return semantics.

## Return from Recursive Functions

A recursive function uses `return` to propagate the result of a recursive call.

```javascript id="recursive-return"
function factorial(n) {
    if (n <= 1) {
        return 1;
    }

    return n * factorial(n - 1);
}
```

The recursive call returns its result to the previous invocation, which incorporates that result into its own returned
expression.

```javascript id="recursive-return-flow"
function countdown(n) {
    if (n === 0) {
        return "done";
    }

    return countdown(n - 1);
}
```

Every invocation eventually returns a value to its caller.

## Early Returns

An early return terminates a function as soon as a condition determines that further processing is unnecessary.

```javascript id="early-return"
function getDiscount(user) {
    if (!user) {
        return 0;
    }

    if (!user.isMember) {
        return 0;
    }

    return 10;
}
```

Early returns can prevent unnecessary nesting and make exit conditions explicit.

```javascript id="early-return-nesting"
function process(value) {
    if (value === null) {
        return;
    }

    if (!isValid(value)) {
        return;
    }

    performWork(value);
}
```

This style is commonly called a guard-clause pattern.

## Return and Guard Clauses

Guard clauses place invalid or exceptional conditions before the main function logic.

```javascript id="guard-clause"
function calculateTotal(order) {
    if (!order) {
        return 0;
    }

    if (order.items.length === 0) {
        return 0;
    }

    return calculateItems(order.items);
}
```

Guard clauses reduce nesting and make preconditions explicit.

Without guard clauses, the same logic can become more deeply nested.

```javascript id="nested-condition"
function calculateTotal(order) {
    if (order) {
        if (order.items.length > 0) {
            return calculateItems(order.items);
        }
    }

    return 0;
}
```

The appropriate style depends on the complexity and conventions of the codebase.

## Return and `try...catch`

A `return` inside `try` schedules the function's completion, but the `finally` block still executes before the function
actually completes.

```javascript id="return-try-finally"
function process() {
    try {
        return 42;
    } finally {
        console.log("cleanup");
    }
}

console.log(process());

// cleanup
// 42
```

The `finally` block therefore executes even when the `try` block contains a `return`.

A `return` inside `catch` behaves similarly.

```javascript id="return-catch"
function process() {
    try {
        performWork();
    } catch (error) {
        return "failed";
    }

    return "success";
}
```

If an exception occurs, the `catch` block returns `"failed"` and the function terminates after any applicable `finally`
block executes.

## Return and `finally`

A `finally` block can override a pending `return`.

```javascript id="finally-overrides-return"
function example() {
    try {
        return 1;
    } finally {
        return 2;
    }
}

console.log(example()); // 2
```

The `return` in `finally` replaces the earlier pending completion.

The same principle applies to exceptions.

```javascript id="finally-overrides-throw"
function example() {
    try {
        throw new Error("failure");
    } finally {
        return "recovered";
    }
}

console.log(example()); // recovered
```

The exception is suppressed by the `return` in `finally`.

Returning from `finally` should therefore generally be avoided because it can unexpectedly override both return values
and thrown exceptions.

```javascript id="finally-danger"
function process() {
    try {
        return calculate();
    } finally {
        return cleanupResult();
    }
}
```

The value from `calculate()` is discarded if `finally` executes its own `return`.

## Return and Resource Cleanup

`finally` is useful when cleanup must occur regardless of whether a function returns normally or throws.

```javascript id="return-cleanup"
function process(resource) {
    try {
        return processResource(resource);
    } finally {
        resource.close();
    }
}
```

The cleanup occurs before the function completes.

The cleanup itself should generally not replace the function's return value.

```javascript id="cleanup-no-return"
function process(resource) {
    try {
        return processResource(resource);
    } finally {
        resource.close();
    }
}
```

This preserves the return value from `processResource()`.

## Automatic Semicolon Insertion and `return`

`return` is affected by a restricted line terminator rule.

A line terminator immediately following `return` causes the statement to terminate.

```javascript id="return-line-break"
function example() {
    return
    42;
}

console.log(example()); // undefined
```

The code is effectively interpreted as:

```javascript id="return-line-break-equivalent"
function example() {
    return;
    42;
}
```

The `42` is unreachable.

The expression should therefore be kept on the same line as `return`.

```javascript id="return-correct-line"
function example() {
    return 42;
}
```

This is particularly important when returning object literals.

```javascript id="return-object-line-break"
function createObject() {
    return {
        value: 42
    };
}
```

Do not place the object expression on the next line after `return`.

```javascript id="return-object-invalid-style"
function createObject() {
    return
    {
        value: 42
    }
    ;
}
```

This returns `undefined` and leaves the object literal as unreachable code.

## Return from Async Functions

An `async` function always returns a `Promise`.

```javascript id="async-return"
async function getValue() {
    return 42;
}

getValue().then(value => {
    console.log(value); // 42
});
```

The returned value becomes the fulfillment value of the promise.

Conceptually:

```javascript id="async-return-promise"
async function getValue() {
    return 42;
}
```

behaves as a function whose result is a fulfilled promise containing `42`.

Returning a promise from an async function causes the function's returned promise to adopt the appropriate state and
value of that promise.

```javascript id="async-return-promise-value"
async function getValue() {
    return Promise.resolve(42);
}

const result = await getValue();

console.log(result); // 42
```

An exception thrown from an async function causes its returned promise to reject.

```javascript id="async-return-throw"
async function getValue() {
    throw new Error("failure");
}

getValue().catch(error => {
    console.log(error.message); // failure
});
```

## `return await` in Async Functions

`return await` explicitly awaits a promise before producing the function's completion.

```javascript id="return-await"
async function getValue() {
    return await fetchValue();
}
```

One important distinction appears when `try...catch` is involved.

```javascript id="return-await-catch"
async function getValue() {
    try {
        return await fetchValue();
    } catch (error) {
        return null;
    }
}
```

The `await` occurs while still inside the `try` block, allowing a rejection from `fetchValue()` to be caught by the
surrounding `catch`.

By contrast:

```javascript id="return-promise-catch"
async function getValue() {
    try {
        return fetchValue();
    } catch (error) {
        return null;
    }
}
```

The promise is returned directly. A later rejection of that promise is not caught by this synchronous `catch`.

`return await` therefore has a meaningful role when the returned promise must participate in the surrounding
`try...catch` or `try...finally` control flow.

## Return from Generators

Generator functions can use `return`.

```javascript id="generator-return"
function* values() {
    yield 1;
    yield 2;
    return 3;
}
```

The `return` produces the generator's final iterator result.

```javascript id="generator-result"
const iterator = values();

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: true }
```

The generator's return value is different from a yielded value.

`yield` produces an intermediate iterator result:

```javascript id="generator-yield"
function* values() {
    yield 1;
    yield 2;
}
```

`return` completes the generator.

A `for...of` loop does not expose the generator's final return value.

```javascript id="generator-for-of"
function* values() {
    yield 1;
    yield 2;
    return 3;
}

for (const value of values()) {
    console.log(value);
}

// 1
// 2
```

The `3` is the generator's completion value, not an iterated value.

## Return and `Generator.prototype.return()`

Generators also expose a `return()` operation that requests termination of the generator.

```javascript id="generator-return-method"
function* values() {
    try {
        yield 1;
        yield 2;
    } finally {
        console.log("cleanup");
    }
}

const iterator = values();

console.log(iterator.next());   // { value: 1, done: false }
console.log(iterator.return(42)); // { value: 42, done: true }
```

If the generator has a `finally` block, that cleanup code executes during termination.

This is distinct from writing `return` inside the generator body.

## Return and Function Boundaries

A `return` only affects the function in which it appears.

```javascript id="return-boundary"
function outer() {
    inner();

    console.log("outer continues");
}

function inner() {
    return;
}

outer();

// outer continues
```

The `return` in `inner()` does not terminate `outer()`.

Similarly, a callback's `return` does not terminate its caller.

```javascript id="return-callback-boundary"
function outer(values) {
    values.forEach(value => {
        return;
    });

    console.log("outer continues");
}
```

Function boundaries therefore determine the scope of `return`.

## Return and Nested Function Definitions

Defining a nested function does not change the meaning of `return`.

```javascript id="nested-function-return"
function outer() {
    function inner() {
        return 42;
    }

    console.log("outer");
}

outer();
```

A `return` inside `inner()` belongs to `inner()`.

```javascript id="nested-function-boundary"
function outer() {
    function inner() {
        return 42;
    }

    inner();

    return 100;
}
```

The `return 42` terminates `inner()`, after which execution resumes in `outer()`.

## Return and Closures

A returned function can retain access to variables from its defining scope.

```javascript id="return-closure"
function createCounter() {
    let count = 0;

    return function () {
        count++;
        return count;
    };
}

const counter = createCounter();

console.log(counter()); // 1
console.log(counter()); // 2
```

The outer `return` returns the function value. Later calls to that returned function execute independently while
retaining the closure.

## Return and Unreachable Code

Code after an unconditional `return` cannot execute.

```javascript id="unreachable-code"
function example() {
    return 42;

    performWork();
}
```

Unreachable code often indicates one of the following:

* accidental control flow
* obsolete code left after a refactoring
* an incorrect branch structure
* a misplaced `return`

Conditional returns do not necessarily make later code unreachable.

```javascript id="conditional-return"
function example(value) {
    if (value > 10) {
        return "large";
    }

    return "small";
}
```

The second `return` remains reachable when `value <= 10`.

## Return Type Consistency

A function can technically return values of different types.

```javascript id="mixed-return-types"
function getValue(condition) {
    if (condition) {
        return 42;
    }

    return "unknown";
}
```

Although valid JavaScript, inconsistent return types can make an API harder to consume.

Prefer a consistent return contract where practical.

```javascript id="consistent-return"
function getValue(condition) {
    if (condition) {
        return 42;
    }

    return 0;
}
```

Alternatively, explicitly represent different states using a consistent structure.

```javascript id="structured-return"
function getValue(condition) {
    if (condition) {
        return {
            found: true,
            value: 42
        };
    }

    return {
        found: false,
        value: null
    };
}
```

The appropriate contract depends on the API and domain model.

## Return and Side Effects

A return expression can contain side effects.

```javascript id="return-side-effect-expression"
let count = 0;

function next() {
    return count++;
}
```

The expression is evaluated before the function terminates.

Although valid, excessive side effects inside return expressions can make control flow harder to reason about.

Prefer separating complex state changes when doing so improves clarity.

```javascript id="return-side-effect-explicit"
function next() {
    const value = count;
    count++;

    return value;
}
```

## Return in Conditional Branches

Multiple branches can return different results.

```javascript id="return-branches"
function classify(value) {
    if (value > 0) {
        return "positive";
    }

    if (value < 0) {
        return "negative";
    }

    return "zero";
}
```

This pattern is particularly useful when every branch produces a complete result.

```javascript id="return-exhaustive-branches"
function getStatus(active) {
    if (active) {
        return "active";
    }

    return "inactive";
}
```

An explicit final return can also provide a fallback for conditions that do not match earlier branches.

## Return and `throw`

`return` represents successful function completion, while `throw` represents exceptional completion.

```javascript id="return-vs-throw"
function parseValue(value) {
    if (value === null) {
        throw new Error("Value is required");
    }

    return value;
}
```

The two forms communicate different contracts:

```javascript id="return-throw-contract"
function getValue(value) {
    if (value === null) {
        return null;
    }

    return value;
}
```

Returning `null` communicates a normal result representing absence, while throwing communicates that execution cannot
continue normally.

The appropriate choice depends on the API contract.

## Return from `finally` and Control-Flow Completion

A `return` statement creates a pending return completion, but surrounding control-flow constructs can affect whether
that completion becomes the final result.

The most important case is `finally`.

```javascript id="finally-return-completion"
function example() {
    try {
        return "try";
    } finally {
        console.log("finally");
    }
}
```

The `finally` block executes before `"try"` is delivered to the caller.

If `finally` itself returns:

```javascript id="finally-replaces-completion"
function example() {
    try {
        return "try";
    } finally {
        return "finally";
    }
}
```

The final result is `"finally"`.

The same principle means a `finally` block can suppress an exception, `break`, or `continue`. Returning from `finally`
should therefore be treated as a high-risk control-flow construct.

## Return in `switch` inside Loops

A `return` inside a `switch` nested within a loop exits the entire function.

```javascript id="return-switch-loop"
function findCommand(commands) {
    for (const command of commands) {
        switch (command) {
            case "start":
                return "starting";

            case "stop":
                return "stopping";
        }
    }

    return "unknown";
}
```

This differs from `break`, which would only exit the nearest applicable `switch` or loop depending on its location.

## Return and Control-Flow Complexity

Multiple returns are not inherently problematic.

```javascript id="multiple-returns"
function validate(user) {
    if (!user) {
        return false;
    }

    if (!user.name) {
        return false;
    }

    if (!user.email) {
        return false;
    }

    return true;
}
```

Multiple returns can make independent termination conditions explicit.

The problem arises when return paths become difficult to reason about or when different branches expose inconsistent
contracts.

```javascript id="complex-return-paths"
function process(value) {
    if (conditionA(value)) {
        if (conditionB(value)) {
            return resultA(value);
        }

        return resultB(value);
    }

    if (conditionC(value)) {
        return resultC(value);
    }

    return resultD(value);
}
```

The number of return statements should be driven by control-flow clarity rather than an arbitrary rule such as "one
return per function."

## Best Practices

* **Return explicitly when a function produces a meaningful result.** Make the function's output obvious at the point
  where it is produced.
* **Keep the returned expression on the same line as `return`.** This avoids the restricted line-terminator behavior of
  `return`.
* **Use early returns for guard conditions.** Reject invalid or exceptional states before entering the main processing
  path.
* **Use `return` when the entire function should terminate.** Use `break` when only the current loop or `switch` should
  terminate.
* **Remember function boundaries.** A `return` inside a callback exits the callback, not the surrounding function.
* **Do not use `return` inside `forEach()` expecting to exit the containing function.** Use an ordinary loop or an
  appropriate array method when the containing function must terminate.
* **Keep return contracts consistent.** Avoid unnecessary mixtures of unrelated return types when a stable API contract
  can be provided.
* **Use explicit `return` in block-bodied arrow functions.** A block body does not implicitly return its final
  expression.
* **Use parentheses for object literals returned from concise arrow functions.** Write `value => ({ value })`, not
  `value => { value }`.
* **Avoid returning from `finally`.** A `return` in `finally` can override an earlier return or suppress a thrown
  exception.
* **Use `return await` deliberately in async functions.** It is particularly relevant when a rejection must be handled
  by surrounding `try...catch` or `try...finally`.
* **Use `return` to make successful completion explicit.** Do not rely on implicit `undefined` when the function's
  contract expects a meaningful result.
* **Use `return` consistently across conditional branches.** Ensure that all relevant paths produce a defined and
  intentional result.
* **Do not add unnecessary temporary variables solely before simple returns.** Direct returns are often clearer when the
  expression is simple.
* **Separate complex side effects from return expressions when clarity benefits.** Evaluation order remains explicit and
  easier to inspect.
* **Treat constructor returns differently from ordinary function returns.** Returning an object from a base constructor
  can replace the constructed instance, while returning a primitive does not.
* **Remember that generator `return` completes the generator.** Its value is the final iterator result and is not
  yielded to `for...of`.
* **Use return values according to the callback API's contract.** Methods such as `map()`, `filter()`, `find()`, and
  `reduce()` assign specific meanings to callback return values.
* **Do not confuse callback termination with outer-function termination.** A callback is a separate function execution
  boundary.
* **Prefer readable control flow over artificial single-return rules.** Multiple well-placed returns can be clearer than
  deeply nested conditional logic.
* **Keep unreachable code out of function bodies.** Statements after unconditional `return` cannot execute and usually
  indicate dead or obsolete logic.
