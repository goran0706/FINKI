# Closures

## Closure Introduction

**Closure:** A combination of a function bundled together (enclosed) with references to its surrounding state (the
lexical environment), giving an inner function access to an outer function's scope even after the outer function has
finished executing and returned.

| Feature            | Behavior                                          |
|:-------------------|:--------------------------------------------------|
| Scope Access       | Inner function retains outer scope variables      |
| Lifetime           | Variables persist beyond outer function execution |
| State Privacy      | Enables true private variables in JavaScript      |
| Memory Implication | Retained references prevent garbage collection    |

## How Closures Work

Closures are created automatically every time a function is created, at function creation time. When an inner function
is defined inside another function, it maintains a permanent hidden link to its outer function's variable environment.

| Component                | Purpose                                     |
|:-------------------------|:--------------------------------------------|
| Lexical Environment      | Holds local variables of the outer function |
| Inner Function Reference | Keeps the environment alive in memory       |
| Scope Chain              | Resolves variable lookups across layers     |

## Lexical Scoping Foundation

Closures rely entirely on lexical scoping, meaning variable accessibility is determined by the physical placement of
functions and blocks within the source code during compilation, not by how or where the function is invoked.

| Scope Type           | Description                              |
|:---------------------|:-----------------------------------------|
| Global Scope         | Accessible everywhere in the application |
| Outer Function Scope | Accessible to nested inner functions     |
| Inner Function Scope | Isolated from outer execution contexts   |

## Data Privacy and Encapsulation

Closures provide a mechanism for data encapsulation, allowing developers to create private state variables that cannot
be accessed or modified directly from the outside except through privileged methods.

| Access Level        | Mechanism                                     |
|:--------------------|:----------------------------------------------|
| Public Interface    | Returned functions/methods with access rights |
| Private State       | Local variables trapped inside the closure    |
| Direct Modification | Blocked by function boundary boundaries       |

## Closures in Loops

Using closures inside asynchronous loops or event handlers can lead to common scoping bugs when variables like `var` are
shared across iterations, requiring block-scoped declarations (`let`) to create fresh bindings per loop cycle.

| Declaration Type | Loop Behavior                                  |
|:-----------------|:-----------------------------------------------|
| `var`            | Shares a single hoisted variable binding       |
| `let`            | Creates a unique lexical binding per iteration |

## Memory Management and Garbage Collection

Normally, local function variables are garbage-collected as soon as execution leaves the function scope. However, if a
closure references those variables, they remain stored in memory as long as the inner function reference is active.

| Condition            | Garbage Collection Status                 |
|:---------------------|:------------------------------------------|
| No active reference  | Variables are swept from memory           |
| Active closure link  | Variables are preserved in heap memory    |
| Unreferenced closure | Eligible for collection once handles drop |

## Performance Considerations

While powerful, excessive or careless use of closures can lead to elevated memory consumption because enclosing scopes
cannot be cleared, potentially impacting application performance if large objects are unnecessarily retained.

## Common Closure Patterns

| Pattern           | Use Case                                       |
|:------------------|:-----------------------------------------------|
| Factory Functions | Generating customized objects or behavior      |
| Module Pattern    | Grouping public methods and private state      |
| Memoization       | Caching expensive function execution results   |
| Currying          | Transforming functions with multiple arguments |

## Best Practices

* **Use closures for data encapsulation:** Hide private implementation details and expose controlled interfaces using
  factory functions or modules.
* **Be mindful of memory leaks:** Release references to closures or large enclosed objects when they are no longer
  needed to allow garbage collection.
* **Use `let` or `const` in loops:** Prevent shared-variable bugs in asynchronous or iterative closures by leveraging
  block-scoped variables.
* **Avoid unnecessary nesting:** Keep closure chains shallow to maintain code readability and simplify debugging stack
  traces.
* **Leverage closures for memoization:** Cache calculation results efficiently inside closure scopes for
  performance-critical algorithms.
* **Understand variable retention:** Remember that all variables in the lexical environment are retained, not just the
  ones explicitly used.
* **Use currying to pre-configure functions:** Build specialized utility functions dynamically using closures and
  partial application.
* **Document private states clearly:** Mark encapsulated closure variables with descriptive naming conventions or
  private syntax indicators.
* **Test memory usage under load:** Monitor heap allocations in long-running applications that rely heavily on
  persistent closures.
* **Do not overcomplicate state management:** Use closures where lightweight encapsulation helps, but lean toward
  classes or state libraries for complex architectures.
* **Keep inner functions pure where possible:** Minimize side effects inside closures to make asynchronous workflows
  predictable.
* **Be cautious with event listener closures:** Ensure components or event handlers clean up references to prevent
  leaked DOM-bound state.
* **Recognize hidden closures in callbacks:** Remember that timers, promises, and array iterators inherently create
  closures over their surrounding scope.
* **Use factory functions over constructors where lightweight state is preferred:** Leverage closures for clean,
  prototype-free object creation.
* **Balance modularity with readability:** Ensure closure-based modules remain modular and testable without tight
  coupling.

