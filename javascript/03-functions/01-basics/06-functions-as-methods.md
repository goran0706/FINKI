# Methods

## Functions vs Methods

**Method:** A function stored as a property of an object, representing behavior associated with that object where the
function defines the operation and the object provides the context, distinguishing itself from an independent function
based on how it is accessed.

| Concept  | Description                                  |
|:---------|:---------------------------------------------|
| Function | Independent callable value                   |
| Method   | Function accessed through an object property |

## Object Methods

**Object Method:** A property whose value is a function, allowing objects to combine data properties that store
information with method properties that perform operations to group related data and behavior together.

| Property Type   | Purpose               |
|:----------------|:----------------------|
| Data property   | Stores information    |
| Method property | Performs an operation |

## Method Invocation

**Method Invocation:** Calling a function through an object property using the member access operator, which differs
from direct function invocation because the calling object becomes part of the execution context and determines the
method receiver.

## Method Receiver

**Receiver:** The object used to access a method during invocation, where the value located before the dot (`.`) becomes
the receiver that determines the `this` value for regular functions.

## Methods and `this`

Regular methods use dynamic `this` binding where the value of `this` depends entirely on how the method is called rather
than where it was created, allowing different objects to share the same function as a method while supplying unique
`this` values.

## Method Shorthand Syntax

JavaScript provides shorthand syntax for defining methods inside object literals, creating function-valued properties
without explicitly writing the `function` keyword for cleaner object definitions and class methods.

## Extracting Methods

A method can be assigned to another variable because functions are objects, but extracting it changes the invocation
pattern and causes it to lose its original object reference, which can result in a modified `this` value and lead to
context-related errors.

## Methods as Values

Because methods are functions, they can be treated as first-class values to be stored, passed, returned, or reassigned,
meaning a method's actual behavior depends on both the underlying function and its invocation context.

| Capability | Description                   |
|:-----------|:------------------------------|
| Stored     | Assigned to variables         |
| Passed     | Used as arguments             |
| Returned   | Produced from functions       |
| Reassigned | Replaced with other functions |

## Built-In Object Methods

JavaScript provides built-in methods across various native structures to perform common operations, all following the
core principle of functions stored as object properties.

| Object Type | Method Category       |
|:------------|:----------------------|
| Arrays      | Collection processing |
| Strings     | Text manipulation     |
| Objects     | Property operations   |
| Maps        | Key-value management  |

## Static Methods vs Instance Methods

**Instance Method:** A method available on individual object instances, whereas a **Static Method:** A method attached
directly to a constructor or class rather than its instances, meaning the access pattern dictates whether a method
belongs to an instance or the type itself.

## Methods and Function Context

Methods introduce function context since the same function can behave differently depending on the invoking object,
serving as a foundation before learning explicit context control methods like `call()`, `apply()`, or `bind()`.

## Best Practices

* **Use methods for object-related behavior:** Keep operations closely coupled to the data they operate on.
* **Keep methods focused:** Ensure a method represents a clear, single operation related to its object.
* **Use methods to express object responsibilities:** Design objects to contain the behaviors that logically belong to
  their data.
* **Avoid unnecessary method extraction:** Prevent context-related errors by avoiding moving methods away from their
  original objects.
* **Understand invocation differences:** Recognize that calling a standalone function and calling a method have
  fundamentally different execution mechanics.
* **Use method shorthand syntax in object literals:** Write cleaner object definitions by adopting the ES6 method
  shorthand instead of explicit function property assignments.
* **Bind `this` explicitly when passing methods as callbacks:** Ensure object methods retain their receiver context when
  handed off as event listeners or timers by wrapping them in arrow functions or using `.bind()`.
* **Use class property fields with arrow functions for automatic binding:** Define methods using arrow syntax within
  modern classes to guarantee that `this` always references the class instance.
* **Distinguish clearly between static and instance methods:** Attach utility methods to classes as static functions
  only when they do not depend on instance state.
* **Avoid mutating shared prototype methods carelessly:** Ensure methods attached to constructor prototypes remain pure
  and stateless to prevent unexpected side effects across instances.
* **Guard against context loss during method destructuring:** Avoid pulling methods directly out of objects into
  isolated variables unless explicitly bound to a receiver.
* **Leverage method chaining where appropriate:** Return `this` from instance methods to enable fluent, readable API
  patterns in object-oriented structures.
* **Validate input parameters inside object methods defensively:** Check arguments rigorously at the start of method
  execution to prevent runtime errors on invalid states.
* **Keep method side-effects minimal and predictable:** Design methods to modify internal object state explicitly and
  transparently rather than relying on hidden mutations.
* **Prefer instance methods over global helper functions for object data:** Encapsulate operations directly inside the
  object's methods to maintain strong cohesion and data encapsulation.
* **Use computed property names for dynamic method definitions:** Define methods dynamically using bracket notation
  within object literals when property keys are determined at runtime.
* **Document method contracts and receiver expectations:** Clearly outline what `this` context a method expects,
  particularly when building utility libraries or flexible mixing objects.
* **Avoid deep method call chains:** Prevent tight coupling and fragile code structures by limiting how many nested
  method calls occur across different domain objects.
* **Test method invocation contexts thoroughly:** Write specific unit tests ensuring methods execute with correct `this`
  bindings when invoked via different patterns or references.
* **Leverage built-in prototype methods safely:** Use native methods like `.map()` or `.filter()` correctly without
  corrupting or overriding standard prototype behavior.