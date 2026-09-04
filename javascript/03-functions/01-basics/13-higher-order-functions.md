# Higher-Order Functions

## Higher-Order Function Concept

**Higher-Order Function:** A function that accepts one or more functions as arguments, returns a function, or both, made
possible because JavaScript treats functions as first-class values that allow behavior to be passed, combined, and
generated dynamically.

## Functions Accepting Functions

A function that receives another function—commonly called a callback—as an argument can control when and how that
function executes to customize behavior, separate processing from execution, handle events, or process data.

| Purpose             | Description                        |
|:--------------------|:-----------------------------------|
| Custom behavior     | Allow callers to provide logic     |
| Reusable operations | Separate processing from execution |
| Event handling      | Execute logic after an event       |
| Data processing     | Transform or filter values         |

## Functions Returning Functions

A higher-order function can create and return another function, preserving access to variables from the original scope
through closures to enable patterns like function factories, configuration functions, and partial application.

| Pattern                 | Purpose                       |
|:------------------------|:------------------------------|
| Function factories      | Generate customized functions |
| Configuration functions | Create reusable behavior      |
| Partial application     | Pre-fill function inputs      |

## Creating Functions Inside Functions

Functions can be declared or created inside other functions, where nested functions maintain access to their own
variables, parameters, outer function variables, and global scope, creating the structural foundation for closures.

| Accessible Data          | Availability |
|:-------------------------|:-------------|
| Own variables            | Yes          |
| Parameters               | Yes          |
| Outer function variables | Yes          |
| Global scope             | Yes          |

## Higher-Order Function Structure

A higher-order function separates execution flow control within the main function from customizable behavior defined by
the provided function, allowing the same structure to perform multiple operations.

| Responsibility    | Description                   |
|:------------------|:------------------------------|
| Main function     | Controls execution flow       |
| Provided function | Defines customizable behavior |

## Built-In Higher-Order Functions

JavaScript provides many built-in higher-order functions across array processing, asynchronous operations, and event
systems.

| Feature         | Purpose                        |
|:----------------|:-------------------------------|
| Array methods   | Process collections            |
| Promise methods | Handle asynchronous operations |
| Event systems   | Respond to runtime events      |

## Higher-Order Array Operations

Array methods use functions as arguments to perform operations on collection elements like transformation, filtering,
searching, and reduction, expressing behavior separately from iteration logic.

| Operation      | Purpose                  |
|:---------------|:-------------------------|
| Transformation | Convert each element     |
| Filtering      | Select matching elements |
| Searching      | Find specific values     |
| Reduction      | Combine multiple values  |

## Function Composition

**Function Composition:** Combining multiple functions so that the output of one function becomes the input of another,
building complex operations from smaller, reusable, testable, and readable functions.

| Benefit     | Description                           |
|:------------|:--------------------------------------|
| Reusability | Small functions can be combined       |
| Testing     | Individual operations can be verified |
| Readability | Logic is separated into steps         |

## Partial Application

**Partial Application:** Creating a new function by providing some arguments in advance, allowing the generated function
to remember those values and accept remaining arguments later using closures.

## Currying Introduction

**Currying:** Transforming a function that accepts multiple arguments into a sequence of functions that each accept
fewer arguments, processing inputs one at a time as a specialized form of function transformation.

## Higher-Order Functions and Abstraction

Higher-order functions allow developers to describe what should happen rather than manually controlling every execution
step, replacing repeated control structures with behavior-focused functions for more flexible designs.

## Higher-Order Functions vs Normal Functions

| Feature                | Normal Function   | Higher-Order Function |
|:-----------------------|:------------------|:----------------------|
| Receives functions     | Not required      | Yes                   |
| Returns functions      | Not required      | Possible              |
| Behavior customization | Limited           | High                  |
| Abstraction level      | Operation-focused | Behavior-focused      |

## Best Practices

* **Use higher-order functions for reusable behavior:** Leverage them when different operations share the same
  underlying structure.
* **Keep passed functions focused:** Write small, single-purpose functions to make higher-order operations easier to
  understand.
* **Understand callbacks first:** Master callbacks since they represent the most common practical use of higher-order
  functions.
* **Avoid excessive abstraction:** Ensure higher-order patterns simplify your code rather than hiding straightforward
  logic.
* **Combine with pure functions when possible:** Pair predictable, pure functions with higher-order patterns for cleaner
  architecture.
* **Prefer declarative array methods over explicit loops:** Use `.map()`, `.filter()`, and `.reduce()` to express data
  transformations clearly instead of writing imperative `for` loops.
* **Maintain function purity in callbacks:** Avoid mutating external variables or global state inside passed callback
  functions to prevent unpredictable side effects.
* **Leverage closures carefully to avoid memory leaks:** Be mindful that returned functions retaining outer scope
  variables keep those references alive in memory.
* **Compose functions from right to left or left to right consistently:** Establish a clear convention when building
  function composition utilities to avoid execution order confusion.
* **Curry functions for partial configuration:** Use currying to pre-configure utility functions with shared context or
  parameters before passing them into mapping pipelines.
* **Name anonymous callback functions for better stack traces:** Assign descriptive names to handler functions or use
  named function expressions to improve debugging and profiling output.
* **Avoid deep nesting of higher-order functions:** Refactor excessively nested callback chains into separate, modular
  functions or use `async/await` to preserve code readability.
* **Handle async callbacks appropriately:** Remember that passing asynchronous functions into array iteration methods
  like `.map()` returns promises that require explicit handling via `Promise.all()`.
* **Use partial application to simplify event listeners:** Pre-fill event handler parameters cleanly using closures or
  partial application before binding them to DOM events.
* **Keep higher-order function signatures predictable:** Design reusable higher-order wrappers with consistent parameter
  ordering to ensure intuitive integration across your codebase.
