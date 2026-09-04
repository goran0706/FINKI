# Factory Functions

## Factory Function Concept

**Factory Function:** A function that creates and returns new objects without requiring the `new` keyword, encapsulating
object creation logic to produce multiple similar objects with customized values as an alternative to constructor
functions and classes.

## Factory Function Characteristics

A factory function creates and returns objects without using prototypes or requiring the `new` keyword.

| Feature                                  | Behavior |
|:-----------------------------------------|:---------|
| Creates objects                          | Yes      |
| Returns objects                          | Yes      |
| Requires `new` keyword                   | No       |
| Uses constructor prototype automatically | No       |
| Can create multiple object variations    | Yes      |

## Basic Factory Pattern

A factory function typically receives configuration values, creates an object, assigns properties and behavior, and
returns the object to reuse creation logic.

## Factory Functions vs Constructor Functions

| Feature                      | Factory Function | Constructor Function |
|:-----------------------------|:-----------------|:---------------------|
| Uses `new`                   | No               | Yes                  |
| Returns object explicitly    | Yes              | Usually automatic    |
| Creates instances            | Yes              | Yes                  |
| Uses prototype automatically | No               | Yes                  |
| Syntax complexity            | Lower            | Higher               |

## Factory Functions vs Classes

| Feature          | Factory Function | Class                  |
|:-----------------|:-----------------|:-----------------------|
| Object creation  | Yes              | Yes                    |
| Requires `new`   | No               | Yes                    |
| Supports methods | Yes              | Yes                    |
| Uses prototypes  | Optional         | Built-in               |
| Encapsulation    | Through closures | Through class features |

## Factory Functions and Encapsulation

Factory functions hide internal implementation details by creating private values inside the function scope that are
exposed only through returned methods using closures.

## Factory Functions and Closures

Factory functions combine with closures to allow returned functions to remember outer scope variables, enabling private
state, controlled access, and custom object behavior.

## Benefits of Factory Functions

| Benefit           | Description                    |
|:------------------|:-------------------------------|
| Flexible creation | Customize generated objects    |
| Encapsulation     | Hide internal values           |
| Reusability       | Create multiple objects        |
| Simple syntax     | Avoid constructor requirements |

## Limitations of Factory Functions

Factory functions involve structural trade-offs compared to prototype-based patterns.

| Limitation                     | Description                                  |
|:-------------------------------|:---------------------------------------------|
| Memory usage                   | Methods may be recreated per object          |
| No automatic prototype sharing | Behavior is not shared by default            |
| Less conventional inheritance  | Prototype patterns require additional design |

## Factory Functions and Object Methods

Factory functions can create objects containing methods that access properties, modify internal state, and use closure
variables without exposing implementation details.

## Factory Functions and Private State

Private state restricts variable access strictly to the factory function scope, permitting interaction solely through
returned methods.

## Use Cases

* **Creating related objects:** Generate multiple objects with similar structures.
* **Encapsulating state:** Hide internal variables.
* **Building reusable components:** Create configurable object patterns.
* **Managing private data:** Protect values from direct modification.

## Best Practices

* **Use factory functions for flexible object creation:** Leverage them when each object requires custom setup.
* **Combine with closures when private state is needed:** Secure data access using scope retention.
* **Avoid unnecessary object complexity:** Use the simplest creation pattern that solves the problem.
* **Consider classes for shared prototype behavior:** Switch to classes when many objects need to share methods
  efficiently.
* **Extract shared method definitions outside factory scopes:** Avoid memory duplication by declaring common methods on
  an external prototype object or shared helper object when performance matters.
* **Return new object literals cleanly:** Use explicit return expressions or concise object literal syntax to keep
  factory creation logic readable.
* **Validate configuration arguments defensively:** Check input parameters at the top of the factory function to ensure
  created objects are initialized with valid states.
* **Leverage destructuring for configuration options:** Accept a single configuration object with default parameter
  values to make large factory function signatures cleaner and more flexible.
* **Keep factory functions pure where possible:** Ensure that object creation logic relies solely on provided parameters
  without producing unintended side effects.
* **Use factories to implement object composition:** Combine smaller behavior-generating functions inside a factory to
  build complex, modular objects without rigid class hierarchies.
* **Document private closures and public API methods:** Clearly distinguish between internal state variables and the
  public methods returned by the factory function using documentation comments.
* **Avoid overusing private state for public data:** Keep properties directly accessible on the returned object unless
  encapsulation is strictly necessary for security or internal consistency.
* **Test factory functions by asserting returned shapes:** Write unit tests verifying that factory calls output objects
  with the correct properties, initial values, and functional behaviors.
* **Use factories for dependency injection:** Pass mocked services or helper functions into factory parameters to
  simplify unit testing of created objects.
* **Prevent unintended mutations on shared configuration objects:** Clone nested configuration arguments or freeze
  options objects inside the factory to maintain data integrity.
* **Design factories to support optional parameters:** Provide sensible defaults for missing arguments so objects can be
  instantiated with minimal boilerplate configurations.
* **Keep object initialization logic centralized:** Bundle complex setup calculations, data formatting, and event
  listener bindings inside the factory body to keep consumer code clean.
* **Avoid mixing class syntax with factory patterns:** Choose one consistent object creation paradigm per module to
  prevent architectural confusion.
* **Use descriptive names for factory functions:** Follow standard conventions (e.g., camelCase names like
  `createButton` or `makeUser`) to distinguish them clearly from constructor functions and classes.
* **Audit memory overhead for large-scale object creation:** Monitor heap allocation if instantiating thousands of
  objects that define unique method closures rather than sharing prototype methods.