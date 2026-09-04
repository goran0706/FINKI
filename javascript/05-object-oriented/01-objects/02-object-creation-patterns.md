# Object Creation Patterns

## Object Creation Patterns Concept

**Object Creation Patterns:** Reusable approaches and design strategies used to instantiate objects effectively while
managing memory, behavior sharing, and structural complexity.

## Object Literals

**Object Literal:** A comma-separated list of key-value pairs wrapped in curly braces that defines a single object
directly.

| Feature    | Description                               |
|:-----------|:------------------------------------------|
| Syntax     | Curly braces with properties and methods  |
| Use Case   | Creating single, unique objects           |
| Limitation | Cannot generate multiple instances easily |

## Factory Functions

**Factory Function:** A regular function that creates, configures, and returns a new object without requiring the `new`
keyword, enabling encapsulation and private state.

| Benefit       | Description                                |
|:--------------|:-------------------------------------------|
| Encapsulation | Can utilize closures to hide internal data |
| Simplicity    | Avoids complex constructor syntax          |
| Flexibility   | Returns custom objects dynamically         |

## Constructor Functions

**Constructor Function:** A regular function designed to initialize new objects when invoked with the `new` keyword,
automatically linking the created instance to its prototype.

| Step | Action                                         |
|:-----|:-----------------------------------------------|
| 1    | Create a new empty object                      |
| 2    | Link the object to the constructor's prototype |
| 3    | Bind `this` to the new object                  |
| 4    | Return the object automatically                |

## ES6 Classes

**ES6 Class:** Modern syntactic sugar built on top of JavaScript's prototype system that provides a cleaner syntax for
creating constructor functions and managing inheritance.

## Factory Functions vs Constructors

| Feature           | Factory Function                 | Constructor Function / Class           |
|:------------------|:---------------------------------|:---------------------------------------|
| Instantiation     | Regular function call            | Requires `new` keyword                 |
| Context (`this`)  | Managed manually or via closure  | Bound automatically to the instance    |
| Prototype sharing | Methods are recreated per object | Methods shared via prototype chain     |
| Private state     | Supported natively via closures  | Requires workarounds or private fields |

## Prototype Pattern

**Prototype Pattern:** A pattern where objects inherit properties and methods directly from a shared prototype object,
reducing memory overhead by preventing method duplication across instances.

## Singleton Pattern

**Singleton Pattern:** A design pattern that restricts class instantiation to a single object, ensuring a single global
point of access to shared resources or application state.

## Module Pattern

**Module Pattern:** A design pattern that uses closures to create public interfaces while keeping implementation details
and state private.

## Object Creation Best Practices

* **Use object literals for singletons:** Opt for simple literals when only one instance of a structure is needed.
* **Choose classes for standard instances:** Leverage ES6 classes when creating multiple instances that share methods
  via the prototype chain.
* **Use factory functions for private state:** Implement closures when data hiding and encapsulation are top priorities.
* **Avoid memory waste:** Ensure shared methods reside on prototypes rather than being duplicated across every instance.