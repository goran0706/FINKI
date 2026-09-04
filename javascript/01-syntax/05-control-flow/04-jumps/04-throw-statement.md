# Throw Statement

The `throw` statement terminates normal execution of the current control-flow path by creating an exception completion
and transferring control to the nearest applicable exception handler.

```javascript id="throw-basic"
function divide(a, b) {
    if (b === 0) {
        throw new Error("Division by zero");
    }

    return a / b;
}
```

If an exception is thrown and no applicable handler catches it, the exception propagates through the caller chain until
it reaches the host environment.

```javascript id="throw-unhandled"
throw new Error("Something went wrong");
```

An exception can be caught using `try...catch`.

```javascript id="throw-catch"
try {
    throw new Error("Something went wrong");
} catch (error) {
    console.log(error.message); // Something went wrong
}
```

## Throw Syntax

The general syntax is:

```javascript id="throw-syntax"
throw expression;
```

The expression is evaluated and its resulting value becomes the thrown value.

```javascript id="throw-expression"
throw new Error("Invalid value");
```

The expression can technically produce any JavaScript value.

```javascript id="throw-values"
throw "error";
throw 42;
throw false;
throw null;
throw {code: "INVALID_VALUE"};
```

JavaScript does not syntactically require the thrown value to be an `Error`.

However, throwing `Error` objects is the standard practice because they provide structured error information such as a
message and stack trace.

```javascript id="throw-error-object"
throw new Error("Invalid value");
```

## Throwing `Error` Objects

The built-in `Error` constructor is the normal foundation for exceptions.

```javascript id="throw-error"
function validate(value) {
    if (value === null) {
        throw new Error("Value is required");
    }
}
```

The resulting error contains information that can be inspected by an exception handler.

```javascript id="inspect-error"
try {
    validate(null);
} catch (error) {
    console.log(error.name);
    console.log(error.message);
    console.log(error.stack);
}
```

The `name`, `message`, and `stack` properties are commonly used when diagnosing errors, although the exact availability
and formatting of `stack` is implementation-dependent.

## Error Subclasses

JavaScript provides specialized built-in error types.

```javascript id="built-in-errors"
throw new TypeError("Expected a string");
throw new RangeError("Value is outside the allowed range");
throw new ReferenceError("Unknown variable");
throw new SyntaxError("Invalid syntax");
throw new URIError("Invalid URI");
```

The error type should communicate the category of failure.

For example:

```javascript id="type-error"
function getLength(value) {
    if (typeof value !== "string") {
        throw new TypeError("Expected a string");
    }

    return value.length;
}
```

`TypeError` indicates that the value has an inappropriate type or cannot be used in the required way.

## Custom Error Classes

Applications can define their own error classes by extending `Error`.

```javascript id="custom-error"
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

throw new ValidationError("Email is required");
```

Custom error types allow callers to distinguish different failure categories.

```javascript id="custom-error-check"
try {
    validateUser(user);
} catch (error) {
    if (error instanceof ValidationError) {
        handleValidationError(error);
    } else {
        throw error;
    }
}
```

A custom error class should preserve the normal `Error` inheritance chain.

## Error Causes

An error can preserve an underlying cause using the `cause` option.

```javascript id="error-cause"
try {
    readConfiguration();
} catch (error) {
    throw new Error("Failed to load configuration", {
        cause: error
    });
}
```

The original error can then be accessed through `cause`.

```javascript id="error-cause-access"
try {
    loadApplication();
} catch (error) {
    console.log(error.message);
    console.log(error.cause);
}
```

Error causes are useful when adding higher-level context without discarding the original failure.

## Throw and Function Execution

A `throw` statement immediately abandons normal execution of the current function.

```javascript id="throw-termination"
function process(value) {
    if (!value) {
        throw new Error("Value is required");
    }

    console.log("processing");
}
```

If the exception is not caught inside the function, execution does not continue with the next statement.

```javascript id="throw-unreachable"
function process() {
    throw new Error("failure");

    performWork();
}
```

`performWork()` is unreachable because the function has already entered exceptional completion.

## Throw and `try...catch`

A `throw` transfers control to the nearest matching `catch` clause.

```javascript id="throw-try-catch"
try {
    throw new Error("failure");
} catch (error) {
    console.log("handled");
}
```

The statements following `throw` inside the `try` block are not executed.

```javascript id="throw-flow"
try {
    console.log("before");

    throw new Error("failure");

    console.log("after");
} catch (error) {
    console.log("caught");
}

// before
// caught
```

The exception handler receives the thrown value through the `catch` binding.

## Catch Binding

The `catch` clause can bind the thrown value to a variable.

```javascript id="catch-binding"
try {
    throw new Error("failure");
} catch (error) {
    console.log(error.message);
}
```

The binding is scoped to the `catch` block.

```javascript id="catch-scope"
try {
    throw new Error("failure");
} catch (error) {
    console.log(error.message);
}

// error is not available here
```

The catch binding can be omitted when the error value is not needed.

```javascript id="optional-catch-binding"
try {
    performWork();
} catch {
    recover();
}
```

## Rethrowing Exceptions

A `catch` block can rethrow the exception instead of handling it completely.

```javascript id="rethrow"
try {
    process();
} catch (error) {
    logError(error);
    throw error;
}
```

Rethrowing preserves the exception's propagation through the caller chain.

This is useful when a layer performs logging or cleanup but does not own the responsibility for recovering from the
failure.

## Throwing a New Error While Handling Another

A catch block can also create a new higher-level error.

```javascript id="wrap-error"
try {
    readFile();
} catch (error) {
    throw new Error("Unable to load configuration", {
        cause: error
    });
}
```

The new exception adds contextual information while retaining the original error through `cause`.

## Throw and Call Stack Propagation

If a function throws an exception without handling it, the exception propagates to its caller.

```javascript id="throw-propagation"
function inner() {
    throw new Error("failure");
}

function middle() {
    inner();
}

function outer() {
    middle();
}

try {
    outer();
} catch (error) {
    console.log(error.message); // failure
}
```

The exception moves outward through the call stack until an applicable handler is found.

The function that throws does not need to know where the exception will eventually be handled.

## Unhandled Exceptions

If an exception reaches the top-level execution environment without being handled, it becomes an unhandled exception.

```javascript id="unhandled"
function process() {
    throw new Error("fatal failure");
}

process();
```

The host environment determines how an unhandled exception is reported or handled.

In a browser this may result in an uncaught error being reported to the console and relevant global error mechanisms
being invoked.

In server-side environments, the runtime may report the exception and potentially terminate the process depending on the
environment and surrounding infrastructure.

## Throw and Conditional Validation

`throw` is commonly used to enforce preconditions.

```javascript id="validation"
function setAge(age) {
    if (typeof age !== "number") {
        throw new TypeError("Age must be a number");
    }

    if (age < 0) {
        throw new RangeError("Age cannot be negative");
    }

    return age;
}
```

Each failure condition terminates normal processing immediately.

```javascript id="validation-guards"
function createUser(name) {
    if (!name) {
        throw new Error("Name is required");
    }

    if (name.length > 100) {
        throw new RangeError("Name is too long");
    }

    return {
        name
    };
}
```

This is commonly combined with guard clauses.

## Throw and `if` Statements

A `throw` can appear in any conditional branch.

```javascript id="throw-if"
function getValue(value) {
    if (value === null) {
        throw new Error("Value cannot be null");
    }

    if (value === undefined) {
        throw new Error("Value cannot be undefined");
    }

    return value;
}
```

Conditional validation should generally reject invalid states as close as practical to the boundary where they are
detected.

## Throw and Loops

A `throw` inside a loop terminates the current function unless the exception is caught by a handler.

```javascript id="throw-loop"
function process(values) {
    for (const value of values) {
        if (!isValid(value)) {
            throw new Error("Invalid value");
        }

        processValue(value);
    }
}
```

Unlike `break`, `throw` does not merely terminate the loop.

```javascript id="throw-vs-break"
function process(values) {
    for (const value of values) {
        if (value === null) {
            break;
        }
    }

    return "completed";
}
```

`break` produces normal control-flow completion of the loop.

`throw` produces exceptional completion and transfers control to an exception handler.

## Throw from Nested Loops

A `throw` inside nested loops exits the current function's normal execution path.

```javascript id="throw-nested-loops"
function findInvalid(matrix) {
    for (const row of matrix) {
        for (const value of row) {
            if (!isValid(value)) {
                throw new Error("Invalid value");
            }
        }
    }
}
```

It does not require separate `break` statements for each loop.

## Throw and `switch`

A `throw` can be used inside a `switch` branch.

```javascript id="throw-switch"
function processStatus(status) {
    switch (status) {
        case "active":
            return processActive();

        case "inactive":
            return processInactive();

        default:
            throw new Error(`Unknown status: ${status}`);
    }
}
```

The `throw` terminates the function's normal execution path.

No `break` is required after an unconditional `throw`.

## Throw and `return`

`return` and `throw` both terminate normal execution of the current function, but they represent different completion
types.

```javascript id="return-throw"
function getValue(value) {
    if (value === null) {
        throw new Error("Value is required");
    }

    return value;
}
```

`return` communicates successful function completion with a value.

`throw` communicates exceptional completion.

The caller handles them differently:

```javascript id="return-throw-handling"
try {
    const value = getValue(input);
    console.log(value);
} catch (error) {
    handleError(error);
}
```

A returned value is part of the function's normal API result. A thrown exception must be handled through exception
control flow or propagated further.

## Throw and `break`

`break` exits a loop or `switch`.

```javascript id="break"
for (const value of values) {
    if (value === 42) {
        break;
    }
}
```

`throw` instead transfers control to exception handling.

```javascript id="throw-loop-handler"
try {
    for (const value of values) {
        if (!isValid(value)) {
            throw new Error("Invalid value");
        }
    }
} catch (error) {
    handleError(error);
}
```

Use `break` for expected loop termination and `throw` for exceptional conditions.

## Throw and `continue`

`continue` skips the remainder of the current loop iteration.

```javascript id="continue"
for (const value of values) {
    if (value === null) {
        continue;
    }

    processValue(value);
}
```

`throw` instead abandons the normal iteration process.

```javascript id="throw-continue"
for (const value of values) {
    if (!isValid(value)) {
        throw new Error("Invalid value");
    }

    processValue(value);
}
```

The choice depends on whether the condition is expected and recoverable within the loop or represents an exceptional
failure.

## Throw and `finally`

A `finally` block executes when control leaves a `try` statement, including when the `try` block throws.

```javascript id="throw-finally"
function process(resource) {
    try {
        return processResource(resource);
    } finally {
        resource.close();
    }
}
```

If `processResource()` throws, `finally` still executes before the exception propagates.

```javascript id="throw-finally-cleanup"
function process(resource) {
    try {
        processResource(resource);
    } finally {
        resource.close();
    }
}
```

This makes `finally` appropriate for mandatory cleanup.

## Throw from `finally`

A `throw` inside `finally` can replace a pending completion.

```javascript id="finally-throws"
function process() {
    try {
        throw new Error("original");
    } finally {
        throw new Error("replacement");
    }
}
```

The original exception is replaced by the exception thrown from `finally`.

The same principle applies to a pending `return`.

```javascript id="return-replaced-by-throw"
function process() {
    try {
        return 42;
    } finally {
        throw new Error("failure");
    }
}
```

The function does not return `42`; the exception from `finally` becomes the final completion.

Throwing from `finally` should therefore be deliberate because it can suppress an earlier return or exception.

## Throw and `try...catch...finally`

A complete exception-handling structure can separate recovery and cleanup.

```javascript id="try-catch-finally"
function process(resource) {
    try {
        return processResource(resource);
    } catch (error) {
        logError(error);
        throw error;
    } finally {
        resource.close();
    }
}
```

The flow is:

1. Execute the `try` block.
2. If an exception occurs, execute the applicable `catch`.
3. Execute `finally`.
4. Complete normally or propagate the remaining exception.

A `catch` block is optional when only cleanup is required.

```javascript id="try-finally"
function process(resource) {
    try {
        return processResource(resource);
    } finally {
        resource.close();
    }
}
```

## Throw and `catch` Scope

A `throw` can be caught by an enclosing `try` even when the throw originates several nested function calls below it.

```javascript id="nested-throw-catch"
function lowLevel() {
    throw new Error("failure");
}

function highLevel() {
    lowLevel();
}

try {
    highLevel();
} catch (error) {
    handleError(error);
}
```

The `catch` does not need to be in the same function that contains the `throw`.

## Throw and Function Boundaries

Unlike `return`, an exception can propagate across function boundaries.

```javascript id="throw-function-boundary"
function inner() {
    throw new Error("failure");
}

function outer() {
    inner();
}

try {
    outer();
} catch (error) {
    console.log(error.message);
}
```

The exception travels from `inner()` through `outer()` until the `catch` handler handles it.

However, an exception cannot automatically transfer into a separate asynchronous callback execution context merely
because that callback was created by the throwing function.

```javascript id="throw-callback-boundary"
try {
    setTimeout(() => {
        throw new Error("failure");
    }, 0);
} catch (error) {
    // Does not catch the asynchronous exception.
}
```

The callback executes later, after the surrounding synchronous `try...catch` has already completed.

The asynchronous operation must provide its own error-handling mechanism.

## Throw in Promise Callbacks

Exceptions thrown inside promise callbacks become rejected promises.

```javascript id="throw-promise"
Promise.resolve()
    .then(() => {
        throw new Error("failure");
    })
    .catch(error => {
        console.log(error.message); // failure
    });
```

The `throw` does not escape synchronously into an outer `try...catch`.

```javascript id="throw-promise-sync-catch"
try {
    Promise.resolve().then(() => {
        throw new Error("failure");
    });
} catch (error) {
    // Does not catch the rejection.
}
```

The promise chain must handle the rejection.

## Throw in `async` Functions

An exception thrown from an `async` function causes its returned promise to reject.

```javascript id="async-throw"
async function process() {
    throw new Error("failure");
}

process().catch(error => {
    console.log(error.message); // failure
});
```

An async function can therefore use ordinary `throw` syntax for asynchronous error signaling.

```javascript id="async-validation"
async function loadUser(id) {
    if (!id) {
        throw new Error("User ID is required");
    }

    return fetchUser(id);
}
```

The caller handles the resulting rejection.

```javascript id="async-catch"
try {
    const user = await loadUser(id);
} catch (error) {
    handleError(error);
}
```

## Throw and Promise Rejection

Throwing inside an async function is equivalent at the API boundary to returning a rejected promise.

```javascript id="async-rejection"
async function fail() {
    throw new Error("failure");
}
```

The caller receives a rejected promise:

```javascript id="async-rejection-catch"
fail().catch(error => {
    console.log(error.message);
});
```

This allows synchronous-looking exception syntax inside asynchronous functions while preserving promise-based error
propagation.

## Throw and Generators

A generator can throw an exception using `throw`.

```javascript id="generator-throw"
function* values() {
    yield 1;
    throw new Error("failure");
}
```

The exception becomes observable when the generator is advanced.

```javascript id="generator-throw-catch"
const iterator = values();

console.log(iterator.next()); // { value: 1, done: false }

try {
    iterator.next();
} catch (error) {
    console.log(error.message); // failure
}
```

Generators also expose a `throw()` method that injects an exception into the suspended generator.

```javascript id="generator-throw-method"
function* values() {
    try {
        yield 1;
    } catch (error) {
        yield `handled: ${error.message}`;
    }
}

const iterator = values();

console.log(iterator.next());
console.log(iterator.throw(new Error("failure")));
```

The generator can handle the injected exception using its own `try...catch`.

## Throw and Iterator Cleanup

Abrupt completion caused by `throw` can trigger iterator cleanup when iteration is active.

```javascript id="throw-iterator-cleanup"
function* values() {
    try {
        yield 1;
        yield 2;
    } finally {
        console.log("cleanup");
    }
}

function process() {
    for (const value of values()) {
        if (value === 2) {
            throw new Error("failure");
        }
    }
}

try {
    process();
} catch (error) {
    console.log(error.message);
}

// cleanup
// failure
```

The iterator's cleanup behavior is part of the semantics of iterator-consuming constructs such as `for...of`.

## Throw and Object Values

Although any value can be thrown, throwing non-`Error` values is generally discouraged.

```javascript id="throw-non-error"
throw "failure";
```

This forces consumers to handle values that may not provide standard error properties.

```javascript id="catch-non-error"
try {
    throw "failure";
} catch (error) {
    console.log(error);
}
```

A thrown `Error` provides a more consistent interface.

```javascript id="throw-standard-error"
throw new Error("failure");
```

Application code should normally establish a convention that exceptions are `Error` instances or subclasses.

## Throw and Error Identity

A caught error object retains its identity when rethrown.

```javascript id="rethrow-identity"
try {
    throw new Error("failure");
} catch (error) {
    throw error;
}
```

The same error object is propagated.

When adding context, creating a new error with `cause` preserves the relationship between the higher-level error and the
original failure.

```javascript id="error-context"
try {
    performOperation();
} catch (error) {
    throw new Error("Operation failed", {
        cause: error
    });
}
```

## Throw and Error Handling Responsibility

Not every function that encounters an exception should catch it.

```javascript id="propagate-error"
function repositoryOperation() {
    throw new Error("Database failure");
}

function serviceOperation() {
    return repositoryOperation();
}

function requestHandler() {
    try {
        return serviceOperation();
    } catch (error) {
        return handleFailure(error);
    }
}
```

The lower-level function can allow the exception to propagate until a layer has enough context to recover meaningfully.

Catching an exception only to immediately rethrow it without adding information or performing required cleanup is
usually unnecessary.

## Throw and Recovery

A `catch` block should generally perform a meaningful recovery, translation, logging operation, or cleanup-related
action.

```javascript id="meaningful-catch"
try {
    loadConfiguration();
} catch (error) {
    throw new ConfigurationError("Configuration could not be loaded", {
        cause: error
    });
}
```

Catching and silently ignoring failures can hide application defects.

```javascript id="silent-catch"
try {
    performCriticalOperation();
} catch {
    // Failure disappears.
}
```

Silent recovery should only be used when the failure is intentionally irrelevant and the behavior is documented by the
surrounding logic.

## Throw and Validation Boundaries

Input validation is commonly performed at system boundaries.

```javascript id="boundary-validation"
function createAccount(input) {
    if (typeof input !== "object" || input === null) {
        throw new TypeError("Input must be an object");
    }

    if (typeof input.email !== "string") {
        throw new TypeError("Email must be a string");
    }

    return createAccountFromInput(input);
}
```

This establishes a clear contract for downstream code.

Once validated, internal functions can often operate under stronger assumptions.

## Throw and Domain Errors

Application-level failures can use domain-specific error classes.

```javascript id="domain-error"
class InsufficientFundsError extends Error {
    constructor(balance, amount) {
        super("Insufficient funds");
        this.name = "InsufficientFundsError";
        this.balance = balance;
        this.amount = amount;
    }
}
```

The domain operation can throw the specific error.

```javascript id="domain-throw"
function withdraw(account, amount) {
    if (amount > account.balance) {
        throw new InsufficientFundsError(account.balance, amount);
    }

    account.balance -= amount;
}
```

The caller can then distinguish this expected domain failure from unrelated programming or infrastructure errors.

```javascript id="domain-catch"
try {
    withdraw(account, amount);
} catch (error) {
    if (error instanceof InsufficientFundsError) {
        notifyInsufficientFunds(error);
    } else {
        throw error;
    }
}
```

## Throw and Control-Flow Complexity

Exceptions are a control-flow mechanism and should therefore be used deliberately.

Normal expected branching should generally use ordinary control-flow constructs.

```javascript id="normal-branch"
function getStatus(value) {
    if (value === null) {
        return "missing";
    }

    return "available";
}
```

Exceptions are better suited to failures that should interrupt the normal operation.

```javascript id="exceptional-branch"
function parseConfiguration(text) {
    if (!isValidConfiguration(text)) {
        throw new Error("Invalid configuration");
    }

    return parse(text);
}
```

Using exceptions as ordinary branching can obscure the function's normal control flow.

## Throw and Performance

Throwing an exception is generally more expensive than ordinary branching because exception handling involves
exceptional control flow and stack/context management.

This is not normally a reason to avoid exceptions for genuine failures.

```javascript id="appropriate-throw"
function parseNumber(value) {
    if (!isValidNumber(value)) {
        throw new TypeError("Invalid number");
    }

    return Number(value);
}
```

It is instead a reason to avoid using exceptions as a routine mechanism for expected high-frequency decisions.

Prefer explicit results when failure is an ordinary part of the algorithm.

```javascript id="explicit-result"
function tryParseNumber(value) {
    if (!isValidNumber(value)) {
        return {
            success: false
        };
    }

    return {
        success: true,
        value: Number(value)
    };
}
```

The appropriate mechanism depends on the API contract and expected control flow.

## Throw and Resource Cleanup

When an exception can occur during resource processing, cleanup should be protected using `finally` or an API-specific
resource-management mechanism.

```javascript id="throw-resource-cleanup"
function process(resource) {
    try {
        return processResource(resource);
    } finally {
        resource.close();
    }
}
```

The cleanup occurs whether processing returns normally or throws.

## Throw and `return` in `finally`

A `return` in `finally` can suppress a thrown exception.

```javascript id="throw-suppressed"
function process() {
    try {
        throw new Error("failure");
    } finally {
        return;
    }
}
```

The exception does not propagate because the `finally` block completes with its own `return`.

This is one of the strongest reasons to avoid `return` statements in `finally` blocks.

## Best Practices

* **Throw `Error` objects rather than arbitrary primitive values.** This provides a consistent error interface and
  preserves diagnostic information such as the message and stack.
* **Use the most appropriate built-in error type.** Use `TypeError`, `RangeError`, and other specialized types when they
  accurately describe the failure.
* **Use custom error classes for domain-specific failures.** Custom types allow callers to distinguish expected
  application failures from unrelated errors.
* **Use `cause` when wrapping lower-level errors.** Add higher-level context without discarding the original failure.
* **Throw for exceptional conditions.** Do not use exceptions as a replacement for ordinary `if`, `break`, `continue`,
  or return-based control flow.
* **Validate inputs at appropriate boundaries.** Reject invalid data before it reaches code that assumes stronger
  invariants.
* **Allow errors to propagate to the layer responsible for handling them.** A function does not need to catch every
  exception it encounters.
* **Rethrow when the current layer cannot recover.** Perform logging, cleanup, translation, or other meaningful work
  before propagating the error.
* **Do not silently swallow important exceptions.** An empty `catch` can hide failures and make diagnosis significantly
  harder.
* **Avoid unnecessary catch-and-rethrow operations.** If no context, recovery, logging, or translation is added,
  allowing the exception to propagate is usually clearer.
* **Use `finally` for mandatory cleanup.** It executes when leaving the associated `try` statement, including when an
  exception is thrown.
* **Avoid `return` or `throw` from `finally` unless deliberately overriding an earlier completion.** Either can suppress
  a pending return or exception.
* **Remember that `throw` exits normal control flow.** Statements after an unconditional `throw` are unreachable.
* **Distinguish synchronous and asynchronous boundaries.** A synchronous `try...catch` does not catch an exception
  thrown later inside an asynchronous callback.
* **Handle promise rejections through promise or async control flow.** Exceptions thrown in promise callbacks become
  promise rejections.
* **Use `throw` naturally inside `async` functions.** The resulting promise is rejected with the thrown error.
* **Use domain-specific errors when callers need different recovery behavior.** Error identity is part of an API's
  control-flow contract.
* **Preserve the original error when translating failures.** Prefer `cause` over discarding the lower-level exception.
* **Do not rely on implementation-specific `stack` formatting.** Use standard error properties for program logic and
  treat stack traces primarily as diagnostic information.
* **Prefer explicit result values for expected, high-frequency failure paths.** Exceptions are better suited to
  genuinely exceptional control flow.
* **Keep exception boundaries intentional.** A clear distinction between normal results and exceptional failures makes
  larger systems easier to reason about and maintain.
