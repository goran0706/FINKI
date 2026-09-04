# Side Effects

## Side Effect Concept

**Side Effect:** Any observable change produced by a function outside its returned value, occurring when a function
interacts with external state, systems, or resources beyond simply calculating and returning a result.

## Understanding Side Effects

A function without side effects receives input, performs calculations, returns a result, and leaves everything else
unchanged, whereas a function with side effects changes external values, produces output, or modifies application state.

## Common Side Effects

Common side effects span multiple operational categories.

| Side Effect         | Example Purpose           |
|:--------------------|:--------------------------|
| Modifying variables | Update application state  |
| Modifying objects   | Change stored data        |
| Writing files       | Persist information       |
| Network requests    | Communicate externally    |
| Logging             | Produce diagnostic output |
| DOM manipulation    | Update the interface      |
| Database operations | Store or retrieve data    |

## Side Effects and Function Output

A function can feature both a returned value and an external effect, meaning the returned value alone does not determine
whether a function is pure.

| Function Behavior                  | Classification |
|:-----------------------------------|:---------------|
| Returns calculated value only      | Pure           |
| Updates external object            | Impure         |
| Returns value and logs output      | Impure         |
| Sends request and returns response | Impure         |

## Local vs External Changes

Changes inside a function are not considered side effects unless they are observable outside the function's execution
scope.

| Change Type            | Side Effect |
|:-----------------------|:------------|
| Modify local variable  | No          |
| Create local object    | No          |
| Modify global variable | Yes         |
| Modify passed object   | Yes         |
| Update DOM             | Yes         |

## Mutable Objects and Side Effects

Objects and arrays can create accidental side effects due to pass-by-reference behavior where modifying a received
object alters the original, leading to unexpected state changes, difficult debugging, and hidden dependencies.

## Managing Side Effects

Side effects should be controlled and organized rather than eliminated, keeping external interactions close to
application boundaries while separating pure logic from mutations.

## Side Effects in Application Design

Most real-world applications require side effects to function correctly across multiple architectural domains.

| Application Area | Required Side Effect   |
|:-----------------|:-----------------------|
| User interfaces  | Update screen contents |
| APIs             | Send network requests  |
| Databases        | Store information      |
| Filesystems      | Read and write files   |
| Authentication   | Manage sessions        |

## Side Effect Isolation

**Side Effect Isolation:** Separating external interactions from internal processing logic by retrieving external data
first, processing it via pure functions, and applying required changes at the boundaries.

## Side Effects and Testing

Functions with side effects require more complex testing strategies—such as mocking external systems, preparing
application state, and cleaning up resources—unlike pure functions which verify inputs and outputs directly.

## Side Effects vs Pure Functions

| Feature                 | Pure Function | Function With Side Effects |
|:------------------------|:--------------|:---------------------------|
| Returns value           | Yes           | Possible                   |
| Modifies external state | No            | Yes                        |
| Predictability          | High          | Lower                      |
| Testing complexity      | Lower         | Higher                     |
| External interaction    | No            | Yes                        |

## Use Cases

* **State updates:** Modify application data.
* **User interface updates:** Change visible content.
* **External communication:** Interact with APIs and services.
* **Persistence:** Save information permanently.

## Best Practices

* **Make side effects explicit:** Avoid hiding external changes inside simple-looking utility functions.
* **Separate business logic from side effects:** Keep calculations independent from external operations and mutations.
* **Minimize unnecessary mutations:** Reduce unexpected state changes across shared references.
* **Document important side effects:** Clarify function behavior for other developers to prevent hidden bugs.
* **Isolate side effects at the architectural boundaries:** Restrict API calls, storage updates, and DOM modifications
  to specific service layers while keeping core domain logic pure.
* **Avoid mutating shared references passed into functions:** Use spread syntax or shallow cloning to prevent unintended
  data modifications on input objects or arrays.
* **Keep side effects transparent and predictable:** Ensure that functions performing external operations clearly
  indicate their intentions through descriptive names and return types.
* **Mock external systems during unit testing:** Replace side-effecting operations like network requests and database
  calls with test doubles to streamline test execution.
* **Control asynchronous side effects explicitly:** Manage concurrent operations using structured `async/await` patterns
  or effect management libraries to prevent race conditions.
* **Limit the use of global state modifications:** Encapsulate mutable state changes inside dedicated modules, classes,
  or state containers rather than scattering them globally.
* **Trace side effects during debugging workflows:** Use logging, breakpoints, or call stack inspection carefully to
  track down unexpected state mutations and data corruption.
* **Freeze critical configuration or state objects:** Prevent accidental object mutation side effects by locking down
  core structures using `Object.freeze()`.
* **Handle errors during side-effect execution gracefully:** Wrap network, file system, and DOM updates in robust
  `try...catch` blocks to safeguard against application crashes.
* **Document observable output changes thoroughly:** Ensure JSDoc annotations clearly specify when a function produces
  side effects like writing to logs or modifying caches.
* **Pass dependencies explicitly into side-effecting blocks:** Avoid pulling in implicit global contexts or environment
  variables directly inside operational routines.
* **Review third-party library functions for hidden mutations:** Verify that external utility functions do not modify
  parameters in place before integrating them into data pipelines.
* **Keep UI components decoupled from business calculations:** Separate the rendering logic and screen updates from core
  processing routines to maintain a clean architecture.
* **Avoid redundant side-effect operations:** Optimize application performance by caching repeated API responses or
  eliminating unnecessary local storage writes.
* **Audit state changes across asynchronous callbacks:** Verify that asynchronous events and timeout handlers do not
  overwrite shared application states unpredictably.
* **Design predictable data flow pipelines:** Combine isolated boundary side effects with a pure computational core to
  maximize code maintainability and long-term scalability.