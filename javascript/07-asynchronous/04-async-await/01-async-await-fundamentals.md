# Async Await Fundamentals

Modern JavaScript asynchronous programming relies heavily on the `async` and `await` keywords, which provide syntactic
sugar built directly on top of ECMAScript promises to simplify asynchronous control flow. Introduced to address the
verbosity and cognitive overhead of managing explicit `.then()` and `.catch()` chains, async functions allow developers
to write asynchronous code that mimics the structure and readability of synchronous execution. The `async` keyword
transforms a standard function into an asynchronous execution unit that automatically manages promise-based resolution
boundaries under the hood. Concurrently, the `await` keyword enables developers to pause the execution of an async
function until a targeted promise settles, making asynchronous coordination seamless and intuitive.

The relationship between async/await and promises is foundational, as `async` and `await` do not introduce a separate
asynchronous model; rather, they serve as a specialized abstraction layer over standard JavaScript promises. Every async
function implicitly returns a promise, and any value returned from within that function is automatically wrapped in a
resolved promise. Similarly, the `await` operator can pause execution only when operating on a promise or a thenable
object. Understanding this underlying architecture ensures that developers can interchange promise chains and
async/await syntax fluidly while avoiding common misconceptions about how asynchronous microtasks are scheduled across
the event loop.

| Syntax Element   | Primary Role                                                           | Underlying Mechanism                                             |
|:-----------------|:-----------------------------------------------------------------------|:-----------------------------------------------------------------|
| `async` Function | Defines a function that operates asynchronously and returns a promise. | Automatically wraps return values and handles thrown exceptions. |
| `await` Operator | Pauses execution inside an async function until a promise settles.     | Unwraps promise fulfillment values or throws rejection reasons.  |
| Promise Base     | The underlying concurrency primitive powering async/await.             | Manages asynchronous state transitions via the microtask queue.  |

Async functions represent the architectural entry point for writing modern, readable asynchronous code blocks in
JavaScript applications. When the JavaScript engine invokes an `async` function, it alters the function's return
behavior. Instead of executing purely synchronously and returning a primitive or undefined, an async function always
returns a promise instance. If the function completes successfully, its returned promise fulfills with the final return
value; if an unhandled exception is thrown inside the function body, its returned promise rejects immediately with that
error.

The `await` keyword provides the mechanism for suspending function execution until an asynchronous operation finishes
and returns its settlement value. When placed before a promise, `await` pauses the execution of the surrounding async
function, yielding control back to the outer event loop so the main thread remains responsive. Once the target promise
fulfills, the `await` expression evaluates to the fulfillment value and resumes the function's execution context. If the
targeted promise rejects, the `await` operator throws the rejection reason directly into the function context, allowing
standard error interception patterns to handle the failure seamlessly.

### Best Practices

* **Syntactic Consistency:** Adopt async/await uniformly across modern codebases to eliminate fragmented control flow
  patterns mixed with raw promise chaining.
* **Await Placement:** Restrict the use of the `await` keyword strictly to within `async` functions or top-level module
  scopes to prevent syntax errors.
* **Promise Awareness:** Remember that `await` pauses only the internal execution of the enclosing async function,
  leaving the broader event loop unblocked.
* **Return Normalization:** Avoid redundantly wrapping values in explicit `Promise.resolve()` calls inside async
  functions since the runtime already wraps return values automatically.