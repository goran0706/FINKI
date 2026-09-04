# Function Return

## return Statement

**`return` Statement:** A control flow statement used inside functions to terminate execution and optionally provide a
value back to the caller. When a `return` statement executes, the function stops immediately, skipping remaining
statements and passing the returned value to the caller, whereas a function with no returned value implicitly provides
`undefined`.

| Action                  | Result               |
|:------------------------|:---------------------|
| Function body execution | Stops immediately    |
| Remaining statements    | Are skipped          |
| Returned value          | Passed to the caller |
| No returned value       | Returns `undefined`  |

## Returning Values

**Return Value:** The value produced by a function and transferred back to the code that invoked it. JavaScript
functions can return any valid JavaScript value, ranging from primitive data and complex objects to functions and
special values, which can then be stored, passed into another operation, or ignored.

| Value Category   | Examples                                     |
|:-----------------|:---------------------------------------------|
| Primitive values | Numbers, strings, booleans, symbols, bigints |
| Objects          | Objects, arrays, dates                       |
| Functions        | Function objects                             |
| Special values   | `null`, `undefined`, `NaN`                   |

## Function Output

Functions can be categorized by whether they produce a meaningful return value. While value-producing functions
calculate and return a result, side-effect function variants perform an action without returning useful data, and
because JavaScript does not enforce return types, functions can return varying types depending on execution conditions.

| Function Type            | Behavior                                         |
|:-------------------------|:-------------------------------------------------|
| Value-producing function | Calculates and returns a result                  |
| Side-effect function     | Performs an action without returning useful data |

## Implicit Undefined Return

**Implicit `undefined` Return:** The automatic return value produced when a function finishes execution without
executing a `return` statement. Regular functions return `undefined` when no return statement exists, when execution
reaches the end of the body, or when an empty return executes.

| Situation                    | Result              |
|:-----------------------------|:--------------------|
| No `return` statement exists | Returns `undefined` |
| Execution reaches the end    | Returns `undefined` |
| Empty `return` executes      | Returns `undefined` |

## Explicit Empty Return

**Empty `return`:** A return statement written without a value. An empty return terminates function execution
immediately but provides no result, causing the caller to receive `undefined`, which makes it commonly used for early
termination when no output is required.

## Early Return

**Early Return:** A function design pattern where execution exits immediately when a specific condition is reached.
Early returns simplify logic by reducing nested conditions through input validation and guard clauses that handle
special cases before the main logic runs.

| Purpose           | Description                   |
|:------------------|:------------------------------|
| Validation        | Stop invalid input processing |
| Guard clauses     | Handle special cases first    |
| Simplifying logic | Reduce nested conditions      |

## Multiple Return Paths

**Multiple Return Paths:** A function structure where different execution conditions produce different return values.
Good return design ensures that each execution path maintains consistency, clarity, and completeness.

| Principle    | Description                                    |
|:-------------|:-----------------------------------------------|
| Consistency  | Similar inputs produce predictable outputs     |
| Clarity      | Returned values represent the function purpose |
| Completeness | All meaningful conditions are handled          |

## Returning Objects

Functions can return objects containing multiple related values. Returning objects is useful when a function needs to
provide several pieces of information together for configurations, results, or factory creation.

| Pattern               | Purpose                             |
|:----------------------|:------------------------------------|
| Configuration objects | Return grouped settings             |
| Result objects        | Return data with status information |
| Factory functions     | Create and return new objects       |

## Returning Functions

Functions can return other functions because functions are first-class objects. Returning functions enables powerful
structural patterns like closures, customized factory functions, and higher-order functions that generate reusable
behavior.

| Pattern                | Purpose                                  |
|:-----------------------|:-----------------------------------------|
| Closures               | Preserve access to surrounding variables |
| Factory functions      | Create customized functions              |
| Higher-order functions | Generate reusable behavior               |

## return and Function Scope

The `return` statement affects only the function where it appears. It does not stop the entire program, exit unrelated
functions, or terminate outer execution contexts, allowing execution to continue normally from the location where the
function was invoked.

| Action                             | Result |
|:-----------------------------------|:-------|
| Stop the entire program            | No     |
| Exit unrelated functions           | No     |
| Terminate outer execution contexts | No     |

## Best Practices

* **Return values that represent the function purpose:** Ensure that every return value clearly communicates the actual
  result of the operation.
* **Use explicit returns for important values:** Maintain clear return behavior so functions remain easy to understand
  and debug.
* **Avoid inconsistent return types:** Prevent unpredictable usage by avoiding unrelated value types returned from
  different execution paths.
* **Use early returns to simplify conditions:** Implement guard clauses to reduce unnecessary code nesting and handle
  edge cases upfront.
* **Separate calculation from side effects when possible:** Keep functions predictable by dividing output generation
  from external state changes.