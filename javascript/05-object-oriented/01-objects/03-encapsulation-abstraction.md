# Encapsulation and Abstraction

## Encapsulation and Abstraction Concept

**Encapsulation and Abstraction:** Core object-oriented design principles used to manage complexity by bundling data
with behavior and hiding internal implementation details behind clean interfaces.

## Encapsulation

**Encapsulation:** The practice of combining state (data) and behavior (methods) into a single unit while restricting
direct external access to internal implementation details.

| Component        | Responsibility                           |
|:-----------------|:-----------------------------------------|
| Internal state   | Managed securely within the object       |
| Public interface | Controlled methods used by external code |

## Benefits of Encapsulation

Encapsulation protects object integrity, prevents unintended modifications, and allows internal logic to change without
breaking external consuming code.

| Benefit           | Description                           |
|:------------------|:--------------------------------------|
| Data protection   | Prevents invalid state changes        |
| Maintainability   | Isolates internal logic modifications |
| Controlled access | Manages how data is read and updated  |

## Encapsulation in JavaScript

JavaScript provides multiple mechanisms to achieve encapsulation, ranging from modern language features to traditional
closure-based patterns.

| Approach             | Mechanism                                              |
|:---------------------|:-------------------------------------------------------|
| Private class fields | Native `#` syntax for properties and methods           |
| Closures             | Factory functions that hide variables in lexical scope |
| Conventions          | Underscore prefixing to signal internal use            |

## Abstraction

**Abstraction:** The practice of exposing essential features and behaviors while hiding complex implementation details
and underlying operational logic.

| Concept        | Role                           |
|:---------------|:-------------------------------|
| Interface      | Shows *what* an object can do  |
| Implementation | Hides *how* the object does it |

## Benefits of Abstraction

Abstraction reduces cognitive load, simplifies interaction with complex subsystems, and shields developers from
unnecessary internal details.

| Benefit               | Description                                |
|:----------------------|:-------------------------------------------|
| Reduced complexity    | Simplifies interaction with systems        |
| Higher-level thinking | Focuses on behavior rather than mechanics  |
| Loose coupling        | Minimizes dependency on internal mechanics |

## Encapsulation vs Abstraction

While often used together, encapsulation focuses on data hiding and bundling, whereas abstraction focuses on complexity
reduction and interface simplification.

| Feature      | Encapsulation                    | Abstraction                     |
|:-------------|:---------------------------------|:--------------------------------|
| Primary Goal | Protect state and bundle data    | Hide complexity and show intent |
| Mechanism    | Restricting access points        | Exposing simplified interfaces  |
| Focus        | "How data is stored and secured" | "What features are available"   |

## Practical Examples

| Concept       | Example                                                                                     |
|:--------------|:--------------------------------------------------------------------------------------------|
| Encapsulation | A bank account object that validates deposits and prevents direct balance manipulation      |
| Abstraction   | A `fetch()` API call that handles network sockets and headers behind a single function call |

## Best Practices

* **Hide internal state:** Restrict direct property modifications to ensure objects maintain valid internal states.
* **Expose simple interfaces:** Design methods that clearly communicate intent without exposing internal complexity.
* **Use private fields:** Leverage native language features like private class fields to enforce encapsulation safely.
* **Depend on abstractions:** Interact with objects through public methods rather than relying on underlying internal
  structures.
* **Validate data at boundaries:** Ensure parameters passed into public setter methods or constructors meet business
  rules before updating internal private states.
* **Limit public getter exposure:** Avoid providing direct read/write access to internal properties unless strictly
  necessary to preserve true encapsulation.
* **Design cohesive classes:** Group related state and behavior together within single-responsibility units to maximize
  encapsulation effectiveness.
* **Favor composition over deep inheritance hierarchies:** Build flexible systems by combining encapsulated objects
  rather than relying on complex parent-child class extensions.
* **Keep public interfaces stable:** Protect consuming modules from breaking changes by keeping underlying refactors
  hidden behind fixed abstract methods.
* **Use factory functions for closure-based privacy:** Leverage lexical scoping and factory patterns when private
  variables are required outside of standard class syntax.
* **Avoid leaking mutable references:** Return deep copies or immutable wrappers when exposing internal data structures
  to prevent external mutation of private states.
* **Document public contracts clearly:** Provide precise descriptions of what public methods expect and return without
  detailing internal computational steps.
* **Enforce access control strictly:** Reject convention-based hiding (`_` prefixes) in modern codebases in favor of
  native private fields (`#`) for true runtime privacy enforcement.
* **Keep abstraction layers shallow:** Avoid wrapping simple operations in multiple layers of abstraction that obscure
  behavior and complicate debugging.
* **Isolate side effects within objects:** Keep network requests, local storage mutations, or logging mechanics trapped
  inside well-defined encapsulated boundaries.
* **Design interfaces for the caller:** Tailor public methods around the needs of the consumer rather than mirroring the
  internal database schema or data model.
* **Test public behaviors, not internal states:** Write unit tests that target the public interface to ensure
  refactoring internal logic does not break test suites.
* **Use TypeScript access modifiers for compile-time safety:** Apply `private`, `protected`, and `public` keywords to
  clarify design intentions in typed environments.
* **Prevent God objects through separation of concerns:** Ensure encapsulated units remain focused on a single domain
  entity rather than absorbing unrelated responsibilities.
* **Review class boundaries regularly:** Refactor classes as requirements evolve to ensure internal data hiding and
  external interfaces remain properly balanced.