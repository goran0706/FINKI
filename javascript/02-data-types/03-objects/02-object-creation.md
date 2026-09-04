# Creating Objects

## Object Creation Concept

Object creation is the process of creating a new object that can store properties and behavior. JavaScript provides
multiple ways to create objects depending on the required level of control and reuse. Each approach creates an object,
but they differ in how the object is initialized and connected to other objects.

| Method            | Purpose                                    |
|:------------------|:-------------------------------------------|
| Object literals   | Creating simple objects                    |
| `new Object()`    | Constructor-based object creation          |
| `Object.create()` | Creating objects with a specific prototype |

## Object Literals

An object literal is a syntax for creating an object directly using object notation. Object literals are the most common
method for creating objects in JavaScript because they allow properties and methods to be defined directly during object
creation. They are commonly used for representing structured data, creating configuration objects, and grouping related
values.

| Feature                  | Behavior |
|:-------------------------|:---------|
| Creates new object       | Yes      |
| Allows properties        | Yes      |
| Allows methods           | Yes      |
| Requires constructor     | No       |
| Requires prototype setup | No       |

## `new Object()`

The `new Object()` constructor-based approach creates a new object instance. The Object constructor can create an empty
object or wrap certain values into object representations depending on the provided value. Although available,
`new Object()` is rarely preferred because object literals provide clearer syntax.

| Input           | Result                 |
|:----------------|:-----------------------|
| No value        | Empty object           |
| Object value    | Returns object value   |
| Primitive value | Creates wrapper object |

## `Object.create()`

`Object.create()` is a method that creates a new object with a specified prototype. Unlike object literals,
`Object.create()` allows direct control over the prototype relationship of the created object, making it useful for
understanding and working with prototype-based inheritance where the created object accesses properties from its
assigned prototype through the prototype chain.

| Feature                         | Behavior |
|:--------------------------------|:---------|
| Creates new object              | Yes      |
| Controls prototype              | Yes      |
| Copies properties automatically | No       |
| Uses inheritance relationship   | Yes      |

## Comparing Object Creation Methods

Choosing the right creation method depends on the level of prototype control required and syntactic simplicity.

| Feature           | Object Literal | `new Object()` | `Object.create()` |
|:------------------|:---------------|:---------------|:------------------|
| Simple syntax     | Yes            | No             | No                |
| Creates object    | Yes            | Yes            | Yes               |
| Prototype control | Limited        | Limited        | Yes               |
| Common usage      | High           | Low            | Advanced          |

## Object Creation and Prototypes

Every JavaScript object has an internal connection to another object called its prototype. The prototype provides
inherited properties and methods, and different creation methods establish different prototype relationships.
Understanding object creation provides the foundation for understanding prototype-based inheritance.

## Object Creation and Object Identity

Every object creation operation produces a unique object. Objects created separately have different identities even when
they contain identical properties, meaning that creating multiple objects with the same structure does not create shared
objects.

## Creating Objects with Methods

Objects can store functions as property values, where a function stored on an object is called a method. Methods allow
objects to combine properties for storing data with methods for defining behavior, enabling objects to operate directly
on their own data.

| Component  | Purpose         |
|:-----------|:----------------|
| Properties | Store data      |
| Methods    | Define behavior |

## Factory Functions

A factory function is a function that creates and returns objects. Factory functions represent an object creation
pattern based on functions that is useful when multiple objects need to be created with similar structures. They belong
primarily to function concepts because they rely on function behavior rather than specialized object syntax.

## Constructor Functions

A constructor function is a function designed to create objects using the `new` operator. Constructor functions are part
of JavaScript's prototype-based object system, allowing multiple objects to share behavior through prototypes.

## Classes

A class provides modern syntax for creating objects and defining inheritance relationships. Classes offer a cleaner
structure for object-oriented programming while internally using JavaScript's prototype system. They introduce
specialized features including constructors, instance methods, static methods, and class inheritance.

## Object Creation Patterns

Different creation methods and patterns serve distinct structural needs across applications.

| Pattern               | Best Used For                              |
|:----------------------|:-------------------------------------------|
| Object literal        | Simple individual objects                  |
| Object.create()       | Prototype control                          |
| Factory functions     | Repeated object creation through functions |
| Constructor functions | Prototype-based object creation            |
| Classes               | Modern object-oriented design              |

## Use Cases

* **Object literals:** Creating simple data structures with known properties.
* **`Object.create()`:** Building objects with custom prototype relationships.
* **Factory functions — use when:**
    * You need to return **different concrete shapes or types** based on input (a `createLogger('dev' | 'prod')`
      returning different implementations behind one interface).
    * You want **hard-private state via closures** — data genuinely inaccessible from outside, not just conventionally
      hidden.
    * Object construction involves **branching, validation, or assembly logic** that doesn't fit cleanly in a
      constructor.
    * You want to create objects **without `new`**, avoiding `this`-binding pitfalls entirely (no risk of a caller
      forgetting `new` and silently mutating the global object or getting `undefined`).
    * You're producing **plain data objects or test fixtures** with no real behavior — just a repeatable shape.
* **Constructor functions — use when:**
    * You're maintaining **legacy pre-ES6 code** or a codebase that already uses this pattern consistently.
    * You need explicit, manual control over the prototype chain without class sugar — genuinely rare today.
    * *(In new code, prefer classes — constructor functions are what classes compile down to; there's little reason to
      hand-write one now.)*
* **Classes — use when:**
    * The object has **behavior tied to its state** (methods that read/mutate its own properties) and you want that
      behavior efficiently shared across many instances via the prototype (methods aren't re-created per instance,
      unlike closures in factory functions).
    * You need **inheritance**, `instanceof` checks, or `abstract` base types.
    * You're working with **frameworks built around classes** — dependency injection (NestJS, Angular), ORMs (TypeORM,
      Prisma models), decorators — these expect a class as the unit of construction.
    * You want **compile-time access modifiers** (`private`, `protected`, `readonly`) enforced by TypeScript's type
      system, even though they're erased at runtime (unlike a factory's true closure privacy).

## Object Creation Decision Guide

Choosing a creation pattern comes down to two questions: *how many instances will exist*, and *does the object need
shared behavior or a controlled prototype relationship*. The table below orders the decision from most to least common.

| Priority | Condition                                                                     | Use                   | Why                                                                                                                           |
|:---------|:------------------------------------------------------------------------------|:----------------------|:------------------------------------------------------------------------------------------------------------------------------|
| 1        | Needs real, shared behavior across many instances                             | **Class**             | Covers most "objects with methods" in typical application code; methods live once on the prototype rather than per instance.  |
| 2        | Needs to return different types/shapes at runtime, or truly private state     | **Factory function**  | The one thing classes can't do cleanly — a constructor can't easily return a different class instance or branch its own type. |
| 3        | Just a data shape, no behavior, no repetition                                 | **Object literal**    | Don't reach for a class or factory to represent a one-off config object.                                                      |
| 4        | Needs direct control over the prototype chain for a specific inheritance need | **`Object.create()`** | Rare in application code; mostly relevant at the library or framework level.                                                  |

**Default rule:** never start with a class. Begin with a plain function or object literal, and promote to a class only
once there are genuinely repeated instances that share behavior.

## Performance Considerations

Object creation performance depends on how objects are structured and how behavior is shared. For most everyday cases,
object literals provide the simplest and most efficient approach.

| Factor           | Description                                |
|:-----------------|:-------------------------------------------|
| Object shape     | Consistent structures improve optimization |
| Method placement | Shared methods avoid duplication           |
| Prototype usage  | Allows behavior reuse                      |

## Best Practices

* **Use object literals for simple objects:** They provide the clearest and most common creation pattern.
* **Use `Object.create()` when prototype control is needed:** It allows direct manipulation of object inheritance.
* **Avoid `new Object()` for normal object creation:** Object literals are shorter and easier to understand.
* **Keep object creation patterns consistent:** Similar objects should usually be created using the same approach.
* **Learn prototypes before constructor functions and classes:** Object creation becomes easier to understand when
  inheritance concepts are clear.
* **Default to classes for anything with real behavior and multiple instances — don't reach for a factory just for
  stylistic preference.** Class methods live once on the prototype and are shared across all instances; a factory
  function that returns methods as closures re-creates a new function per instance, which is real, measurable memory
  overhead at scale.
* **Reach for a factory function specifically when a constructor can't do the job — not as a default alternative to
  `class`.** The signal is: "this creation logic needs to branch into different types," or "this needs state closures
  can hide that TypeScript's `private` can't." If neither applies, a factory is just an indirection with no payoff.
* **Never mix constructor functions and classes in the same codebase for new code.** Constructor functions are what
  classes compile to internally — writing both patterns side by side in the same project signals inconsistent style, not
  a deliberate choice.
* **Don't use a class purely to group unrelated static utility functions.** A class with only `static` methods and no
  instances is a namespace, not an object-creation pattern — a plain module with exported functions is simpler and
  doesn't imply `instanceof`/inheritance semantics that will never be used.
* **If a "factory function" always creates the exact same shape with no branching, it's really just a named object
  literal generator — that's fine, but recognize it's not doing anything a plain object literal couldn't, other than
  adding repeatability.** Don't over-justify it as "the Factory pattern" when it's simpler than that.
* **Promote a factory function to a class only when instances start needing shared behavior, not before.** Premature
  class extraction for a two-property data object adds indirection (constructors, `this` binding) without benefit — this
  is the YAGNI principle applied to object creation choices specifically.
