# Functions as Objects

## Functions Are Objects

**Function Object:** A JavaScript object that can be invoked as executable code. Unlike many languages where functions
are separate from objects, JavaScript treats functions as objects that combine callable execution behavior with the
ability to store properties and values.

| Behavior | Description                             |
|:---------|:----------------------------------------|
| Callable | Can be executed using invocation syntax |
| Object   | Can store properties and values         |

## First-Class Functions

**First-Class Function:** A function that can be treated as a regular value within the language. JavaScript functions
are first-class values, meaning they can be assigned to variables, passed as arguments, returned from other functions,
and stored inside objects or arrays to enable patterns like callbacks and higher-order functions.

| Capability | Description                     |
|:-----------|:--------------------------------|
| Assigned   | Stored in variables             |
| Passed     | Used as arguments               |
| Returned   | Produced by other functions     |
| Stored     | Placed inside objects or arrays |

## Functions Assigned to Variables

Functions can be assigned to variables because they are values, storing a reference to the underlying function object so
the function can be accessed through that variable without altering its behavior based on which reference points to it.

## Functions as Arguments

Functions can be passed into other functions as arguments, allowing one function to receive behavior from another for
use in callbacks, array processing methods, or event handlers, where any function receiving another function acts as a
higher-order function.

| Pattern        | Purpose                         |
|:---------------|:--------------------------------|
| Callbacks      | Execute provided behavior later |
| Array methods  | Process collection elements     |
| Event handlers | Respond to runtime events       |

## Functions as Return Values

Functions can be returned from other functions to create new behavior dynamically, enabling patterns like factory
functions, closures, and function generators.

| Pattern             | Purpose                                  |
|:--------------------|:-----------------------------------------|
| Factory functions   | Create configured functions              |
| Closures            | Preserve access to surrounding variables |
| Function generators | Produce reusable operations              |

## Function Properties

Because functions are objects, they can contain properties that store additional data or behavior associated with the
function object, categorized as either built-in properties provided by JavaScript or custom properties added by
developers.

| Type                | Description            |
|:--------------------|:-----------------------|
| Built-in properties | Provided by JavaScript |
| Custom properties   | Added by developers    |

## Built-In Function Properties

JavaScript function objects include built-in properties related to their behavior, such as tracking names, parameter
counts, and prototype bindings.

| Property    | Description                          |
|:------------|:-------------------------------------|
| `name`      | Contains the function name           |
| `length`    | Number of declared parameters        |
| `prototype` | Object used by constructor functions |

## Custom Function Properties

Developers can attach custom properties to functions because they are objects, utilizing them to store metadata, track
state, or attach configuration settings, though this should be used carefully to prevent excessive state from reducing
code clarity.

| Usage         | Purpose                              |
|:--------------|:-------------------------------------|
| Metadata      | Store information about the function |
| State         | Preserve related values              |
| Configuration | Attach settings                      |

## Function References

When a function is assigned to another variable, the reference is copied rather than creating a new function, meaning
multiple variables can point to the same function object and modifications affect all references.

## Functions in Data Structures

Functions can be stored inside various data structures to represent behavior as data.

| Structure | Usage                                |
|:----------|:-------------------------------------|
| Arrays    | Collections of executable operations |
| Objects   | Methods and behaviors                |
| Maps      | Dynamic behavior storage             |

## Functions vs Other Objects

Functions share properties and methods with normal objects, but their callable behavior and executable body distinguish
them from ordinary objects.

| Feature         | Function Object | Regular Object |
|:----------------|:----------------|:---------------|
| Properties      | Yes             | Yes            |
| Methods         | Yes             | Yes            |
| Callable        | Yes             | No             |
| Executable body | Yes             | No             |

## Best Practices

* **Treat functions as values when useful:** Leverage passing and storing functions to enable flexible and modular
  software designs.
* **Use first-class behavior intentionally:** Ensure dynamic function handling improves architecture rather than making
  code harder to follow.
* **Prefer clear abstractions:** Use callbacks, higher-order functions, and returned functions when they represent
  meaningful design patterns.
* **Avoid excessive function properties:** Keep functions focused by preventing them from becoming hidden containers for
  unrelated state.
* **Understand references:** Remember that assigning a function to another variable creates a new reference to the exact
  same function object.
* **Use built-in properties for debugging and introspection:** Leverage `.name` and `.length` properties when building
  logging utilities, routers, or dependency injectors that require metadata about functions.
* **Avoid mutating native function prototypes:** Refrain from attaching custom methods directly to `Function.prototype`,
  as it pollutes the global execution context and can cause unexpected conflicts with third-party libraries.
* **Store state in closures instead of custom function properties:** Prefer encapsulation through closures or class
  instances over attaching mutable state variables directly onto function objects to maintain predictability.
* **Be mindful of memory references when storing functions in collections:** Remember that functions stored in arrays,
  objects, or maps hold strong references that prevent garbage collection unless explicitly cleared.
* **Use function objects to implement the Command Pattern:** Store executable behaviors as values inside data structures
  to easily queue, undo, or dynamically invoke commands in complex applications.
* **Leverage `Function.prototype` methods cleanly:** Utilize built-in instance methods like `.bind()`, `.call()`, and
  `.apply()` correctly, keeping in mind that functions inherit from `Function.prototype` and ultimately
  `Object.prototype`.
* **Distinguish between function declarations and function expressions:** Understand hoisting differences and object
  creation timing when assigning functions dynamically to variables versus declaring them statically.
* **Avoid relying on `arguments.callee` in modern code:** Use named function expressions if a function needs to
  reference itself recursively instead of using deprecated or strict-mode-forbidden properties.
* **Cache expensive computations using function memoization:** Attach computed results to custom function properties or
  closure scopes to cache outputs for recurring inputs efficiently.
* **Use higher-order functions to return customized function objects:** Generate specialized functions dynamically using
  factory patterns rather than duplicating redundant configuration logic across modules.
* **Inspect function parameter lengths for validation:** Use the `.length` property to inspect expected arguments
  dynamically when building flexible wrapper functions or middleware pipelines.
* **Keep function bodies pure and side-effect free:** Design callable objects to operate predictably without unexpected
  mutations to external states or hidden properties.
* **Document custom properties thoroughly:** If custom metadata or configuration settings must be attached to a function
  object, ensure they are clearly documented using TypeScript types or JSDoc annotations.
* **Avoid aliasing core functions accidentally:** Be careful when copying references to built-in or utility functions
  into local variables to prevent unintended overwrites or context detachment.
* **Test function objects as first-class citizens:** Write robust unit tests verifying that higher-order functions,
  callbacks, and dynamically returned functions execute with correct references and behaviors.