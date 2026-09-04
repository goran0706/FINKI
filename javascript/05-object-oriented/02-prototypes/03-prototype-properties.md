# Prototype Properties

## Prototype Properties Concept

**Prototype Properties:** Properties and internal links that connect JavaScript objects to their prototypes, dictating
how property resolution, sharing, and lookup behavior function across the prototype chain.

| Property / Link | Belongs To                      | Primary Purpose                                                                         |
|:----------------|:--------------------------------|:----------------------------------------------------------------------------------------|
| `__proto__`     | Object instances                | Internal link pointing directly to the object's prototype (deprecated for direct use)   |
| `prototype`     | Constructor functions / Classes | Property used during instantiation to assign the prototype for created instances        |
| `constructor`   | Prototype objects               | Reference pointing back to the constructor function or class that created the prototype |

## `__proto__` vs `prototype`

While frequently confused, these two properties operate in completely different areas of the JavaScript prototype
architecture.

| Feature       | `__proto__`                             | `prototype`                                 |
|:--------------|:----------------------------------------|:--------------------------------------------|
| Belongs to    | Object instances                        | Constructor functions and classes           |
| Purpose       | References an object's prototype        | Defines prototype for created instances     |
| Used during   | Property lookup (chain traversal)       | Object creation via `new`                   |
| Modern status | Legacy / deprecated for direct mutation | Standard and active in constructors/classes |

## Prototype Property Shadowing

**Prototype Property Shadowing:** A situation where an object's own property shares the exact same name as a property on
its prototype, causing the instance property to be returned during lookups while the prototype property is ignored for
that specific object.

| Lookup Step | Target Checked           | Result if Match Found                                          |
|:------------|:-------------------------|:---------------------------------------------------------------|
| 1           | Object's own properties  | Returns own property immediately (shadows prototype)           |
| 2           | Object's prototype chain | Returns prototype property only if own property does not exist |

## The `constructor` Property and Delegation

Every default prototype object comes with a non-enumerable `constructor` property that points back to the function or
class associated with it. This allows instances to reference their creating blueprint.

| Relationship             | Description                              |
|:-------------------------|:-----------------------------------------|
| Instance to Prototype    | Linked via internal prototype references |
| Prototype to Constructor | Linked via the `.constructor` property   |

## Performance Considerations

| Factor                          | Effect on Application                                                       |
|:--------------------------------|:----------------------------------------------------------------------------|
| Dynamic property reassignments  | Modifying prototype properties at runtime deoptimizes engine hidden classes |
| Deep prototype property lookups | Increases traversal steps during property resolution                        |
| Shadowing properties            | Bypasses prototype lookups entirely for matched own properties              |

## Use Cases

* **Determining object origins:** Tracing which constructor built an instance via the `constructor` property.
* **Understanding property resolution:** Managing how own properties override or shadow shared prototype properties.
* **Inspecting internal links:** Examining underlying prototype relationships for debugging purposes.

## Best Practices

* **Avoid direct `__proto__` mutations:** Never assign or modify `__proto__` directly in modern code to prevent severe
  engine performance degradation.
* **Understand the distinction between `__proto__` and `prototype`:** Recognize that instance links differ entirely from
  constructor prototype definitions.
* **Watch out for accidental property shadowing:** Ensure instance properties do not unintentionally overwrite critical
  shared prototype methods.
* **Do not rely solely on the `constructor` property for type checking:** Understand that `constructor` references can
  be manually overwritten and do not guarantee safe type identity.
* **Prefer `Object.hasOwn()` over inherited `hasOwnProperty()`:** Check property ownership directly using static
  utilities to avoid prototype lookup errors on clean objects.
* **Keep object-specific state on instances:** Store unique data on individual object instances rather than cluttering
  shared prototype properties.
* **Avoid modifying prototype properties after instantiation:** Maintain stable object shapes to allow JavaScript
  engines to optimize property access via hidden classes.
* **Use concise method definitions for shared behaviors:** Define prototype properties cleanly using shorthand method
  syntax rather than verbose property assignments.
* **Be cautious of prototype property enumerability:** Ensure shared properties defined on prototypes respect expected
  enumeration boundaries during `for...in` loops or `Object.keys()` calls.
* **Restore constructor references if replacing prototype objects:** Explicitly reassign the `.constructor` property if
  overriding a constructor's `.prototype` object entirely to prevent broken type links.
* **Do not store large mutable arrays or collections on prototypes:** Keep instance-specific data structures inside the
  constructor function to prevent unintended data sharing across instances.
* **Inspect property descriptors before modifying prototype properties:** Use `Reflect.getOwnPropertyDescriptor()` to
  verify attribute flags like writable, enumerable, and configurable.
* **Avoid circular prototype references:** Ensure internal prototype links never loop back onto themselves, which causes
  infinite traversal loops and crashes the call stack.
* **Keep prototype property names descriptive and distinct:** Use clear naming conventions to prevent accidental
  collisions between instance fields and prototype properties.
* **Understand property lookup order thoroughly:** Recognize that JavaScript always checks own properties on the
  instance before traversing up to prototype properties.
* **Avoid dynamic property injections that alter prototype chains:** Refrain from injecting arbitrary properties into
  shared prototypes at runtime during high-frequency execution loops.
* **Test property shadowing explicitly:** Write comprehensive unit test cases to verify that instance properties
  correctly override prototype properties when intended.
* **Document custom prototype property contracts clearly:** Provide detailed JSDoc comments or type annotations
  explaining the expected behavior of shared prototype properties.
* **Leverage `Reflect` APIs for robust property management:** Use `Reflect.has()` and `Reflect.get()` when inspecting
  properties across complex prototype chains.
* **Review memory footprints when scaling instances:** Monitor how many objects are instantiated to confirm that shared
  prototype properties successfully reduce memory overhead compared to duplicate instance fields.
* **Keep prototype chains shallow and predictable:** Avoid deep hierarchies that make tracking prototype property
  resolution and shadowing rules difficult.
* **Use modern class syntax for clean property initialization:** Leverage standard class fields and methods to manage
  instance and prototype properties readably.
* **Guard against missing prototype properties defensively:** Provide safe fallback values when accessing shared
  prototype properties that might be undefined or overridden.
* **Audit dependencies for unexpected prototype property modifications:** Inspect third-party libraries to ensure they
  do not inject rogue properties into standard prototype objects.
* **Reinforce anti-monkey-patching rules within team standards:** Ensure developers avoid mutating global native
  prototype properties to maintain long-term code stability.