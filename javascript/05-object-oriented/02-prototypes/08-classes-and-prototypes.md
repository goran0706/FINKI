# Classes and Prototypes

## Classes and Prototype Concept

**Class:** A cleaner syntax introduced in modern JavaScript for creating objects and defining inheritance relationships,
built entirely on top of the underlying prototype system rather than replacing it.

| Class Feature    | Prototype Mechanism              |
|:-----------------|:---------------------------------|
| Instance methods | Stored on the class prototype    |
| Inheritance      | Uses underlying prototype chains |
| Object creation  | Uses constructors                |

## Class Architecture & Method Placement

Methods defined inside a class body are placed directly on the class prototype, ensuring they are shared across all
instances without duplication. Conversely, instance fields and constructor properties belong directly to individual
objects.

| Feature Type                 | Storage Location       | Responsibility                         |
|:-----------------------------|:-----------------------|:---------------------------------------|
| Instance properties / fields | Object instance itself | Stores unique object-specific state    |
| Instance methods             | Class prototype        | Stores shared reusable behavior        |
| Static methods               | Class itself           | Used for class-level utility functions |

## Class Inheritance and `super`

Classes support clean inheritance syntax using the `extends` keyword and `super` keyword, which manages parent
constructor and method execution while preserving the underlying prototype chain structure.

| Inheritance Level | Prototype Relationship                         |
|:------------------|:-----------------------------------------------|
| Instance object   | Links to `ChildClass.prototype`                |
| Child prototype   | Links to `ParentClass.prototype` via `extends` |
| Parent prototype  | Links to `Object.prototype`                    |
| End of chain      | `null`                                         |

## Classes vs Constructor Functions

| Feature          | Constructor Function     | Class                      |
|:-----------------|:-------------------------|:---------------------------|
| Syntax           | Function-based syntax    | Clean class syntax wrapper |
| Inheritance      | Manual prototype setup   | Built-in `extends` keyword |
| Shared methods   | Assigned to `.prototype` | Defined inside class body  |
| Underlying model | Prototype-based          | Prototype-based            |

## Performance Considerations

| Factor            | Description                                 |
|:------------------|:--------------------------------------------|
| Prototype methods | Shared efficiently between instances        |
| Instance fields   | Stored separately per object                |
| Deep inheritance  | Adds lookup steps along the prototype chain |

## Use Cases

* **Creating object templates:** Classes provide clean, structured object instantiation.
* **Organizing related behavior:** Group methods and data logically together.
* **Implementing inheritance:** Simplify prototype chain creation via `extends`.
* **Working with object-oriented patterns:** Provide familiar syntax while leveraging JavaScript's native model.

## Best Practices

* **Understand that classes use prototypes internally:** Recognize that class syntax is a wrapper over prototype
  behavior.
* **Keep shared methods as class methods:** Let methods reside efficiently on prototypes.
* **Use static methods for class-level operations:** Avoid placing utility functions on instances unnecessarily.
* **Use instance properties for object-specific state:** Keep unique data on individual object instances.
* **Prefer classes for modern code clarity:** Leverage clean class syntax while maintaining underlying prototype
  mechanics.
* **Avoid treating classes as traditional block-scoped object-oriented blueprints:** Keep in mind that JavaScript
  classes remain dynamic functions backed by prototype delegation under the hood.
* **Do not mix manual prototype assignment with modern class syntax:** Rely on standard `class` and `extends`
  declarations rather than modifying class prototypes directly post-declaration.
* **Inspect underlying prototype links during debugging:** Use `Object.getPrototypeOf()` to examine class inheritance
  chains rather than guessing structural relationships.
* **Keep class bodies free of non-standard syntax extensions:** Stick strictly to ECMAScript standard class field and
  method specifications to ensure cross-platform compatibility.
* **Understand static inheritance in classes:** Recognize that static methods and static fields inherit down child class
  chains through constructor prototype links.
* **Use modern private fields (`#`) instead of weak maps or conventions:** Leverage native private field syntax for
  robust data encapsulation within classes.
* **Avoid unnecessary constructor definitions:** Omit empty constructor methods when a class relies entirely on default
  parent initialization or uninitialized class fields.
* **Test class methods and prototype linkage explicitly:** Verify that instances correctly inherit methods from their
  respective class prototypes under various execution states.
* **Do not attach mutable data structures to static properties:** Keep class-level shared state immutable or strictly
  controlled to prevent global side effects across instances.
* **Leverage class expressions for anonymous or dynamic definitions:** Use class expressions when classes need to be
  passed as arguments or generated conditionally at runtime.
* **Keep inheritance chains shallow and meaningful:** Avoid deep class hierarchies that obscure prototype lookup paths
  and complicate debugging trails.
* **Use standard method definition shorthand:** Define class methods using concise syntax rather than arrow function
  properties unless lexical `this` binding is explicitly required.
* **Document class APIs with comprehensive type annotations:** Use TypeScript or JSDoc comments to clearly specify
  method signatures, parameters, and property types.
* **Review performance impacts of heavy instantiation loops:** Monitor memory allocation when creating massive
  quantities of class instances in high-frequency pipelines.
* **Embrace classes as the standard approach for modern object-oriented code:** Standardize on class declarations for
  new application codebases to maximize readability and maintainability.