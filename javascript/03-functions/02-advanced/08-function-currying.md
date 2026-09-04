# Currying

## Currying Concept

**Currying:** Transforming a function that accepts multiple arguments into a sequence of functions that each accept a
single argument, receiving values progressively through a chain of functions that capture previously provided values.

## Normal Functions vs Curried Functions

A normal function receives all required arguments in a single call, processes them immediately, and returns the final
result, whereas a curried function receives arguments one at a time and returns nested functions until all required
values are provided.

## Currying Structure

A curried function follows a progressive input path where each resulting function remembers previous arguments through
closures.

Input → Function → Function → Result

## Currying and Closures

Currying relies on closures to preserve received arguments so inner functions can remember outer variables and combine
additional arguments later while maintaining partial state.

## Basic Currying Behavior

A curried function receives an initial argument, stores it in a closure, returns another function to receive subsequent
arguments, and ultimately produces the final result.

## Partial Application

**Partial Application:** Creating a new function by pre-filling some arguments of another function, which currying
enables naturally to create specialized functions, predefine common configuration values, and combine operations.

| Benefit       | Description                  |
|:--------------|:-----------------------------|
| Reuse         | Create specialized functions |
| Configuration | Predefine common values      |
| Composition   | Combine smaller functions    |

## Currying Example Use

| Use Case                | Purpose                         |
|:------------------------|:--------------------------------|
| Configuration functions | Store common settings           |
| Event handlers          | Predefine behavior              |
| Data processing         | Create reusable transformations |
| Functional programming  | Build composable functions      |

## Currying vs Partial Application

Currying describes the structural transformation of a function, while partial application describes the resulting
specialized function with pre-filled arguments.

| Feature                         | Currying | Partial Application |
|:--------------------------------|:---------|:--------------------|
| Transforms function structure   | Yes      | Not required        |
| Receives one argument at a time | Usually  | Not required        |
| Creates specialized functions   | Yes      | Yes                 |
| Uses closures                   | Common   | Common              |

## Currying and Function Composition

Currying works well with function composition to combine small functions into larger behaviors, yielding reusable logic,
clear data flow, and reduced code duplication.

## Automatic Currying

Some functional programming libraries provide automatic currying wrappers that track provided arguments and execute
automatically once enough values are received, though JavaScript does not include this feature natively.

## Advantages of Currying

| Benefit       | Description                   |
|:--------------|:------------------------------|
| Reusability   | Create specialized functions  |
| Flexibility   | Provide arguments gradually   |
| Composition   | Combine smaller operations    |
| Encapsulation | Preserve configuration values |

## Limitations of Currying

| Limitation            | Description                                      |
|:----------------------|:-------------------------------------------------|
| Additional complexity | Can make simple functions harder to read         |
| Debugging difficulty  | Multiple function layers can hide execution flow |
| Syntax overhead       | Requires more function structures                |

## Currying vs Normal Functions

| Feature    | Normal Function      | Curried Function                     |
|:-----------|:---------------------|:-------------------------------------|
| Arguments  | Provided together    | Provided gradually                   |
| Structure  | Single function call | Chain of functions                   |
| Reuse      | Requires wrappers    | Built-in through partial application |
| Complexity | Lower                | Higher                               |

## Use Cases

* **Creating reusable functions:** Generate specialized versions of existing functions.
* **Building utilities:** Create configurable helper functions.
* **Functional programming:** Support composition and transformation pipelines.
* **Event handling:** Store configuration before execution.

## Best Practices

* **Use currying for reusable patterns:** Leverage it to create specialized functions without introducing unnecessary
  nesting.
* **Use when partial application provides real value:** Introduce currying only when gradual argument application yields
  concrete benefits.
* **Prefer readability to abstraction:** Ensure that added function layers do not obscure simple logic.
* **Combine with closures carefully:** Verify that captured values remain intentional and transparent.
* **Design curried functions to accept arguments in order of decreasing frequency:** Place configuration parameters,
  environment settings, or frequently reused values first to simplify partial application calls.
* **Leverage arrow functions for concise curried syntax:** Write modern, compact multi-level arrow functions (e.g.,
  `const add = a => b => a + b`) to minimize boilerplate overhead.
* **Implement flexible arity handling for advanced utilities:** Build generic currying wrappers that automatically
  determine whether to execute the target function or return another nested callback based on incoming argument counts.
* **Avoid over-currying simple utility functions:** Refrain from transforming straightforward one-parameter or
  two-parameter helpers into deeply chained curried structures if normal functions suffice.
* **Document expected parameter steps clearly:** Use descriptive JSDoc comments or TypeScript function signatures to
  outline what each level of a curried function chain expects and returns.
* **Test each stage of a curried function chain independently:** Write granular unit tests verifying the exact behavior
  and returned function shapes at every intermediate partial application step.
* **Keep curried closures lightweight:** Ensure that intermediate functions do not capture massive unused data
  structures in their scopes, preventing unexpected memory retention.
* **Combine curried functions cleanly within data pipelines:** Pair curried mapping, filtering, and reducing utilities
  smoothly with array higher-order methods or function composition helpers.
* **Avoid mixing curried and uncurried calling styles:** Maintain consistent patterns across modules so developers
  instantly recognize when a function requires sequential argument application.
* **Handle missing or undefined arguments defensively:** Validate parameters at execution time to prevent runtime errors
  if an intermediate function call receives unexpected inputs.
* **Audit performance overhead in critical loops:** Avoid executing heavy currying wrapper logic inside tight
  performance-sensitive code paths where function allocations can cause garbage collection pressure.
* **Use currying to implement dependency injection gracefully:** Preload configuration services, loggers, or database
  handles into functions progressively before passing them down as callbacks.
* **Keep closure scopes transparent during debugging:** Use named function expressions instead of anonymous arrows if
  stack traces need to clearly distinguish between nested curried layers.
* **Refactor complex curried chains into readable helpers:** Break excessively long functional curries into named
  intermediate functions if the abstraction becomes difficult for team members to parse.
* **Ensure immutability across curried arguments:** Verify that captured closure variables and passed arguments remain
  unmutated throughout the progressive invocation chain.
* **Adopt functional design patterns progressively:** Introduce currying gradually into codebases where partial
  application genuinely enhances reusability and architectural clarity.