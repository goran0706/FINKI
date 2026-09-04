# Function Context

## Function Context

**Function Context:** The execution environment that determines the value of `this` inside a function, which for regular
functions is dictated entirely by the invocation pattern rather than being permanently attached to the function itself.

## `this` Keyword

**`this` Keyword:** A special identifier that references the current execution context object at runtime during function
invocation, meaning its value depends strictly on how the function is executed rather than where it is written.

## `this` Binding Rules

Regular functions follow distinct binding rules based on their specific invocation style, with invocation patterns
always taking priority over the function definition.

| Invocation Type            | `this` Value                                             |
|:---------------------------|:---------------------------------------------------------|
| Method invocation          | The object before the dot                                |
| Direct function invocation | Global object or `undefined` in strict mode              |
| Constructor invocation     | Newly created instance                                   |
| Explicit invocation        | Object provided through `call()`, `apply()`, or `bind()` |

## Method Binding

When a function is called as an object method, the receiver object located before the dot becomes the execution context,
meaning method binding relies entirely on the call expression rather than the function's creation location.

## Direct Function Invocation

A function called directly without an owning object evaluates its `this` value based on the execution mode, defaulting
to `undefined` in strict mode and the global object in non-strict mode to prevent automatic conversion of invalid
contexts.

| Environment     | `this` Value  |
|:----------------|:--------------|
| Strict mode     | `undefined`   |
| Non-strict mode | Global object |

## Constructor Binding

**Constructor Invocation:** Executing a function using the `new` operator to instantiate a new object that automatically
becomes the function execution context and `this` binding.

| Step | Action                     |
|:-----|:---------------------------|
| 1    | Create a new object        |
| 2    | Bind `this` to the object  |
| 3    | Constructor body execution |
| 4    | Return the created object  |

## Explicit Binding

**Explicit Binding:** Manually defining the value of `this` during function execution using built-in methods that
override normal invocation behavior.

| Method    | Purpose                                                         |
|:----------|:----------------------------------------------------------------|
| `call()`  | Executes immediately with specified context                     |
| `apply()` | Executes immediately with specified context and arguments array |
| `bind()`  | Creates a new function with permanently assigned context        |

## call()

**`call()` Method:** A function method that immediately executes a function while explicitly setting its `this` value
using an initial argument followed by individual parameter values.

| Input               | Purpose                       |
|:--------------------|:------------------------------|
| First argument      | Desired `this` value          |
| Remaining arguments | Individual function arguments |

## apply()

**`apply()` Method:** A function method that immediately executes a function with an explicitly assigned `this` value,
differing from `call()` solely by accepting arguments as an array-like collection.

| Method    | Argument Format            |
|:----------|:---------------------------|
| `call()`  | Separate arguments         |
| `apply()` | Array or array-like object |

## bind()

**`bind()` Method:** A function method that creates and returns a new function with a permanently assigned `this` value
without executing it immediately, making it ideal for event handlers, callbacks, and partial application.

| Usage               | Purpose                 |
|:--------------------|:------------------------|
| Event handlers      | Preserve object context |
| Callbacks           | Prevent context loss    |
| Partial application | Predefine arguments     |

## Arrow Functions and Context

Arrow functions do not create their own `this` binding, choosing instead to capture `this` lexically from the
surrounding environment while ignoring method invocation, `call()`, `apply()`, and `bind()` context modifications
entirely.

## Context Loss

**Context Loss:** A frequent source of bugs where a method loses its original object reference during variable
assignment, callback passing, or changing invocation styles, resulting in an unexpected `this` value.

| Cause                        | Description                            |
|:-----------------------------|:---------------------------------------|
| Extracting methods           | Assigning a method to another variable |
| Passing methods as callbacks | Runtime invokes function separately    |
| Changing invocation style    | Function called differently            |

## Best Practices

* **Understand invocation before using `this`:** Always trace the call pattern since it determines runtime context.
* **Use regular functions for dynamic context:** Leverage regular functions when methods and constructors require
  dynamic `this` resolution.
* **Use arrow functions when lexical context is required:** Opt for arrow functions to preserve surrounding `this`
  bindings.
* **Avoid relying on implicit context:** Explicitly control function behavior to maximize code predictability.
* **Use `bind()` for callbacks requiring preserved context:** Prevent accidental context shifts during indirect
  execution by locking down bindings.
* **Always run JavaScript code in strict mode:** Enable strict mode (`"use strict"`) to ensure direct function
  invocations evaluate `this` as `undefined` instead of accidentally polluting the global object.
* **Be cautious when destructuring object methods:** Avoid pulling methods directly into standalone variables without
  binding, as this strips the receiver object and triggers context loss.
* **Use arrow functions for class property methods:** Define class methods using arrow syntax (e.g.,
  `handleClick = () => {}`) to automatically bind `this` to the class instance across event listeners and callbacks.
* **Pass context arguments into array methods carefully:** Utilize the optional `thisArg` parameter provided by native
  array higher-order functions like `.forEach()` or `.map()` to maintain context without manual binding.
* **Choose `call()` vs `apply()` based on argument availability:** Use `call()` for comma-separated parameters and
  `apply()` when working with pre-existing argument arrays or array-like collections.
* **Avoid binding `this` multiple times unnecessarily:** Remember that calling `.bind()` on an already bound function
  has no effect, but it creates redundant function wrappers that impact performance.
* **Audit callback contexts in asynchronous routines:** Verify that methods passed into asynchronous timers, promises,
  or event streams retain their intended context references to prevent runtime exceptions.
* **Use explicit binding to safely borrow methods:** Leverage `Function.prototype.call()` or
  `Function.prototype.apply()` when borrowing methods from prototype chains for array-like objects (e.g.,
  `Array.prototype.slice.call(arguments)`).
* **Beware of `this` inside constructor error handling:** Ensure that helper functions called during class instantiation
  do not mistakenly assume global context if invoked as plain functions.
* **Test context bindings thoroughly:** Write targeted unit tests verifying that object methods and callbacks maintain
  correct `this` bindings across varying execution flows.
* **Avoid assigning object methods to global variables:** Protect methods from falling back to global or undefined
  execution contexts by keeping them attached to their parent objects until execution.
* **Use modern class syntax for cleaner encapsulation:** Rely on standard class definitions where methods automatically
  run in strict mode and maintain clear instance associations.
* **Verify bound function performance impact:** Exercise caution when creating massive numbers of `.bind()` wrappers
  inside tight loops or hot code paths, as they allocate new function objects.
* **Utilize optional chaining with method calls defensively:** Combine optional chaining with method invocation (e.g.,
  `obj.method?.()`) to prevent runtime crashes if a method reference is undefined.
* **Document expected execution contexts clearly:** Provide explicit JSDoc annotations or TypeScript type definitions
  detailing whether a function expects a specific `this` binding.