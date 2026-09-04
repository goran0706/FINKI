# Classes vs Other Object Patterns

## Object Creation Pattern Concept

**Object Creation Pattern:** A reusable approach used to instantiate and structure objects in JavaScript, leveraging the
underlying prototype system through various syntaxes and methods.

| Pattern               | Purpose                                                 |
|:----------------------|:--------------------------------------------------------|
| Object literals       | Create simple standalone objects                        |
| Constructor functions | Create reusable object structures using function syntax |
| Object.create()       | Create objects with direct prototype control            |
| Classes               | Create structured objects using modern class syntax     |

## Object Literal Concept

**Object Literal:** A direct, comma-separated list of key-value pairs wrapped in curly braces used to create a single
unique object.

```javascript
const user = {
    name: "John",
    login() {
        return true;
    }
};
```

## Classes vs Object Literals

| Feature            | Classes                     | Object Literals          |
|:-------------------|:----------------------------|:-------------------------|
| Multiple instances | Designed for it             | Manual creation          |
| Shared methods     | Prototype methods           | Requires manual sharing  |
| Structure          | Defined blueprint           | Individual object        |
| Inheritance        | Built-in syntax (`extends`) | Prototype-based manually |

## Constructor Function Concept

**Constructor Function:** A traditional function used with the `new` keyword to instantiate objects and establish
prototype chains prior to modern class syntax.

```javascript
function User(name) {
    this.name = name;
}
```

## Classes vs Constructor Functions

| Feature     | Classes             | Constructor Functions  |
|:------------|:--------------------|:-----------------------|
| Syntax      | Modern class syntax | Function syntax        |
| Methods     | Prototype methods   | Prototype methods      |
| Inheritance | `extends` keyword   | Manual prototype setup |
| Readability | Higher              | Lower                  |

## Object.create() Concept

**`Object.create()`:** A method that directly constructs a new object linked to a specified prototype object without
requiring a constructor function or class structure.

```javascript
const user = Object.create(userPrototype);
```

## Classes vs Object.create()

| Feature         | Classes            | Object.create()           |
|:----------------|:-------------------|:--------------------------|
| Syntax          | Class-based        | Prototype-based           |
| Object creation | Constructor        | Prototype delegation      |
| Inheritance     | `extends`          | Manual prototype links    |
| Use case        | Structured objects | Custom prototype patterns |

## Classes and Prototypes

Classes in JavaScript are syntactic sugar built directly on top of the prototype system, meaning they do not introduce a
separate inheritance model.

| Class Feature     | Prototype Behavior      |
|:------------------|:------------------------|
| Instance methods  | Stored on prototype     |
| Inheritance       | Prototype chain         |
| `extends` keyword | Prototype linking       |
| `super` keyword   | Parent prototype access |

## Choosing an Object Pattern

Selecting the appropriate pattern depends on the complexity and structural requirements of the application.

| Requirement              | Recommended Pattern  |
|:-------------------------|:---------------------|
| Single simple object     | Object literal       |
| Many similar objects     | Class                |
| Legacy JavaScript code   | Constructor function |
| Direct prototype control | Object.create()      |

## Object Pattern Evolution

JavaScript object creation has evolved from simple structures to syntactic sugar over prototypes.

| Pattern               | Role                           |
|:----------------------|:-------------------------------|
| Object literals       | Basic object creation          |
| Constructor functions | Reusable object creation       |
| Prototype inheritance | Shared behavior mechanism      |
| Classes               | Cleaner syntax over prototypes |

## Use Cases

* **Using object literals:** Create simple standalone objects or configuration containers.
* **Using classes:** Create reusable object structures with shared behavior and clean inheritance.
* **Using constructor functions:** Maintain and understand older prototype-based codebases.
* **Using Object.create():** Build custom prototype relationships and low-level object models.

## Best Practices

* **Use classes when creating many related objects:** They provide clear structure, built-in syntax, and reusable
  behavior.
* **Use object literals for simple objects:** Avoid unnecessary class structures for small, single-instance data
  objects.
* **Understand prototypes before using advanced class features:** Recognize that classes rely on underlying prototype
  behavior.
* **Use Object.create() when direct prototype control is required:** Apply it when lower-level delegation models are
  necessary.
* **Choose the simplest suitable pattern:** Match the pattern complexity to the actual problem requirements.
* **Prefer modern class syntax over legacy constructor functions:** Use ES6 classes for new development to ensure clean
  readability, standard inheritance, and predictable syntax.
* **Avoid modifying built-in prototypes globally:** Refrain from adding custom methods to native prototypes (
  `Array.prototype`, `Object.prototype`) to prevent unexpected naming collisions and library conflicts.
* **Keep object initialization logic clean and lightweight:** Avoid placing heavy side effects or blocking asynchronous
  tasks directly inside constructor functions or initializers.
* **Leverage factory functions for alternative encapsulation:** Use plain functions that return objects with closed-over
  private variables when class syntax feels overly rigid or restrictive.
* **Validate constructor inputs defensively:** Check parameter types and boundaries inside class constructors or factory
  functions to prevent malformed object states from being instantiated.
* **Use static methods for utility behaviors:** Group helper functions that operate on class logic without requiring
  specific instance state under `static` definitions.
* **Keep inheritance hierarchies shallow:** Limit class extension depth to avoid tight coupling and maintainable,
  easy-to-reason-about object models.
* **Freeze configuration objects when immutability is required:** Apply `Object.freeze()` to object literals used as
  constants or configuration maps to prevent accidental runtime mutations.
* **Use computed property names carefully:** Ensure dynamic keys in object literals remain readable and easy for static
  analysis tools or type systems to parse.
* **Audit prototype chains during performance tuning:** Avoid excessively long prototype lookup chains in high-frequency
  execution paths to minimize property resolution overhead.
* **Combine object patterns with TypeScript interfaces for safety:** Pair object creation patterns with explicit type
  definitions or abstract classes to enforce strict structural contracts.
* **Avoid mixing class patterns with manual prototype hacking:** Stick to standard class declarations and the `extends`
  keyword rather than manually overwriting `prototype` objects across class boundaries.
* **Use composition helpers instead of complex multi-inheritance:** Build flexible objects by mixing in behavior
  functions rather than forcing single-inheritance paradigms where they do not fit.
* **Document custom object delegation models clearly:** Provide explicit architectural notes if using `Object.create()`
  for custom prototype links so other team members understand the object graph.
* **Review object creation overhead in performance loops:** Avoid instantiating heavy classes inside tight animation
  loops or high-frequency data pipelines where object recycling or object literals perform better.